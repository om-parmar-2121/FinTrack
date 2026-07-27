import { useState } from "react";
import type { FC } from "react";
import { X, CreditCard, Loader2, IndianRupee, StickyNote, CheckCircle2 } from "lucide-react";
import type { DebtItem } from "./types";

interface LogPaymentModalProps {
  debt: DebtItem;
  onClose: () => void;
  onSuccess: (updatedDebt: DebtItem) => void;
}

export const LogPaymentModal: FC<LogPaymentModalProps> = ({ debt, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const remaining = debt.amount - (debt.paidAmount ?? 0);
  const progress = debt.amount > 0 ? Math.round(((debt.paidAmount ?? 0) / debt.amount) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }
    if (numAmount > remaining) {
      setError(`Payment cannot exceed remaining amount ₹${remaining.toLocaleString("en-IN")}.`);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Dynamic import to avoid circular deps
      const { default: debtService } = await import("../../services/debt.service");
      const res = await debtService.logPayment(debt._id, numAmount, note);
      if (res.success) {
        onSuccess(res.data);
        onClose();
      } else {
        setError("Failed to log payment. Please try again.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to log payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLent = debt.type === "lent";
  const personInitial = debt.person.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#111111]/98 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 text-white">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl font-bold text-sm uppercase ${isLent ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>
              {personInitial}
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">{debt.person}</h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
                {isLent ? "Recovering Lent Money" : "Logging EMI / Repayment"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Summary */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-4 mb-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Payment Progress</span>
            <span className={`font-semibold ${isLent ? "text-emerald-400" : "text-blue-400"}`}>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isLent ? "bg-emerald-500" : "bg-blue-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Total</p>
              <p className="text-sm font-bold text-white">₹{debt.amount.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Paid</p>
              <p className={`text-sm font-bold ${isLent ? "text-emerald-400" : "text-blue-400"}`}>
                ₹{(debt.paidAmount ?? 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Remaining</p>
              <p className="text-sm font-bold text-rose-400">₹{remaining.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {debt.payments && debt.payments.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/3 p-3 mb-5">
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-2">Payment History</p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
              {[...debt.payments].reverse().map((p, i) => (
                <div key={p._id || i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span className="text-zinc-400">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    {p.note && <span className="text-zinc-500">· {p.note}</span>}
                  </div>
                  <span className="font-semibold text-white">₹{p.amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Payment Amount <span className="text-zinc-500">(max ₹{remaining.toLocaleString("en-IN")})</span>
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="number"
                min="1"
                max={remaining}
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={isSubmitting}
                required
                className="w-full pl-9 pr-4 h-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/25 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Quick fill buttons */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {[25, 50, 75, 100].map((pct) => {
                const val = Math.ceil((remaining * pct) / 100);
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    disabled={isSubmitting}
                    className="text-[10px] px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {pct === 100 ? "Full" : `${pct}%`} · ₹{val.toLocaleString("en-IN")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Note <span className="text-zinc-600">(optional)</span></label>
            <div className="relative">
              <StickyNote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. June EMI, partial settlement..."
                disabled={isSubmitting}
                className="w-full pl-9 pr-4 h-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/25 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 ${isLent ? "bg-emerald-600 hover:bg-emerald-500" : "bg-blue-600 hover:bg-blue-500"}`}
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Logging...</>
              ) : (
                <><CreditCard className="h-4 w-4" /> Log Payment</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogPaymentModal;
