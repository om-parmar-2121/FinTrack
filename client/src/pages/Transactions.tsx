import type { FC } from "react";
import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { TransactionForm } from "../components/transactions/TransactionForm";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { TransactionHistory } from "../components/transactions/TransactionHistory";
import { AlertCircle, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import transactionService from "../services/transaction.service";
import analyticsService from "../services/analytics.service";
import type { TransactionItem } from "../components/transactions/types";

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

  // List states
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  // Balance summary states
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  const fetchSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const res = await analyticsService.getSummary();
      if (res.success) setSummary(res.data);
    } catch { }
    finally { setIsLoadingSummary(false); }
  };

  const fetchTransactions = async () => {
    setIsLoadingList(true);
    setError("");
    try {
      const filters: any = {};
      if (type !== "all") filters.type = type;
      if (category !== "all") filters.category = category;
      if (fromDate) filters.startDate = new Date(fromDate).toISOString();
      if (toDate) filters.endDate = new Date(toDate).toISOString();

      const result = await transactionService.getTransactions(filters);
      if (result.success) {
        setTransactions(result.data || []);
      }
    } catch (err: any) {
      setError("Failed to fetch transaction logs from the server.");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [type, category, fromDate, toDate]);

  const handleUpdate = () => {
    fetchTransactions();
    fetchSummary();
  };

  const filteredTransactions = transactions.filter((t) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      t.note?.toLowerCase().includes(term) ||
      t.category?.toLowerCase().includes(term)
    );
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

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Current Balance Card */}
          <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
            <CardContent className="flex items-center justify-between">
              <div>
                {isLoadingSummary ? (
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-28 bg-zinc-800/50 rounded-lg" />
                    <Skeleton className="h-7 w-20 bg-zinc-800/50 rounded-xl" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Current Balance</p>
                    <h3 className="text-2xl font-bold text-blue-400 mt-1">
                      ₹{summary.balance.toLocaleString("en-IN")}
                    </h3>
                  </>
                )}
              </div>
              {isLoadingSummary ? (
                <Skeleton className="h-[44px] w-[44px] bg-zinc-800/50 rounded-full animate-pulse" />
              ) : (
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                  <Wallet className="h-5 w-5" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Income Card */}
          <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
            <CardContent className="flex items-center justify-between">
              <div>
                {isLoadingSummary ? (
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-28 bg-zinc-800/50 rounded-lg" />
                    <Skeleton className="h-7 w-20 bg-zinc-800/50 rounded-xl" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Monthly Income</p>
                    <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                      ₹{summary.totalIncome.toLocaleString("en-IN")}
                    </h3>
                  </>
                )}
              </div>
              {isLoadingSummary ? (
                <Skeleton className="h-[44px] w-[44px] bg-zinc-800/50 rounded-full animate-pulse" />
              ) : (
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Expense Card */}
          <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white overflow-hidden relative">
            <CardContent className="flex items-center justify-between">
              <div>
                {isLoadingSummary ? (
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-28 bg-zinc-800/50 rounded-lg" />
                    <Skeleton className="h-7 w-20 bg-zinc-800/50 rounded-xl" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Monthly Expense</p>
                    <h3 className="text-2xl font-bold text-rose-400 mt-1">
                      ₹{summary.totalExpense.toLocaleString("en-IN")}
                    </h3>
                  </>
                )}
              </div>
              {isLoadingSummary ? (
                <Skeleton className="h-[44px] w-[44px] bg-zinc-800/50 rounded-full animate-pulse" />
              ) : (
                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
                  <ArrowDownRight className="h-5 w-5" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 lg:flex-1 lg:min-h-0 xl:items-stretch">

          {/* Left Column: Form */}
          <div className="xl:w-[36%] xl:shrink-0 flex flex-col">
            <TransactionForm onSuccess={handleUpdate} />
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
              isLoading={isLoadingList}
              onDeleteSuccess={handleUpdate}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Transactions;