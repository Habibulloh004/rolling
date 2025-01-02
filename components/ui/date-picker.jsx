"use client";

import React, { useEffect, useState } from "react";
import { format, getDate, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useTranslations } from "use-intl";

export function DatePicker({ startYear, endYear, value, onChange }) {
  startYear = startYear || getYear(new Date()) - 100;
  endYear = endYear || getYear(new Date()) + 100;
  const month = useTranslations("Months");
  const [date, setDate] = useState(new Date());

  const months = [
    month("January"),
    month("February"),
    month("March"),
    month("April"),
    month("May"),
    month("June"),
    month("July"),
    month("August"),
    month("September"),
    month("October"),
    month("November"),
    month("December"),
  ];
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthChange = (month) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year) => {
    const newDate = setYear(date, parseInt(year));
    setDate(newDate);
  };

  const handleSelect = (selectedData) => {
    if (selectedData) {
      setDate(selectedData);
    }
  };

  useEffect(() => {
    onChange(date.getTime());
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-11 w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            <span>{`${getDate(date)} - ${months[getMonth(date)]}, ${getYear(
              date
            )}`}</span>
          ) : (
            <span>{month("selectDate")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="relative w-full p-0">
        <div className="absolute bg-white w-full z-20 flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(date)]}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={getYear(date).toString()}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          month={date}
          onMonthChange={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}
