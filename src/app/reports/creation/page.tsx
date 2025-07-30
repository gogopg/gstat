"use client";

import StatDefinitionInput from "@/ui/StatDefinitionInput";
import React, { useState } from "react";
import ProfileInput from "@/ui/ProfileInput";
import { StatDefinition, Profile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Report } from "@/types/report";

export default function Page() {
  const [step, setStep] = useState(1);
  const [stats, setStats] = useState<StatDefinition[]>([{ value: "" }]);
  const [profilesData, setProfileData] = useState<Profile[]>([{ name: "", stats: {} }]);

  const methods = useForm<Report>({
    defaultValues: {
      name: "",
      statDefinitions: [],
      profiles: [],
    },
  });

  const onSubmit = methods.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <input {...methods.register("name")} placeholder="report 이름" />
          <StatDefinitionInput setStats={setStats} setStepAction={setStep} />
          <ProfileInput />

          <button type="submit">저장</button>
        </form>
      </FormProvider>
    </div>
  );
}
