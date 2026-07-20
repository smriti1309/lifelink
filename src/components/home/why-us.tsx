import { XOctagon, CheckCircle2, MessageSquareOff, HelpCircle, CalendarOff, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function WhyUs() {
  const challenges = [
    {
      icon: MessageSquareOff,
      title: 'Scattered Communications',
      description: 'Requests are scattered across unorganized WhatsApp chats, Facebook groups, and chain messages, leading to visual clutter.',
    },
    {
      icon: HelpCircle,
      title: 'Unknown Donor Availability',
      description: 'Seeking groups are left calling dozens of outdated numbers, unsure who is actually eligible or ready to donate today.',
    },
    {
      icon: CalendarOff,
      title: 'Stale/Outdated Forwards',
      description: 'Emergency messages are forwarded weeks after patients are discharged, resulting in unnecessary, late calls.',
    },
  ];

  const solutions = [
    {
      icon: CheckCircle2,
      title: 'Structured Requests',
      description: 'Standardized forms capturing precise blood type, hospital location details, dates, and replacement requirements.',
    },
    {
      icon: Activity,
      title: 'Real-time Status Updates',
      description: 'Requests are clearly marked as Active, Fulfilled, or Cancelled so everyone instantly knows if help is still needed.',
    },
    {
      icon: CheckCircle2,
      title: 'Organized Coordination',
      description: 'A single, trusted hub for coordination, enabling verified volunteers to connect without exposing contact details publicly.',
    },
  ];

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
          Why Coordinate via LifeLink?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          LifeLink replaces disorganized search chains with a dedicated emergency blood coordination infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        {/* Left Grid: The Challenges */}
        <div className="flex flex-col gap-6 p-8 rounded-xl bg-slate-50 border border-border">
          <div className="flex items-center gap-2 text-destructive font-black text-sm uppercase tracking-wider mb-2">
            <XOctagon className="w-5 h-5 shrink-0" />
            <span>The Traditional Chaos</span>
          </div>
          
          <div className="flex flex-col gap-6">
            {challenges.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="p-2.5 h-fit rounded-lg bg-destructive-light/10 text-destructive shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Grid: LifeLink Solutions */}
        <div className="flex flex-col gap-6 p-8 rounded-xl bg-white border border-primary/20 shadow-premium relative">
          {/* Subtle brand border highlight */}
          <div className="absolute inset-x-0 top-0 h-1 bg-primary rounded-t-xl" />
          
          <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-5 h-5 fill-primary/10 shrink-0" />
            <span>The LifeLink Solution</span>
          </div>

          <div className="flex flex-col gap-6">
            {solutions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="p-2.5 h-fit rounded-lg bg-primary-light text-primary shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
