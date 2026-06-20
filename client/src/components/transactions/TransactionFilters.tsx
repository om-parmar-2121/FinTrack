import type { FC } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Filter, Search, Calendar, ChevronDown } from "lucide-react";

interface TransactionFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  fromDate: string;
  setFromDate: (val: string) => void;
  toDate: string;
  setToDate: (val: string) => void;
}

export const TransactionFilters: FC<TransactionFiltersProps> = ({
  search,
  setSearch,
  type,
  setType,
  category,
  setCategory,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) => {
  const todayStr = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category or note..."
              className="w-full pl-8 pr-3 py-1 h-8 bg-black/20 border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {/* Type */}
          <div>
            <Label className="text-[10px] text-zinc-400 uppercase tracking-wider">Type</Label>
            <div className="relative mt-1.5">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full appearance-none rounded-lg border border-white/10 bg-[#0f0f0f] px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer pr-6"
              >
                <option className="bg-[#151515] text-white" value="all">All Types</option>
                <option className="bg-[#151515] text-white" value="income">Income</option>
                <option className="bg-[#151515] text-white" value="expense">Expense</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Category */}
          <div>
            <Label className="text-[10px] text-zinc-400 uppercase tracking-wider">Category</Label>
            <div className="relative mt-1.5">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-white/10 bg-[#0f0f0f] px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer pr-6"
              >
                <option className="bg-[#151515] text-white" value="all">All Categories</option>
                <option className="bg-[#151515] text-white" value="food">Food</option>
                <option className="bg-[#151515] text-white" value="travel">Travel</option>
                <option className="bg-[#151515] text-white" value="bills">Bills</option>
                <option className="bg-[#151515] text-white" value="shopping">Shopping</option>
                <option className="bg-[#151515] text-white" value="other">Other</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Date range from */}
          <div>
            <Label className="text-[10px] text-zinc-400 uppercase tracking-wider">From</Label>
            <div className="relative mt-1.5">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white pointer-events-none" />
              <input
                type="date"
                value={fromDate}
                max={toDate || todayStr}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full pl-8 pr-2 py-1 h-8 bg-black/20 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>

          {/* Date range to */}
          <div>
            <Label className="text-[10px] text-zinc-400 uppercase tracking-wider">To</Label>
            <div className="relative mt-1.5">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white pointer-events-none" />
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                max={todayStr}
                onChange={(e) => setToDate(e.target.value)}
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
