// app/page.tsx
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DailySummaryCard } from "@/components/DailySummaryCard";
import { fetchDailySummaries } from "@/lib/data";
import { Suspense } from "react";
import Loading from "./loading";

async function SummariesList() {
  const summaries = await fetchDailySummaries();

  if (summaries.length === 0) {
    return <p className="text-center text-muted-foreground">データなし</p>;
  }

  const singleSummary = summaries[0];

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <DailySummaryCard summary={singleSummary} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold tracking-tight mb-6">日次売上詳細</h2>
        <Suspense fallback={<Loading />}>
          <SummariesList />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
