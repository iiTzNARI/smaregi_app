// lib/data.ts
import "server-only";
import { Transaction, SmaregiSingleTransactionApiResponse } from "./types";

// 全ての取引データを取得する
export const fetchAllTransactions = async (): Promise<Transaction[]> => {
  const contractId = process.env.SMAREGI_CONTRACT_ID;
  const accessToken = process.env.SMAREGI_ACCESS_TOKEN;

  if (!contractId || !accessToken) {
    throw new Error("API credentials are not configured in .env.local");
  }

  const allTransactions: Transaction[] = [];
  let consecutiveErrors = 0;
  const CONSECUTIVE_ERRORS_TO_STOP = 5;
  const MAX_TRANSACTIONS_TO_CHECK = 1000;

  console.log("Fetching all transactions one by one...");

  for (
    let transactionId = 1;
    transactionId <= MAX_TRANSACTIONS_TO_CHECK;
    transactionId++
  ) {
    if (consecutiveErrors >= CONSECUTIVE_ERRORS_TO_STOP) {
      console.log("Stopping fetch loop.");
      break;
    }
    //  「取引一覧取得」がなぜか使用できない
    //  代わりに「取引取得」をすべての取引IDに対して実行している
    const url = `https://api.smaregi.dev/${contractId}/pos/transactions/${transactionId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

      if (response.ok) {
        const transaction =
          (await response.json()) as SmaregiSingleTransactionApiResponse;
        allTransactions.push({
          id: transactionId,
          dateTime: transaction.transactionDateTime,
          total: transaction.total,
        });
        consecutiveErrors = 0;
      } else {
        consecutiveErrors++;
      }

      //  サーバー負荷軽減のためのタイムアウト
      await new Promise((resolve) => setTimeout(resolve, 50));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      consecutiveErrors++;
    }
  }

  console.log(`Fetched a total of ${allTransactions.length} transactions.`);
  return allTransactions;
};
