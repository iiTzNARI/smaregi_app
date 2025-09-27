// app/actions.ts
"use server";

import { fetchTransactionsByDateRange } from "@/lib/data";
import { Transaction } from "@/lib/types";
import { startOfWeek, endOfWeek } from "date-fns";

// 月次レポート用のアクション（既存）
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

// 週次レポート用のアクション（既存）
export const getWeeklyTransactionsAction = async (
  date: Date
): Promise<Transaction[]> => {
  try {
    const fromDate = startOfWeek(date, { weekStartsOn: 0 });
    const toDate = endOfWeek(date, { weekStartsOn: 0 });
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    const transactions = await fetchTransactionsByDateRange(fromDate, toDate);
    return transactions;
  } catch (error) {
    console.error("Server Action for weekly data failed:", error);
    return [];
  }
};

// ▼▼▼ 日次レポート用のアクションをここに追加 ▼▼▼
export const getDailyTransactionsAction = async (
  date: Date
): Promise<Transaction[]> => {
  try {
    // 1日の始まりと終わりを計算
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(date);
    toDate.setHours(23, 59, 59, 999);

    const transactions = await fetchTransactionsByDateRange(fromDate, toDate);
    return transactions;
  } catch (error) {
    console.error("Server Action for daily data failed:", error);
    return [];
  }
};
