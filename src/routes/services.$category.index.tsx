import { createFileRoute, Link, redirect, notFound } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { categoryById, services, getCurrentUser } from "@/lib/mock-store";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/services/$category/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getCurrentUser()) throw redirect({ to: "/login" });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = categoryById(category);
  if (!cat) throw notFound();
  const list = services.filter((s) => s.category === cat.id);
  const Icon = cat.icon;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/services" className="text-xs text-muted-foreground hover:text-primary">← All categories</Link>
        <div className="flex items-center gap-3 mt-4">
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">{cat.label}</h1>
            <p className="text-xs text-muted-foreground">{cat.blurb}</p>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          {list.map((s) => (
            <Link key={s.id} to="/services/$category/$serviceId" params={{ category: cat.id, serviceId: s.id }} className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:border-primary">
              <div>
                <div className="font-semibold text-sm text-primary">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.description}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-primary">{s.fee === 0 ? "Free" : `₹${s.fee}`}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
