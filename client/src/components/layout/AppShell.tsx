import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowLeftRight, ChartLine, HandCoins, LayoutDashboard, Menu, X, LogOut, Sun, Moon, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth0 } from "@auth0/auth0-react";
import authService from "../../services/auth.service";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms";

const navigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", to: "/analytics", icon: ChartLine },
  { label: "Transactions", to: "/transactions", icon: ArrowLeftRight },
  { label: "Debts", to: "/debts", icon: HandCoins },
];

const UserProfileCard = ({
  displayName,
  displayEmail,
  displayPicture,
  onLogout,
  theme,
  toggleTheme,
}: {
  displayName: string;
  displayEmail: string;
  displayPicture: string | null;
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={cardRef} className="relative w-full">
      {/* Animated Extension Popover Menu */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-white/10 bg-[#141414] p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer mb-1"
          >
            <span className="flex items-center gap-2">
              {theme === "light" ? <Moon className="h-4 w-4 text-violet-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
              <span>{theme === "light" ? "Dark Theme" : "Light Theme"}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2 rounded-xl bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-400 border border-transparent hover:bg-rose-500/20 hover:border-rose-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Main Profile Trigger Card matching Image 1 */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/10 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          {displayPicture && !imgError ? (
            <img
              src={displayPicture}
              alt={displayName}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-9 w-9 rounded-xl object-cover shrink-0 border border-white/10"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 font-bold text-xs border border-blue-500/20">
              {displayName
                ? displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate text-white leading-snug">{displayName}</p>
            <p className="text-xs text-white/50 truncate leading-snug">{displayEmail}</p>
          </div>
        </div>

        <ChevronsUpDown className="h-4 w-4 shrink-0 text-white/45 ml-2" />
      </div>
    </div>
  );
};

const AppShell = React.memo(() => {
  const { user: auth0User, logout: auth0Logout } = useAuth0();
  const localUser = useRecoilValue(userState);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isTransactionsPage = location.pathname.startsWith("/transactions");

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme") || "dark";
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    return saved;
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const displayName = auth0User?.name || auth0User?.nickname || localUser?.name || "User";
  const displayEmail = auth0User?.email || localUser?.email || "user@fintrack.app";
  const displayPicture = auth0User?.picture || null;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Local session logout failed:", err);
    }
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className="min-h-screen lg:h-screen bg-[#0b0b0b] text-white lg:flex lg:overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#0f0f0f] px-5 py-6 lg:flex lg:flex-col">
        <div className="mb-8 space-y-1">
          <p className="font-heading text-xs uppercase tracking-[0.35em] text-white/50">FinTrack</p>
          <h1 className="text-2xl font-semibold">Money OS</h1>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "active-tab border-black bg-black text-white dark:border-white/15 dark:bg-white dark:text-black"
                      : "inactive-tab border-zinc-200/80 bg-[#f4f4f5] text-zinc-700 hover:bg-[#e4e4e7] hover:text-black hover:border-zinc-300 dark:border-transparent dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Quick view</p>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>Monthly budget controls belong in analytics or settings.</p>
              <p>Use transactions for add, edit, and filters.</p>
              <p>Use debts for borrowed, lent, overdue, and paid states.</p>
            </div>
          </div>

          <UserProfileCard
            displayName={displayName}
            displayEmail={displayEmail}
            displayPicture={displayPicture}
            onLogout={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-1 flex-col lg:h-screen",
          isTransactionsPage ? "overflow-hidden" : "lg:overflow-y-auto"
        )}
      >
        {/* Mobile Header: Hamburger on Left, Title on Right */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#0b0b0b]/95 px-4 py-3.5 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="text-right">
            <p className="font-heading text-[0.65rem] uppercase tracking-[0.35em] text-white/45">FinTrack</p>
            <h1 className="text-lg font-semibold">Money OS</h1>
          </div>
        </header>

        {/* Mobile Left-Side Slide-Over Drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Dark Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
              onClick={() => setMobileOpen(false)}
            />

            {/* Left Slide Drawer Panel */}
            <aside className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-[#0f0f0f] border-r border-white/10 px-5 py-6 flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="font-heading text-xs uppercase tracking-[0.35em] text-white/50">FinTrack</p>
                  <h1 className="text-xl font-semibold">Money OS</h1>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                          isActive
                            ? "active-tab border-black bg-black text-white dark:border-white/15 dark:bg-white dark:text-black"
                            : "inactive-tab border-zinc-200/80 bg-[#f4f4f5] text-zinc-700 hover:bg-[#e4e4e7] hover:text-black hover:border-zinc-300 dark:border-transparent dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                        )
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6">
                <UserProfileCard
                  displayName={displayName}
                  displayEmail={displayEmail}
                  displayPicture={displayPicture}
                  onLogout={handleLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              </div>
            </aside>
          </div>
        ) : null}

        <main className={cn("flex-1 min-h-0", isTransactionsPage && "overflow-hidden")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
});

export default AppShell;