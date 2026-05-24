import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { store, getCurrentUser } from "@/lib/mock-store";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getCurrentUser()) throw redirect({ to: "/dashboard" });
  },
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = store.getUsers().find((u) => u.mobile === mobile && u.password === password);
    if (!user) { setError("Invalid mobile number or password."); return; }
    store.setSession(user.id);
    router.navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-primary">Login to your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Access government services from your home.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-primary">Mobile Number</label>
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} required maxLength={10} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-primary">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:opacity-90">Sign In</button>
        </form>
        <div className="flex justify-between mt-4 text-xs">
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
          <Link to="/register" className="text-primary hover:underline">New user? Register</Link>
        </div>
      </main>
    </div>
  );
}
