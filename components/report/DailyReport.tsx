// components/report/DailyReport.tsx
"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateSelector } from "./DateSelector";
import { getDailyTransactionsAction } from "@/app/actions";
import { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// KPIカード用のコンポーネント
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
      <p className="text-4xl font-bold">
        {value}
        <span className="text-xl ml-1">{unit}</span>
      </p>
    </CardContent>
  </Card>
);

// 時間帯別売上グラフ用のコンポーネント
const HourlySalesChart = ({
  data,
}: {
  data: { hour: string; total: number }[];
}) => (
  // divで囲み、横スクロールを可能にする
  <div className="w-full overflow-x-auto">
    <div style={{ width: "1200px" }}>
      {" "}
      {/* グラフ自体の幅を広げる */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis tickFormatter={(value) => `${value.toLocaleString()}円`} />
          <Tooltip
            formatter={(value: number) => [
              value.toLocaleString() + "円",
              "売上",
            ]}
          />
          <Bar dataKey="total" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

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

  // 時間帯別データを計算するロジックを0時〜23時に変更
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i); // 0時から23時
    const data: { hour: string; total: number }[] = hours.map((h) => ({
      hour: `${h}時`,
      total: 0,
    }));

    dailyTransactions.forEach((tx) => {
      const hour = new Date(tx.dateTime).getHours();
      // data配列のインデックスは時間と一致する
      if (data[hour]) {
        data[hour].total += Number(tx.total);
      }
    });
    return data;
  }, [dailyTransactions]);

  const totalSales = dailyTransactions.reduce(
    (sum, tx) => sum + Number(tx.total),
    0
  );
  const customerCount = dailyTransactions.length;
  const avgSalePerCustomer = customerCount > 0 ? totalSales / customerCount : 0;

  return (
    <div className="space-y-6">
      <DateSelector
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        isLoading={isPending}
      />

      {isPending ? (
        <p className="text-center pt-10">読み込み中...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KpiCard
              title="売上高"
              value={totalSales.toLocaleString()}
              unit="円"
            />
            <KpiCard title="客数" value={customerCount.toString()} unit="人" />
            <KpiCard
              title="客単価"
              value={Math.round(avgSalePerCustomer).toLocaleString()}
              unit="円"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>時間帯別 売上グラフ</CardTitle>
            </CardHeader>
            <CardContent>
              <HourlySalesChart data={hourlyData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💡 今日の分析とアクションプラン</CardTitle>
            </CardHeader>
            <CardContent>
              {customerCount > 0 ? (
                <p>
                  売上: {formatCurrency(totalSales)} / 客数: {customerCount}人
                </p>
              ) : (
                <p>この日の取引データはありません。</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
