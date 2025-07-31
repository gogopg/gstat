"use client";
import { TrashIcon, CirclePlusIcon } from "lucide-react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";

export default function ProfileDefinitionInput() {
  const { control, register } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "reportDefinitions",
  });

  return (
    <div>
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`reportDefinitions.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input {...field} placeholder="프로필 명" />
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-5 w-5 p-0 text-red-500"
                    onClick={() => remove(index)}
                    aria-label="프로필 삭제"
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
        프로필 추가
      </Button>
    </div>
  );
}
