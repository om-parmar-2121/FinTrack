import type { FC } from "react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation, Navigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import { useAuth0 } from "@auth0/auth0-react";
import authService from "./services/auth.service";
import NotFound from "./components/NotFound";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Debts = lazy(() => import("./pages/Debts"));

// Protect dashboard pages from unauthenticated access
const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Prevent authenticated users from visiting login/signup
const PublicRoute = ({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const App: FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLocalAuthenticated, setIsLocalAuthenticated] = useState<boolean | null>(null);

  // Sync Auth0 with backend
  useEffect(() => {
    const syncAuth0User = async () => {
      if (isAuthenticated && user) {
        setIsSyncing(true);
        try {
          const res = await authService.auth0Login({
            email: user.email!,
            name: user.name || user.nickname || "Google User",
            auth0Id: user.sub!
          });
          
          if (res.success) {
            if (location.pathname === "/" || location.pathname === "/signup") {
              navigate("/dashboard");
            }
          }
        } catch (err) {
          console.error("Failed to sync Auth0 user with backend:", err);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncAuth0User();
  }, [isAuthenticated, user, navigate, location.pathname]);

  // Check auth session state on mount / navigation
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.getMe();
        setIsLocalAuthenticated(true);
      } catch (err) {
        setIsLocalAuthenticated(false);
      }
    };

    if (!isLoading) {
      checkAuth();
    }
  }, [isLoading, isAuthenticated, location.pathname]);

  if (isLoading || isSyncing || isLocalAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center text-zinc-400 gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
        <span className="text-xs uppercase tracking-wider text-zinc-500">Loading...</span>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center text-zinc-400 gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
        <span className="text-xs uppercase tracking-wider text-zinc-500">Loading...</span>
      </div>
    }>
      <Routes>
        <Route path="/" element={
          <PublicRoute isAuthenticated={isLocalAuthenticated === true}>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute isAuthenticated={isLocalAuthenticated === true}>
            <Signup />
          </PublicRoute>
        } />
        <Route path="*" element={<NotFound />} />
        
        <Route element={
          <ProtectedRoute isAuthenticated={isLocalAuthenticated === true}>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/debts" element={<Debts />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;