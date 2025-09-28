import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { StatDefinition } from "@/types/report";
import type { StatRecordFormValues } from "@/types/forms";

type props = {
  profileName: string;
  statDefinitions: StatDefinition[];
  profileIndex: number;
};

export function StatRecordCard({ profileName, statDefinitions, profileIndex }: props) {
  const { control } = useFormContext<StatRecordFormValues>();
  const statLength = statDefinitions.length;

  return (
    <Card className="max-w-sm min-w-50" key={profileName}>
      <CardHeader>
        <CardTitle>{profileName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {statDefinitions.map((statDefinition, index) => {
            const recordIndex = profileIndex * statLength + index;
            return (
              <FormField
                key={`${profileName}-${statDefinition.value}`}
                control={control}
                name={`statRecords.${String(recordIndex)}.${profileName}.${statDefinition.value}` as const}
                render={({ field }) => {
                  const { value, ...rest } = field;
                  const inputValue = typeof value === "string" ? value : "";
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <Label className="w-1/2 text-muted-foreground">{statDefinition.value}</Label>
                          <Input className="w-1/2" {...rest} value={inputValue} placeholder={statDefinition.value} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
