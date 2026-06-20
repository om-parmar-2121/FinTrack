import type { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#0b0b0b",
    border: "1px solid #262626",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: "0.75rem",
  },
  itemStyle: { color: "#e5e7eb" },
};

export interface WeeklyBarData {
  day: string;
  amount: number;
}

interface WeeklyBarChartProps {
  isLoading?: boolean;
  data?: WeeklyBarData[];
}

export const WeeklyBarChart: FC<WeeklyBarChartProps> = ({ isLoading = false, data = [] }) => {
  const maxAmount = data.length > 0 ? Math.max(...data.map((d) => d.amount)) : 0;

  if (isLoading) {
    return (
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl p-6 space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3.5 w-56" />
        </div>
        <Skeleton className="h-44 w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Spend Trend</CardTitle>
        <CardDescription>Day-by-day spending for the current week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              {...tooltipStyle}
              cursor={false}
              formatter={(value: unknown) => [`₹${(value as number).toLocaleString("en-IN")}`, "Spend"]}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} activeBar={false}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.amount > 0 && entry.amount === maxAmount ? "var(--chart-2)" : "var(--chart-4)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WeeklyBarChart;
