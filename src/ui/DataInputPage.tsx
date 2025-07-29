"use client";
import { TrashIcon, CirclePlusIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { ProfileData, Stat } from "@/types/profile";

type FormValues = {
  profiles: ProfileData[];
};

type DataInputPageProps = {
  stats: Stat[];
  setStepAction: React.Dispatch<React.SetStateAction<number>>;
  setProfileDataAction: React.Dispatch<React.SetStateAction<ProfileData[]>>;
};

export default function DataInputPage({
  stats,
  setStepAction,
  setProfileDataAction,
}: DataInputPageProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      profiles: [{ name: "", stats: {} }],
    },
  });

  const {
    fields: profileFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "profiles",
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setProfileDataAction(data.profiles);
    setStepAction(2);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          {profileFields.map((field, index) => (
            <div key={field.id} className="space-y-4">
              <FormField
                key={field.id}
                control={form.control}
                name={`profiles.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <label>이름:</label>
                        <Input
                          {...field}
                          placeholder="이름"
                          value={field.value ?? ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {stats.map((stat) => (
                <FormField
                  key={stat.value}
                  control={form.control}
                  name={`profiles.${index}.stats.${stat.value}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <label>{stat.value}:</label>
                          <Input
                            {...field}
                            placeholder="지표명"
                            value={field.value ?? ""}
                          />
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
                aria-label="플레이어 삭제"
              >
                <TrashIcon className="h-5 w-5" />
                플레이어 삭제
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
            플레이어 추가
          </Button>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
