"use client"

import * as React from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale/vi"
import { Calendar as CalendarIcon } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// A custom PopoverContent that DOES NOT use a portal.
// This ensures it renders inside the Dialog's DOM tree.

interface DatePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  localLanguage?: string
  disabled?: boolean
}

export function DatePicker({ value, onChange, placeholder, localLanguage, disabled }: DatePickerProps) {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal border-cyan-300",
            !value && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd/MM/yyyy", { locale: vi}) : <span>{placeholder || "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={localLanguage === "vi" ? vi : undefined}
          disabled={(date) => date > new Date()}
          captionLayout="dropdown"
          formatters={{
            formatMonthDropdown: (month) => localLanguage === "vi" ? format(month, "'Tháng' MM", {locale: vi}) : format(month, "LLLL"),
          }}
        />
      </PopoverContent>
    </Popover>
  )
}