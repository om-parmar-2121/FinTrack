import { SignupForm } from "../components/auth/signup-form";
import Grainient from "../components/Grainient";
import TextType from "../components/TextType";

const Signup = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">

      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Grainient />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-6">

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-center">

          {/* Left Side Text */}
          <div className="hidden lg:flex flex-col justify-center">

            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              <TextType
                text={[
                  "Create your FinTrack account",
                  "Start tracking in minutes.",
                ]}
                typingSpeed={60}
                pauseDuration={1200}
                showCursor={true}
                cursorCharacter="|"
              />
            </h1>

            <p className="mt-6 text-lg text-zinc-400 max-w-lg leading-relaxed">
              Join FinTrack to manage budgets, monitor spending, and reach your savings goals with clarity.
            </p>

          </div>

          {/* Right Side Signup */}
          <div className="w-full flex justify-center lg:justify-end">

            <div className="w-full max-w-sm">
              <SignupForm />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Signup;