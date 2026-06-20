import type { FC } from "react";
import { Card, CardContent } from "../ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface DebtStatsProps {
  netBalance: number;
  totalLent: number;
  totalBorrowed: number;
  isLoading?: boolean;
}

export const DebtStats: FC<DebtStatsProps> = ({
  netBalance,
  totalLent,
  totalBorrowed,
  isLoading = false,
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {/* Net Balance Card */}
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
        <CardContent className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28 bg-zinc-800/50 rounded-lg" />
                <Skeleton className="h-7 w-20 bg-zinc-800/50 rounded-xl" />
              </div>
            ) : (
              <>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Active Debts</p>
                <h3 className="text-2xl font-bold text-blue-400 mt-1">
                  ₹{netBalance.toLocaleString("en-IN")}
                </h3>
              </>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-[44px] w-[44px] bg-zinc-800/50 rounded-full" />
          ) : (
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <DollarSign className="h-5 w-5" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Lent Card */}
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
        <CardContent className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28 bg-zinc-800/50 rounded-lg" />
                <Skeleton className="h-7 w-20 bg-zinc-800/50 rounded-xl" />
              </div>
            ) : (
              <>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Money Owed to Me (Lent)</p>
                <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                  ₹{totalLent.toLocaleString("en-IN")}
                </h3>
              </>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-[44px] w-[44px] bg-zinc-800/50 rounded-full" />
          ) : (
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Borrowed Card */}
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
        <CardContent className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28 bg-zinc-800/50 rounded-lg" />
                <Skeleton className="h-7 w-20 bg-zinc-800/50 rounded-xl" />
              </div>
            ) : (
              <>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Money I Owe (Borrowed)</p>
                <h3 className="text-2xl font-bold text-rose-400 mt-1">
                  ₹{totalBorrowed.toLocaleString("en-IN")}
                </h3>
              </>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-[44px] w-[44px] bg-zinc-800/50 rounded-full" />
          ) : (
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
              <ArrowDownRight className="h-5 w-5" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
