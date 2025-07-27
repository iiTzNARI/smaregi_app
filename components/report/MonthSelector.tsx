"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MonthSelectorProps = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
};

export const MonthSelector = ({
  currentDate,
  onDateChange,
}: MonthSelectorProps) => {
  const [year, setYear] = useState(String(currentDate.getFullYear()));
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1));

  // 親コンポーネントから渡される日付が変更されたら、入力欄も更新する
  useEffect(() => {
    setYear(String(currentDate.getFullYear()));
    setMonth(String(currentDate.getMonth() + 1));
  }, [currentDate]);

  // 前後月に移動する関数
  const changeMonthByArrow = (amount: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + amount);
    onDateChange(newDate);
  };

  // 表示ボタンが押されたときの処理
  const handleDisplayClick = () => {
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    // 入力が有効な数値かチェック
    if (
      !isNaN(yearNum) &&
      !isNaN(monthNum) &&
      monthNum >= 1 &&
      monthNum <= 12
    ) {
      onDateChange(new Date(yearNum, monthNum - 1));
    } else {
      alert("正しい年月を入力してください。");
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => changeMonthByArrow(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-24 text-center"
        />
        <span>年</span>
        <Input
          type="number"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-16 text-center"
        />
        <span>月</span>
      </div>

      <Button onClick={handleDisplayClick}>表示</Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => changeMonthByArrow(1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
