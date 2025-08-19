import { EloPayload, EloRating, MatchRecord } from "@/types/report";

function expectedScore(aSide: EloRating, bSide: EloRating): number {
  return 1 / (1 + Math.pow(10, (bSide.score - aSide.score) / 400));
}

function scoreA(record: MatchRecord): number {
  const total = Number(record.setResult.A) + Number(record.setResult.B);
  return Number(record.setResult.A) / total;
}

function findRating(id: string, ratings: EloRating[]): EloRating | undefined {
  return ratings.find((v) => v.profile.id === id);
}

export function calculateEloRating(record: MatchRecord, K: number, ratings: EloRating[]): EloRating[] {
  const aSide = findRating(record.participants.A.profileId, ratings);
  const bSide = findRating(record.participants.B.profileId, ratings);

  if (!aSide || !bSide) {
    console.error("경기 참가자의 레이팅을 찾을 수 없습니다.");
    return ratings;
  }

  const eA = expectedScore(aSide, bSide);
  const sA = scoreA(record);

  const deltaA = Math.round(K * (sA - eA));
  const deltaB = -deltaA;

  const newASide = { ...aSide, score: aSide.score + deltaA };
  const newBSide = { ...bSide, score: bSide.score + deltaB };

  return ratings.map((rating) => {
    if (rating.profile.id === newASide.profile.id) {
      return newASide;
    }
    if (rating.profile.id === newBSide.profile.id) {
      return newBSide;
    }
    return rating;
  });
}

export function calcMatchRecords(payload: EloPayload): EloRating[] {
  const sortedRecords = payload.matchRecords
    .slice()
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

  const initializedRatings = payload.eloRatings.map(rating => ({
    ...rating,
    score: 1000
  }));


  return sortedRecords.reduce((acc, record) => {
    return calculateEloRating(record, payload.k, acc);
  }, initializedRatings);
}
