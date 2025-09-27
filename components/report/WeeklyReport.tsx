// components/report/WeeklyReport.tsx
"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeekSelector } from "./WeekSelector";
import { getWeeklyTransactionsAction } from "@/app/actions";
import { Transaction } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { startOfWeek, addDays, format } from "date-fns";
import { ja } from "date-fns/locale";

const KpiCard = ({
  title,
  value,
  unit,
}: {
  title: string;
  value: string;
  unit: string;
}) => (
  <Card className="text-center">
    <CardHeader>
      <CardTitle className="text-base font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">
        {value}
        <span className="text-lg ml-1">{unit}</span>
      </p>
    </CardContent>
  </Card>
);

const DailySalesChart = ({
  data,
}: {
  data: { label: string; total: number }[];
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="label" /> {/* 表示用のlabelキーを使用 */}
      <YAxis tickFormatter={(value) => `${value.toLocaleString()}円`} />
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

  // ▼▼▼ ここから修正 ▼▼▼
  const dailyData = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    // グラフの横軸ラベルとデータを初期化
    const data = Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(weekStart, i);
      return {
        label: format(date, "M/d(E)", { locale: ja }), // "7/28(日)" のような形式
        total: 0,
      };
    });

    // 売上データを各曜日に加算
    weeklyTransactions.forEach((tx) => {
      const dayIndex = new Date(tx.dateTime).getDay(); // 0 (日) ~ 6 (土)
      if (data[dayIndex]) {
        data[dayIndex].total += Number(tx.total);
      }
    });
    return data;
  }, [weeklyTransactions, currentDate]);
  // ▲▲▲ ここまで修正 ▲▲▲

  const totalSales = weeklyTransactions.reduce(
    (sum, tx) => sum + Number(tx.total),
    0
  );
  const customerCount = weeklyTransactions.length;

  return (
    <div className="space-y-6">
      <WeekSelector
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        isLoading={isPending}
      />
      {isPending ? (
        <p className="text-center pt-10">読み込み中...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <KpiCard
              title="週間総売上"
              value={totalSales.toLocaleString()}
              unit="円"
            />
            <KpiCard
              title="週間総客数"
              value={customerCount.toString()}
              unit="人"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>曜日別 売上グラフ</CardTitle>
            </CardHeader>
            <CardContent>
              <DailySalesChart data={dailyData} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
