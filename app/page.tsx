"use client";
// app/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyReport } from "@/components/report/DailyReport";
import { WeeklyReport } from "@/components/report/WeeklyReport";
import { MonthlyReport } from "@/components/report/MonthlyReport"; // 新しいパスからインポート

import { getSessionToken } from "../lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionToken = getSessionToken();
    setToken(sessionToken);
    if (!sessionToken) {
      router.replace("/login");
    }
  }, [router]);

  if (!token) {
    // 認証済みでなければ何も表示しない（リダイレクト）
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          🍜 俺のラーメン 売上分析ダッシュボード
        </h1>
        <p className="text-muted-foreground mt-2">
          データは力！ライバルに差をつけろ！
        </p>
      </header>
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">日次レポート</TabsTrigger>
          <TabsTrigger value="weekly">週次レポート</TabsTrigger>
          <TabsTrigger value="monthly">月次レポート</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <DailyReport />
        </TabsContent>
        <TabsContent value="weekly" className="mt-6">
          <WeeklyReport />
        </TabsContent>
        <TabsContent value="monthly" className="mt-6">
          <MonthlyReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
