import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search, Play, Fingerprint, Landmark, FileStack, HeartHandshake, Receipt,
  Linkedin, Instagram, Facebook, Twitter, Globe, Upload, Star,
} from "lucide-react";
import heroWoman from "@/assets/hero-woman.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "National Government Services Portal" },
      { name: "description", content: "Access over 150 government services like Community Certificates, Income, Nativity, and First Graduate certificates directly from your home." },
    ],
  }),
  component: Index,
});

const categories = [
  { label: "Personal\nIdentity", icon: Fingerprint },
  { label: "Revenue\nServices", icon: Landmark },
  { label: "Community\n& Caste", icon: FileStack, active: true },
  { label: "Social\nWelfare", icon: HeartHandshake },
  { label: "Utility\nPayments", icon: Receipt },
];

const steps = [
  { n: "Step 01: Discover:", t: "Search for your required service or browse our 5 core categories." },
  { n: "Step 02: Explore:", t: "Hover over a card to view the top 3 services or click 'Learn More' for full details." },
  { n: "Step 03: Apply:", t: "Click on your specific service to be taken to the dedicated application page." },
  { n: "Step 04: Track Progress:", t: 'Use the "Track Application" button to see exactly where your certificate is at any time.' },
];

const testimonials = [
  { name: "Arun Kumar S", loc: "Chennai", color: "bg-orange-400", stars: 5, text: "The new portal has completely transformed how I access services. I applied for my First Graduate Certificate from home in just minutes. The tracking system is precise and saved me three trips to the center. The interface is remarkably intuitive, making complex government procedures feel simple and accessible. It's not just a website; it's a bridge to a more efficient digital future for every citizen of Tamil Nadu. Truly a citizen-first design!" },
  { name: "Meera", loc: "Coimbatore", color: "bg-emerald-500", stars: 5, text: "The new integrated map search is a lifesaver. I tracked my Community Certificate from my phone and found my nearest office in seconds. Digital governance at its best—fast and reliable." },
  { name: "Lakshmi", loc: "Thanjavur", color: "bg-pink-300", stars: 5, text: "As a retiree, I used to depend on others to visit government offices for me. Now, I can apply for my Senior Citizen Certificate from my living room. The font is clear, the navigation is simple, and the voice-assisted features thoughtful touch. It has given me back my independence in managing my affairs. Truly a breakthrough for people ages." },
  { name: "Priya", loc: "Trichy", color: "bg-red-500", stars: 4, text: "A massive step forward for Digital Tamil Nadu. I renewed my OBC Certificate seamlessly. The UI is world-class and the speed is unmatched. Highly recommended!" },
  { name: "Abdul", loc: "Salem", color: "bg-violet-500", stars: 4, text: "Downloaded my Income Certificate in record time. The interface is intuitive makes everything just a click away. A truly seamless experience!" },
  { name: "Naveen", loc: "Erode", color: "bg-pink-500", stars: 4, text: "As a student, getting my First Graduate Certificate was a priority. The digital signature and instant download tech-forward governance we need!" },
];

function Octagon({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-28 h-32 sm:w-36 sm:h-40 text-center px-2 transition-all ${active ? "bg-primary text-primary-foreground scale-110" : "bg-secondary text-primary"}`}
      style={{ clipPath: "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)" }}
    >
      {children}
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="px-6 md:px-16 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div className="text-primary font-bold text-xs sm:text-sm leading-tight">
            NATIONAL GOVERNMENT<br />SERVICES PORTAL
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-10 text-primary text-sm font-medium">
          <a href="#about" className="hover:opacity-70">About</a>
          <a href="#service" className="hover:opacity-70">Service</a>
          <a href="#demo" className="hover:opacity-70">Demo</a>
        </nav>
        <div className="text-primary text-xs sm:text-sm font-medium">23-02-2026 17:33</div>
      </header>

      <section className="px-6 md:px-16 pt-8 pb-20 grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
        <div className="space-y-5">
          <p className="text-primary text-lg">
            <span className="font-bold">Search for</span>{" "}
            <span className="tracking-wide">GOVERNMENT SERVICES</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
            Need a Community Certificate?<br />Want to pay your EB bill?
          </h1>
          <div className="text-primary/90 space-y-1 text-sm">
            <p>You're in the right place.</p>
            <p>Access over 150 government services like Income, Nativity, and First Graduate certificates directly from your home.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Link to="/services" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90">Explore All Services</Link>
            <Link to="/track" className="bg-card border border-primary/30 text-primary px-5 py-2.5 rounded-md text-sm font-medium hover:bg-secondary">Track Application</Link>
          </div>
        </div>
        <div className="flex justify-center">
          <img src={heroWoman} alt="Government services assistant" width={500} height={650} className="max-h-[500px] w-auto drop-shadow-xl" />
        </div>
      </section>

      <section id="service" className="px-6 md:px-16 py-12 text-center">
        <h2 className="text-3xl font-bold text-primary">What we Provide?</h2>
        <p className="text-primary/80 mt-2 text-sm">Transparent, secure, and always accessible.</p>
        <p className="text-primary/80 text-sm">Your direct link to essential civic services</p>

        <div className="max-w-md mx-auto mt-6 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search for Service" className="w-full bg-card rounded-full pl-10 pr-10 py-3 text-sm shadow-sm border border-border focus:outline-none" />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-10">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Octagon key={c.label} active={c.active}>
                <div className="text-[10px] sm:text-xs font-bold whitespace-pre-line leading-tight mb-2">{c.label}</div>
                <Icon className="w-7 h-7 sm:w-9 sm:h-9" strokeWidth={1.3} />
              </Octagon>
            );
          })}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-primary/30" />
          <span className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
      </section>

      <section id="demo" className="px-6 md:px-16 py-12 grid md:grid-cols-2 gap-10 max-w-6xl mx-auto items-center">
        <div className="aspect-square bg-black rounded-lg flex items-center justify-center">
          <Play className="w-16 h-16 text-white/80" fill="currentColor" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary mb-5">How it Work ?</h2>
          <ul className="space-y-3 text-sm">
            {steps.map((s) => (
              <li key={s.n}>
                <span className="font-bold text-primary">{s.n}</span>{" "}
                <span className="text-foreground/80">{s.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 md:px-16 py-12 grid md:grid-cols-2 gap-10 max-w-6xl mx-auto items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-5">Find e-Sevai Center<br />Near YOU</h2>
          <div className="space-y-3 max-w-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Select District" className="w-full bg-card rounded pl-9 pr-3 py-2 text-sm border border-border focus:outline-none" />
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Select Taluk/Area" className="w-full bg-card rounded pl-9 pr-3 py-2 text-sm border border-border focus:outline-none" />
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium">View on Map</button>
          </div>
        </div>
        <div className="aspect-square rounded-lg overflow-hidden border border-border">
          <iframe title="Map" className="w-full h-full" src="https://maps.google.com/maps?q=Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed" />
        </div>
      </section>

      <section className="px-6 md:px-16 py-12 text-center">
        <h2 className="text-2xl font-bold text-primary">Words from our Citizens</h2>
        <p className="text-primary/80 mt-2 max-w-md mx-auto text-sm">
          Hear directly from the people who are experiencing a faster, simpler way to access government services
        </p>

        <div className="mt-10 bg-primary p-4 sm:p-6 rounded-lg max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card rounded-md p-4 text-left">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${t.color}`} />
                    <div>
                      <p className="text-sm font-semibold text-primary">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.loc}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < t.stars ? "fill-foreground text-foreground" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-2">
                  <p className="text-xs text-foreground/80 leading-relaxed">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-primary">Need assistance with<br />your application?</h2>
        <p className="text-primary/80 mt-3 text-sm">
          Our 24/7 help desk is here to guide you through<br />every step of the process.
        </p>
        <button className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium">
          Get Assistance <Upload className="w-4 h-4" />
        </button>
      </section>

      <footer id="about" className="px-6 md:px-16 py-10 grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div className="text-primary font-bold text-xs leading-tight">
              NATIONAL GOVERNMENT<br />SERVICES PORTAL
            </div>
          </div>
          <p className="text-primary/80 text-sm max-w-md">
            Empowering every citizen with seamless, transparent, and digital-first government services. Access over 150+ essential services directly from your home, designed for a faster, simpler Tamil Nadu.
          </p>
          <div className="flex gap-3 mt-4 text-primary">
            <Linkedin className="w-5 h-5" /><Instagram className="w-5 h-5" /><Facebook className="w-5 h-5" /><Twitter className="w-5 h-5" /><Globe className="w-5 h-5" />
          </div>
        </div>
        <div className="md:text-right space-y-3 text-sm text-primary self-end">
          <div className="flex flex-wrap md:justify-end gap-6">
            <a href="#">Home</a><a href="#about">About</a><a href="#service">Service</a><a href="#demo">Demo</a><a href="#">Contact</a>
          </div>
          <div className="flex flex-wrap md:justify-end gap-6">
            <a href="#">Privacy Policy</a><a href="#">Terms OfService</a><a href="#">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
