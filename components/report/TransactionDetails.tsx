import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export const TransactionDetails = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>取引明細</CardTitle>
        <CardDescription>{transactions.length}件の取引</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead className="text-right">取引額</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    {new Date(tx.dateTime).toLocaleDateString("ja-JP")}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(tx.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            この月の取引データはありません。
          </p>
        )}
      </CardContent>
    </Card>
  );
};
