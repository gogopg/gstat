"use client";

import { StatRecordCard } from "@/ui/StatRecordCard";
import { ProfileDefinition, StatDefinition } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import React from "react";
import { Button } from "@/components/ui/button";

type CreateStatRecordInputType = {
  statDefinitions: StatDefinition[];
  profileDefinitions: ProfileDefinition[];
  executeFunctionAction: () => void;
  cancelFunctionAction: () => void;
};

export default function CreateStatRecordInput({
  statDefinitions,
  profileDefinitions,
  executeFunctionAction,
  cancelFunctionAction,
}: CreateStatRecordInputType) {
  const { control } = useFormContext();

  const saveRecord = () => {
    executeFunctionAction();
    cancelFunctionAction();
  };
  return (
    <div className="flex flex-col gap-4 rounded-md border bg-white px-4 py-3 shadow-sm">
      <p className="mx-2 my-4 text-2xl font-bold">새 기록 추가</p>
      <div className="flex w-full items-center gap-4">
        <Label>기록명</Label>
        <FormField
          key={`statRecordName`}
          control={control}
          name={`statRecordName`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} key="recordName" placeholder="기록 이름" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="flex w-full flex-col gap-4 text-balance">
        <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {profileDefinitions.map((profileDefinition, index) => {
            return (
              <StatRecordCard
                key={profileDefinition.name}
                profileName={profileDefinition.name}
                statDefinitions={statDefinitions}
                profileIndex={index}
              />
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="secondary" className="flex items-center gap-1" onClick={cancelFunctionAction}>
          취소
        </Button>
        <Button type="button" className="flex items-center gap-1" onClick={saveRecord}>
          입력
        </Button>
      </div>
    </div>
  );
}
