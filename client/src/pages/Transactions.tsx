import type { FC } from "react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { Badge } from "../components/ui/badge";
import { TransactionForm } from "../components/transactions/TransactionForm";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { TransactionHistory } from "../components/transactions/TransactionHistory";
import { TransactionStats } from "../components/transactions/TransactionStats";
import { transactionsState } from "../recoil/atoms";
import { transactionsSummarySelector } from "../recoil/selectors";

const Transactions: FC = () => {
  const date: Date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };
  const formattedDate: string = new Intl.DateTimeFormat('en-GB', options).format(date).replace(/ /g, '-');

  // Filter states
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const transactions = useRecoilValue(transactionsState);
  const summary = useRecoilValue(transactionsSummarySelector);

  const filteredTransactions = transactions.filter((t) => {
    // Filter by type
    if (type !== "all" && t.type !== type) return false;

    // Filter by category
    if (category !== "all" && t.category !== category) return false;

    // Filter by fromDate
    if (fromDate) {
      const tDate = new Date(t.date);
      const fDate = new Date(fromDate);
      tDate.setHours(0, 0, 0, 0);
      fDate.setHours(0, 0, 0, 0);
      if (tDate < fDate) return false;
    }

    // Filter by toDate
    if (toDate) {
      const tDate = new Date(t.date);
      const oDate = new Date(toDate);
      tDate.setHours(23, 59, 59, 999);
      oDate.setHours(23, 59, 59, 999);
      if (tDate > oDate) return false;
    }

    // Filter by search query
    const term = search.toLowerCase().trim();
    if (term) {
      return (
        t.note?.toLowerCase().includes(term) ||
        t.category?.toLowerCase().includes(term)
      );
    }

    return true;
  });

  return (
    <div className="min-h-full bg-[#0b0b0b] text-white py-4 lg:h-screen lg:overflow-hidden lg:flex lg:flex-col lg:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 lg:px-4 lg:flex-1 lg:min-h-0">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Log payments, search records, and manage your transaction history.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
              {`${formattedDate}`}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <TransactionStats
          balance={summary.balance}
          totalIncome={summary.totalIncome}
          totalExpense={summary.totalExpense}
          isLoading={false}
        />

        <div className="flex flex-col xl:flex-row gap-4 lg:flex-1 lg:min-h-0 xl:items-stretch">

          {/* Left Column: Form */}
          <div className="xl:w-[36%] xl:shrink-0 flex flex-col">
            <TransactionForm />
          </div>

          {/* Right Column: Filters + History */}
          <div className="flex flex-col xl:self-stretch xl:flex-1 xl:min-h-0 gap-4 animate-in fade-in duration-300">
            <TransactionFilters
              search={search}
              setSearch={setSearch}
              type={type}
              setType={setType}
              category={category}
              setCategory={setCategory}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
            />
            <TransactionHistory
              transactions={filteredTransactions}
              isLoading={false}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Transactions;