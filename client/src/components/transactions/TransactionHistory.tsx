import { useState } from "react";
import type { FC } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Trash2, CircleDollarSign, Coffee, Car, Receipt, ShoppingBag, HelpCircle, AlertTriangle } from "lucide-react";
import type { TransactionItem } from "./types";
import { Skeleton } from "../ui/skeleton";
import transactionService from "../../services/transaction.service";

const getCategoryIcon = (cat: string, tType: "income" | "expense") => {
  if (tType === "income") return <CircleDollarSign className="h-4 w-4 text-emerald-400" />;
  switch (cat?.toLowerCase()) {
    case "food": return <Coffee className="h-4 w-4 text-amber-400" />;
    case "travel": return <Car className="h-4 w-4 text-blue-400" />;
    case "bills": return <Receipt className="h-4 w-4 text-rose-400" />;
    case "shopping": return <ShoppingBag className="h-4 w-4 text-violet-400" />;
    default: return <HelpCircle className="h-4 w-4 text-zinc-400" />;
  }
};

interface TransactionHistoryProps {
  transactions: TransactionItem[];
  isLoading?: boolean;
  onDeleteSuccess?: () => void;
}

export const TransactionHistory: FC<TransactionHistoryProps> = ({
  transactions,
  isLoading = false,
  onDeleteSuccess,
}) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await transactionService.deleteTransaction(deleteTargetId);
      setDeleteTargetId(null);
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      alert("Failed to delete transaction. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card size="sm" className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white shadow-xl shadow-black/25 overflow-hidden lg:flex-1 lg:flex lg:flex-col lg:min-h-0">
        <CardHeader className="flex flex-row items-center justify-between pb-1.5">
          <div>
            <CardTitle className="text-sm tracking-tight">History Logs</CardTitle>
            <CardDescription className="text-zinc-400 text-[10px] leading-tight">Transactions</CardDescription>
          </div>
          {!isLoading && (
            <Badge className="rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5 text-xs">
              {transactions.length}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="px-3 sm:px-4 lg:flex-1 lg:flex lg:flex-col lg:min-h-0 lg:overflow-hidden">
          <div className="space-y-2 lg:flex-1 lg:min-h-0 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : transactions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 text-center text-zinc-500 text-xs py-8">
                No transactions logged yet.
              </div>
            ) : (
              transactions.map((t) => (
                <div
                  key={t._id}
                  className="group flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-sm transition-all duration-200 hover:border-white/10 hover:bg-white/5"
                >
                  {/* Title details */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${t.type === "income" ? "bg-emerald-500/10" : "bg-zinc-800/80"}`}>
                        {getCategoryIcon(t.category, t.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-white capitalize text-xs sm:text-sm">{t.category}</p>
                          {t.note && (
                            <span className="text-[11px] sm:text-xs text-zinc-500 max-w-40 sm:max-w-50 truncate" title={t.note}>
                              ({t.note})
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5 font-mono">
                          {new Date(t.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Delete action button for mobile view */}
                    <div className="sm:hidden">
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(t._id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Remove Entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t border-white/5 sm:border-t-0">
                    <div className="text-left sm:text-right">
                      <p className={`font-bold whitespace-nowrap text-xs sm:text-sm ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Delete action button for laptop view */}
                    <div className="hidden sm:flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(t._id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Remove Entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal with Backdrop Blur */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#121212]/95 border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Delete Entry?</h3>
                <p className="text-xs text-zinc-400 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-sm text-zinc-300 leading-relaxed">
              Are you sure you want to permanently delete this transaction entry from your logs?
            </p>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
