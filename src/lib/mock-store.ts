// Simple mock store backed by localStorage for prototype only.
import { Fingerprint, Landmark, FileStack, HeartHandshake, Receipt, FileText, IdCard, Car, Droplet, Zap, MessageSquareWarning, Wallet } from "lucide-react";

export type CategoryId = "certificates" | "licenses" | "bills" | "grievances" | "other";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  fee: number; // 0 = free
  requirements: string[];
  documents: string[];
  eligibility: string;
}

export const categories: { id: CategoryId; label: string; icon: any; blurb: string }[] = [
  { id: "certificates", label: "Certificates", icon: FileStack, blurb: "Birth, Death, Community" },
  { id: "licenses", label: "Licenses", icon: IdCard, blurb: "Driving, Trade" },
  { id: "bills", label: "Bills & Payments", icon: Receipt, blurb: "Property, Water, EB" },
  { id: "grievances", label: "Grievances", icon: MessageSquareWarning, blurb: "File / Track Complaints" },
  { id: "other", label: "Other Services", icon: HeartHandshake, blurb: "Pension, Ration, Schemes" },
];

export const services: Service[] = [
  { id: "community-cert", name: "Community Certificate", category: "certificates", fee: 60, description: "Proof of community/caste for reservation benefits.", requirements: ["Indian citizen", "Resident of Tamil Nadu"], documents: ["Aadhaar", "Ration Card", "Parent's community certificate"], eligibility: "Tamil Nadu residents" },
  { id: "birth-cert", name: "Birth Certificate", category: "certificates", fee: 50, description: "Official record of birth.", requirements: ["Birth registered with municipality"], documents: ["Hospital record", "Parent ID"], eligibility: "Anyone born in Tamil Nadu" },
  { id: "income-cert", name: "Income Certificate", category: "certificates", fee: 60, description: "Annual income proof.", requirements: ["Tamil Nadu resident"], documents: ["Aadhaar", "Salary slip / Form 16"], eligibility: "All citizens" },
  { id: "first-grad", name: "First Graduate Certificate", category: "certificates", fee: 0, description: "For first graduates in family.", requirements: ["Currently enrolled in UG"], documents: ["Bonafide", "Parent education declaration"], eligibility: "First graduate students" },
  { id: "driving-license", name: "Driving License", category: "licenses", fee: 700, description: "Apply for new driving license.", requirements: ["Age 18+", "Pass driving test"], documents: ["Aadhaar", "Address proof", "Medical certificate"], eligibility: "Age 18+ with LL" },
  { id: "trade-license", name: "Trade License", category: "licenses", fee: 1500, description: "License to operate business.", requirements: ["Business address proof"], documents: ["Aadhaar", "Property tax receipt"], eligibility: "Business owners" },
  { id: "property-tax", name: "Property Tax", category: "bills", fee: 0, description: "Pay your half-yearly property tax.", requirements: ["Property assessment number"], documents: ["Assessment number"], eligibility: "Property owners" },
  { id: "water-bill", name: "Water Charges", category: "bills", fee: 0, description: "Pay metro water bills.", requirements: ["Consumer number"], documents: ["Consumer number"], eligibility: "Connection holders" },
  { id: "eb-bill", name: "EB Bill Payment", category: "bills", fee: 0, description: "Pay your electricity bill (TANGEDCO).", requirements: ["Service connection number"], documents: ["SC number"], eligibility: "Connection holders" },
  { id: "grievance", name: "File Grievance", category: "grievances", fee: 0, description: "File a complaint to any department.", requirements: ["Valid issue with department"], documents: ["Supporting documents"], eligibility: "All citizens" },
  { id: "pension", name: "Old Age Pension", category: "other", fee: 0, description: "Monthly pension for senior citizens.", requirements: ["Age 60+", "Income below limit"], documents: ["Aadhaar", "Age proof", "Income certificate"], eligibility: "Senior citizens, low income" },
  { id: "ration", name: "Ration Card", category: "other", fee: 0, description: "Apply for new family ration card.", requirements: ["No existing card in family"], documents: ["Aadhaar of all members", "Address proof"], eligibility: "Tamil Nadu families" },
];

export interface Application {
  id: string;
  refNumber: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt: string;
  formData: Record<string, string>;
  paid: boolean;
  fee: number;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  aadhaar: string;
  email: string;
  password: string;
}

const USERS_KEY = "esevai_users";
const SESSION_KEY = "esevai_session";
const APPS_KEY = "esevai_apps";

const safeParse = <T,>(s: string | null, fallback: T): T => {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
};

export const store = {
  getUsers: (): User[] => typeof window === "undefined" ? [] : safeParse(localStorage.getItem(USERS_KEY), []),
  saveUsers: (u: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(u)),
  getSession: (): string | null => typeof window === "undefined" ? null : localStorage.getItem(SESSION_KEY),
  setSession: (id: string) => localStorage.setItem(SESSION_KEY, id),
  clearSession: () => localStorage.removeItem(SESSION_KEY),
  getApps: (): Application[] => typeof window === "undefined" ? [] : safeParse(localStorage.getItem(APPS_KEY), []),
  saveApps: (a: Application[]) => localStorage.setItem(APPS_KEY, JSON.stringify(a)),
};

export const getCurrentUser = (): User | null => {
  const id = store.getSession();
  if (!id) return null;
  return store.getUsers().find((u) => u.id === id) ?? null;
};

export const serviceById = (id: string) => services.find((s) => s.id === id);
export const categoryById = (id: string) => categories.find((c) => c.id === id);

export const genRef = () => "TN" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
