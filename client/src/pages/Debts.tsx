import { useState } from "react";
import type { FC } from "react";
import { useRecoilValue } from "recoil";
import { Badge } from "../components/ui/badge";
import { DebtStats } from "../components/debts/DebtStats";
import { DebtForm } from "../components/debts/DebtForm";
import { DebtFilters } from "../components/debts/DebtFilters";
import { DebtHistory } from "../components/debts/DebtHistory";
import { debtsState } from "../recoil/atoms";
import { debtSummarySelector } from "../recoil/selectors";

const Debts: FC = () => {
  const date: Date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };
  const formattedDate: string = new Intl.DateTimeFormat('en-GB', options).format(date).replace(/ /g, '-');

  const debts = useRecoilValue(debtsState);
  const { totalLent, totalBorrowed } = useRecoilValue(debtSummarySelector);
  const netBalance = totalLent + totalBorrowed;

  // Filters state
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleTypeChange = (newType: string) => {
    setType(newType);
    // Reset status filter when switching to Lent (status doesn't apply)
    if (newType === "lent") setStatus("");
  };

  // Client-side filtering for type, status, search query, and due by date
  const filteredDebts = debts.filter((d) => {
    // Filter by type
    if (type && d.type !== type) return false;

    // Filter by status
    if (status) {
      if (status === "overdue") {
        if (d.status !== "overdue") return false;
      } else {
        if (d.status !== status) return false;
      }
    }

    // Filter by search query
    if (search.trim()) {
      const s = search.toLowerCase();
      const matchPerson = d.person?.toLowerCase().includes(s);
      const matchNote = d.note?.toLowerCase().includes(s);
      if (!matchPerson && !matchNote) return false;
    }

    // Filter by due date limit
    if (dueDate) {
      const dDate = new Date(d.dueDate);
      const filterDate = new Date(dueDate);
      dDate.setHours(0, 0, 0, 0);
      filterDate.setHours(0, 0, 0, 0);
      if (dDate > filterDate) return false;
    }

    return true;
  });

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

        {/* Stats Summary Cards */}
        <DebtStats
          netBalance={netBalance}
          totalLent={totalLent}
          totalBorrowed={totalBorrowed}
          isLoading={false}
        />

        <div className="flex flex-col xl:flex-row gap-4 lg:flex-1 lg:min-h-0 xl:items-stretch">

          {/* Left Column: Form */}
          <div className="xl:w-[36%] xl:shrink-0 flex flex-col">
            <DebtForm />
          </div>

          {/* Right Column: Filters + History */}
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
              isLoading={false}
              onDeleteSuccess={() => { }}
              onPaySuccess={() => { }}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Debts;