import { useState, useEffect } from "react";
import type { FC } from "react";
import { Badge } from "../components/ui/badge";
import { ExpensePieChart } from "../components/dashboard/ExpensePieChart";
import { StatCard } from "../components/dashboard/StatCard";
import { RecentTransactions } from "../components/dashboard/RecentTransactions";
import { SavingGoalCard } from "../components/dashboard/SavingGoalCard";
import { AlertsCard } from "../components/dashboard/AlertsCard";
import { ArrowUpRight, ArrowDownRight, Wallet, Calendar, AlertCircle } from "lucide-react";
import authService from "../services/auth.service";
import analyticsService from "../services/analytics.service";
import transactionService from "../services/transaction.service";

type TransactionType = "Expense" | "Income";

const formatAmount = (type: TransactionType, amount: number) => {
	const sign = type === "Expense" ? "-" : "+";
	return `${sign}₹${amount.toLocaleString("en-IN")}`;
};

const Dashboard: FC = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
	const [insights, setInsights] = useState({ weeklyExpense: 0, monthlyExpense: 0 });
	const [categories, setCategories] = useState<{ category: string; amount: number }[]>([]);
	const [alerts, setAlerts] = useState<string[]>([]);
	const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
	const [savingGoal, setSavingGoal] = useState(0);
	const [savedAmount, setSavedAmount] = useState(0);

	const date: Date = new Date();
	const options: Intl.DateTimeFormatOptions = { 
		day: '2-digit', 
		month: 'short', 
		year: 'numeric' 
	};
	const formattedDate: string = new Intl.DateTimeFormat('en-GB', options).format(date).replace(/ /g, '-');

	useEffect(() => {
		const fetchDashboardData = async () => {
			setIsLoading(true);
			setError("");
			try {
				const [
					userResult,
					summaryResult,
					insightsResult,
					categoriesResult,
					alertsResult,
					transactionsResult
				] = await Promise.allSettled([
					authService.getMe(),
					analyticsService.getSummary(),
					analyticsService.getInsights(),
					analyticsService.getCategories(),
					analyticsService.getAlerts(),
					transactionService.getTransactions()
				]);

				if (userResult.status === "fulfilled" && userResult.value.success) {
					setSavingGoal(userResult.value.data.savingGoal || 0);
				}
				if (summaryResult.status === "fulfilled" && summaryResult.value.success) {
					setSummary(summaryResult.value.data);
					setSavedAmount(summaryResult.value.data.balance || 0);
				}
				if (insightsResult.status === "fulfilled" && insightsResult.value.success) {
					setInsights({
						weeklyExpense: insightsResult.value.data.weeklyExpense || 0,
						monthlyExpense: insightsResult.value.data.monthlyExpense || 0
					});
				}
				if (categoriesResult.status === "fulfilled" && categoriesResult.value.success) {
					setCategories(categoriesResult.value.data || []);
				}
				if (alertsResult.status === "fulfilled" && alertsResult.value.success) {
					setAlerts((alertsResult.value.data || []).map((a: any) => a.message));
				}
				if (transactionsResult.status === "fulfilled" && transactionsResult.value.success) {
					const mapped = (transactionsResult.value.data || []).slice(0, 6).map((t: any) => ({
						type: t.type === "income" ? ("Income" as const) : ("Expense" as const),
						category: t.category,
						amount: t.amount,
						date: new Date(t.date).toLocaleDateString("en-IN", {
							day: "numeric",
							month: "numeric",
							year: "numeric"
						})
					}));
					setRecentTransactions(mapped);
				}

				// Only show error if ALL critical calls failed
				const criticalFailed = [userResult, summaryResult].every(r => r.status === "rejected");
				if (criticalFailed) {
					setError("Failed to load dashboard data. Please make sure you are logged in.");
				}
			} catch (err: any) {
				console.error("Failed to load dashboard data:", err);
				setError("Failed to load dashboard data. Please make sure you are logged in.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	const currentMonthLongName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());

	const dynamicStats = [
		{
			label: "Income",
			value: `₹${summary.totalIncome.toLocaleString("en-IN")}`,
			caption: currentMonthLongName,
			icon: ArrowUpRight,
			iconColor: "text-emerald-500 bg-emerald-500/10",
			valueColor: "text-emerald-400"
		},
		{
			label: "Expense",
			value: `₹${summary.totalExpense.toLocaleString("en-IN")}`,
			caption: currentMonthLongName,
			icon: ArrowDownRight,
			iconColor: "text-rose-500 bg-rose-500/10",
			valueColor: "text-rose-400"
		},
		{
			label: "Balance",
			value: `₹${summary.balance.toLocaleString("en-IN")}`,
			caption: "Total available",
			icon: Wallet,
			iconColor: "text-blue-500 bg-blue-500/10",
			valueColor: "text-blue-400"
		},
		{
			label: "Weekly Spending",
			value: `₹${insights.weeklyExpense.toLocaleString("en-IN")}`,
			caption: "Last 7 days",
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
					<Badge variant="secondary" className="hidden sm:inline-flex w-fit self-start px-3 py-1 text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
						{`${formattedDate}`}
					</Badge>
				</div>

				{error && (
					<div className="flex items-start gap-2.5 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-200 animate-in fade-in slide-in-from-top-1 duration-200">
						<AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
						<div className="flex-1 font-medium leading-relaxed">
							{error}
						</div>
					</div>
				)}

				{/* Stats Cards - 4 cards, 4-col layout */}
				<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
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

				{/* 2nd Row: Widgets (Pie Chart, Saving Goal, Alerts) */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
					<ExpensePieChart 
						height={200} 
						showHeader={true} 
						className="w-full h-full rounded-2xl" 
						data={categories} 
						isLoading={isLoading}
					/>
					<SavingGoalCard
						savingGoal={savingGoal}
						savedAmount={savedAmount}
						isLoading={isLoading}
						onGoalUpdated={(newGoal) => setSavingGoal(newGoal)}
					/>
					<AlertsCard
						alerts={alerts}
						isLoading={isLoading}
					/>
				</div>

				{/* 3rd Row: Recent Transactions */}
				<RecentTransactions
					transactions={recentTransactions}
					formatAmount={formatAmount}
					isLoading={isLoading}
				/>

			</div>
		</div>
	);
};

export default Dashboard;
