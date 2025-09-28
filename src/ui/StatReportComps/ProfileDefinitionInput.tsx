"use client";
import { TrashIcon, CirclePlusIcon } from "lucide-react";
import { useFieldArray, useFormContext, type Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import type { StatReport } from "@/types/report";

export default function ProfileDefinitionInput() {
  const { control } = useFormContext<StatReport>();

  const { fields, append, remove } = useFieldArray<StatReport, "profileDefinitions">({
    control,
    name: "profileDefinitions",
  });
  return (
    <div className="flex flex-col justify-start gap-1">
      <div className="flex items-center gap-1">
        <label className="text-lg font-bold">프로필</label>
        <Button
          type="button"
          variant="ghost"
          className="flex w-fit items-center gap-1 text-blue-500"
          onClick={() => {
            append({ id: crypto.randomUUID(), name: "", description: undefined });
          }}
        >
          <CirclePlusIcon className="h-4 w-4" />
          프로필 추가
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {fields.length === 0 && <div>입력된 프로필이 없습니다</div>}
        {fields.map((field, index) => (
          <FormField
            key={`${field.id}-hidden`}
            control={control}
            name={("profileDefinitions." + String(index) + ".id") as Path<StatReport>}
            render={({ field: idField }) => {
              const idValue = typeof idField.value === "string" ? idField.value : "";
              return (
                <input
                  type="hidden"
                  name={idField.name}
                  value={idValue}
                  onChange={idField.onChange}
                  onBlur={idField.onBlur}
                  ref={idField.ref}
                />
              );
            }}
          />
        ))}
        {fields.map((field, index) => {
          const indexSegment = String(index);
          const namePath = ("profileDefinitions." + indexSegment + ".name") as Path<StatReport>;
          return (
            <FormField
              key={field.id}
              control={control}
              name={namePath}
              render={({ field: nameField }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        name={nameField.name}
                        value={typeof nameField.value === "string" ? nameField.value : ""}
                        onChange={nameField.onChange}
                        onBlur={nameField.onBlur}
                        ref={nameField.ref}
                        placeholder="프로필 명"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-5 w-5 p-0 text-red-500"
                        onClick={() => {
                          remove(index);
                        }}
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
          );
        })}
      </div>
    </div>
  );
}
