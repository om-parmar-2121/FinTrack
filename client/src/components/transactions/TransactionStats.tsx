import type { FC } from "react";
import { Card, CardContent } from "../ui/card";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

import { Skeleton } from "../ui/skeleton";

interface TransactionStatsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  isLoading?: boolean;
}

export const TransactionStats: FC<TransactionStatsProps> = ({
  balance,
  totalIncome,
  totalExpense,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
            <CardContent className="flex items-center justify-between py-5">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {/* Balance Card */}
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Balance</p>
            <h3 className="text-2xl font-bold text-blue-400 mt-1">
              ₹{balance.toLocaleString("en-IN")}
            </h3>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Wallet className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Total Income Card */}
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Income</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              ₹{totalIncome.toLocaleString("en-IN")}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Total Expense Card */}
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">
              ₹{totalExpense.toLocaleString("en-IN")}
            </h3>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
