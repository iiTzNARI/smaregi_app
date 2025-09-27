// components/report/DateSelector.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateSelectorProps = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  isLoading: boolean;
};

export const DateSelector = ({
  currentDate,
  onDateChange,
  isLoading,
}: DateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      setIsOpen(false);
    }
  };

  // 日付を変更する関数
  const changeDateByArrow = (amount: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + amount);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* 前日ボタン */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => changeDateByArrow(-1)}
        disabled={isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[240px] justify-start text-left font-normal")}
            disabled={isLoading}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(currentDate, "PPP", { locale: ja })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* 翌日ボタン */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => changeDateByArrow(1)}
        disabled={isLoading}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
