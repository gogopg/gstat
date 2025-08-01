import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { StatDefinition } from "@/types/profile";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TrashIcon } from "lucide-react";

type MatchRecordCardType = {
  profile: string;
  statDefinitions: StatDefinition[];
  profileIndex: number;
};

export function MatchRecordCard({ profile, statDefinitions, profileIndex }: MatchRecordCardType) {
  const { control } = useFormContext();
  const statLength = statDefinitions.length;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{profile}</CardTitle>
      </CardHeader>
      <CardContent>
        {statDefinitions.map((statDefinition, index) => {
          return (
            <FormField
              key={`${profile}-${statDefinition.value}`}
              control={control}
              name={`matchRecords.${profileIndex * statLength + index}.${profile}.${statDefinition.value}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Label>{statDefinition.value}</Label>
                      <Input {...field} placeholder={statDefinition.value} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
