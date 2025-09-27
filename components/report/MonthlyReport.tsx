// components/report/MonthlyReport.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { Transaction } from "@/lib/types";
import { getMonthlyTransactionsAction } from "@/app/actions";
import { MonthSelector } from "./MonthSelector";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// KPIカード用のコンポーネント
const KpiCard = ({
  title,
  value,
  unit,
  change,
}: {
  title: string;
  value: string;
  unit: string;
  change?: string;
}) => {
  const isPositive = change && change.startsWith("+");
  const changeColor = isPositive ? "text-green-500" : "text-red-500";

  return (
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
        {change && (
          <span className={`text-sm font-semibold ${changeColor}`}>
            {change}
          </span>
        )}
      </CardContent>
    </Card>
  );
};

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

  const totalSales = monthlyTransactions.reduce(
    (sum, tx) => sum + Number(tx.total),
    0
  );
  // 他のKPIはダミーデータ
  const totalProfit = totalSales * 0.3; // 仮に利益率30%とする
  const flCost = 65;
  const goalAchievement = 103;

  return (
    <div className="space-y-6">
      <MonthSelector
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        isLoading={isPending}
      />
      {isPending ? (
        <p className="text-center pt-10">読み込み中...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="月間売上"
              value={totalSales.toLocaleString()}
              unit="円"
              change={`前月比 +${Math.round(totalSales / 10000)}%`}
            />
            <KpiCard
              title="月間利益"
              value={totalProfit.toLocaleString()}
              unit="円"
              change="前月比 -2%"
            />
            <KpiCard
              title="FLコスト"
              value={flCost.toString()}
              unit="%"
              change="目標60% 超過"
            />
            <KpiCard
              title="目標達成率"
              value={goalAchievement.toString()}
              unit="%"
              change="目標達成！"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>💡 今月の分析とアクションプラン</CardTitle>
            </CardHeader>
            <CardContent>
              <p>ここに分析結果とアクションプランが表示されます。</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
