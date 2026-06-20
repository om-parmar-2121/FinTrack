import type { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface CategoryData {
  category: string;
  amount: number;
}

interface CategoryBreakdownCardProps {
  isLoading?: boolean;
  className?: string;
  data?: CategoryData[];
}

const categoryInfo: Record<string, { label: string; color: string }> = {
  food: { label: "Food", color: "var(--chart-1)" },
  bills: { label: "Bills", color: "var(--chart-2)" },
  travel: { label: "Travel", color: "var(--chart-3)" },
  shopping: { label: "Shopping", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
};

export const CategoryBreakdownCard: FC<CategoryBreakdownCardProps> = ({ 
  isLoading = false, 
  className,
  data = []
}) => {
  if (isLoading) {
    return (
      <Card className={`bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl p-6 space-y-5 h-full ${className ?? ""}`}>
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-52" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </Card>
    );
  }

  const formattedData = data.map((item) => {
    const key = item.category?.toLowerCase() || "other";
    const info = categoryInfo[key] || { label: item.category || "Other", color: "var(--chart-5)" };
    return {
      name: info.label,
      amount: item.amount,
      color: info.color,
    };
  });

  const total = formattedData.reduce((s, c) => s + c.amount, 0);

  return (
    <Card className={`bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl h-full flex flex-col ${className ?? ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Category Breakdown</CardTitle>
        <CardDescription>Top spend categories this month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-start pb-6 gap-4">
        {formattedData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-xs py-8">
            No expense transactions this month
          </div>
        ) : (
          formattedData.map((cat) => {
            const pct = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium">{cat.name}</span>
                  <span className="text-zinc-400">₹{cat.amount.toLocaleString("en-IN")} · {pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: cat.color }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdownCard;
