import {
  MatchRecordModel,
  StatReportModel,
  connectToDatabase,
  type MatchRecordDocument,
  type StatReportDocument,
} from "@/db";
import type {
  EloPayload,
  PerformancePayload,
  PerformanceRecord,
  ProfileDefinition,
  ProfileRecord,
  SimpleStatReport,
  StatReport,
} from "@/types/report";

function toIsoString(value: Date | string | undefined | null) {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function mapProfileDefinitions(doc: StatReportDocument): ProfileDefinition[] {
  const definitions = Array.isArray(doc.profileDefinitions) ? doc.profileDefinitions : [];
  return definitions.map((profile) => ({
    id: typeof profile.id === "string" ? profile.id : "",
    name: typeof profile.name === "string" ? profile.name : "",
    description: typeof profile.description === "string" ? profile.description : undefined,
  }));
}

function mapSimpleReport(doc: StatReportDocument): SimpleStatReport {
  const type: StatReport["type"] = doc.type === "elo" ? "elo" : "performance";
  return {
    name: doc.name,
    type,
    token: doc.token,
    createdAt: toIsoString(doc.createdAt),
  };
}

function normalizeProfileRecord(record: unknown): ProfileRecord | null {
  if (!record || typeof record !== "object") {
    return null;
  }

  const candidate = record as {
    name?: unknown;
    stats?: unknown;
    count?: unknown;
  };

  if (typeof candidate.name !== "string") {
    return null;
  }

  const statsSource = candidate.stats && typeof candidate.stats === "object" ? candidate.stats : {};
  const stats = Object.entries(statsSource as Record<string, unknown>).reduce<Record<string, number>>((acc, [key, value]) => {
    if (typeof value === "number") {
      acc[key] = value;
    }
    return acc;
  }, {});

  const count = typeof candidate.count === "number" && Number.isFinite(candidate.count) ? candidate.count : 0;

  return {
    name: candidate.name,
    stats,
    count,
  };
}

function mapPerformanceRecords(records: unknown[]): PerformanceRecord[] {
  if (!Array.isArray(records)) {
    return [];
  }

  return records
    .map((record) => {
      if (!record || typeof record !== "object") {
        return null;
      }

      const candidate = record as {
        name?: unknown;
        createdAt?: unknown;
        profileRecords?: unknown;
      };

      if (typeof candidate.name !== "string" || typeof candidate.createdAt !== "string") {
        return null;
      }

      const profileRecordsSource = Array.isArray(candidate.profileRecords) ? candidate.profileRecords : [];
      const profileRecords = profileRecordsSource
        .map((profileRecord) => normalizeProfileRecord(profileRecord))
        .filter((profileRecord): profileRecord is ProfileRecord => profileRecord !== null);

      return {
        name: candidate.name,
        createdAt: candidate.createdAt,
        profileRecords,
      } satisfies PerformanceRecord;
    })
    .filter((record): record is PerformanceRecord => record !== null);
}

function mapPerformancePayload(doc: StatReportDocument): PerformancePayload {
  if (!doc.performancePayload) {
    return { statDefinitions: [], performanceRecords: [] };
  }

  return {
    statDefinitions: (Array.isArray(doc.performancePayload.statDefinitions)
      ? doc.performancePayload.statDefinitions
      : []
    ).map((stat) => ({ value: stat.value })),
    performanceRecords: mapPerformanceRecords(doc.performancePayload.performanceRecords),
  };
}

function mapMatchRecords(matchDocs: MatchRecordDocument[]): EloPayload["matchRecords"] {
  return matchDocs.map((record) => ({
    id: record.matchId,
    name: record.name ?? undefined,
    participants: (() => {
      const participantA = record.participants?.A ?? { profileId: "", profileName: "" };
      const participantB = record.participants?.B ?? { profileId: "", profileName: "" };
      return {
        A: {
          profileId: participantA.profileId,
          profileName: participantA.profileName,
        },
        B: {
          profileId: participantB.profileId,
          profileName: participantB.profileName,
        },
      };
    })(),
    setResult: {
      A: record.setResult.A,
      B: record.setResult.B,
    },
    matchDate: toIsoString(record.matchDate),
    createdAt: toIsoString(record.createdAt),
    roster:
      record.roster && record.roster.A && record.roster.B
        ? {
            A: record.roster.A,
            B: record.roster.B,
          }
        : undefined,
    winnerSide: record.winnerSide === "B" ? "B" : "A",
  }));
}

function mapLegacyMatchRecords(records: unknown[]): EloPayload["matchRecords"] {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => {
    const legacy = record as {
      id?: string;
      name?: string;
      participants?: {
        A?: { profileId?: string; profileName?: string };
        B?: { profileId?: string; profileName?: string };
      };
      setResult?: { A?: number; B?: number };
      matchDate?: Date | string;
      createdAt?: Date | string;
      roster?: { A?: string[]; B?: string[] };
      winnerSide?: string;
    };

    return {
      id: legacy.id ?? "",
      name: legacy.name ?? undefined,
      participants: {
        A: {
          profileId: legacy.participants?.A?.profileId ?? "",
          profileName: legacy.participants?.A?.profileName ?? "",
        },
        B: {
          profileId: legacy.participants?.B?.profileId ?? "",
          profileName: legacy.participants?.B?.profileName ?? "",
        },
      },
      setResult: {
        A: legacy.setResult?.A ?? 0,
        B: legacy.setResult?.B ?? 0,
      },
      matchDate: toIsoString(legacy.matchDate),
      createdAt: toIsoString(legacy.createdAt),
      roster:
        legacy.roster && legacy.roster.A && legacy.roster.B
          ? { A: legacy.roster.A, B: legacy.roster.B }
          : undefined,
      winnerSide: legacy.winnerSide === "B" ? "B" : "A",
    };
  });
}

function mapEloPayload(
  doc: StatReportDocument,
  profiles: ProfileDefinition[],
  matchDocs: MatchRecordDocument[],
  legacyMatches: unknown[] = [],
): EloPayload {
  const resolvedMatchRecords = matchDocs.length > 0 ? mapMatchRecords(matchDocs) : mapLegacyMatchRecords(legacyMatches);

  if (!doc.eloPayload) {
    return { k: 0, bestOf: 1, eloRatings: [], matchRecords: resolvedMatchRecords };
  }

  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
  const bestOfRaw = doc.eloPayload.bestOf;
  const bestOf: 1 | 3 | 5 | 7 = bestOfRaw === 3 || bestOfRaw === 5 || bestOfRaw === 7 ? bestOfRaw : 1;

  return {
    k: doc.eloPayload.k,
    bestOf,
    lastUpdatedAt: doc.eloPayload.lastUpdatedAt ? toIsoString(doc.eloPayload.lastUpdatedAt) : undefined,
    eloRatings: doc.eloPayload.eloRatings.map((rating) => ({
      profile: profileMap.get(rating.profileId) ?? {
        id: rating.profileId,
        name: "(unknown)",
      },
      score: rating.score,
    })),
    matchRecords: resolvedMatchRecords,
  };
}

export async function findReportsByOwnerId(ownerId: string): Promise<SimpleStatReport[]> {
  await connectToDatabase();

  const docs = await StatReportModel.find({ ownerId }).sort({ createdAt: -1 }).lean<StatReportDocument[]>();
  return docs.map(mapSimpleReport);
}

export async function findReportByToken(token: string, ownerId: string): Promise<StatReport | null> {
  await connectToDatabase();

  const doc = await StatReportModel.findOne({ token, ownerId }).lean<StatReportDocument>();
  if (!doc) return null;

  const profiles = mapProfileDefinitions(doc);

  if (doc.type === "elo") {
    const matchDocs = await MatchRecordModel.find({ reportToken: doc.token })
      .sort({ matchDate: 1, createdAt: 1 })
      .lean<MatchRecordDocument[]>();

    const legacyMatchRecords =
      doc.eloPayload && typeof doc.eloPayload === "object" && "matchRecords" in doc.eloPayload
        ? ((doc.eloPayload as { matchRecords?: unknown[] }).matchRecords ?? [])
        : [];

    return {
      type: "elo",
      name: doc.name,
      createdAt: toIsoString(doc.createdAt),
      token: doc.token,
      profileDefinitions: profiles,
      payload: mapEloPayload(doc, profiles, matchDocs, legacyMatchRecords),
    };
  }

  return {
    type: "performance",
    name: doc.name,
    createdAt: toIsoString(doc.createdAt),
    token: doc.token,
    profileDefinitions: profiles,
    payload: mapPerformancePayload(doc),
  };
}
