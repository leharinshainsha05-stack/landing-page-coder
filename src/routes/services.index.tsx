import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { categories, services, getCurrentUser } from "@/lib/mock-store";
import { Search } from "lucide-react";

export const Route = createFileRoute("/services/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getCurrentUser()) throw redirect({ to: "/login" });
  },
  component: ServicesIndex,
});

function ServicesIndex() {
  const [q, setQ] = useState("");
  const filtered = services.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.description.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary">Browse Services</h1>
        <p className="text-sm text-muted-foreground">150+ services across 5 categories</p>

        <div className="relative max-w-md mt-6">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for a service" className="w-full bg-card rounded-full pl-10 pr-4 py-3 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        <h2 className="font-bold text-primary mt-8 mb-3 text-sm uppercase tracking-wide">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.id} to="/services/$category" params={{ category: c.id }} className="bg-card border border-border rounded-lg p-4 hover:border-primary">
                <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                <div className="font-semibold text-primary text-sm mt-2">{c.label}</div>
              </Link>
            );
          })}
        </div>

        <h2 className="font-bold text-primary mt-10 mb-3 text-sm uppercase tracking-wide">{q ? "Search Results" : "All Services"}</h2>
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
      </main>
    </div>
  );
}
