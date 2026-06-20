import type { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import { Skeleton } from "../ui/skeleton";

type TransactionType = "Expense" | "Income";

interface Transaction {
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  formatAmount?: (type: TransactionType, amount: number) => string;
  isLoading?: boolean;
}

export const RecentTransactions: FC<RecentTransactionsProps> = ({
  transactions = [],
  formatAmount = () => "",
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl py-4 px-6 space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-3 pt-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl overflow-hidden gap-0 pt-4 pb-4">
      <CardHeader className="pt-0 pb-0 px-4 sm:px-6">
        <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
        <CardDescription className="text-zinc-400 text-sm">Your latest cashflows and purchase logs.</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pt-0">
        <Table>
          <TableHeader className="border-b border-[#262626]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-left text-zinc-400 font-semibold px-1.5 sm:px-2 py-3 text-xs sm:text-sm">Type</TableHead>
              <TableHead className="text-left text-zinc-400 font-semibold px-1.5 sm:px-2 py-3 text-xs sm:text-sm">Category</TableHead>
              <TableHead className="text-right text-zinc-400 font-semibold px-1.5 sm:px-2 py-3 text-xs sm:text-sm">Amount</TableHead>
              <TableHead className="text-right text-zinc-400 font-semibold px-1.5 sm:px-2 py-3 text-xs sm:text-sm">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, 5).map((transaction, idx) => (
              <TableRow key={`${transaction.category}-${idx}`} className="border-b border-[#262626]/50 hover:bg-white/5 transition-colors">
                <TableCell className="px-1.5 sm:px-2 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                    transaction.type === 'Expense' 
                      ? 'bg-rose-500/10 text-rose-400' 
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    <span className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${
                      transaction.type === 'Expense' ? 'bg-rose-400' : 'bg-emerald-400'
                    }`} />
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-zinc-200 px-1.5 sm:px-2 py-3.5 text-xs sm:text-sm">{transaction.category}</TableCell>
                <TableCell className={`text-right font-semibold whitespace-nowrap px-1.5 sm:px-2 py-3.5 text-xs sm:text-sm ${
                  transaction.type === 'Expense' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {formatAmount(transaction.type, transaction.amount)}
                </TableCell>
                <TableCell className="text-right text-zinc-400 px-1.5 sm:px-2 py-3.5 text-xs sm:text-sm">{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
