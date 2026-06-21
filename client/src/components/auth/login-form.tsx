import { useState } from "react";
import type { FC, ChangeEvent, FormEvent } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { AlertCircle } from "lucide-react";
import authService from "../../services/auth.service";
import { OtpVerification } from "./otp-verification";
import { useAuth0 } from "@auth0/auth0-react";

interface LoginFormProps {
  className?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: FC<LoginFormProps> = ({ className, ...props }) => {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

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
      const res = await authService.login(formData);
      if (res.data?.requireVerification) {
        setEmailForVerification(res.data.email || formData.email);
        setShowOtpVerification(true);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error details:", err);
      setError(err.response?.data?.message || "Unable to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await authService.login(formData);
  };

  if (showOtpVerification) {
    return (
      <OtpVerification
        email={emailForVerification}
        variant="login"
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
      <div className="bg-[#111111]/95 backdrop-blur-xl border border-[#262626] text-white shadow-2xl rounded-2xl sm:p-7 space-y-4">
        <div className="space-y-2 text-center lg:text-left">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Login to your account</h2>
          <p className="text-zinc-400 text-sm">Enter your email below to login to your account</p>
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

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/10"
            >
              {isLoading ? "Logging in..." : "Login"}
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

            <div className="text-center text-zinc-400 text-sm mt-1">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:text-white! transition-colors duration-200 no-underline!">Sign up</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
