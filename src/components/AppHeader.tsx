import { Link, useRouter } from "@tanstack/react-router";
import { Globe, LogOut, LayoutDashboard, Search, ListChecks } from "lucide-react";
import { getCurrentUser, store } from "@/lib/mock-store";

export function AppHeader() {
  const router = useRouter();
  const user = typeof window !== "undefined" ? getCurrentUser() : null;

  const logout = () => {
    store.clearSession();
    router.navigate({ to: "/" });
  };

  return (
    <header className="px-6 md:px-12 py-4 flex items-center justify-between gap-4 border-b border-border bg-card">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div className="text-primary font-bold text-xs leading-tight hidden sm:block">
          NATIONAL GOVERNMENT<br />SERVICES PORTAL
        </div>
      </Link>

      <nav className="flex items-center gap-2 sm:gap-4 text-primary text-sm">
        {user ? (
          <>
            <Link to="/dashboard" className="flex items-center gap-1 hover:opacity-70 px-2 py-1">
              <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/services" className="flex items-center gap-1 hover:opacity-70 px-2 py-1">
              <Search className="w-4 h-4" /> <span className="hidden sm:inline">Services</span>
            </Link>
            <Link to="/track" className="flex items-center gap-1 hover:opacity-70 px-2 py-1">
              <ListChecks className="w-4 h-4" /> <span className="hidden sm:inline">Track</span>
            </Link>
            <span className="hidden md:inline text-xs text-muted-foreground">Hi, {user.name.split(" ")[0]}</span>
            <button onClick={logout} className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 py-1.5 hover:opacity-70">Login</Link>
            <Link to="/register" className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
