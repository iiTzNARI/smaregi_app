import { fetchAllTransactions } from "@/lib/data";
import { MonthlyReport } from "@/components/MonthlyReport";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Home() {
  const allTransactions = await fetchAllTransactions();

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">
        月間売上
      </h2>
      <Suspense fallback={<Loading />}>
        {allTransactions.length > 0 ? (
          <MonthlyReport transactions={allTransactions} />
        ) : (
          <p className="text-center text-muted-foreground">
            取引データがありません。
          </p>
        )}
      </Suspense>
    </>
  );
}
