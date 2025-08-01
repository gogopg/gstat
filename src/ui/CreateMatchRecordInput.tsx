"use client";

import { MatchRecordCard } from "@/ui/MatchRecordCard";
import { StatDefinition } from "@/types/profile";
import { ProfileDefinition } from "@/types/statReport";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

type CreateMatchRecordInputType = {
  statDefinitions: StatDefinition[];
  profileDefinitions: ProfileDefinition[];
};

export default function CreateMatchRecordInput({ statDefinitions, profileDefinitions }: CreateMatchRecordInputType) {
  const { control } = useFormContext();
  return (
    <div>
      <Label>기록명</Label>
      <FormField
        key={`matchRecordName`}
        control={control}
        name={`matchRecordName`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} key='recordName' placeholder="기록 이름" />
            </FormControl>
          </FormItem>
        )}
      />

      {profileDefinitions.map((profileDefinition,index) => {
        return (
          <MatchRecordCard
            key={profileDefinition.name}
            profileName={profileDefinition.name}
            statDefinitions={statDefinitions}
            profileIndex={index}
          />
        );
      })}
    </div>
  );
}
