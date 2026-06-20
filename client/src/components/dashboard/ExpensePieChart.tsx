import type { FC } from "react";
import { Pie, PieChart, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { cn } from "../../lib/utils";

import { Skeleton } from "../ui/skeleton";

interface ChartDataPoint {
	category: string;
	amount: number;
	fill?: string;
}

const chartData: ChartDataPoint[] = [
	{
		category: "Food",
		amount: 400,
		fill: "var(--chart-1)",
	},
	{
		category: "Travel",
		amount: 2500,
		fill: "var(--chart-2)",
	},
	{
		category: "Bills",
		amount: 2000,
		fill: "var(--chart-3)",
	},
	{
		category: "Other",
		amount: 1500,
		fill: "var(--chart-4)",
	},
];

interface ExpensePieChartProps {
	className?: string;
	height?: number;
	showHeader?: boolean;
	isLoading?: boolean;
	data?: ChartDataPoint[];
}

export const ExpensePieChart: FC<ExpensePieChartProps> = ({ 
	className, 
	height = 300, 
	showHeader = true, 
	isLoading = false,
	data
}) => {
	if (isLoading) {
		return (
			<Card className={cn("bg-[#111111]/95 backdrop-blur-xl border border-[#262626] text-white shadow-sm py-4 px-6 flex flex-col justify-between", className)}>
				<div className="space-y-2">
					<Skeleton className="h-5 w-36" />
					<Skeleton className="h-3.5 w-48" />
				</div>
				<div className="flex flex-col items-center justify-center py-4 space-y-4">
					<Skeleton className="h-[96px] w-[96px] rounded-full" />
					<Skeleton className="h-3.5 w-28" />
				</div>
			</Card>
		);
	}

	const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
	const displayData = data && data.length > 0
		? data.map((d, index) => ({
				...d,
				fill: d.fill || colors[index % colors.length]
			}))
		: chartData;

	return (
		<Card
			className={cn(
				"bg-[#111111]/95 backdrop-blur-xl border border-[#262626] text-white shadow-sm",
				className
			)}
		>
			{showHeader && (
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Category Breakdown</CardTitle>

					<CardDescription>Monthly expense distribution</CardDescription>
				</CardHeader>
			)}

			<CardContent className={showHeader ? undefined : "flex h-full items-center justify-center pb-0"}>
				<ResponsiveContainer width="100%" height={height}>
					<PieChart>
						<Pie
							data={displayData}
							cx="50%"
							cy="45%"
							labelLine={false}
							outerRadius={65}
							innerRadius={35}
							fill="var(--chart-1)"
							dataKey="amount"
							nameKey="category"
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "#0b0b0b",
								border: "1px solid #262626",
								borderRadius: 8,
								color: "#ffffff",
							}}
							itemStyle={{ color: "#e5e7eb" }}
						/>
						<Legend
							wrapperStyle={{
								paddingTop: "20px",
								color: "#94a3b8",
								fontSize: "0.75rem",
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			</CardContent>

		</Card>
	);
};

export default ExpensePieChart;