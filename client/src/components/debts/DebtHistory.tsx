import { useState } from "react";
import type { FC } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Trash2, Check, AlertTriangle } from "lucide-react";
import type { DebtItem } from "./types";
import { Skeleton } from "../ui/skeleton";
import debtService from "../../services/debt.service";

interface DebtHistoryProps {
  debts: DebtItem[];
  isLoading?: boolean;
  onDeleteSuccess?: () => void;
  onPaySuccess?: () => void;
}

export const DebtHistory: FC<DebtHistoryProps> = ({
  debts,
  isLoading = false,
  onDeleteSuccess,
  onPaySuccess,
}) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingId, setIsMarkingId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await debtService.deleteDebt(deleteTargetId);
      setDeleteTargetId(null);
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      alert("Failed to delete debt entry. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    setIsMarkingId(id);
    try {
      await debtService.markAsPaid(id);
      if (onPaySuccess) onPaySuccess();
    } catch (err) {
      alert("Failed to mark debt as paid. Please try again.");
    } finally {
      setIsMarkingId(null);
    }
  };

  return (
    <>
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white shadow-xl lg:flex-1 lg:flex lg:flex-col lg:min-h-0">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Debt Records</CardTitle>
            <CardDescription className="text-zinc-400 text-xs">Review pending and paid balances.</CardDescription>
          </div>
          {!isLoading && (
            <Badge className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-0.5">
              {debts.length} debts
            </Badge>
          )}
        </CardHeader>

        <CardContent className="px-3 sm:px-6 lg:flex-1 lg:flex lg:flex-col lg:min-h-0 lg:overflow-hidden">
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
            ) : debts.length === 0 ? (
              <div className="text-center text-zinc-500 text-xs py-8">
                No debts logged yet.
              </div>
            ) : (
              debts.map((d) => (
                <div
                  key={d._id}
                  className="group flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/5 bg-black/20 hover:bg-white/5 hover:border-white/10 px-4 py-3 text-sm transition-all duration-200"
                >
                  {/* Left Column: Avatar & Person details */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-sm uppercase ${d.type === "lent" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                        }`}>
                        {d.person.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white text-sm sm:text-base">{d.person}</p>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${d.type === "lent" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                            }`}>
                            {d.type}
                          </span>
                          {d.type === "borrowed" && d.status !== "paid" && (
                            <button
                              type="button"
                              disabled={isMarkingId === d._id}
                              onClick={() => handleMarkAsPaid(d._id)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer disabled:opacity-50 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 animate-in fade-in inline-flex items-center justify-center h-6 w-6"
                              title="Mark as Paid"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        {d.note && <p className="text-xs text-zinc-400 mt-1">{d.note}</p>}
                      </div>
                    </div>

                    {/* Delete action button for mobile view */}
                    <div className="sm:hidden">
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(d._id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Remove Entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right info: Price, Status, Due date */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t border-white/5 sm:border-t-0">
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1.5">
                      {/* Status badge only for borrowed debts */}
                      {d.type === "borrowed" && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wide uppercase ${d.status === "paid"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : d.status === "overdue"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                        >
                          {d.status}
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">
                        Due: {new Date(d.dueDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className={`font-bold text-sm sm:text-base whitespace-nowrap ${d.type === "lent" ? "text-emerald-400" : "text-rose-400"}`}>
                        {d.type === "lent" ? "+" : "-"}₹{d.amount.toLocaleString("en-IN")}
                      </p>

                      {/* Delete action button for laptop view */}
                      <div className="hidden sm:flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(d._id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Remove Entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
              Are you sure you want to permanently delete this debt record from your logs?
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
