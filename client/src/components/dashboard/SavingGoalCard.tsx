import { useState, useEffect } from "react";
import type { FC } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Target, Pencil, Check, X, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import authService from "../../services/auth.service";
import { Skeleton } from "../ui/skeleton";

interface SavingGoalCardProps {
  savingGoal?: number;
  savedAmount?: number;
  isLoading?: boolean;
  onGoalUpdated?: (newGoal: number) => void;
}

export const SavingGoalCard: FC<SavingGoalCardProps> = ({
  savingGoal = 0,
  savedAmount = 0,
  isLoading = false,
  onGoalUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(savingGoal.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setEditValue(savingGoal.toString());
  }, [savingGoal]);

  const progress = Math.min(
    100,
    savingGoal > 0 ? Math.round((savedAmount / savingGoal) * 100) : 0
  );

  const handleSave = async () => {
    const numericGoal = Number(editValue);
    if (isNaN(numericGoal) || numericGoal < 0) {
      setError("Please enter a valid positive number.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const res = await authService.updateMe({ savingGoal: numericGoal });
      if (res.success) {
        if (onGoalUpdated) {
          onGoalUpdated(numericGoal);
        }
        setIsEditing(false);
      } else {
        setError("Failed to update goal.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update saving goal.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setError("");
      setEditValue(savingGoal.toString());
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl py-4 px-6 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3.5 w-36" />
        </div>
        <div className="space-y-3 pt-4">
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111]/90 backdrop-blur-xl border border-[#262626] text-white shadow-md rounded-2xl py-4 px-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 mr-2">
          <CardTitle className="text-lg font-bold">Saving Goal</CardTitle>
          {isEditing ? (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSaving}
                  className="h-8 bg-[#181818] border-[#333333] text-sm focus:border-blue-500 w-32"
                  placeholder="Target amount"
                  autoFocus
                />
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-400 hover:border-emerald-400"
                >
                  {isSaving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setError("");
                    setEditValue(savingGoal.toString());
                  }}
                  disabled={isSaving}
                  className="bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:bg-rose-400 hover:border-rose-400"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1 group">
              <CardDescription className="text-zinc-400 text-sm">
                Goal target: ₹{savingGoal.toLocaleString("en-IN")}
              </CardDescription>
              <button
                onClick={() => setIsEditing(true)}
                className="group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 cursor-pointer"
                title="Edit saving goal"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl shrink-0">
          <Target className="h-6 w-6" />
        </div>
      </div>
      <CardContent className="p-0 space-y-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Total Saved</span>
            <span className="font-bold text-zinc-200">₹{savedAmount.toLocaleString("en-IN")} ({progress}%)</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <Separator className="bg-[#262626]" />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-zinc-400">Target status</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            On Track
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingGoalCard;
