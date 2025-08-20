import { StatReportCard } from "@/ui/StatReportComps/StatReportCard";
import { StatReport } from "@/types/report";

type props = {
  reports: StatReport[];
};

export default function DBReportPageUI({ reports }: props) {
  return (
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {reports.map((report) => {
        return <StatReportCard key={report.name} statReport={report}></StatReportCard>;
      })}
    </div>
  );
}
