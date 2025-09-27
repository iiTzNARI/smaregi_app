// components/report/WeeklyReport.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeekSelector } from "./WeekSelector";
import { getWeeklyTransactionsAction } from "@/app/actions";
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
      <p className="text-3xl font-bold">
        {value}
        <span className="text-lg ml-1">{unit}</span>
      </p>
    </CardContent>
  </Card>
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
              <CardTitle>💡 今週の分析とアクションプラン</CardTitle>
            </CardHeader>
            <CardContent>
              {customerCount > 0 ? (
                <p>
                  売上: {formatCurrency(totalSales)} / 客数: {customerCount}人
                </p>
              ) : (
                <p>この週の取引データはありません。</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
