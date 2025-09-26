import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { eloRatings, schema } from "@/db/schema";
import { StatReport, ProfileDefinition, EloPayload, PerformancePayload } from "@/types/report";


export async function findReportsByOwnerId(ownerId: string) {
  return db.select().from(schema.statReports).where(eq(schema.statReports.ownerId, ownerId));
}

export async function findReportByToken(
  token: string,
  ownerId: string
): Promise<StatReport | null> {
  // 1) 보고서
  const [report] = await db
    .select()
    .from(schema.statReports)
    .where(and(eq(schema.statReports.ownerId, ownerId), eq(schema.statReports.token, token)))
    .limit(1);

  if (!report) return null;

  // 2) 프로필 정의
  const profileRows = await db
    .select()
    .from(schema.profileDefinitions)
    .where(eq(schema.profileDefinitions.reportId, report.id));

  const profileDefinitions: ProfileDefinition[] = profileRows.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
  }));

  // 3) 타입별 payload
  if (report.type === "elo") {
    // Elo payload 1:1
    const [eloRow] = await db
      .select()
      .from(schema.eloPayload)
      .where(eq(schema.eloPayload.reportId, report.id));

    if (!eloRow) {
      return {
        type: "elo",
        name: report.name,
        createdAt: report.createdAt.toString(),
        token: report.token,
        profileDefinitions,
        payload: { k: 0, bestOf: 1, eloRatings: [], matchRecords: [] },
      };
    }

    // Elo Ratings
    const ratingRows = await db
      .select()
      .from(schema.eloRatings)
      .where(eq(schema.eloRatings.eloPayloadId, eloRow.id));

    const eloRatings = ratingRows.map((r) => ({
      profile: profileDefinitions.find((p) => p.id === r.profileId) ?? {
        id: r.profileId,
        name: "(unknown)",
      },
      score: r.score,
    }));

    // Match Records
    const matchRows = await db
      .select()
      .from(schema.matchRecords)
      .where(eq(schema.matchRecords.eloPayloadId, eloRow.id));

    const matchRecords = matchRows.map((m) => ({
      id: m.id,
      name: m.name ?? undefined,
      participants: {
        A: {
          profileId: m.participantAId,
          profileName:
            profileDefinitions.find((p) => p.id === m.participantAId)?.name ?? "(unknown)",
        },
        B: {
          profileId: m.participantBId,
          profileName:
            profileDefinitions.find((p) => p.id === m.participantBId)?.name ?? "(unknown)",
        },
      },
      setResult: { A: m.setResultA, B: m.setResultB },
      matchDate: m.matchDate.toString(),
      createdAt: m.createdAt.toString(),
      winnerSide: m.winnerSide as "A" | "B",
    }));

    const payload: EloPayload = {
      k: eloRow.k,
      bestOf: eloRow.bestOf as 1 | 3 | 5 | 7,
      eloRatings,
      matchRecords,
    };

    const result = {
      type: "elo",
      name: report.name,
      createdAt: report.createdAt.toString(),
      token: report.token,
      profileDefinitions,
      payload,
    };

    return {
      type: "elo",
      name: report.name,
      createdAt: report.createdAt.toString(),
      token: report.token,
      profileDefinitions,
      payload,
    };
  } else {
    // Performance payload 1:1
    const [perfRow] = await db
      .select()
      .from(schema.performancePayload)
      .where(eq(schema.performancePayload.reportId, report.id));

    const payload: PerformancePayload = perfRow
      ? {
        statDefinitions: perfRow.statDefinitions,
        performanceRecords: perfRow.performanceRecords,
      }
      : { statDefinitions: [], performanceRecords: [] };

    return {
      type: "performance",
      name: report.name,
      createdAt: report.createdAt.toString(),
      token: report.token,
      profileDefinitions,
      payload,
    };
  }
}
