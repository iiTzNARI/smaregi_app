// lib/data.ts
import "server-only";
import { Transaction, SmaregiTransactionListItem } from "./types";

// API用に日付を "YYYY-MM-DDTHH:mm:ss+09:00" 形式にフォーマットする関数
const formatDateForApi = (date: Date): string => {
  const pad = (num: number) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;
};

export const fetchTransactionsByDateRange = async (
  fromDate: Date,
  toDate: Date
): Promise<Transaction[]> => {
  const contractId = process.env.SMAREGI_CONTRACT_ID;
  const accessToken = process.env.SMAREGI_ACCESS_TOKEN;

  if (!contractId || !accessToken) {
    throw new Error("API credentials are not configured in .env.local");
  }

  const to = formatDateForApi(toDate);
  const from = formatDateForApi(fromDate);

  // パラメータ名をsnake_caseに修正
  const url =
    `https://api.smaregi.dev/${contractId}/pos/transactions` +
    `?transaction_date_time-from=${encodeURIComponent(from)}` +
    `&transaction_date_time-to=${encodeURIComponent(to)}` +
    `&limit=1000`;

  console.log(`[data.ts] Fetching transactions from: ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[data.ts] Failed to fetch. Status: ${
          response.status
        }, Body: ${await response.text()}`
      );
      return [];
    }

    const transactionsFromApi =
      (await response.json()) as SmaregiTransactionListItem[];
    const allTransactions: Transaction[] = transactionsFromApi.map((tx) => ({
      id: tx.transactionHeadId,
      dateTime: tx.transactionDateTime,
      total: tx.total,
    }));

    console.log(
      `[data.ts] Fetched ${allTransactions.length} transactions successfully.`
    );
    return allTransactions;
  } catch (error) {
    console.error("[data.ts] An error occurred during fetch:", error);
    return [];
  }
};
