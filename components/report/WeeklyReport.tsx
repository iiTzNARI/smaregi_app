// components/report/WeeklyReport.tsx
"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { Transaction } from "@/lib/types";
import { getWeeklyTransactionsAction } from "@/app/actions";
import { WeekSelector } from "./WeekSelector";
import { SalesSummaryCard } from "./SalesSummaryCard";
import { TransactionDetails } from "./TransactionDetails";
import { ReportSkeleton } from "./ReportSkeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DailyBarChart = ({
  data,
}: {
  data: { day: string; total: number }[];
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis
        tickFormatter={(value) => `${(value / 10000).toLocaleString()}万円`}
      />
      <Tooltip
        formatter={(value: number) => [value.toLocaleString() + "円", "売上"]}
      />
      <Bar dataKey="total" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

export const WeeklyReport = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeklyTransactions, setWeeklyTransactions] = useState<Transaction[]>(
    []
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const transactions = await getWeeklyTransactionsAction(currentDate);
      setWeeklyTransactions(transactions);
    });
  }, [currentDate]);

  // グラフ用データ変換（曜日ごとに売上合計を集計）
  const dailyTrendData = useMemo(() => {
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
    const allWeekDays = weekDays.map((day) => ({ day, total: 0 }));

    weeklyTransactions.forEach((tx) => {
      const txDate = new Date(tx.transactionDateTime);
      const dayIndex = txDate.getDay();
      allWeekDays[dayIndex].total += Number(tx.total);
    });

    return allWeekDays;
  }, [weeklyTransactions]);

  const totalSales = weeklyTransactions.reduce(
    (sum, tx) => sum + Number(tx.total),
    0
  );

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <WeekSelector
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
                <CardTitle>曜日別 売上推移グラフ</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyBarChart data={dailyTrendData} />
              </CardContent>
            </Card>
            <TransactionDetails transactions={weeklyTransactions} />
          </>
        )}
      </div>
    </div>
  );
};
