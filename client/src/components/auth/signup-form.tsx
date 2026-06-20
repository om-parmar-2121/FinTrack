import { useState } from "react";
import type { FC, FormEvent, ChangeEvent } from "react";
import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import authService from "../../services/auth.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
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
  monthlyBudget: string;
  savingGoal: string;
}

export const SignupForm: FC<SignupFormProps> = ({
  className,
  ...props
}) => {
  const { loginWithRedirect } = useAuth0();
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    monthlyBudget: "",
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
        monthlyBudget: Number(formData.monthlyBudget),
        savingGoal: Number(formData.savingGoal)
      });

      if (res.data?.requireVerification) {
        setEmailForVerification(res.data.email || formData.email);
        setShowOtpVerification(true);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await authService.signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      monthlyBudget: Number(formData.monthlyBudget),
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
    <div
      className={cn("w-full", className)}
      {...props}
    >
      <Card className="bg-[#111111]/95 backdrop-blur-xl border border-[#262626] text-white shadow-2xl rounded-2xl">

        <CardHeader className="space-y-1 px-5 pt-5 sm:px-6 sm:pt-6">

          <CardTitle className="text-xl sm:text-2xl font-bold">
            Create your account
          </CardTitle>

          <CardDescription className="text-zinc-400 text-sm">
            Enter your details below to create your account
          </CardDescription>

        </CardHeader>

        <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-200 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">
                  {error}
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>

              <Label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-zinc-200"
              >
                Full Name
              </Label>

              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="h-10 sm:h-11 bg-[#181818] border-[#2a2a2a] text-white placeholder:text-zinc-500"
              />

            </div>

            {/* Email */}
            <div>

              <Label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-zinc-200"
              >
                Email
              </Label>

              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                required
                className="h-10 sm:h-11 bg-[#181818] border-[#2a2a2a] text-white placeholder:text-zinc-500"
              />

            </div>

            {/* Password */}
            <div>

              <Label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-zinc-200"
              >
                Password
              </Label>

              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="h-10 sm:h-11 bg-[#181818] border-[#2a2a2a] text-white placeholder:text-zinc-500"
              />

            </div>

            {/* Budget + Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Monthly Budget */}
              <div>

                <Label
                  htmlFor="monthlyBudget"
                  className="block mb-2 text-sm font-medium text-zinc-200"
                >
                  Monthly Budget
                </Label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    ₹
                  </span>

                  <Input
                    id="monthlyBudget"
                    type="number"
                    value={formData.monthlyBudget}
                    onChange={handleChange}
                    placeholder="5000"
                    required
                    className="pl-8 h-10 sm:h-11 bg-[#181818] border-[#2a2a2a] text-white placeholder:text-zinc-500"
                  />

                </div>

              </div>

              {/* Saving Goal */}
              <div>

                <Label
                  htmlFor="savingGoal"
                  className="block mb-2 text-sm font medium text-zinc-200"
                >
                  Saving Goal
                </Label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    ₹
                  </span>

                  <Input
                    id="savingGoal"
                    type="number"
                    value={formData.savingGoal}
                    onChange={handleChange}
                    placeholder="10000"
                    required
                    className="pl-8 h-10 sm:h-11 bg-[#181818] border-[#2a2a2a] text-white placeholder:text-zinc-500"
                  />

                </div>

              </div>

            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/10"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="relative flex items-center justify-center py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-3 bg-[#111111] text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Or
                </span>
              </div>

              <Button
                type="button"
                onClick={() => loginWithRedirect({ authorizationParams: { connection: "google-oauth2" } })}
                className="w-full h-10 sm:h-11 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <img src="/GoogleLogo.png" alt="google logo" className="h-5 w-5 object-contain" />
                <span>Continue with Google</span>
              </Button>

              <p className="text-center text-zinc-400 text-sm mt-1">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-blue-500 hover:text-white! transition-colors duration-200 no-underline!"
                >
                  Sign in
                </Link>
              </p>
            </div>

          </form>

        </CardContent>

      </Card>
    </div>
  );
};

export default SignupForm;