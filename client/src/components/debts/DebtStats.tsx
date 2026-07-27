import type { FC } from "react";
import { Card, CardContent } from "../ui/card";
import { DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface DebtStatsProps {
  netBalance: number;
  totalLent: number;
  totalBorrowed: number;
  totalRecovered?: number;
  totalRepaid?: number;
  isLoading?: boolean;
}

export const DebtStats: FC<DebtStatsProps> = ({
  netBalance,
  totalLent,
  totalBorrowed,
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
      {/* Net Position Card */}
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Net Position</p>
            <h3 className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? "text-blue-400" : "text-amber-400"}`}>
              ₹{netBalance.toLocaleString("en-IN")}
            </h3>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <DollarSign className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Money Owed to Me Card */}
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Money Owed to Me</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              ₹{totalLent.toLocaleString("en-IN")}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Money I Owe Card */}
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Money I Owe</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">
              ₹{totalBorrowed.toLocaleString("en-IN")}
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
