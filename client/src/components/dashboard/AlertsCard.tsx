import type { FC } from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { AlertCircle } from "lucide-react";

import { Skeleton } from "../ui/skeleton";

interface AlertsCardProps {
  alerts?: string[];
  isLoading?: boolean;
}

export const AlertsCard: FC<AlertsCardProps> = ({ alerts = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl py-4 px-6 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3.5 w-44" />
        </div>
        <div className="space-y-3 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl py-4 px-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <CardTitle className="text-lg font-bold">Alerts</CardTitle>
        </div>
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
          <AlertCircle className="h-6 w-6" />
        </div>
      </div>
      <CardContent className="p-0 space-y-4">
        {alerts.map((alert, index) => (
          <div key={alert} className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <p className="text-sm leading-relaxed text-zinc-300">{alert}</p>
            </div>
            {index < alerts.length - 1 ? <Separator className="bg-[#262626]/60" /> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
