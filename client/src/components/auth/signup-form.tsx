import React, { useState } from "react";
import type { FC, FormEvent, ChangeEvent } from "react";
import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import authService from "../../services/auth.service";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AlertCircle } from "lucide-react";
import { OtpVerification } from "./otp-verification";
import { useAuth0 } from "@auth0/auth0-react";

interface SignupFormProps {
  className?: string;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  startingBalance: string;
  savingGoal: string;
}

export const SignupForm: FC<SignupFormProps> = React.memo(({
  className,
  ...props
}) => {
  const { loginWithRedirect } = useAuth0();
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    startingBalance: "",
    savingGoal: "",
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP states
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        startingBalance: Number(formData.startingBalance),
        savingGoal: Number(formData.savingGoal)
      });

      if (res.data?.requireVerification) {
        setEmailForVerification(res.data.email || formData.email);
        setShowOtpVerification(true);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Signup error details:", err);
      setError(err.response?.data?.message || "Unable to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await authService.signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      startingBalance: Number(formData.startingBalance),
      savingGoal: Number(formData.savingGoal)
    });
  };

  if (showOtpVerification) {
    return (
      <OtpVerification
        email={emailForVerification}
        variant="signup"
        onSuccess={() => navigate("/dashboard")}
        onResend={handleResendOtp}
        onCancel={() => {
          setShowOtpVerification(false);
          setError("");
        }}
        className={className}
        {...props}
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)} {...props}>
      <div className="bg-[#111111]/95 backdrop-blur-xl border border-[#262626] text-white shadow-2xl rounded-2xl p-5 sm:p-7 space-y-4">
        <div className="space-y-2 text-center lg:text-left">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Create your account</h2>
          <p className="text-zinc-400 text-sm">Enter your details below to create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-200 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">
                {error}
              </div>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="h-10 sm:h-11 bg-[#181818] border-[#2a2a2a] text-white placeholder:text-zinc-500 rounded-xl"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@example.com"
              required
              className="h-10 sm:h-11 bg-[#181818] border-[#2a2a2a] text-white placeholder:text-zinc-500 rounded-xl"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="h-10 sm:h-11 bg-[#181818] border-[#2a2a2a] text-white placeholder:text-zinc-500 rounded-xl"
            />
          </div>

          {/* Budget + Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Starting Balance */}
            <div className="space-y-1.5">
              <Label htmlFor="startingBalance" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Starting Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">₹</span>
                <Input
                  id="startingBalance"
                  type="number"
                  value={formData.startingBalance}
                  onChange={handleChange}
                  placeholder="50000"
                  required
                  className="pl-8 h-10 sm:h-11 bg-[#181818] border-[#2a2a2a] text-white placeholder:text-zinc-500 rounded-xl"
                />
              </div>
            </div>

            {/* Saving Goal */}
            <div className="space-y-1.5">
              <Label htmlFor="savingGoal" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Saving Goal</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">₹</span>
                <Input
                  id="savingGoal"
                  type="number"
                  value={formData.savingGoal}
                  onChange={handleChange}
                  placeholder="10000"
                  required
                  className="pl-8 h-10 sm:h-11 bg-[#181818] border-[#2a2a2a] text-white placeholder:text-zinc-500 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 sm:h-11 bg-[#155DFC] hover:bg-[#1447E6] text-white text-sm font-medium rounded-xl shadow-none cursor-pointer"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 border-t border-white/10" />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Or
              </span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            <Button
              type="button"
              onClick={() => loginWithRedirect({ authorizationParams: { connection: "google-oauth2" } })}
              className="w-full h-10 sm:h-11 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <img src="/GoogleLogo.png" alt="google logo" className="h-5 w-5 object-contain" />
              <span>Continue with Google</span>
            </Button>

            <div className="text-center text-zinc-400 text-sm mt-1">
              Already have an account?{" "}
              <Link to="/" className="text-blue-500 hover:text-white! transition-colors duration-200 no-underline!">Sign in</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default SignupForm;