import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from 'react';
import { Control } from 'react-hook-form'; // Control 타입을 import

type props = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}

export default function TextFormField({ control, name, label, placeholder, type = "text" } : props){
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

