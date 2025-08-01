"use client";
import { TrashIcon, CirclePlusIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { StatDefinition } from "@/types/profile";

export default function ProfileInput() {
  const { control, register, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "profiles",
  });

  const statDefs = watch("statDefinitions");

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4">
          <FormField
            key={field.id}
            control={control}
            name={`profiles.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <label className="w-10">이름</label>
                    <Input {...field} placeholder="이름" value={field.value ?? ""} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {statDefs.map((stat: StatDefinition) => (
            <FormField
              key={stat.value}
              control={control}
              name={`profiles.${index}.stats.${stat.value}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="inline-flex items-center gap-2">
                      <label className="w-10">{stat.value}</label>
                      <Input {...field} placeholder={stat.value} value={field.value ?? ""} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-1 text-red-500"
            onClick={() => remove(index)}
            aria-label="프로필 삭제"
          >
            <TrashIcon className="h-5 w-5" />
            프로필 삭제
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        className="flex items-center gap-1"
        onClick={() => append({ name: "", stats: {} })}
      >
        <CirclePlusIcon className="h-4 w-4" />
        프로필 추가
      </Button>
    </div>
  );
}
