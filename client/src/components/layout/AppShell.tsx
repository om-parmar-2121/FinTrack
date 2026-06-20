import type { FC } from "react";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowLeftRight, ChartLine, HandCoins, LayoutDashboard, Menu, X, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth0 } from "@auth0/auth0-react";
import authService from "../../services/auth.service";

const navigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", to: "/analytics", icon: ChartLine },
  { label: "Transactions", to: "/transactions", icon: ArrowLeftRight },
  { label: "Debts", to: "/debts", icon: HandCoins },
];

const AppShell: FC = () => {
  const { logout: auth0Logout } = useAuth0();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isTransactionsPage = location.pathname.startsWith("/transactions");

  return (
    <div className="min-h-screen lg:h-screen bg-[#0b0b0b] text-white lg:flex lg:overflow-hidden">
      <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#0f0f0f] px-5 py-6 lg:flex lg:flex-col">
        <div className="mb-8 space-y-1">
          <p className="font-heading text-xs uppercase tracking-[0.35em] text-white/50">FinTrack</p>
          <h1 className="text-2xl font-semibold">Money OS</h1>
          <p className="text-sm text-white/55">Dashboard, analytics, transactions, and debts in one place.</p>
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
                      ? "border-white/15 bg-white text-black"
                      : "border-transparent bg-white/5 text-white/70 hover:border-white/10 hover:bg-white/10 hover:text-white"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Quick view</p>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>Monthly budget controls belong in analytics or settings.</p>
              <p>Use transactions for add, edit, and filters.</p>
              <p>Use debts for borrowed, lent, overdue, and paid states.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                await authService.logout();
              } catch (err) {
                console.error("Local session logout failed:", err);
              }
              auth0Logout({ logoutParams: { returnTo: window.location.origin } });
            }}
            className="w-full flex items-center gap-3 rounded-2xl border border-transparent bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/20 px-4 py-3 text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div
        className={cn(
          "flex flex-1 flex-col lg:h-screen",
          isTransactionsPage ? "overflow-hidden" : "lg:overflow-y-auto"
        )}
      >
        <header className="flex items-center justify-between border-b border-white/10 bg-[#0b0b0b]/95 px-4 py-4 backdrop-blur lg:hidden">
          <div>
            <p className="font-heading text-[0.65rem] uppercase tracking-[0.35em] text-white/45">FinTrack</p>
            <h1 className="text-lg font-semibold">Money OS</h1>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {mobileOpen ? (
          <div className="border-b border-white/10 bg-[#0f0f0f] px-4 py-4 lg:hidden">
            <nav className="grid gap-2">
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
                          ? "border-white/15 bg-white text-black"
                          : "border-white/10 bg-white/5 text-white/70"
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ) : null}

        <main className={cn("flex-1 min-h-0", isTransactionsPage && "overflow-hidden")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;