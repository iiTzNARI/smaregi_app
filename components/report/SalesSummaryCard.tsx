import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export const SalesSummaryCard = ({ totalSales }: { totalSales: number }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月間売上合計</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{formatCurrency(totalSales)}</p>
      </CardContent>
    </Card>
  );
};
