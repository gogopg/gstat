"use client";

import StatInputPage from "@/ui/StatInputPage";
import { useEffect, useState } from "react";
import DataInputPage from "@/ui/DataInputPage";

export type Stat = { value: string };
export type StatData = { stat: string; statData: string };
export type StatMap = Record<string, number>;
export type ProfileData = {
  name: string;
  stats: StatMap;
};

export default function Page() {
  const [step, setStep] = useState(1);
  const [stats, setStats] = useState<Stat[]>([{ value: "" }]);
  const [statData, setStatData] = useState<StatData[]>([
    { stat: "", statData: "" },
  ]);
  const [profilesData, setProfileData] = useState<ProfileData[]>([
    { name: "", stats: {} },
  ]);

  return (
    <div>
      {step === 1 && (
        <StatInputPage setStats={setStats} setStepAction={setStep} />
      )}
      {step === 2 && (
        <DataInputPage
          stats={stats}
          setProfileDataAction={setProfileData}
          setStepAction={setStep}
        />
      )}
    </div>
  );
}
