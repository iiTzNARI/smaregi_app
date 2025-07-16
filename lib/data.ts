// lib/data.ts
import "server-only";

//  APIレスポンスの型
//  これ必要？
type SmaregiApiSummary = {
  store_id: number;
  store_name: string;
  sum_date: string;
  transaction_count: number;
  total: number;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  //  ほかにもめっちゃある
};

// アプリ内で使うデータの型
export type DailySummary = {
  storeId: number;
  storeName: string;
  sumDate: string;
  transactionCount: number;
  total: number;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
};

export const fetchDailySummaries = async (): Promise<DailySummary[]> => {
  const contractId = process.env.SMAREGI_CONTRACT_ID;
  const accessToken = process.env.SMAREGI_ACCESS_TOKEN;

  if (!contractId || !accessToken) {
    throw new Error("API credentials are not configured in .env.local");
  }

  const dateString = "2025-07-01";
  const storeId = "1";

  //  「日次締め情報一覧取得」
  //  https://www1.smaregi.dev/apidoc/#operation/getDailySummaries
  //  「締め日」「店舗ID」のみパラメータで指定
  const url = `https://api.smaregi.dev/${contractId}/pos/daily_summaries?sum_date=${dateString}&store_id=${storeId}`;

  console.log(`Fetching summary from: ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch data. Status: ${
          response.status
        }, Body: ${await response.text()}`
      );
      return [];
    }

    const apiData = (await response.json()) as SmaregiApiSummary[];
    console.log(
      "Response data from Smaregi:",
      JSON.stringify(apiData, null, 2)
    );

    // Fetchしたデータをアプリ用に変換
    const formattedData: DailySummary[] = apiData.map((summary) => ({
      storeId: summary.store_id,
      storeName: summary.store_name,
      sumDate: summary.sum_date,
      transactionCount: summary.transaction_count,
      total: summary.total,
      subtotal: summary.subtotal,
      taxTotal: summary.tax_total,
      discountTotal: summary.discount_total,
    }));

    return formattedData;
  } catch (error) {
    console.error("An error occurred during API fetch:", error);
    return [];
  }
};
