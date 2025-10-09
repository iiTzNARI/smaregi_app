// components/report/DailyReport.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { Transaction } from "@/lib/types";
import { getDailyTransactionsAction } from "@/app/actions";
import { DateSelector } from "./DateSelector";
import { SalesSummaryCard } from "./SalesSummaryCard";
import { TransactionDetails } from "./TransactionDetails";
import { ReportSkeleton } from "./ReportSkeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const DailyReport = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyTransactions, setDailyTransactions] = useState<Transaction[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const transactions = await getDailyTransactionsAction(currentDate);
      setDailyTransactions(transactions);
    });
  }, [currentDate]);

  // 0時〜23時までの時間軸データを生成
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}時`,
    total: 0,
  }));

  // 取引データを時間ごとに集計
  dailyTransactions.forEach((tx) => {
    const dateObj = new Date(tx.transactionDateTime);
    const hour = dateObj.getHours();
    hours[hour].total += Number(tx.total);
  });

  const totalSales = dailyTransactions.reduce(
    (sum, tx) => sum + Number(tx.total),
    0
  );

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <DateSelector
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
                <CardTitle>時間別 売上推移グラフ</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <TransactionDetails transactions={dailyTransactions} />
          </>
        )}
      </div>
    </div>
  );
};
