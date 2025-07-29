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
import { Stat } from "@/types/profile";

type FormValues = {
  stats: { value: string }[];
};

type StatInputPageProps = {
  setStats: React.Dispatch<React.SetStateAction<Stat[]>>;
  setStepAction: React.Dispatch<React.SetStateAction<number>>;
};

export default function StatInputForm({
  setStats,
  setStepAction,
}: StatInputPageProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      stats: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stats",
  });

  const onSubmit = (data: FormValues) => {
    setStats(data.stats);
    setStepAction(2);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`stats.${index}.value`}
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
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-1"
            onClick={() => append({ value: "" })}
          >
            <CirclePlusIcon className="h-4 w-4" />
            지표 추가
          </Button>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
