import { useAuthStore } from "@/store/authStore";
import { db } from "@/db";
import { statReportsSchema, eloPayloadSchema, performancePayloadSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PerformancePayload, StatReport, EloPayload } from "@/types/report";
import { generateReportToken } from "@/util/tokenUtil";

export async function getReports(userId: string) {
  return db.select().from(statReportsSchema).where(eq(statReportsSchema.ownerId, userId));
}
