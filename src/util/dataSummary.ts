import { PerformanceRecord, StatDefinition } from "@/types/report";

function normalize(value: number, min: number, max: number): number {
  if (max === min) {
    return 0;
  }

  const clamped = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return Math.round(clamped * 100) / 100;
}

function aggregateProfiles(statRecords: PerformanceRecord[], statKeys: string[]) {
  const profileMap = new Map<string, { totalStats: Record<string, number>; count: number }>();

  for (const match of statRecords) {
    for (const profile of match.profileRecords) {
      let aggregated = profileMap.get(profile.name);
      if (!aggregated) {
        aggregated = {
          totalStats: { ...profile.stats },
          count: profile.count,
        };
        profileMap.set(profile.name, aggregated);
      } else {
        for (const key of statKeys) {
          const previousValue = aggregated.totalStats[key] ?? 0;
          const nextValue = profile.stats[key] ?? 0;
          aggregated.totalStats[key] = previousValue + nextValue;
        }
        aggregated.count += profile.count;
      }
    }
  }

  return Array.from(profileMap.entries()).map(([name, { totalStats, count }]) => {
    const averageStats: Record<string, number> = {};
    for (const key of statKeys) {
      averageStats[key] = count === 0 ? 0 : totalStats[key] / count;
    }
    return { name, stats: averageStats };
  });
}

export function buildRadarChartData(statRecords: PerformanceRecord[], statDefinition: StatDefinition[]) {
  const statKeys = statDefinition.map((def) => def.value);

  const averagedProfiles = aggregateProfiles(statRecords, statKeys);

  const overallAverage: Record<string, number> = {};
  for (const key of statKeys) {
    const sum = averagedProfiles.reduce<number>((acc, profile) => acc + (profile.stats[key] ?? 0), 0);
    overallAverage[key] = averagedProfiles.length === 0 ? 0 : sum / averagedProfiles.length;
  }

  const profilesWithAverage = [...averagedProfiles, { name: "AVERAGE", stats: overallAverage }];

  const statSummary: Record<string, { min: number; max: number }> = {};
  for (const key of statKeys) {
    const values = profilesWithAverage.map((profile) => profile.stats[key] ?? 0);
    statSummary[key] = { min: Math.min(...values), max: Math.max(...values) };
  }

  const labels: (string | string[])[] = statKeys.map((key) => {
    const { min, max } = statSummary[key];
    return [key, `(${min.toString()}~${max.toString()})`];
  });

  const datasets = profilesWithAverage.map((profile) => {
    const data = statKeys.map((key) => {
      const { min, max } = statSummary[key];
      return normalize(profile.stats[key] ?? 0, min, max);
    });

    const isAverage = profile.name === "AVERAGE";

    return {
      label: profile.name,
      data,
      fill: isAverage,
      borderWidth: 1,
      borderColor: isAverage ? undefined : "rgba(0,0,0,0.7)",
      backgroundColor: isAverage ? "rgba(255,0,0,0.1)" : "transparent",
      pointBackgroundColor: isAverage ? "red" : "black",
      borderDash: isAverage ? [2, 2] : undefined,
    };
  });

  return {
    labels,
    datasets,
  };
}
