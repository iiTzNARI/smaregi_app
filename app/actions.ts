// app/actions.ts
"use server";

import { fetchTransactionsByDateRange } from "@/lib/data";
import { Transaction } from "@/lib/types";
import { startOfWeek, endOfWeek } from "date-fns";

export const getMonthlyTransactionsAction = async (
  date: Date
): Promise<Transaction[]> => {
  try {
    const year = date.getFullYear();
    const month = date.getMonth();
    const fromDate = new Date(year, month, 1);
    const toDate = new Date(year, month + 1, 0, 23, 59, 59);

    const transactions = await fetchTransactionsByDateRange(fromDate, toDate);
    return transactions;
  } catch (error) {
    console.error("Server Action failed:", error);
    return [];
  }
};
// ▼▼▼ 週次レポート用のアクションをここに追加 ▼▼▼
export const getWeeklyTransactionsAction = async (
  date: Date
): Promise<Transaction[]> => {
  try {
    // 渡された日付が含まれる週の始まりと終わりを計算
    const fromDate = startOfWeek(date, { weekStartsOn: 0 });
    const toDate = endOfWeek(date, { weekStartsOn: 0 });

    // 0時0分0秒に設定
    fromDate.setHours(0, 0, 0, 0);
    // 23時59分59秒に設定
    toDate.setHours(23, 59, 59, 999);

    const transactions = await fetchTransactionsByDateRange(fromDate, toDate);
    return transactions;
  } catch (error) {
    console.error("Server Action for weekly data failed:", error);
    return [];
  }
};
