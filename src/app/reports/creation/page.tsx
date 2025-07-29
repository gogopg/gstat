"use client";

import StatInputForm from "@/ui/StatInputForm";
import { useState } from "react";
import DataInputForm from "@/ui/DataInputForm";
import { Stat, Profile } from "@/types/profile";

export default function Page() {
  const [step, setStep] = useState(1);
  const [stats, setStats] = useState<Stat[]>([{ value: "" }]);
  const [profilesData, setProfileData] = useState<Profile[]>([
    { name: "", stats: {} },
  ]);

  return (
    <div>
      {step === 1 && (
        <StatInputForm setStats={setStats} setStepAction={setStep} />
      )}
      {step === 2 && (
        <DataInputForm
          stats={stats}
          setProfileDataAction={setProfileData}
          setStepAction={setStep}
        />
      )}
    </div>
  );
}
