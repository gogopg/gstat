import { connectToDatabase, StatReportModel, type StatReportDocument } from "@/db";
import type {
  EloPayload,
  PerformancePayload,
  ProfileDefinition,
  SimpleStatReport,
  StatReport,
} from "@/types/report";

function toIsoString(value: Date | string | undefined | null) {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function mapProfileDefinitions(doc: StatReportDocument): ProfileDefinition[] {
  return (doc.profileDefinitions ?? []).map((profile) => ({
    id: profile.id,
    name: profile.name,
    description: profile.description ?? undefined,
  }));
}

function mapSimpleReport(doc: StatReportDocument): SimpleStatReport {
  return {
    name: doc.name,
    type: doc.type as StatReport["type"],
    token: doc.token,
    createdAt: toIsoString(doc.createdAt),
  };
}

function mapPerformancePayload(doc: StatReportDocument): PerformancePayload {
  if (!doc.performancePayload) {
    return { statDefinitions: [], performanceRecords: [] };
  }

  return {
    statDefinitions: doc.performancePayload.statDefinitions?.map((stat) => ({ value: stat.value })) ?? [],
    performanceRecords: doc.performancePayload.performanceRecords ?? [],
  };
}

function mapEloPayload(doc: StatReportDocument, profiles: ProfileDefinition[]): EloPayload {
  if (!doc.eloPayload) {
    return { k: 0, bestOf: 1, eloRatings: [], matchRecords: [] };
  }

  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

  return {
    k: doc.eloPayload.k,
    bestOf: (doc.eloPayload.bestOf as 1 | 3 | 5 | 7) ?? 1,
    lastUpdatedAt: doc.eloPayload.lastUpdatedAt ? toIsoString(doc.eloPayload.lastUpdatedAt) : undefined,
    eloRatings:
      doc.eloPayload.eloRatings?.map((rating) => ({
        profile: profileMap.get(rating.profileId) ?? {
          id: rating.profileId,
          name: "(unknown)",
        },
        score: rating.score,
      })) ?? [],
    matchRecords:
      doc.eloPayload.matchRecords?.map((record) => ({
        id: record.id,
        name: record.name ?? undefined,
        participants: {
          A: {
            profileId: record.participants.A.profileId,
            profileName: record.participants.A.profileName,
          },
          B: {
            profileId: record.participants.B.profileId,
            profileName: record.participants.B.profileName,
          },
        },
        setResult: {
          A: record.setResult.A,
          B: record.setResult.B,
        },
        matchDate: toIsoString(record.matchDate),
        createdAt: toIsoString(record.createdAt),
        roster: record.roster
          ? {
              A: record.roster.A,
              B: record.roster.B,
            }
          : undefined,
        winnerSide: record.winnerSide as "A" | "B",
      })) ?? [],
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
    return {
      type: "elo",
      name: doc.name,
      createdAt: toIsoString(doc.createdAt),
      token: doc.token,
      profileDefinitions: profiles,
      payload: mapEloPayload(doc, profiles),
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
