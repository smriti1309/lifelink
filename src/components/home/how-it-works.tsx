import { FileSpreadsheet, Users2, Activity } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: FileSpreadsheet,
      title: 'Create a Request',
      description: 'Tell us the blood group, hospital location, urgency level, units required, and whether replacement donors are needed to replenish stock.',
      color: 'bg-primary-light text-primary border-primary/25',
    },
    {
      num: '02',
      icon: Users2,
      title: 'Connect With Donors',
      description: 'LifeLink registers donor details and locations, allowing matching, verified volunteers in your area to respond to requirements quickly.',
      color: 'bg-success-light text-success border-success/25',
    },
    {
      num: '03',
      icon: Activity,
      title: 'Coordinate & Update',
      description: 'Track real-time helper responses and update the request status (e.g., Active, Fulfilled, or Cancelled) once the medical need is met.',
      color: 'bg-slate-100 text-slate-700 border-slate-300',
    },
  ];

  return (
    <section className="bg-muted/30 border-y border-border/30 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
            How LifeLink Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            A simple, organized, and reliable flow to coordinate blood requirements without social media clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connector lines on desktop */}
          <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-border/80 -z-10" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center gap-4 bg-white p-8 rounded-xl border border-border/40 shadow-premium relative">
                {/* Step badge */}
                <span className="absolute top-4 right-4 text-xs font-black text-muted-foreground/30 font-mono tracking-widest">
                  {step.num}
                </span>

                {/* Icon wrapper */}
                <div className={`p-4 rounded-2xl border ${step.color} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
