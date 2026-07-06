import type { FC } from "react";
import { useRecoilValue } from "recoil";
import { Badge } from "../components/ui/badge";
import { StatCard } from "../components/dashboard/StatCard";
import { MonthlyLineChart } from "../components/analytics/MonthlyLineChart";
import { CategoryBreakdownCard } from "../components/analytics/CategoryBreakdownCard";
import { WeeklyBarChart } from "../components/analytics/WeeklyBarChart";
import { ArrowUpRight, ArrowDownRight, Flame } from "lucide-react";
import {
  monthlyAnalyticsSelector,
  transactionsByCategorySelector,
  highestExpenseSelector,
  monthlyExpenseSelector,
  weeklySpendAnalyticsSelector,
} from "../recoil/selectors";

const Analytics: FC = () => {
  const monthlyData = useRecoilValue(monthlyAnalyticsSelector);
  const categories = useRecoilValue(transactionsByCategorySelector);
  const highestExpense = useRecoilValue(highestExpenseSelector);
  const monthlyExpense = useRecoilValue(monthlyExpenseSelector);
  const weeklySpendData = useRecoilValue(weeklySpendAnalyticsSelector);

  const date: Date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };
  const formattedDate: string = new Intl.DateTimeFormat('en-GB', options).format(date).replace(/ /g, '-');

  const currentMonthShortName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date());
  const currentMonthLongName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());

  const currentMonthData = monthlyData.find((d) => d.month === currentMonthShortName);
  const monthlyIncome = currentMonthData ? currentMonthData.income : 0;

  const highestExpenseAmt = highestExpense
    ? `₹${highestExpense.amount.toLocaleString("en-IN")}`
    : "₹0";
  const highestExpenseCaption = highestExpense
    ? `${highestExpense.category} category`
    : "None recorded";

  const dynamicStats = [
    {
      label: "Monthly Income",
      value: `₹${monthlyIncome.toLocaleString("en-IN")}`,
      caption: currentMonthLongName,
      icon: ArrowUpRight,
      iconColor: "text-emerald-500 bg-emerald-500/10",
      valueColor: "text-emerald-400",
    },
    {
      label: "Monthly Expense",
      value: `₹${monthlyExpense.toLocaleString("en-IN")}`,
      caption: currentMonthLongName,
      icon: ArrowDownRight,
      iconColor: "text-rose-500 bg-rose-500/10",
      valueColor: "text-rose-400",
    },
    {
      label: "Highest Expense",
      value: highestExpenseAmt,
      caption: highestExpenseCaption,
      icon: Flame,
      iconColor: "text-violet-500 bg-violet-500/10",
      valueColor: "text-violet-400",
    },
  ];

  return (
    <div className="min-h-full bg-[#0b0b0b] text-white py-4">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-4 px-4 lg:px-4">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Monthly trends, category breakdowns, and spending insights.
            </p>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex w-fit self-start px-3 py-1 text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
            {`${formattedDate}`}
          </Badge>
        </div>

        {/* Stat Cards - 3 cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {dynamicStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              caption={stat.caption}
              icon={stat.icon}
              iconColor={stat.iconColor}
              valueColor={stat.valueColor}
              isLoading={false}
            />
          ))}
        </div>

        {/* Charts Row: Line Chart + Category Breakdown */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 items-stretch">
          <div className="lg:col-span-2">
            <MonthlyLineChart isLoading={false} data={monthlyData} />
          </div>
          <div className="lg:col-span-1 h-full">
            <CategoryBreakdownCard isLoading={false} data={categories} />
          </div>
        </div>

        {/* Weekly Spend Bar Chart */}
        <WeeklyBarChart isLoading={false} data={weeklySpendData} />

      </div>
    </div>
  );
};

export default Analytics;