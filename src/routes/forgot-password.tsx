import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { store } from "@/lib/mock-store";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPage });

function ForgotPage() {
  const router = useRouter();
  const [stage, setStage] = useState<"mobile" | "reset" | "done">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [error, setError] = useState("");

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!store.getUsers().find((u) => u.mobile === mobile)) { setError("No account with that mobile."); return; }
    setStage("reset");
  };

  const reset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp !== "123456") { setError("Invalid OTP. (Demo: 123456)"); return; }
    if (newPass.length < 6) { setError("Password too short."); return; }
    const users = store.getUsers().map((u) => u.mobile === mobile ? { ...u, password: newPass } : u);
    store.saveUsers(users);
    setStage("done");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-primary">Reset Password</h1>

        {stage === "mobile" && (
          <form onSubmit={sendOtp} className="mt-6 space-y-3">
            <input placeholder="Registered mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} required maxLength={10} className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium">Send OTP</button>
          </form>
        )}

        {stage === "reset" && (
          <form onSubmit={reset} className="mt-6 space-y-3">
            <p className="text-xs text-muted-foreground">OTP sent to {mobile} (demo: 123456)</p>
            <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm tracking-widest text-center" />
            <input type="password" placeholder="New password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium">Reset Password</button>
          </form>
        )}

        {stage === "done" && (
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground">Password reset successful.</p>
            <button onClick={() => router.navigate({ to: "/login" })} className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-medium">Back to Login</button>
          </div>
        )}

        <div className="mt-4 text-center text-xs">
          <Link to="/login" className="text-primary hover:underline">Back to login</Link>
        </div>
      </main>
    </div>
  );
}
