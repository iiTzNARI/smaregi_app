import { NextRequest, NextResponse } from "next/server";

// 日付を "YYYY-MM-DDTHH:mm:ss+09:00" 形式に変換
function formatDateForApi(dateStr: string): string {
  const date = new Date(dateStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;
}

export async function POST(req: NextRequest) {
  try {
    const { accessToken, fromDate, toDate } = await req.json();
    // 修正: サーバーサイドでは NEXT_PUBLIC_ なしの環境変数を使う
    const contractId = process.env.SMAREGI_CONTRACT_ID;

    if (!contractId || !accessToken) {
      return NextResponse.json(
        { error: "API credentials missing" },
        { status: 400 }
      );
    }

    // 日付をスマレジAPI用に変換
    const from = formatDateForApi(fromDate);
    const to = formatDateForApi(toDate);

    const url =
      `https://api.smaregi.dev/${contractId}/pos/transactions` +
      `?transaction_date_time-from=${encodeURIComponent(from)}` +
      `&transaction_date_time-to=${encodeURIComponent(to)}` +
      `&limit=1000`;

    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Smaregi API fetch failed", status: res.status, detail: await res.text() },
        { status: res.status }
      );
    }

    const transactions = await res.json();
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", detail: String(error) },
      { status: 500 }
    );
  }
}