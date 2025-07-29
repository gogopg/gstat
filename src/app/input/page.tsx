"use client";

import StatInputPage from "@/ui/StatInputPage";
import { useState } from "react";
import DataInputPage from "@/ui/DataInputPage";
import { Stat, ProfileData } from "@/types/profile";

export default function Page() {
  const [step, setStep] = useState(1);
  const [stats, setStats] = useState<Stat[]>([{ value: "" }]);
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
