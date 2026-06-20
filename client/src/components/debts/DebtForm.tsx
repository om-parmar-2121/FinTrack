import { useState } from "react";
import type { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Calendar, User, AlertCircle } from "lucide-react";
import debtService from "../../services/debt.service";

interface DebtFormProps {
  onSuccess?: () => void;
}

export const DebtForm: FC<DebtFormProps> = ({ onSuccess }) => {
  const todayStr = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  // Form states
  const [person, setPerson] = useState("");
  const [type, setType] = useState<"lent" | "borrowed">("lent");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(todayStr);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!person.trim()) {
      setError("Please enter a person or contact name");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date");
      return;
    }

    if (dueDate < todayStr) {
      setError("Due date cannot be in the past");
      return;
    }

    setIsSubmitting(true);
    try {
      await debtService.addDebt({
        person,
        type,
        amount: parsedAmount,
        dueDate: new Date(dueDate).toISOString(),
        note,
      });

      // Reset form
      setPerson("");
      setAmount("");
      setNote("");
      setDueDate(todayStr);
      setType("lent");

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to log debt entry. Check validation filters.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] rounded-2xl text-white shadow-xl h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Log Debt / Loan</CardTitle>
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

            {/* Person Name */}
            <div>
              <Label htmlFor="person" className="text-xs font-medium text-zinc-300">Person / Contact</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500 pointer-events-none" />
                <Input
                  id="person"
                  type="text"
                  disabled={isSubmitting}
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="pl-9 h-9 bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus:border-blue-500/50"
                  required
                />
              </div>
            </div>

            {/* Type Button Toggle Group */}
            <div>
              <Label className="text-xs font-medium text-zinc-300">Debt Type</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setType("lent")}
                  className={`py-2 px-4 rounded-xl border text-m font-semibold transition-all cursor-pointer ${type === "lent"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-black/20 border-white/10 text-zinc-400 hover:bg-black/45 hover:border-white/15"
                    }`}
                >
                  Lent (Owed to Me)
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setType("borrowed")}
                  className={`py-2 px-4 rounded-xl border text-m font-semibold transition-all cursor-pointer ${type === "borrowed"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    : "bg-black/20 border-white/10 text-zinc-400 hover:bg-black/45 hover:border-white/15"
                    }`}
                >
                  Borrowed (I Owe)
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

            {/* Due Date */}
            <div>
              <Label htmlFor="dueDate" className="text-xs font-medium text-zinc-300">Due Date / Deadline</Label>
              <div className="relative mt-2">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white pointer-events-none" />
                <Input
                  id="dueDate"
                  type="date"
                  disabled={isSubmitting}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
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
                placeholder="Laptop assistance, lunch split, travel share..."
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
              {isSubmitting ? "Logging..." : "Log Debt Entry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
