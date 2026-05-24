import { createFileRoute, Link, redirect, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { serviceById, getCurrentUser, store, genRef, type Application } from "@/lib/mock-store";
import { CheckCircle2, Upload, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/services/$category/$serviceId")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getCurrentUser()) throw redirect({ to: "/login" });
  },
  component: ServiceDetailPage,
});

type Stage = "details" | "form" | "review" | "payment" | "submitted";

function ServiceDetailPage() {
  const { serviceId } = Route.useParams();
  const router = useRouter();
  const service = serviceById(serviceId);
  if (!service) throw notFound();
  const user = getCurrentUser()!;

  const [stage, setStage] = useState<Stage>("details");
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [form, setForm] = useState({ fullName: user.name, mobile: user.mobile, address: "", purpose: "" });
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [refNumber, setRefNumber] = useState("");
  const [payError, setPayError] = useState("");

  const submitApplication = (paid: boolean) => {
    const ref = genRef();
    const app: Application = {
      id: crypto.randomUUID(),
      refNumber: ref,
      serviceId: service.id,
      serviceName: service.name,
      userId: user.id,
      status: "pending",
      submittedAt: new Date().toISOString(),
      formData: form,
      paid,
      fee: service.fee,
    };
    const apps = store.getApps();
    apps.push(app);
    store.saveApps(apps);
    setRefNumber(ref);
    setStage("submitted");
  };

  const handleProceedAfterReview = () => {
    if (service.fee > 0) setStage("payment");
    else submitApplication(true);
  };

  const tryPay = (success: boolean) => {
    if (success) submitApplication(true);
    else setPayError("Payment failed. Please retry.");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/services/$category" params={{ category: service.category }} className="text-xs text-muted-foreground hover:text-primary">← Back</Link>
        <h1 className="text-2xl font-bold text-primary mt-3">{service.name}</h1>
        <p className="text-sm text-muted-foreground">{service.description}</p>

        {stage === "details" && (
          <div className="mt-6 space-y-5">
            <Section title="Eligibility">{service.eligibility}</Section>
            <Section title="Requirements"><ul className="list-disc pl-5 space-y-1">{service.requirements.map((r) => <li key={r}>{r}</li>)}</ul></Section>
            <Section title="Documents Required"><ul className="list-disc pl-5 space-y-1">{service.documents.map((d) => <li key={d}>{d}</li>)}</ul></Section>
            <Section title="Fee">{service.fee === 0 ? "Free" : `₹${service.fee}`}</Section>

            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-primary mb-3">Do you meet the eligibility criteria?</p>
              <div className="flex gap-2">
                <button onClick={() => { setEligible(true); setStage("form"); }} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">Yes, I'm Eligible — Apply</button>
                <button onClick={() => setEligible(false)} className="bg-card border border-border text-primary px-4 py-2 rounded-md text-sm">Not Sure</button>
              </div>
              {eligible === false && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-secondary rounded text-xs text-primary">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>Please review the requirements and documents above. <Link to="/dashboard" className="underline">Back to Dashboard</Link></div>
                </div>
              )}
            </div>
          </div>
        )}

        {stage === "form" && (
          <form onSubmit={(e) => { e.preventDefault(); setStage("review"); }} className="mt-6 space-y-4">
            <Stepper current={1} />
            <h2 className="font-bold text-primary">Application Form</h2>
            <Field label="Full Name"><input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" /></Field>
            <Field label="Mobile"><input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" /></Field>
            <Field label="Address"><textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" /></Field>
            <Field label="Purpose / Reason"><input required value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm" /></Field>

            <Field label="Upload Documents">
              <div className="space-y-2">
                {service.documents.map((d) => (
                  <label key={d} className="flex items-center justify-between bg-card border border-border rounded p-3 text-xs cursor-pointer hover:border-primary">
                    <span className="text-primary">{d}</span>
                    <span className="flex items-center gap-2">
                      {uploaded.includes(d) ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Upload className="w-4 h-4 text-muted-foreground" />}
                      <input type="file" className="hidden" onChange={() => setUploaded([...uploaded, d])} />
                      <span className="text-primary underline">{uploaded.includes(d) ? "Uploaded" : "Choose file"}</span>
                    </span>
                  </label>
                ))}
              </div>
            </Field>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStage("details")} className="bg-card border border-border text-primary px-4 py-2 rounded-md text-sm">Back</button>
              <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">Review</button>
            </div>
          </form>
        )}

        {stage === "review" && (
          <div className="mt-6 space-y-4">
            <Stepper current={2} />
            <h2 className="font-bold text-primary">Review Application</h2>
            <div className="bg-card border border-border rounded-lg p-4 text-sm space-y-2">
              <Row label="Service" value={service.name} />
              <Row label="Full Name" value={form.fullName} />
              <Row label="Mobile" value={form.mobile} />
              <Row label="Address" value={form.address} />
              <Row label="Purpose" value={form.purpose} />
              <Row label="Documents" value={`${uploaded.length} uploaded`} />
              <Row label="Fee" value={service.fee === 0 ? "Free" : `₹${service.fee}`} />
            </div>
            <p className="text-xs text-muted-foreground">Please verify all information is correct.</p>
            <div className="flex gap-2">
              <button onClick={() => setStage("form")} className="bg-card border border-border text-primary px-4 py-2 rounded-md text-sm">Edit</button>
              <button onClick={handleProceedAfterReview} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                {service.fee > 0 ? "Proceed to Payment" : "Submit Application"}
              </button>
            </div>
          </div>
        )}

        {stage === "payment" && (
          <div className="mt-6 space-y-4">
            <Stepper current={3} />
            <h2 className="font-bold text-primary">Payment</h2>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex justify-between text-sm"><span>Amount Due</span><span className="font-bold text-primary">₹{service.fee}</span></div>
            </div>
            <p className="text-xs text-muted-foreground">Choose a payment method (demo mode)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["UPI", "Card", "Net Banking"].map((m) => <div key={m} className="bg-card border border-border rounded-md p-3 text-center text-xs text-primary">{m}</div>)}
            </div>
            {payError && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded flex items-center justify-between">
                <span>{payError}</span>
                <button onClick={() => router.navigate({ to: "/dashboard" })} className="underline">Cancel</button>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => tryPay(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">Pay ₹{service.fee} (Success)</button>
              <button onClick={() => tryPay(false)} className="bg-card border border-border text-primary px-4 py-2 rounded-md text-sm">Simulate Failure</button>
            </div>
          </div>
        )}

        {stage === "submitted" && (
          <div className="mt-6 text-center bg-card border border-border rounded-lg p-8">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-primary mt-4">Application Submitted</h2>
            <p className="text-sm text-muted-foreground mt-2">Your acknowledgement reference is</p>
            <p className="font-mono text-lg font-bold text-primary mt-1">{refNumber}</p>
            <p className="text-xs text-muted-foreground mt-3">Save this number to track your application status.</p>
            <div className="flex gap-2 justify-center mt-6">
              <Link to="/track/$refNumber" params={{ refNumber }} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">Track Application</Link>
              <Link to="/services" className="bg-card border border-border text-primary px-4 py-2 rounded-md text-sm">Apply for More</Link>
              <Link to="/dashboard" className="bg-card border border-border text-primary px-4 py-2 rounded-md text-sm">Dashboard</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="text-xs uppercase font-semibold text-muted-foreground mb-2">{title}</div>
      <div className="text-sm text-primary">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-primary mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">{label}</span><span className="text-primary text-right">{value}</span></div>;
}

function Stepper({ current }: { current: number }) {
  const steps = ["Form", "Review", "Payment"];
  return (
    <div className="flex gap-2 mb-2">
      {steps.map((s, i) => (
        <div key={s} className="flex-1">
          <div className={`h-1 rounded ${i + 1 <= current ? "bg-primary" : "bg-secondary"}`} />
          <div className="text-[10px] text-muted-foreground mt-1">{s}</div>
        </div>
      ))}
    </div>
  );
}
