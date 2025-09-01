"use server";

import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { StatReport, EloPayload, SimpleStatReport } from "@/types/report";
import { generateReportToken } from "@/util/tokenUtil";
import { getSessionUser } from "@/util/auth";
import { findReportByToken, findReportsByOwnerId } from "@/db/repository/reportRepository";

type StatReportRow = typeof schema.statReports.$inferSelect;

function toStatReport(row: StatReportRow): SimpleStatReport {
  return {
    name: row.name,
    type: row.type as StatReport["type"],
    token: row.token,
    createdAt: row.createdAt.toString(),
  };
}

export async function getReports(ownerId: string) {
  const reports = await findReportsByOwnerId(ownerId);
  return reports.map(toStatReport);``
}

export async function getReport(token: string, ownerId: string) {
  const report = await findReportByToken(token, ownerId);
  return report;
}

export async function insertReport(report: StatReport) {
  try {
    return await db.transaction(async (tx) => {
      let token = await generateReportToken();
      while (true) {
        const existing = await tx
          .select({ count: sql`count(*)` })
          .from(schema.statReports)
          .where(eq(schema.statReports.token, token))
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

      const [result] = await tx
        .insert(schema.statReports)
        .values({
          name: report.name,
          type: report.type,
          token: token,
          ownerId: ownerId,
          updatedAt: new Date(),
        })
        .returning();

      const reportId = result.id;

      const newProfiles: (typeof schema.profileDefinitions.$inferInsert)[] = report.profileDefinitions.map(
        (profile) => {
          return {
            name: profile.name,
            reportId: reportId,
            description: profile.description,
          };
        },
      );

      const [insertedProfile] = await tx.insert(schema.profileDefinitions).values(newProfiles).returning();
      if(!insertedProfile) throw new Error("ProfileDefinitions 페이로드 삽입 실패!");

      if (report.type === "performance") {
        const perf = report.payload;

        const [insertedPayload] = await tx
          .insert(schema.performancePayload)
          .values({
            reportId: reportId,
            statDefinitions: perf.statDefinitions,
            performanceRecords: perf.performanceRecords,
          })
          .returning({ id: schema.performancePayload.id });

        if (!insertedPayload) throw new Error("Performance 페이로드 삽입 실패!");
      } else if (report.type === "elo") {
        const elo = report.payload as EloPayload;
        const [insertedPayload] = await tx
          .insert(schema.eloPayload)
          .values({
            reportId: reportId,
            k: elo.k,
            bestOf: elo.bestOf,
          })
          .returning({ id: schema.eloPayload.id });

        if (!insertedPayload) throw new Error("Elo 페이로드 삽입 실패!");
      } else {
        throw new Error("알 수 없는 리포트 타입입니다.");
      }

      return result;
    });
  } catch (e) {
    console.error(e);
  }
}
