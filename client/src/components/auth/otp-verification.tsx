import { useState, useEffect, useRef } from "react";
import type { FC, FormEvent, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { AlertCircle } from "lucide-react";
import authService from "../../services/auth.service";

interface OtpVerificationProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string;
  variant: "signup" | "login";
  onSuccess: () => void;
  onResend: () => Promise<void>;
  onCancel: () => void;
}

export const OtpVerification: FC<OtpVerificationProps> = ({
  email,
  variant,
  onSuccess,
  onResend,
  onCancel,
  className,
  ...props
}) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpCode = otpValues.join("");

  useEffect(() => {
    // Auto-focus first input box when OTP window opens
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    let intervalId: any;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await authService.verifyOtp({
        email,
        otp: otpCode,
      });

      if (res.success) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      await onResend();
      setTimer(300);
      setOtpValues(Array(6).fill(""));
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      alert("A new OTP code has been sent to your email.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = "";
      setOtpValues(newOtpValues);
      return;
    }

    const newOtpValues = [...otpValues];
    const singleChar = cleanValue.substring(cleanValue.length - 1);
    newOtpValues[index] = singleChar;
    setOtpValues(newOtpValues);

    // Auto-focus next box
    if (index < 5 && singleChar) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasteData) {
      const newOtpValues = [...otpValues];
      for (let i = 0; i < 6; i++) {
        if (pasteData[i]) {
          newOtpValues[i] = pasteData[i];
        }
      }
      setOtpValues(newOtpValues);
      const nextFocusIndex = Math.min(pasteData.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const labelClassName =
    variant === "signup"
      ? "block mb-2 text-sm font-medium text-zinc-200"
      : "text-xs font-semibold uppercase tracking-wider text-zinc-400";

  const backButtonText =
    variant === "signup"
      ? "Back to Registration"
      : "Back to Login";

  const formContent = (
    <form onSubmit={handleVerifyOtp} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-200 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">{error}</div>
        </div>
      )}

      <div className={variant === "login" ? "space-y-1.5" : undefined}>
        <Label className={labelClassName}>
          Verification Code (OTP)
        </Label>
        
        <div className="grid grid-cols-6 gap-2 sm:gap-3 py-1">
          {otpValues.map((val, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={val}
              onChange={(e) => handleInputChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              required
              className="w-full h-11 sm:h-12 bg-[#181818] border border-[#2a2a2a] text-white text-center text-lg font-mono font-bold rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-400">
        {timer > 0 ? (
          <span>
            Code expires in:{" "}
            <span className="text-amber-400 font-mono font-medium">
              {formatTime(timer)}
            </span>
          </span>
        ) : (
          <span className="text-rose-400 font-medium">OTP code has expired</span>
        )}

        <button
          type="button"
          disabled={isLoading || timer > 0}
          onClick={handleResendOtp}
          className="text-blue-500 hover:text-white transition-colors duration-200 font-medium disabled:opacity-50 disabled:hover:text-blue-500 cursor-pointer"
        >
          Resend OTP
        </button>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading || otpCode.length !== 6}
          className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <button
          type="button"
          onClick={() => {
            onCancel();
            setError("");
          }}
          className="w-full text-center text-zinc-400 hover:text-white transition-colors text-xs font-medium pt-1 cursor-pointer"
        >
          {backButtonText}
        </button>
      </div>
    </form>
  );

  if (variant === "signup") {
    return (
      <div className={cn("w-full", className)} {...props}>
        <Card className="bg-[#111111]/95 backdrop-blur-xl border border-[#262626] text-white shadow-2xl rounded-2xl">
          <CardHeader className="space-y-1 px-5 pt-5 sm:px-6 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Verify your email
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              We have sent a 6-digit verification code to{" "}
              <span className="text-zinc-200 font-semibold">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            {formContent}
          </CardContent>
        </Card>
      </div>
    );
  }

  // variant === "login"
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)} {...props}>
      <div className="bg-[#111111]/95 backdrop-blur-xl border border-[#262626] text-white shadow-2xl rounded-2xl sm:p-7 space-y-4">
        <div className="space-y-2 text-center lg:text-left">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Verify your email
          </h2>
          <p className="text-zinc-400 text-sm">
            We have sent a 6-digit verification code to{" "}
            <span className="text-zinc-200 font-semibold">{email}</span>.
          </p>
        </div>
        {formContent}
      </div>
    </div>
  );
};

export default OtpVerification;
