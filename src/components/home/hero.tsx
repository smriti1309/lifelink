import Link from 'next/link';
import { Droplet, Zap, HeartHandshake, ShieldCheck, Heart, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/45 via-background to-background py-16 md:py-24 border-b border-border/20">
      {/* Premium blurred decorative backdrops */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] rounded-full bg-primary/5 blur-3xl opacity-60" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-success/4 blur-3xl opacity-50" />
      
      {/* Decorative Radial Grid / Dot pattern */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Abstract background decorative SVG */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -z-20 pointer-events-none opacity-[0.03] lg:opacity-[0.05] text-primary">
        <svg
          width="400"
          height="400"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[300px] h-[300px] lg:w-[500px] lg:h-[500px]"
        >
          <path
            d="M100 20 C100 20 60 75 60 110 C60 132.09 77.91 150 100 150 C122.09 150 140 132.09 140 110 C140 75 100 20 100 20 Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30 110 H75 L83 95 L92 125 L100 100 L108 115 L115 110 H170"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Content & CTAs */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
            {/* Alert network badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light border border-primary/10 text-xs font-semibold text-primary mb-6 shadow-sm hover:border-primary/20 transition-all-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="tracking-wide">Emergency Blood Coordination Platform</span>
            </div>

            {/* Typography refined Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight max-w-2xl leading-[1.1] mb-6">
              Every Drop Counts.<br />
              <span className="bg-gradient-to-r from-primary via-[#dc2626] to-[#991b1b] bg-clip-text text-transparent">
                Every Second Matters.
              </span>
            </h1>

            {/* Supporting description */}
            <p className="text-base sm:text-lg text-slate-600/90 max-w-xl leading-relaxed mb-8">
              Find blood donors quickly during emergencies and coordinate replacement donors when hospitals need them — all through one trusted platform.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
              <Link href={ROUTES.AUTH.NEW_REQUEST} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-bold px-8 shadow-premium shadow-[0_10px_25px_-5px_rgba(185,28,28,0.25)] bg-primary hover:bg-primary-hover hover:scale-[1.02] text-white gap-2 h-12 transition-all-300">
                  <Droplet className="w-4.5 h-4.5 fill-white text-white shrink-0 animate-pulse" />
                  Need Blood Now
                </Button>
              </Link>
              <Link href={ROUTES.AUTH.BECOME_DONOR} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold px-8 bg-white hover:bg-muted text-foreground h-12 hover:scale-[1.02] transition-all-300">
                  Become a Donor
                </Button>
              </Link>
            </div>

            {/* Trust Indicators subgrid (Desktop/Tablet) */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-3 gap-6 w-full border-t border-border/50 pt-8 mt-2">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-light text-primary border border-primary/10 shrink-0 shadow-sm">
                  <Zap className="w-5 h-5 fill-primary/5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-foreground">Fast Emergency Coordination</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Rapid setup in minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success-light text-success border border-success/10 shrink-0 shadow-sm">
                  <ShieldCheck className="w-5 h-5 fill-success/5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-foreground">Verified Donor Network</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Checked volunteer network</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/60 shrink-0 shadow-sm">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-foreground">Replacement Donor Support</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Replenish bank reserves</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Conceptual Visual Illustration */}
          <div className="md:col-span-5 flex justify-center items-center relative w-full mt-12 md:mt-0 px-4 select-none">
            {/* Soft decorative backdrops */}
            <div className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] rounded-full bg-gradient-to-tr from-primary/10 to-primary-light blur-3xl -z-10 opacity-70" />
            <div className="absolute w-[180px] h-[180px] rounded-full bg-success/5 blur-2xl -z-10 opacity-40 translate-x-12 -translate-y-8" />

            {/* Illustration Canvas */}
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/3] flex items-center justify-center">
              
              {/* SVG Connecting Paths & Pulse Lines */}
              <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <style>{`
                  @keyframes flow {
                    from { stroke-dashoffset: 24; }
                    to { stroke-dashoffset: 0; }
                  }
                  @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  .animate-flow-dash {
                    animation: flow 2s linear infinite;
                  }
                  .animate-spin-slow-custom {
                    animation: spinSlow 15s linear infinite;
                    transform-origin: 200px 105px;
                  }
                  .animate-pulse-slow-custom {
                    transform-origin: 200px 105px;
                  }
                `}</style>

                {/* Base Curved Connection: Donor to Central LifeLink Node */}
                <path
                  d="M 72 165 C 120 165, 150 105, 200 105"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="opacity-[0.12]"
                />
                
                {/* Base Curved Connection: Central LifeLink Node to Care Centers */}
                <path
                  d="M 200 105 C 250 105, 280 165, 328 165"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="opacity-[0.12]"
                />

                {/* Faint ECG / heartbeat line under the center node */}
                <path
                  d="M 120 105 H 155 L 165 85 L 175 125 L 185 95 L 195 115 L 205 105 H 280"
                  stroke="var(--primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-[0.08]"
                />

                {/* Animated dash flow path: Donor -> LifeLink */}
                <path
                  d="M 72 165 C 120 165, 150 105, 200 105"
                  stroke="url(#flow-gradient)"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                  className="animate-flow-dash"
                />

                {/* Animated dash flow path: LifeLink -> Care Centers */}
                <path
                  d="M 200 105 C 250 105, 280 165, 328 165"
                  stroke="url(#flow-gradient)"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                  className="animate-flow-dash"
                />

                {/* Concentric Pulsing Rings in Center */}
                <circle cx="200" cy="105" r="35" stroke="var(--primary)" strokeWidth="1" strokeDasharray="3 3" className="opacity-20 animate-spin-slow-custom" />
                <circle cx="200" cy="105" r="52" stroke="var(--primary)" strokeWidth="0.75" className="opacity-15 animate-pulse-slow animate-pulse-slow-custom" />
                <circle cx="200" cy="105" r="70" stroke="var(--primary)" strokeWidth="0.5" className="opacity-5" />

                {/* Flow Gradient definition */}
                <defs>
                  <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Node 1: The Donor (Left) */}
              <div className="absolute left-[6%] sm:left-[10%] top-[55%] -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 border border-slate-200 shadow-premium flex items-center justify-center transition-all-300 hover:scale-105 hover:shadow-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-50 flex items-center justify-center text-primary">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-primary/10" />
                  </div>
                </div>
                <div className="bg-white/95 border border-border/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] rounded-full px-3 py-1 text-center">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-700 tracking-wide">Ready Donors</span>
                </div>
              </div>

              {/* Node 2: Central LifeLink Coordinator (Center) */}
              <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-primary/10 shadow-2xl flex items-center justify-center transition-all-300 hover:scale-105">
                  {/* Soft gradient background */}
                  <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-primary to-rose-500 opacity-[0.08]" />
                  
                  {/* Central icon circle */}
                  <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl bg-gradient-to-tr from-primary to-rose-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <Droplet className="w-6.5 h-6.5 sm:w-8 sm:h-8 fill-white text-white animate-pulse" />
                  </div>
                  
                  {/* Active coordination indicator */}
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-40"></span>
                    <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-success text-[10px] font-bold text-white items-center justify-center shadow-sm">
                      ✓
                    </span>
                  </span>
                </div>
                <div className="bg-primary-light border border-primary/10 shadow-premium rounded-full px-3.5 py-1 text-center">
                  <span className="text-[10px] sm:text-xs font-bold text-primary tracking-wide uppercase">LifeLink Connect</span>
                </div>
              </div>

              {/* Node 3: The Care Center / Hospital (Right) */}
              <div className="absolute right-[6%] sm:right-[10%] top-[55%] -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 border border-slate-200 shadow-premium flex items-center justify-center transition-all-300 hover:scale-105 hover:shadow-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div className="bg-white/95 border border-border/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] rounded-full px-3 py-1 text-center">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-700 tracking-wide">Care Centers</span>
                </div>
              </div>

              {/* Conceptual floating elements */}
              {/* Floating Element 1: Nearby matches / location indicator */}
              <div className="absolute top-[12%] left-[10%] flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-border/60 shadow-sm rounded-full text-[9px] font-bold text-slate-500 hover:-translate-y-0.5 transition-all-300">
                <MapPin className="w-3 h-3 text-primary" />
                <span>Nearby Matches</span>
              </div>

              {/* Floating Element 2: Secure / verified indicator */}
              <div className="absolute bottom-[10%] right-[10%] flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-border/60 shadow-sm rounded-full text-[9px] font-bold text-slate-500 hover:-translate-y-0.5 transition-all-300">
                <ShieldCheck className="w-3 h-3 text-success" />
                <span>Secure Routing</span>
              </div>

            </div>
          </div>

          {/* Trust Indicators (Mobile stacked, rendered after product visual) */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-3 gap-4 w-full border-t border-border/50 pt-6 mt-8">
            <div className="flex items-center gap-2.5 justify-center">
              <div className="p-1 rounded-lg bg-primary-light text-primary border border-primary/10 shrink-0">
                <Zap className="w-4 h-4 fill-primary/5" />
              </div>
              <span className="text-xs font-bold text-foreground">Fast Emergency Coordination</span>
            </div>
            <div className="flex items-center gap-2.5 justify-center">
              <div className="p-1 rounded-lg bg-success-light text-success border border-success/10 shrink-0">
                <ShieldCheck className="w-4 h-4 fill-success/5" />
              </div>
              <span className="text-xs font-bold text-foreground">Verified Donor Network</span>
            </div>
            <div className="flex items-center gap-2.5 justify-center">
              <div className="p-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/60 shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-foreground">Replacement Donor Support</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
