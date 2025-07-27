import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6 animate-pulse">
        {/* 月間売上合計のスケルトン */}
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-10 w-10" />
        </div>

        {/* 取引明細のスケルトン */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-3/4" />
          </CardContent>
        </Card>

        {/* 取引詳細のスケルトン */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-5 w-20" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="h-5 w-24" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* ダミーデータを表示 */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
