import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { categories, services, getCurrentUser } from "@/lib/mock-store";
import { Search, ShieldCheck, FileText, IdCard, Vote, Plane, Car, CreditCard, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/services/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getCurrentUser()) throw redirect({ to: "/login" });
  },
  component: ServicesIndex,
});

type Stage = "aadhaar" | "otp" | "verified";

interface UserDoc {
  id: string;
  name: string;
  number: string;
  icon: any;
  expiresInDays: number | null; // null = lifetime
}

function ServicesIndex() {
  const user = getCurrentUser()!;
  const [stage, setStage] = useState<Stage>("aadhaar");
  const [aadhaar, setAadhaar] = useState(user.aadhaar || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [q, setQ] = useState("");

  const last4 = aadhaar.slice(-4) || "1234";
  const mockDocs: UserDoc[] = [
    { id: "aadhaar", name: "Aadhaar Card", number: `XXXX XXXX ${last4}`, icon: ShieldCheck, expiresInDays: null },
    { id: "pan", name: "PAN Card", number: `ABCDE${last4}F`, icon: CreditCard, expiresInDays: null },
    { id: "voter", name: "Voter ID (EPIC)", number: `TN${last4}567`, icon: Vote, expiresInDays: null },
    { id: "passport", name: "Passport", number: `M${last4}890`, icon: Plane, expiresInDays: 412 },
    { id: "dl", name: "Driving License", number: `TN10 2019 00${last4}`, icon: Car, expiresInDays: 89 },
    { id: "ration", name: "Smart Ration Card", number: `RC${last4}9921`, icon: FileText, expiresInDays: 1825 },
  ];

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{12}$/.test(aadhaar)) { setError("Enter a valid 12-digit Aadhaar number."); return; }
    setSending(true);
    setTimeout(() => { setSending(false); setStage("otp"); }, 700);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp !== "123456") { setError("Invalid OTP. Use 123456 for demo."); return; }
    setStage("verified");
  };

  const filtered = services.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.description.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* ============ Section 1: Identity + Documents ============ */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section 1</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Verify Identity & View Your Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">Securely fetch government-issued documents linked to your Aadhaar.</p>

          {stage !== "verified" ? (
            <div className="mt-6 max-w-md bg-card border border-border rounded-lg p-6">
              {stage === "aadhaar" && (
                <form onSubmit={sendOtp} className="space-y-4">
                  <label className="block">
                    <span className="text-xs font-medium text-primary">Aadhaar Number</span>
                    <input
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                      placeholder="1234 5678 9012"
                      inputMode="numeric"
                      className="mt-1 w-full px-3 py-2 rounded-md border border-border bg-background text-sm tracking-wider"
                    />
                  </label>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                  <button disabled={sending} className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                    {sending && <Loader2 className="w-4 h-4 animate-spin" />} Send OTP
                  </button>
                  <p className="text-[11px] text-muted-foreground">An OTP will be sent to the mobile linked with your Aadhaar.</p>
                </form>
              )}
              {stage === "otp" && (
                <form onSubmit={verifyOtp} className="space-y-4">
                  <div className="flex items-center gap-2 text-xs bg-secondary text-primary p-2 rounded">
                    <CheckCircle2 className="w-4 h-4" />
                    OTP sent to mobile ending in **{user.mobile.slice(-2)}
                  </div>
                  <label className="block">
                    <span className="text-xs font-medium text-primary">Enter 6-digit OTP</span>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="••••••"
                      inputMode="numeric"
                      className="mt-1 w-full px-3 py-2 rounded-md border border-border bg-background text-sm tracking-[0.5em] text-center"
                    />
                  </label>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                  <p className="text-[11px] text-muted-foreground">Demo OTP: <span className="font-mono font-bold">123456</span></p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setStage("aadhaar"); setOtp(""); setError(""); }} className="flex-1 border border-border bg-card text-primary py-2 rounded-md text-sm">Back</button>
                    <button type="submit" className="flex-1 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium">Verify</button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-2 mb-4 w-fit">
                <CheckCircle2 className="w-4 h-4" /> Identity verified · Aadhaar ending {last4}
              </div>
              <h2 className="text-sm font-semibold text-primary mb-3">Documents linked to your name</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mockDocs.map((d) => {
                  const Icon = d.icon;
                  const expiringSoon = d.expiresInDays !== null && d.expiresInDays <= 90;
                  const expired = d.expiresInDays !== null && d.expiresInDays <= 0;
                  return (
                    <div key={d.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-start justify-between">
                        <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                        {expired ? (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">Expired</span>
                        ) : expiringSoon ? (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Expiring</span>
                        ) : (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Valid</span>
                        )}
                      </div>
                      <div className="mt-3 font-semibold text-primary text-sm">{d.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{d.number}</div>
                      <div className="mt-3 text-xs">
                        {d.expiresInDays === null ? (
                          <span className="text-muted-foreground">Lifetime validity</span>
                        ) : (
                          <span className={expired ? "text-red-700" : expiringSoon ? "text-amber-800" : "text-primary"}>
                            Expires in <span className="font-semibold">{d.expiresInDays}</span> day{d.expiresInDays === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs text-primary underline">Download</button>
                        {d.expiresInDays !== null && d.expiresInDays <= 180 && (
                          <button className="text-xs text-primary underline">Renew</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* ============ Section 2: Available Services ============ */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section 2</span>
          </div>
          <h2 className="text-2xl font-bold text-primary">Available Services to Apply</h2>
          <p className="text-sm text-muted-foreground mt-1">150+ services across 5 categories</p>

          <div className="relative max-w-md mt-6">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for a service" className="w-full bg-card rounded-full pl-10 pr-4 py-3 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>

          <h3 className="font-bold text-primary mt-8 mb-3 text-sm uppercase tracking-wide">Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <Link key={c.id} to="/services/$category" params={{ category: c.id }} className="bg-card border border-border rounded-lg p-4 hover:border-primary">
                  <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  <div className="font-semibold text-primary text-sm mt-2">{c.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.blurb}</div>
                </Link>
              );
            })}
          </div>

          <h3 className="font-bold text-primary mt-10 mb-3 text-sm uppercase tracking-wide">{q ? "Search Results" : "All Services"}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((s) => (
              <Link key={s.id} to="/services/$category/$serviceId" params={{ category: s.category, serviceId: s.id }} className="bg-card border border-border rounded-lg p-4 hover:border-primary">
                <div className="font-semibold text-primary text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</div>
                <div className="text-xs text-primary mt-2 font-medium">{s.fee === 0 ? "Free" : `₹${s.fee}`}</div>
              </Link>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No services match your search.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
