// components/report/MonthlyReport.tsx
"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { Transaction } from "@/lib/types";
import { getMonthlyTransactionsAction } from "@/app/actions";
import { MonthSelector } from "./MonthSelector";
import { SalesSummaryCard } from "./SalesSummaryCard";
import { TransactionDetails } from "./TransactionDetails";
import { ReportSkeleton } from "./ReportSkeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DailyTrendChart = ({
  data,
}: {
  data: { day: string; total: number }[];
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis
        tickFormatter={(value) => `${(value / 10000).toLocaleString()}万円`}
      />
      <Tooltip
        formatter={(value: number) => [value.toLocaleString() + "円", "売上"]}
      />
      <Line type="monotone" dataKey="total" stroke="#82ca9d" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export const MonthlyReport = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>(
    []
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const transactions = await getMonthlyTransactionsAction(currentDate);
      setMonthlyTransactions(transactions);
    });
  }, [currentDate]);

  const dailyTrendData = useMemo(() => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const data = Array.from({ length: daysInMonth }, (_, i) => ({
      day: `${i + 1}日`,
      total: 0,
    }));

    monthlyTransactions.forEach((tx) => {
      const dayIndex = new Date(tx.dateTime).getDate() - 1;
      if (data[dayIndex]) {
        data[dayIndex].total += Number(tx.total);
      }
    });
    return data;
  }, [monthlyTransactions, currentDate]);

  const totalSales = monthlyTransactions.reduce(
    (sum, tx) => sum + Number(tx.total),
    0
  );

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <MonthSelector
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          isLoading={isPending}
        />
        {isPending ? (
          <ReportSkeleton />
        ) : (
          <>
            <SalesSummaryCard totalSales={totalSales} />
            <Card>
              <CardHeader>
                <CardTitle>日別 売上推移グラフ</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyTrendChart data={dailyTrendData} />
              </CardContent>
            </Card>
            <TransactionDetails transactions={monthlyTransactions} />
          </>
        )}
      </div>
    </div>
  );
};
