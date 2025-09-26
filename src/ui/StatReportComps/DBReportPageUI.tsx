import { StatReportCard } from "@/ui/StatReportComps/StatReportCard";
import { SimpleStatReport } from "@/types/report";

type props = {
  reports: SimpleStatReport[];
};

export default function DBReportPageUI({ reports }: props) {
  return (
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {reports.map((report) => {
        return <StatReportCard key={report.token} statReport={report} isSsr={true}></StatReportCard>;
      })}
    </div>
  );
}
