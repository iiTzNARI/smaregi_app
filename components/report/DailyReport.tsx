// components/report/DailyReport.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateSelector } from "./DateSelector";
import { getMonthlyTransactionsAction } from "@/app/actions";
import { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

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

export const DailyReport = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>(
    []
  );
  const [isPending, startTransition] = useTransition();

  // 日付が変更されるたびに、その月全体のデータを取得する
  useEffect(() => {
    startTransition(async () => {
      const data = await getMonthlyTransactionsAction(currentDate);
      setMonthlyTransactions(data);
    });
  }, [currentDate]);

  // 月全体のデータから、選択された日のデータだけを絞り込む
  const dailyTransactions = monthlyTransactions.filter((tx) => {
    const txDate = new Date(tx.dateTime);
    return txDate.getDate() === currentDate.getDate();
  });

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
