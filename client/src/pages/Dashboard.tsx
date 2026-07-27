import type { FC } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Badge } from "../components/ui/badge";
import { ExpensePieChart } from "../components/dashboard/ExpensePieChart";
import { StatCard } from "../components/dashboard/StatCard";
import { RecentTransactions } from "../components/dashboard/RecentTransactions";
import { SavingGoalCard } from "../components/dashboard/SavingGoalCard";
import { AlertsCard } from "../components/dashboard/AlertsCard";
import { ArrowUpRight, ArrowDownRight, Wallet, Calendar } from "lucide-react";
import authService from "../services/auth.service";
import { userState } from "../recoil/atoms";
import {
  transactionsSummarySelector,
  transactionsByCategorySelector,
  budgetAlertsSelector,
  recentTransactionsSelector,
  weeklyExpenseSelector,
} from "../recoil/selectors";

type TransactionType = "Expense" | "Income";

const formatAmount = (type: TransactionType, amount: number) => {
  const sign = type === "Expense" ? "-" : "+";
  return `${sign}₹${amount.toLocaleString("en-IN")}`;
};

const Dashboard: FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const summary = useRecoilValue(transactionsSummarySelector);
  const categories = useRecoilValue(transactionsByCategorySelector);
  const alerts = useRecoilValue(budgetAlertsSelector);
  const recentRaw = useRecoilValue(recentTransactionsSelector);
  const weeklyExpense = useRecoilValue(weeklyExpenseSelector);

  const date: Date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };
  const formattedDate: string = new Intl.DateTimeFormat('en-GB', options).format(date).replace(/ /g, '-');

  const handleGoalUpdated = async (newGoal: number) => {
    try {
      const res = await authService.updateMe({ savingGoal: newGoal });
      if (res.success) {
        setUser(res.data);
      }
    } catch (err) {
      console.error("Failed to update saving goal:", err);
    }
  };

  const recentTransactions = recentRaw.map((t) => ({
    type: t.type === "income" ? ("Income" as const) : ("Expense" as const),
    category: t.category,
    amount: t.amount,
    date: new Date(t.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    })
  }));

  const dynamicStats = [
    {
      label: "Income",
      value: `₹${summary.totalIncome.toLocaleString("en-IN")}`,
      icon: ArrowUpRight,
      iconColor: "text-emerald-500 bg-emerald-500/10",
      valueColor: "text-emerald-400"
    },
    {
      label: "Expense",
      value: `₹${summary.totalExpense.toLocaleString("en-IN")}`,
      icon: ArrowDownRight,
      iconColor: "text-rose-500 bg-rose-500/10",
      valueColor: "text-rose-400"
    },
    {
      label: "Balance",
      value: `₹${summary.balance.toLocaleString("en-IN")}`,
      icon: Wallet,
      iconColor: "text-blue-500 bg-blue-500/10",
      valueColor: "text-blue-400"
    },
    {
      label: "Weekly Spending",
      value: `₹${weeklyExpense.toLocaleString("en-IN")}`,
      icon: Calendar,
      iconColor: "text-amber-500 bg-amber-500/10",
      valueColor: "text-amber-400"
    },
  ];

  return (
    <div className="min-h-full bg-[#0b0b0b] text-white py-4">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-4 px-4 lg:px-4">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              Finance Dashboard
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Track income, expenses, and goals at a glance.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
              {`${formattedDate}`}
            </Badge>
          </div>
        </div>

        {/* Stats Cards - 4 cards, 4-col layout */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {dynamicStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.iconColor}
              valueColor={stat.valueColor}
              isLoading={false}
            />
          ))}
        </div>

        {/* 2nd Row: Widgets (Pie Chart, Saving Goal, Alerts) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <ExpensePieChart
            height={200}
            showHeader={true}
            className="w-full h-full rounded-2xl"
            data={categories}
            isLoading={false}
          />
          <SavingGoalCard
            savingGoal={user?.savingGoal ?? 0}
            savedAmount={summary.balance}
            isLoading={false}
            onGoalUpdated={handleGoalUpdated}
          />
          <AlertsCard
            alerts={alerts}
            isLoading={false}
          />
        </div>

        {/* 3rd Row: Recent Transactions */}
        <RecentTransactions
          transactions={recentTransactions}
          formatAmount={formatAmount}
          isLoading={false}
        />

      </div>
    </div>
  );
};

export default Dashboard;
