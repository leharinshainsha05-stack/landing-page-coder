import { createFileRoute, Link, redirect, notFound } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentUser, store } from "@/lib/mock-store";
import { StatusBadge } from "./dashboard";
import { CheckCircle2, Clock, Download, XCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/track/$refNumber")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getCurrentUser()) throw redirect({ to: "/login" });
  },
  component: TrackDetail,
});

function TrackDetail() {
  const { refNumber } = Route.useParams();
  const user = getCurrentUser()!;
  const [tick, setTick] = useState(0);
  const app = store.getApps().find((a) => a.refNumber === refNumber && a.userId === user.id);
  if (!app) throw notFound();

  const setStatus = (status: "pending" | "approved" | "rejected", reason?: string) => {
    const apps = store.getApps().map((a) => a.refNumber === refNumber ? { ...a, status, rejectionReason: reason } : a);
    store.saveApps(apps);
    setTick(tick + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/track" className="text-xs text-muted-foreground hover:text-primary">← All applications</Link>
        <div className="flex items-center justify-between mt-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">{app.serviceName}</h1>
            <p className="text-xs text-muted-foreground font-mono">Ref: {app.refNumber}</p>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="mt-6 bg-card border border-border rounded-lg p-5 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-primary">Submitted</div>
              <div className="text-xs text-muted-foreground">{new Date(app.submittedAt).toLocaleString()}</div>
            </div>
          </div>
          {app.fee > 0 && (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-primary">Payment Received</div>
                <div className="text-xs text-muted-foreground">₹{app.fee} paid</div>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            {app.status === "pending" && <Clock className="w-5 h-5 text-amber-600 mt-0.5" />}
            {app.status === "approved" && <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />}
            {app.status === "rejected" && <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
            <div>
              <div className="text-sm font-medium text-primary capitalize">
                {app.status === "pending" ? "Under Review" : app.status}
              </div>
              {app.status === "pending" && <div className="text-xs text-muted-foreground">Your application is being processed. You'll be notified.</div>}
              {app.status === "rejected" && app.rejectionReason && <div className="text-xs text-red-700 mt-1">Reason: {app.rejectionReason}</div>}
            </div>
          </div>
        </div>

        {app.status === "approved" && (
          <button onClick={() => alert("Demo: Certificate downloaded.")} className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm inline-flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Certificate
          </button>
        )}

        {app.status === "rejected" && (
          <div className="mt-4 flex gap-2">
            <Link to="/services/$category/$serviceId" params={{ category: "certificates", serviceId: app.serviceId }} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">Reapply</Link>
            <Link to="/dashboard" className="bg-card border border-border text-primary px-4 py-2 rounded-md text-sm">Back to Dashboard</Link>
          </div>
        )}

        {/* Demo controls — simulate department actions */}
        <details className="mt-8 text-xs">
          <summary className="cursor-pointer text-muted-foreground">Demo controls (simulate status change)</summary>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setStatus("approved")} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded">Approve</button>
            <button onClick={() => setStatus("rejected", "Incomplete documents.")} className="px-3 py-1 bg-red-100 text-red-800 rounded">Reject</button>
            <button onClick={() => setStatus("pending")} className="px-3 py-1 bg-amber-100 text-amber-800 rounded">Pending</button>
          </div>
        </details>
      </main>
    </div>
  );
}
