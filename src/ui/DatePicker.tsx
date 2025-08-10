"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useController, useFormContext } from "react-hook-form";
import { MatchRecord } from "@/types/report";
import { format } from "date-fns";

export default function DatePicker() {
  const curDate = new Date();

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(curDate);
  const [time, setTime] = React.useState<string>(format(curDate, "hh:mm:ss"));

  const { control } = useFormContext<{
    matchDate: MatchRecord["matchDate"];
  }>();
  const { field, fieldState } = useController({ control, name: "matchDate" });

  const onSelectDate = (date?: Date) => {
    setDate(date);
    if (date) {
      field.onChange(format(date, "yyyy-mm-dd") + " " + time);
      setOpen(false);
    } else {
      field.onChange(undefined);
    }
  };

  const onChangeTime: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    setTime(time);
    if (date) field.onChange(format(date, "yyyy-mm-dd") + " " + time);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          날짜
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="date-picker" className="w-32 justify-between font-normal">
              {date ? date.toLocaleDateString() : "날짜 선택"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={curDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                onSelectDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          시간
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue={time}
          onChange={(e) => onChangeTime(e)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
