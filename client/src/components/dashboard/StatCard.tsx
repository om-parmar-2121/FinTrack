import type { FC, ComponentType } from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface StatCardProps {
  label?: string;
  value?: string;
  caption?: string;
  icon?: ComponentType<{ className?: string }>;
  iconColor?: string;
  valueColor?: string;
  isLoading?: boolean;
}

export const StatCard: FC<StatCardProps> = ({
  label,
  value,
  caption,
  icon: Icon,
  iconColor,
  valueColor,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md py-3.5 px-5 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md py-3.5 px-5 rounded-2xl transition-all duration-200 hover:border-white/10 hover:bg-[#151515]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{label}</p>
          <h3 className={`text-2xl font-bold tracking-tight mt-1 ${valueColor}`}>
            {value}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">{caption}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconColor} shrink-0 ml-4`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
