"use client";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

import { Radar } from "react-chartjs-2";
import { useParams } from "next/navigation";
import { useStatReportStore } from "@/store/store";
import { buildRadarChartData } from "@/util/dataSummary";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function Page() {
  const { id } = useParams();

  const statReport = useStatReportStore((state) =>
    state.statReports.find((r) => r.name === decodeURIComponent(id as string)),
  );

  if (!statReport || statReport.type !== "performance") {
    return <div>자료 오류</div>;
  }

  const statRecord = statReport.payload.performanceRecords;

  const { labels, datasets } = buildRadarChartData(statRecord, statReport.payload.statDefinitions);

  const average = datasets.find((data) => {
    return data.label === "AVERAGE";
  });

  const filterSets = datasets.filter((data) => {
    return data.label !== "AVERAGE";
  });

  const options = {
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.2,
        },
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
      <div className="flex flex-wrap justify-center gap-6">
        {filterSets.map((dataSet, index) => {
          const name = dataSet.label;
          if (!average) {
            return null;
          }
          const radarData: ChartData<"radar", number[], string | string[]> = {
            labels: labels,
            datasets: [dataSet, average],
          };

          return (
              <div key={index} className="max-w-[340px] min-w-[280px] flex-1 basis-1/4 rounded border p-4 shadow">
                <p>{name}</p>
                <Radar data={radarData} options={options} />
              </div>
          );
        })}
      </div>
  );
}
