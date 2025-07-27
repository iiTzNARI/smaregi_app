"use client";

import { useState, useEffect, useTransition } from "react";
import { Transaction } from "@/lib/types";
import { getMonthlyTransactionsAction } from "@/app/actions";
import { MonthSelector } from "./report/MonthSelector";
import { SalesSummaryCard } from "./report/SalesSummaryCard";
import { TransactionDetails } from "./report/TransactionDetails";
import { ReportSkeleton } from "./report/ReportSkeleton";

export const MonthlyReport = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>(
    []
  );
  const [isPending, startTransition] = useTransition();

  const fetchReportData = (date: Date) => {
    startTransition(async () => {
      const transactions = await getMonthlyTransactionsAction(date);
      setMonthlyTransactions(transactions);
    });
  };

  useEffect(() => {
    fetchReportData(currentDate);
  }, []);

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    fetchReportData(date);
  };

  const totalSales = monthlyTransactions.reduce(
    (sum, tx) => sum + Number(tx.total),
    0
  );

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <MonthSelector
          currentDate={currentDate}
          onDateChange={handleDateChange}
          isLoading={isPending}
        />

        {isPending ? (
          <ReportSkeleton />
        ) : (
          <>
            <SalesSummaryCard totalSales={totalSales} />
            <TransactionDetails transactions={monthlyTransactions} />
          </>
        )}
      </div>
    </div>
  );
};
