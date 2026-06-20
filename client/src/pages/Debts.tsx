import { useState, useEffect } from "react";
import type { FC } from "react";
import { Badge } from "../components/ui/badge";
import { DebtStats } from "../components/debts/DebtStats";
import { DebtForm } from "../components/debts/DebtForm";
import { DebtFilters } from "../components/debts/DebtFilters";
import { DebtHistory } from "../components/debts/DebtHistory";
import type { DebtItem } from "../components/debts/types";
import debtService from "../services/debt.service";
import { AlertCircle } from "lucide-react";

const Debts: FC = () => {
  const date: Date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };
  const formattedDate: string = new Intl.DateTimeFormat('en-GB', options).format(date).replace(/ /g, '-');

  const [debts, setDebts] = useState<DebtItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");

  const fetchDebts = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Pass the API filters (type and status).
      // text search and due date limit are filtered client side.
      const apiFilters: any = {};
      if (type) apiFilters.type = type;
      if (status) apiFilters.status = status;

      const res = await debtService.getDebts(apiFilters);
      if (res.success) {
        setDebts(res.data);
      }
    } catch (err: any) {
      setError("Failed to fetch debts. Check connection to database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, [type, status]); // Refetch when API filters change

  const handleTypeChange = (newType: string) => {
    setType(newType);
    // Reset status filter when switching to Lent (status doesn't apply)
    if (newType === "lent") setStatus("");
  };

  const handleActionSuccess = () => {
    fetchDebts();
  };

  // Client-side filtering for search query and due by date
  const filteredDebts = debts.filter((d) => {
    if (search.trim()) {
      const s = search.toLowerCase();
      const matchPerson = d.person?.toLowerCase().includes(s);
      const matchNote = d.note?.toLowerCase().includes(s);
      if (!matchPerson && !matchNote) return false;
    }

    if (dueDate) {
      const dDate = new Date(d.dueDate);
      const filterDate = new Date(dueDate);
      dDate.setHours(0, 0, 0, 0);
      filterDate.setHours(0, 0, 0, 0);
      if (dDate > filterDate) return false;
    }

    return true;
  });

  // totalLent = pending lent: money others OWE YOU (still "your" money, held by someone else)
  const totalLent = debts
    .filter((d) => d.type === "lent" && d.status !== "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // totalBorrowed = pending borrowed: money YOU currently hold from others (you owe them)
  const totalBorrowed = debts
    .filter((d) => d.type === "borrowed" && (d.status === "pending" || d.status === "overdue"))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // netBalance = total money "with you" = lent (yours, held by others) + borrowed (physically in hand)
  const netBalance = totalLent + totalBorrowed;

  return (
    <div className="min-h-full bg-[#0b0b0b] text-white py-4 lg:h-screen lg:overflow-hidden lg:flex lg:flex-col lg:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 lg:px-4 lg:flex-1 lg:min-h-0">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">Debts</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Track money borrowed, lent, overdue status, and paid histories.
            </p>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex w-fit self-start px-3 py-1 text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
            {`${formattedDate}`}
          </Badge>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-200 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        {/* Stats Summary Cards */}
        <DebtStats
          netBalance={netBalance}
          totalLent={totalLent}
          totalBorrowed={totalBorrowed}
          isLoading={isLoading}
        />

        <div className="flex flex-col xl:flex-row gap-4 lg:flex-1 lg:min-h-0 xl:items-stretch">

          {/* Left Column: Form — stretches functionally */}
          <div className="xl:w-[36%] xl:shrink-0 flex flex-col">
            <DebtForm onSuccess={handleActionSuccess} />
          </div>

          {/* Right Column: independently fills full height */}
          <div className="flex flex-col xl:self-stretch xl:flex-1 xl:min-h-0 gap-4 animate-in fade-in duration-300">
            <DebtFilters
              search={search}
              onSearchChange={setSearch}
              type={type}
              onTypeChange={handleTypeChange}
              status={status}
              onStatusChange={setStatus}
              dueDate={dueDate}
              onDueDateChange={setDueDate}
            />
            <DebtHistory
              debts={filteredDebts}
              isLoading={isLoading}
              onDeleteSuccess={handleActionSuccess}
              onPaySuccess={handleActionSuccess}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Debts;