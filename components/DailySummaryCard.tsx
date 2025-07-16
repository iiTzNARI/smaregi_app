// components/DailySummaryCard.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DailySummary } from "@/lib/data";

// コンポーネントが受け取るデータの型
type DailySummaryCardProps = {
  summary: DailySummary;
};

// 数値を日本円形式にフォーマットする関数
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return "N/A";
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(amount);
};

// 数値をフォーマットする関数 (例: 100 => 100回)
const formatCount = (count: number | undefined) => {
  if (count === undefined) return "N/A";
  return `${count} 回`;
};

// 詳細なデータ項目を表示する小さなコンポーネント
const DataRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm">
    <p className="text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export const DailySummaryCard = ({ summary }: DailySummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{summary.storeName || "店舗名未設定"}</CardTitle>
        <CardDescription>締め日: {summary.sumDate}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-t pt-4">
          <div className="flex justify-between items-baseline">
            <p className="text-sm font-medium text-muted-foreground">
              売上合計
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(summary.total)}
            </p>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <DataRow
            label="取引数"
            value={formatCount(summary.transactionCount)}
          />
          <DataRow label="税抜合計" value={formatCurrency(summary.subtotal)} />
          <DataRow label="税合計" value={formatCurrency(summary.taxTotal)} />
          <DataRow
            label="割引合計"
            value={formatCurrency(summary.discountTotal)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
