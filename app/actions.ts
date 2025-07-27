// app/actions.ts
"use server";

import { fetchTransactionsForMonth } from "@/lib/data";
import { Transaction } from "@/lib/types";

export const getMonthlyTransactionsAction = async (
  date: Date
): Promise<Transaction[]> => {
  try {
    const transactions = await fetchTransactionsForMonth(date);
    return transactions;
  } catch (error) {
    console.error("Server Action failed:", error);
    return [];
  }
};
