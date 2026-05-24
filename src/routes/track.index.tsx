import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentUser, store } from "@/lib/mock-store";
import { StatusBadge } from "./dashboard";
import { Search } from "lucide-react";

export const Route = createFileRoute("/track/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getCurrentUser()) throw redirect({ to: "/login" });
  },
  component: TrackIndex,
});

function TrackIndex() {
  const user = getCurrentUser()!;
  const apps = store.getApps().filter((a) => a.userId === user.id);
  const [q, setQ] = useState("");
  const list = apps.filter((a) => a.refNumber.toLowerCase().includes(q.toLowerCase()) || a.serviceName.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary">Track Applications</h1>
        <p className="text-sm text-muted-foreground">View status of all your submitted applications.</p>

        <div className="relative max-w-md mt-6">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by reference number or service" className="w-full bg-card rounded-full pl-10 pr-4 py-3 text-sm border border-border focus:outline-none" />
        </div>

        <div className="mt-6 space-y-2">
          {list.length === 0 && <p className="text-sm text-muted-foreground bg-card border border-border rounded-lg p-6 text-center">No applications found.</p>}
          {list.map((a) => (
            <Link key={a.id} to="/track/$refNumber" params={{ refNumber: a.refNumber }} className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:border-primary">
              <div>
                <div className="font-semibold text-sm text-primary">{a.serviceName}</div>
                <div className="text-xs text-muted-foreground">Ref: {a.refNumber} · Submitted {new Date(a.submittedAt).toLocaleDateString()}</div>
              </div>
              <StatusBadge status={a.status} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
