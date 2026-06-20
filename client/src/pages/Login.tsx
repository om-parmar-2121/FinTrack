import type { FC } from "react";

import { LoginForm } from "../components/auth/login-form";

import ShapeGrid from "../components/Grainient";
import TextType from "../components/TextType";

const Login: FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">

      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-40">

        <ShapeGrid />

      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-6">

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-center">

          {/* Left Side Text */}
          <div className="hidden lg:flex flex-col justify-center">

            <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight">

              <TextType
                text={[
                  "Welcome to FinTrack!",
                  "Smart Expense Tracking.",
                  "Track. Save. Grow.",
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />

            </h1>

            <p className="mt-6 text-lg text-zinc-400 max-w-lg leading-relaxed">
              It is a smart expense tracker web app that helps you
              manage budgets, monitor spending, and achieve savings goals.
            </p>

          </div>

          {/* Right Side Login */}
          <div className="w-full flex justify-center lg:justify-end">

            <div className="w-full max-w-sm">
              <LoginForm />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;