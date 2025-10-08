// app/actions.ts
"use client";

import { Transaction } from "@/lib/types";
import { startOfWeek, endOfWeek } from "date-fns";

// API Route経由でスマレジAPIを呼び出す共通関数（クライアントサイドでセッションストレージのアクセストークンを利用）
const fetchTransactionsViaApiRoute = async (
  fromDate: Date,
  toDate: Date
): Promise<Transaction[]> => {
  // クライアントサイドでアクセストークンを取得
  const accessToken =
    typeof window !== "undefined"
      ? sessionStorage.getItem("smaregi_access_token")
      : null;

  if (!accessToken) {
    console.error("アクセストークンがセッションストレージに存在しません。");
    return [];
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SMAREGI_APP_ORIGIN}/api/smaregi/transactions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString(),
          accessToken,
        }),
        cache: "no-store",
      }
    );
    if (!res.ok) {
      console.error("API Route fetch failed:", await res.text());
      return [];
    }
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.transactions)) return data.transactions;
    return [];
  } catch (error) {
    console.error("API Route error:", error);
    return [];
  }
};

// 月次レポート用のアクション
export const getMonthlyTransactionsAction = async (
  date: Date
): Promise<Transaction[]> => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const fromDate = new Date(year, month, 1);
  const toDate = new Date(year, month + 1, 0, 23, 59, 59);
  return fetchTransactionsViaApiRoute(fromDate, toDate);
};

// 週次レポート用のアクション
export const getWeeklyTransactionsAction = async (
  date: Date
): Promise<Transaction[]> => {
  const fromDate = startOfWeek(date, { weekStartsOn: 0 });
  const toDate = endOfWeek(date, { weekStartsOn: 0 });
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);
  return fetchTransactionsViaApiRoute(fromDate, toDate);
};

// 日次レポート用のアクション
export const getDailyTransactionsAction = async (
  date: Date
): Promise<Transaction[]> => {
  const fromDate = new Date(date);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(date);
  toDate.setHours(23, 59, 59, 999);
  return fetchTransactionsViaApiRoute(fromDate, toDate);
};
