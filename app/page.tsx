import { MonthlyReport } from "@/components/MonthlyReport";

export default function Home() {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">
        月間売上レポート
      </h2>
      <MonthlyReport />
    </>
  );
}
