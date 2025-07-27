import "server-only";
import { Transaction, SmaregiTransactionListItem } from "./types";

/**
 * 指定された月の取引データをAPIから一括で取得する
 * @param targetDate - 取得したい月を示すDateオブジェクト
 * @returns {Promise<Transaction[]>} その月の取引データ配列
 */
export const fetchTransactionsForMonth = async (
  targetDate: Date
): Promise<Transaction[]> => {
  const contractId = process.env.SMAREGI_CONTRACT_ID;
  const accessToken = process.env.SMAREGI_ACCESS_TOKEN;

  if (!contractId || !accessToken) {
    throw new Error("API credentials are not configured in .env.local");
  }

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const dateFrom = new Date(year, month, 1);
  const dateTo = new Date(year, month + 1, 0, 23, 59, 59); // 月末日の23:59:59

  //  API用の形式にフォーマット
  const to = formatDateForApi(dateTo);
  const from = formatDateForApi(dateFrom);

  const url =
    `https://api.smaregi.dev/${contractId}/pos/transactions` +
    `?transaction_date_time-from=${encodeURIComponent(from)}` +
    `&transaction_date_time-to=${encodeURIComponent(to)}` +
    `&limit=1000`;

  console.log(`Fetching transactions for ${year}/${month + 1} from: ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch transactions. Status: ${
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
      `Fetched a total of ${allTransactions.length} transactions for ${year}/${
        month + 1
      }.`
    );
    return allTransactions;
  } catch (error) {
    console.error("An error occurred during API fetch:", error);
    return [];
  }
};

// API用に日本時間でフォーマット
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
