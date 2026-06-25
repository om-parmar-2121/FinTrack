import { useState } from "react";
import type { FC, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { AlertCircle, Target, Wallet } from "lucide-react";

const Setup: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ monthlyBudget: "", savingGoal: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.updateMe({
        monthlyBudget: Number(formData.monthlyBudget),
        savingGoal: Number(formData.savingGoal),
      });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Setup error:", err);
      setError(err.response?.data?.message || err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 mb-4 shadow-lg shadow-blue-500/25">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Almost there! 🎉</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Let's set up your financial profile. You can always update these later in settings.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111111]/95 backdrop-blur-xl border border-[#262626] rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-200 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{error}</div>
              </div>
            )}

            {/* Monthly Budget */}
            <div className="space-y-2">
              <label htmlFor="monthlyBudget" className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <Wallet className="w-4 h-4 text-blue-400" />
                Monthly Budget
              </label>
              <p className="text-xs text-zinc-500">How much do you plan to spend per month?</p>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">₹</span>
                <input
                  id="monthlyBudget"
                  type="number"
                  min="0"
                  value={formData.monthlyBudget}
                  onChange={handleChange}
                  placeholder="25000"
                  required
                  className="w-full pl-8 pr-4 h-11 bg-[#181818] border border-[#2a2a2a] rounded-xl text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Saving Goal */}
            <div className="space-y-2">
              <label htmlFor="savingGoal" className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <Target className="w-4 h-4 text-emerald-400" />
                Saving Goal
              </label>
              <p className="text-xs text-zinc-500">What's your target savings amount?</p>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">₹</span>
                <input
                  id="savingGoal"
                  type="number"
                  min="0"
                  value={formData.savingGoal}
                  onChange={handleChange}
                  placeholder="100000"
                  required
                  className="w-full pl-8 pr-4 h-11 bg-[#181818] border border-[#2a2a2a] rounded-xl text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </span>
              ) : (
                "Let's Go →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setup;
