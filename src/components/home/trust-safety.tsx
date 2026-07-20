import { Shield, ShieldAlert, BadgeCheck, FileCheck2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function TrustSafety() {
  const items = [
    {
      icon: BadgeCheck,
      title: 'Admin-Verified Donors',
      description: 'Volunteer donor profiles can be verified by our coordination administrators to increase community trust and database validity.',
    },
    {
      icon: FileCheck2,
      title: 'Clear Request Status',
      description: 'Requests specify patient requirements and timestamps, preventing stale information forwards and late calls.',
    },
    {
      icon: ShieldAlert,
      title: 'Medical Verification Always Required',
      description: 'Donation eligibility and transfusion details must always be verified by certified healthcare professionals or licensed blood bank staff.',
    },
  ];

  return (
    <section className="bg-muted/30 border-y border-border/30 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700 mx-auto border border-border">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span>Community Guidelines</span>
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl mt-2">
            Built Around Trust &amp; Safety
          </h2>
          <p className="text-sm text-muted-foreground">
            LifeLink functions as a coordination network. We enforce safety checkpoints and clear disclaimers for seeker and donor connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="border-border bg-white shadow-premium">
                <CardContent className="p-8 flex flex-col gap-4 text-center items-center">
                  <div className="p-3 rounded-full bg-slate-50 text-slate-700 border border-border shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Legal disclaimer banner */}
        <div className="mt-12 text-center max-w-2xl mx-auto text-xs text-muted-foreground leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> LifeLink does not store, issue, or test blood units. We are not a medical provider, licensed blood bank, or clinic. Our platform facilitates communication between seekers and volunteer donors. All donation screenings, procedures, and transfusions are conducted exclusively under the direct supervision of licensed medical facilities and professionals.
          </p>
        </div>
      </div>
    </section>
  );
}
