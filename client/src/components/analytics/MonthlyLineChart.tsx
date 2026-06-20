import type { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

export interface MonthlyTrendData {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyLineChartProps {
  isLoading?: boolean;
  data?: MonthlyTrendData[];
}

export const MonthlyLineChart: FC<MonthlyLineChartProps> = ({ isLoading = false, data = [] }) => {
  if (isLoading) {
    return (
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl p-6 space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton className="h-52 w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Monthly Income vs Expense</CardTitle>
        <CardDescription>6-month overview of cash flow</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value: unknown) => [`₹${(value as number).toLocaleString("en-IN")}`, ""]}
            />
            <Line type="monotone" dataKey="income" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: "var(--chart-1)", r: 3 }} name="Income" />
            <Line type="monotone" dataKey="expense" stroke="var(--chart-3)" strokeWidth={2} dot={{ fill: "var(--chart-3)", r: 3 }} name="Expense" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 px-2">
          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="h-2 w-4 rounded-sm" style={{ background: "var(--chart-1)" }} />
            Income
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="h-2 w-4 rounded-sm" style={{ background: "var(--chart-3)" }} />
            Expense
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyLineChart;
