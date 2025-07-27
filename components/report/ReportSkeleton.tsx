import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const ReportSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Sales Summary Card Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-3/4" />
      </CardContent>
    </Card>

    {/* Transaction Details Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/-3" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </CardContent>
    </Card>
  </div>
);
