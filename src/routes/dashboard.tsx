import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentUser, store, categories } from "@/lib/mock-store";
import { FileText, ListChecks, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getCurrentUser()) throw redirect({ to: "/login" });
  },
  component: Dashboard,
});

function Dashboard() {
  const user = getCurrentUser()!;
  const apps = store.getApps().filter((a) => a.userId === user.id);
  const pending = apps.filter((a) => a.status === "pending").length;
  const approved = apps.filter((a) => a.status === "approved").length;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary">Welcome, {user.name}</h1>
        <p className="text-sm text-muted-foreground">Manage your applications and browse services.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <Stat label="Total" value={apps.length} />
          <Stat label="Pending" value={pending} />
          <Stat label="Approved" value={approved} />
          <Stat label="Rejected" value={apps.filter((a) => a.status === "rejected").length} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/services" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Apply for Service</Link>
          <Link to="/track" className="bg-card border border-border text-primary px-4 py-2 rounded-md text-sm inline-flex items-center gap-2"><ListChecks className="w-4 h-4" /> Track Applications</Link>
        </div>

        <h2 className="text-lg font-bold text-primary mt-10 mb-4">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.id} to="/services/$category" params={{ category: c.id }} className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors">
                <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                <div className="font-semibold text-primary text-sm mt-2">{c.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.blurb}</div>
              </Link>
            );
          })}
        </div>

        <h2 className="text-lg font-bold text-primary mt-10 mb-4">Recent Applications</h2>
        {apps.length === 0 ? (
          <p className="text-sm text-muted-foreground bg-card border border-border rounded-lg p-6 text-center">No applications yet. Start by browsing services above.</p>
        ) : (
          <div className="space-y-2">
            {apps.slice(-5).reverse().map((a) => (
              <Link key={a.id} to="/track/$refNumber" params={{ refNumber: a.refNumber }} className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:border-primary">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-sm text-primary">{a.serviceName}</div>
                    <div className="text-xs text-muted-foreground">Ref: {a.refNumber}</div>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
  };
  return <span className={`text-[10px] uppercase font-semibold px-2 py-1 rounded ${map[status]}`}>{status}</span>;
}
