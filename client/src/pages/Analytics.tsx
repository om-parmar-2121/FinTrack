import type { FC } from "react";
import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { StatCard } from "../components/dashboard/StatCard";
import { MonthlyLineChart } from "../components/analytics/MonthlyLineChart";
import { CategoryBreakdownCard } from "../components/analytics/CategoryBreakdownCard";
import { WeeklyBarChart } from "../components/analytics/WeeklyBarChart";
import { ArrowUpRight, ArrowDownRight, Flame, AlertCircle } from "lucide-react";
import analyticsService from "../services/analytics.service";
import transactionService from "../services/transaction.service";

const Analytics: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>({
    highestExpense: null,
    monthlyExpense: 0,
    weeklyExpense: 0,
  });
  const [weeklySpendData, setWeeklySpendData] = useState<any[]>([]);

  const date: Date = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  };
  const formattedDate: string = new Intl.DateTimeFormat('en-GB', options).format(date).replace(/ /g, '-');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const currentYear = new Date().getFullYear();

        // Calculate current week range
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Mon is first day of week
        const startOfWeek = new Date(now.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const [
          monthlyResult,
          categoriesResult,
          insightsResult,
          weeklyTransactionsResult,
        ] = await Promise.allSettled([
          analyticsService.getMonthlyData(currentYear),
          analyticsService.getCategories(),
          analyticsService.getInsights(),
          transactionService.getTransactions({
            startDate: startOfWeek.toISOString(),
            endDate: endOfWeek.toISOString(),
          }),
        ]);

        if (monthlyResult.status === "fulfilled" && monthlyResult.value.success) {
          setMonthlyData(monthlyResult.value.data);
        }
        if (categoriesResult.status === "fulfilled" && categoriesResult.value.success) {
          setCategories(categoriesResult.value.data);
        }
        if (insightsResult.status === "fulfilled" && insightsResult.value.success) {
          setInsights(insightsResult.value.data);
        }

        // Aggregate weekly transactions by day
        if (weeklyTransactionsResult.status === "fulfilled" && weeklyTransactionsResult.value.success) {
          const txs = weeklyTransactionsResult.value.data || [];
          const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          const dailySums = daysOfWeek.map((day) => ({ day, amount: 0 }));

          txs.forEach((tx: any) => {
            if (tx.type === "expense") {
              const txDate = new Date(tx.date);
              let wDay = txDate.getDay() - 1; // 0 for Sun -> -1, 1 for Mon -> 0
              if (wDay === -1) wDay = 6; // Sun is last day (index 6)
              if (wDay >= 0 && wDay < 7) {
                dailySums[wDay].amount += tx.amount;
              }
            }
          });
          setWeeklySpendData(dailySums);
        }

        // Check if critical calls failed
        const criticalFailed = [monthlyResult, categoriesResult, insightsResult].every(
          (r) => r.status === "rejected"
        );
        if (criticalFailed) {
          setError("Failed to load analytics records. Make sure you are authenticated.");
        }
      } catch (err: any) {
        console.error("Failed to load analytics:", err);
        setError("An unexpected error occurred while loading analytics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const currentMonthShortName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date());
  const currentMonthLongName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());

  const currentMonthData = monthlyData.find((d) => d.month === currentMonthShortName);
  const monthlyIncome = currentMonthData ? currentMonthData.income : 0;

  const highestExpenseAmt = insights.highestExpense
    ? `₹${insights.highestExpense.amount.toLocaleString("en-IN")}`
    : "₹0";
  const highestExpenseCaption = insights.highestExpense
    ? `${insights.highestExpense.category} category`
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
      value: `₹${insights.monthlyExpense.toLocaleString("en-IN")}`,
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

        {error && (
          <div className="flex items-start gap-2.5 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-200 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <div className="flex-1 font-medium leading-relaxed">{error}</div>
          </div>
        )}

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
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Charts Row: Line Chart + Category Breakdown */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 items-stretch">
          <div className="lg:col-span-2">
            <MonthlyLineChart isLoading={isLoading} data={monthlyData} />
          </div>
          <div className="lg:col-span-1 h-full">
            <CategoryBreakdownCard isLoading={isLoading} data={categories} />
          </div>
        </div>

        {/* Weekly Spend Bar Chart */}
        <WeeklyBarChart isLoading={isLoading} data={weeklySpendData} />

      </div>
    </div>
  );
};

export default Analytics;