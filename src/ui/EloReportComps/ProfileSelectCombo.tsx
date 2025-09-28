import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import React from "react";
import { MatchRecord, ProfileDefinition, Side } from "@/types/report";
import { useController, useFormContext, useWatch } from "react-hook-form";

type props = {
  side: Side;
  profileDefinitions: ProfileDefinition[];
};

export default function ProfileSelectCombo({ profileDefinitions, side }: props) {
  const [open, setOpen] = React.useState(false);

  const { control, setValue } = useFormContext<{
    participants: MatchRecord["participants"];
  }>();

  const fieldName = `participants.${side}.profileName` as const;
  const { field } = useController({ control, name: fieldName });

  const base = `participants.${side}` as const;
  const selectedId = useWatch({ control, name: `${base}.profileId` }) as string | undefined;

  const selected = field.value as string | undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {selected ? profileDefinitions.find((profile) => profile.name === selected)?.name : "프로필을 선택"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="프로필 검색" />
          <CommandList>
            <CommandEmpty>검색 결과 없음</CommandEmpty>
            <CommandGroup>
              {profileDefinitions.map((profile) => (
                <CommandItem
                  key={profile.id}
                  value={profile.name}
                  onSelect={() => {
                    if (selectedId === profile.id) {
                      setValue(`${base}.profileId`, "", { shouldDirty: true, shouldValidate: true });
                      field.onChange(""); // profileName 초기화 (string 필드)
                    } else {
                      setValue(`${base}.profileId`, profile.id, { shouldDirty: true, shouldValidate: true });
                      field.onChange(profile.name); // profileName 동시 업데이트
                    }
                    setOpen(false);
                  }}
                >
                  <CheckIcon className={cn("mr-2 h-4 w-4", selectedId === profile.id ? "opacity-100" : "opacity-0")} />
                  {profile.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
