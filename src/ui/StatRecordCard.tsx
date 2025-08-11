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

type props = {
  profileName: string;
  statDefinitions: StatDefinition[];
  profileIndex: number;
};

export function StatRecordCard({ profileName, statDefinitions, profileIndex }: props) {
  const { control } = useFormContext();
  const statLength = statDefinitions.length;

  return (
    <Card className="max-w-sm min-w-50" key={`${profileName}`}>
      <CardHeader>
        <CardTitle>{profileName}</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="flex flex-col gap-1">
        {statDefinitions.map((statDefinition, index) => {
          return (
            <FormField
              key={`${profileName}-${statDefinition.value}`}
              control={control}
              name={`statRecords.${profileIndex * statLength + index}.${profileName}.${statDefinition.value}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <Label className="text-muted-foreground w-1/2">{statDefinition.value}</Label>
                      <Input className="w-1/2" {...field} value={field.value ?? ""} placeholder={statDefinition.value} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
          </div>
      </CardContent>
    </Card>
  );
}
