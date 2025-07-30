"use client";
import { TrashIcon, CirclePlusIcon } from "lucide-react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { StatDefinition } from "@/types/profile";

type FormValues = {
  statDefinitions: { value: string }[];
};

type StatInputPageProps = {
  setStats: React.Dispatch<React.SetStateAction<StatDefinition[]>>;
  setStepAction: React.Dispatch<React.SetStateAction<number>>;
};

export default function StatDefinitionInput({ setStats, setStepAction }: StatInputPageProps) {
  const { control, register } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "statDefinitions",
  });

  const onSubmit = (data: FormValues) => {
    setStats(data.statDefinitions);
    setStepAction(2);
  };

  return (
    <div>
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`statDefinitions.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input {...field} placeholder="지표명" />
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-5 w-5 p-0 text-red-500"
                    onClick={() => remove(index)}
                    aria-label="지표 삭제"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button type="button" variant="ghost" className="flex items-center gap-1" onClick={() => append({ value: "" })}>
        <CirclePlusIcon className="h-4 w-4" />
        지표 추가
      </Button>

    </div>
  );
}
