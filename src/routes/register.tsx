import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { store, getCurrentUser, type User } from "@/lib/mock-store";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getCurrentUser()) throw redirect({ to: "/dashboard" });
  },
  component: RegisterPage,
});

function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", aadhaar: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.aadhaar.length !== 12) { setError("Aadhaar must be 12 digits."); return; }
    if (form.mobile.length !== 10) { setError("Mobile must be 10 digits."); return; }
    if (store.getUsers().some((u) => u.mobile === form.mobile)) { setError("Mobile already registered."); return; }
    setStep(2);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp !== "123456") { setError("Invalid OTP. (Hint: use 123456)"); return; }
    const user: User = { id: crypto.randomUUID(), ...form };
    const users = store.getUsers();
    users.push(user);
    store.saveUsers(users);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-6 text-xs">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`flex-1 h-1 rounded ${step >= n ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-primary">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Step 1 of 3 — Your details</p>
            <form onSubmit={submitStep1} className="mt-6 space-y-3">
              <input placeholder="Full Name" value={form.name} onChange={set("name")} required className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" />
              <input type="email" placeholder="Email" value={form.email} onChange={set("email")} required className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" />
              <input placeholder="Mobile (10 digits)" value={form.mobile} onChange={set("mobile")} required maxLength={10} className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" />
              <input placeholder="Aadhaar (12 digits)" value={form.aadhaar} onChange={set("aadhaar")} required maxLength={12} className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" />
              <input type="password" placeholder="Password" value={form.password} onChange={set("password")} required minLength={6} className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" />
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium">Continue</button>
              <p className="text-xs text-center text-muted-foreground">Already have an account? <Link to="/login" className="text-primary">Login</Link></p>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-primary">Verify Identity</h1>
            <p className="text-sm text-muted-foreground mt-1">Step 2 of 3 — Aadhaar / Mobile OTP sent to {form.mobile}</p>
            <form onSubmit={verifyOtp} className="mt-6 space-y-3">
              <input placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm tracking-widest text-center" />
              <p className="text-[10px] text-muted-foreground text-center">Demo OTP: 123456</p>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium">Verify</button>
            </form>
          </>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full mx-auto flex items-center justify-center text-primary text-3xl">✓</div>
            <h1 className="text-2xl font-bold text-primary mt-4">Profile Created</h1>
            <p className="text-sm text-muted-foreground mt-2">Your account is ready. Please login to continue.</p>
            <button onClick={() => router.navigate({ to: "/login" })} className="mt-6 bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-medium">Proceed to Login</button>
          </div>
        )}
      </main>
    </div>
  );
}
