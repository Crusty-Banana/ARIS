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
const PopoverContentNoPortal = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    // Copy the styles from shadcn/ui's PopoverContent.
    className={cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
))
PopoverContentNoPortal.displayName = PopoverPrimitive.Content.displayName

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