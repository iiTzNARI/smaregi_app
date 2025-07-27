"use client";

import { useState, useMemo } from "react";
import { Transaction } from "@/lib/types";
import { MonthSelector } from "./report/MonthSelector";
import { SalesSummaryCard } from "./report/SalesSummaryCard";
import { TransactionDetails } from "./report/TransactionDetails";

type MonthlyReportProps = {
  transactions: Transaction[];
};

export const MonthlyReport = ({ transactions }: MonthlyReportProps) => {
  const latestMonth =
    transactions.length > 0
      ? new Date(
          transactions.sort(
            (a, b) =>
              new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
          )[0].dateTime
        )
      : new Date();
  const [currentDate, setCurrentDate] = useState(latestMonth);

  // 日付が変更されたときのハンドラ
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const { monthlyTransactions, totalSales } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.dateTime);
      return txDate.getFullYear() === year && txDate.getMonth() === month;
    });

    const total = filtered.reduce((sum, tx) => sum + Number(tx.total), 0);
    return { monthlyTransactions: filtered, totalSales: total };
  }, [currentDate, transactions]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <MonthSelector
          currentDate={currentDate}
          onDateChange={handleDateChange}
        />
        <SalesSummaryCard totalSales={totalSales} />
        <TransactionDetails transactions={monthlyTransactions} />
      </div>
    </div>
  );
};
