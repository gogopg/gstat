"use server";

import { connectToDatabase, MatchRecordModel, StatReportModel } from "@/db";
import { findReportByToken, findReportsByOwnerId } from "@/db/repository/reportRepository";
import type { SimpleStatReport, StatReport } from "@/types/report";
import { getSessionUser } from "@/util/auth";
import { generateReportToken } from "@/util/tokenUtil";

function normalizeNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getReports(ownerId: string): Promise<SimpleStatReport[]> {
  return findReportsByOwnerId(ownerId);
}

export async function getReport(token: string, ownerId: string): Promise<StatReport | null> {
  return findReportByToken(token, ownerId);
}

export async function insertReport(report: StatReport): Promise<void> {
  await connectToDatabase();

  let token = generateReportToken();
  while (await StatReportModel.exists({ token })) {
    token = generateReportToken();
  }

  const owner = await getSessionUser();
  if (!owner) {
    throw new Error("유저 아이디 오류");
  }

  const profileDefinitions = report.profileDefinitions.map((profile) => ({
    id: profile.id,
    name: profile.name,
    description: profile.description,
  }));

  const base = {
    name: report.name,
    type: report.type,
    token,
    ownerId: owner.id,
    profileDefinitions,
  } as const;

  if (report.type === "performance") {
    const payload = report.payload;

    await StatReportModel.create({
      ...base,
      performancePayload: {
        statDefinitions: payload.statDefinitions,
        performanceRecords: payload.performanceRecords,
      },
    });
    return;
  }

  const payload = report.payload;
  const matchRecords = payload.matchRecords;

  await StatReportModel.create({
    ...base,
    eloPayload: {
      k: normalizeNumber(payload.k, 0),
      bestOf: normalizeNumber(payload.bestOf, 1),
      lastUpdatedAt: payload.lastUpdatedAt ? new Date(payload.lastUpdatedAt) : undefined,
      eloRatings: payload.eloRatings.map((rating) => ({
        profileId: rating.profile.id,
        score: rating.score,
      })),
    },
  });

  if (matchRecords.length === 0) {
    return;
  }

  await MatchRecordModel.insertMany(
    matchRecords.map((match) => ({
      reportToken: token,
      matchId: match.id,
      name: match.name,
      participants: {
        A: {
          profileId: match.participants.A.profileId,
          profileName: match.participants.A.profileName,
        },
        B: {
          profileId: match.participants.B.profileId,
          profileName: match.participants.B.profileName,
        },
      },
      setResult: match.setResult,
      matchDate: new Date(match.matchDate),
      createdAt: new Date(match.createdAt),
      roster: match.roster,
      winnerSide: match.winnerSide,
    })),
    { ordered: true },
  );
}
