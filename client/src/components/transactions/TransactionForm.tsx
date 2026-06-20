import type { FC } from "react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Calendar, ChevronDown, AlertCircle } from "lucide-react";
import transactionService from "../../services/transaction.service";

interface TransactionFormProps {
  onSuccess?: () => void;
}

export const TransactionForm: FC<TransactionFormProps> = ({ onSuccess }) => {

  // Local component state for form fields
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");

  const todayStr = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  const [date, setDate] = useState(todayStr);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      await transactionService.addTransaction({
        type,
        amount: parsedAmount,
        category: type === "expense" ? category : "salary",
        date: new Date(date).toISOString(),
        note,
      });

      // Reset inputs
      setAmount("");
      setNote("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to log transaction. Check parameters.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white shadow-xl h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Log Income / Expense</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0">
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {error && (
              <div className="flex items-start gap-2 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-200 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{error}</div>
              </div>
            )}
            {/* Type Button Toggle Group */}
            <div>
              <Label className="text-xs font-medium text-zinc-300">Transaction Type</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setType("expense");
                    if (category === "salary") setCategory("food");
                  }}
                  className={`py-2 px-4 rounded-xl border text-m font-semibold transition-all cursor-pointer ${type === "expense"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      : "bg-black/20 border-white/10 text-zinc-400 hover:bg-black/45 hover:border-white/15"
                    }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setType("income");
                    setCategory("salary");
                  }}
                  className={`py-2 px-4 rounded-xl border text-m font-semibold transition-all cursor-pointer ${type === "income"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-black/20 border-white/10 text-zinc-400 hover:bg-black/45 hover:border-white/15"
                    }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Amount field */}
            <div>
              <Label htmlFor="amount" className="text-xs font-medium text-zinc-300">Amount</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-semibold">₹</span>
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  disabled={isSubmitting}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8 h-9 bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus:border-blue-500/50"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-xs font-medium text-zinc-300">Category</Label>
              <div className="relative mt-2">
                <select
                  id="category"
                  disabled={isSubmitting}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-9 w-full appearance-none rounded-lg border border-white/10 bg-[#0f0f0f] px-2.5 text-sm text-white shadow-sm focus:outline-none focus:border-blue-500/50 cursor-pointer pr-6"
                >
                  {type === "income" ? (
                    <>
                      <option className="bg-[#151515] text-white" value="salary">Salary</option>
                      <option className="bg-[#151515] text-white" value="other">Other</option>
                    </>
                  ) : (
                    <>
                      <option className="bg-[#151515] text-white" value="food">Food</option>
                      <option className="bg-[#151515] text-white" value="travel">Travel</option>
                      <option className="bg-[#151515] text-white" value="bills">Bills</option>
                      <option className="bg-[#151515] text-white" value="shopping">Shopping</option>
                      <option className="bg-[#151515] text-white" value="other">Other</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date" className="text-xs font-medium text-zinc-300">Date</Label>
              <div className="relative mt-2">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white pointer-events-none" />
                <Input
                  id="date"
                  type="date"
                  disabled={isSubmitting}
                  max={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="pl-9 pr-3 h-9 bg-black/20 border-white/10 text-white focus:border-blue-500/50 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <Label htmlFor="note" className="text-xs font-medium text-zinc-300">Note / Details</Label>
              <Input
                id="note"
                type="text"
                disabled={isSubmitting}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Food, bills, shopping details..."
                className="mt-2 h-9 bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 mt-auto shrink-0">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-m font-semibold cursor-pointer"
            >
              {isSubmitting ? "Logging..." : "Log Entry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
