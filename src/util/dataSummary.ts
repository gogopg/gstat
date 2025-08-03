import { MatchRecord } from "@/types/matchRecord";
import { StatDefinition } from "@/types/profile";

function normalize(value: number, min: number, max: number): number {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function buildRadarChartData(
    matchRecords: MatchRecord[],
    statDefinition: StatDefinition[]
) {
    const statKeys = statDefinition.map((def) => def.value);

    // 1. profile.name 기준으로 stats 누적
    const profileMap = new Map<
        string,
        { totalStats: Record<string, number>; count: number }
    >();

    for (const match of matchRecords) {
        for (const profile of match.profileRecords) {
            if (!profileMap.has(profile.name)) {
                profileMap.set(profile.name, {
                    totalStats: { ...profile.stats },
                    count: profile.count,
                });
            } else {
                const existing = profileMap.get(profile.name)!;
                for (const key of statKeys) {
                    existing.totalStats[key] =
                        (existing.totalStats[key] || 0) + (profile.stats[key] || 0);
                }
                existing.count += profile.count;
            }
        }
    }

    // 2. 선수별 평균값 계산
    const averagedProfiles = Array.from(profileMap.entries()).map(
        ([name, { totalStats, count }]) => {
            const avgStats: Record<string, number> = {};
            for (const key of statKeys) {
                avgStats[key] = totalStats[key] / count;
            }
            return { name, stats: avgStats };
        }
    );

    // 3. 전체 평균 추가
    const overallAverage: Record<string, number> = {};
    for (const key of statKeys) {
        const sum = averagedProfiles.reduce((acc, p) => acc + p.stats[key], 0);
        overallAverage[key] = sum / averagedProfiles.length;
    }

    averagedProfiles.push({ name: "AVERAGE", stats: overallAverage });

    // 4. stat별 min/max 계산
    const statSummary = statKeys.reduce((acc, key) => {
        const values = averagedProfiles.map((p) => p.stats[key]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        acc[key] = { min, max };
        return acc;
    }, {} as Record<string, { min: number; max: number }>);

    // 5. labels 구성 (2줄)
    const labels: (string | string[])[] = statKeys.map((key) => {
        const { min, max } = statSummary[key];
        return [key, `(${min}~${max})`];
    });

    // 6. datasets 구성
    const datasets = averagedProfiles.map((profile) => {
        const data = statKeys.map((key) => {
            const { min, max } = statSummary[key];
            return Number(normalize(profile.stats[key], min, max).toFixed(2));
        });

        const isAverage = profile.name === "AVERAGE";

        return {
            label: profile.name,
            data,
            fill: isAverage,
            borderWidth: 1,
            borderColor: isAverage ? undefined : "rgba(0,0,0,0.7)" ,
            backgroundColor: isAverage ? "rgba(255,0,0,0.1)" : "transparent",
            pointBackgroundColor: isAverage ? "red" : "black",
            borderDash: isAverage ? [2, 2] : undefined ,
        };
    });

    return {
        labels,
        datasets,
    };
}