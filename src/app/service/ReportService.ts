"use server";

import { db } from "@/db";
import { statReportsSchema, eloPayloadSchema, performancePayloadSchema } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { PerformancePayload, StatReport, EloPayload, SimpleStatReport } from "@/types/report";
import { generateReportToken } from "@/util/tokenUtil";
import { getSessionUser } from "@/util/auth";

type StatReportRow = typeof statReportsSchema.$inferSelect;

function toStatReport(row: StatReportRow): SimpleStatReport {
  return {
    name: row.name,
    type: row.type as StatReport["type"],
    token: row.token,
    createdAt: row.createdAt.toString(),
  };
}

export async function getReports(userId: string) {
  const reports = await db.select().from(statReportsSchema).where(eq(statReportsSchema.ownerId, userId));
  return reports.map(toStatReport);
}

export async function insertReport(report: StatReport) {
  try {
    return await db.transaction(async (tx) => {
      let insertedPayloadId;

      if (report.type === "performance") {
        const perf = report.payload as PerformancePayload;

        const [insertedPayload] = await tx
          .insert(performancePayloadSchema)
          .values({
            statDefinitions: perf.statDefinitions,
            performanceRecords: perf.performanceRecords,
          })
          .returning({ id: performancePayloadSchema.id });

        if (!insertedPayload) throw new Error("Performance 페이로드 삽입 실패!");
        insertedPayloadId = insertedPayload.id;
      } else if (report.type === "elo") {
        const elo = report.payload as EloPayload;
        const [insertedPayload] = await tx
          .insert(eloPayloadSchema)
          .values({
            k: elo.k,
            bestOf: elo.bestOf,
          })
          .returning({ id: eloPayloadSchema.id });

        if (!insertedPayload) throw new Error("Elo 페이로드 삽입 실패!");
        insertedPayloadId = insertedPayload.id;
      } else {
        throw new Error("알 수 없는 리포트 타입입니다.");
      }

      if (!insertedPayloadId) {
        throw new Error("알 수 없는 리포트 타입입니다.");
      }
      let token = await generateReportToken();
      while (true) {
        const existing = await tx
          .select({ count: sql`count(*)` })
          .from(statReportsSchema)
          .where(eq(statReportsSchema.token, token))
          .then((res) => res[0].count);

        if (Number(existing) === 0) {
          break;
        }
        token = await generateReportToken();
      }
      const ownerId = (await getSessionUser())?.id;
      if (!ownerId) {
        throw new Error("유저 아이디 오류");
      }
      const result = await tx
        .insert(statReportsSchema)
        .values({
          name: report.name,
          type: report.type,
          payloadId: insertedPayloadId,
          token: token,
          ownerId: ownerId,
          updatedAt: new Date(),
        })
        .returning();

      return result;
    });
  } catch (e) {
    console.error(e);
  }
}
