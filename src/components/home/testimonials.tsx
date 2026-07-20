import { Quote, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

interface Testimonial {
  quote: string;
  name: string;
  role: 'Seeker' | 'Volunteer Donor' | 'Medical Coordinator';
  location: string;
}

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    quote: "When my father needed surgery and the hospital asked for replacement donors to replenish blood reserves, we were overwhelmed. LifeLink helped us organize the request and share a structured page with our network. Two colleagues stepped forward and donated.",
    name: "Marcus A.",
    role: "Seeker",
    location: "Springfield, IL",
  },
  {
    quote: "I registered as a donor to give back. Last month, I received an active request alert for an O- negative request near my district. The platform allowed me to coordinate details with the family securely. The process at the hospital was quick and safe.",
    name: "Sarah T.",
    role: "Volunteer Donor",
    location: "Metropolis, NY",
  },
  {
    quote: "Coordinating blood needs during emergency medical admissions is stressful for families. Having a structured platform like LifeLink helps families share accurate details, hospital contacts, and statuses, instead of outdated, messy chat chains.",
    name: "Dr. David L.",
    role: "Medical Coordinator",
    location: "Oakville, CA",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
          Community Stories
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Feedback and coordination experiences from our volunteer network and seekers.
        </p>
      </div>

      {/* Demo notice alert */}
      <div className="mb-8 p-3 rounded-lg bg-slate-100 border border-border text-muted-foreground text-xs flex items-center gap-2 max-w-xl mx-auto">
        <Info className="w-4 h-4 shrink-0 text-slate-500" />
        <span>Stories below are illustrative mockup representations of seeking and donating coordination.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MOCK_TESTIMONIALS.map((t, idx) => {
          return (
            <Card key={idx} className="border-border/60 bg-white shadow-premium flex flex-col justify-between">
              <CardContent className="p-8 flex flex-col gap-6 h-full justify-between">
                {/* Quote details */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-primary/10 absolute -top-4 -left-4 -z-10" />
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed relative">
                    "{t.quote}"
                  </p>
                </div>

                {/* User info */}
                <div className="flex items-center gap-3 border-t border-border/40 pt-4">
                  <Avatar fallback={t.name[0]} alt={t.name} size="sm" className="bg-primary-light text-primary" />
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="text-xs font-bold text-foreground">{t.name}</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-muted-foreground">{t.location}</span>
                      <span className="text-[10px] text-slate-300">&bull;</span>
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 bg-slate-50 border-border text-foreground select-none">
                        {t.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
