import type { FC } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Filter, Search, Calendar, ChevronDown } from "lucide-react";

interface DebtFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  dueDate: string;
  onDueDateChange: (val: string) => void;
}

export const DebtFilters: FC<DebtFiltersProps> = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  dueDate,
  onDueDateChange,
}) => {
  return (
    <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white shadow-lg">
      <CardContent className="pt-4 space-y-3">
        {/* Search & Filter labels */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <Filter className="h-4 w-4 text-blue-400" />
            <span>Search & Filters</span>
          </div>
          {/* Text search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search person or note..."
              className="w-full pl-8 pr-3 py-1 h-8 bg-black/20 border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
          {/* Type */}
          <div>
            <Label className="text-[10px] text-zinc-400 uppercase tracking-wider">Type</Label>
            <div className="relative mt-1.5">
              <select
                value={type}
                onChange={(e) => onTypeChange(e.target.value)}
                className="w-full appearance-none rounded-lg border border-white/10 bg-[#0f0f0f] px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer pr-6"
              >
                <option className="bg-[#151515] text-white" value="">All Types</option>
                <option className="bg-[#151515] text-white" value="lent">Lent</option>
                <option className="bg-[#151515] text-white" value="borrowed">Borrowed</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Status — only meaningful for Borrowed debts */}
          <div>
            <Label className={`text-[10px] uppercase tracking-wider ${type === "lent" ? "text-zinc-600" : "text-zinc-400"}`}>
              Status {type === "lent" && <span className="normal-case font-normal">(N/A for Lent)</span>}
            </Label>
            <div className="relative mt-1.5">
              <select
                value={type === "lent" ? "" : status}
                disabled={type === "lent"}
                onChange={(e) => {
                  if (type !== "lent") onStatusChange(e.target.value);
                }}
                className={`w-full appearance-none rounded-lg border border-white/10 bg-[#0f0f0f] px-2.5 py-1.5 text-xs focus:outline-none pr-6 ${type === "lent"
                    ? "text-zinc-600 cursor-not-allowed opacity-50"
                    : "text-white cursor-pointer"
                  }`}
              >
                {type !== "lent" ? (
                  <>
                    <option className="bg-[#151515] text-white" value="">All Statuses</option>
                    <option className="bg-[#151515] text-white" value="pending">Pending</option>
                    <option className="bg-[#151515] text-white" value="paid">Paid</option>
                    <option className="bg-[#151515] text-white" value="overdue">Overdue</option>
                  </>
                ) : (
                  <option className="bg-[#151515] text-zinc-600" value="">Not applicable</option>
                )}
              </select>
              <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none ${type === "lent" ? "text-zinc-700" : "text-zinc-500"}`} />
            </div>
          </div>

          {/* Due Date Range Limit */}
          <div>
            <Label className="text-[10px] text-zinc-400 uppercase tracking-wider">Due By Date</Label>
            <div className="relative mt-1.5">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white pointer-events-none" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => onDueDateChange(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full pl-8 pr-2 py-1 h-8 bg-black/20 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
