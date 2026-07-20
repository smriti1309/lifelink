import { HelpCircle, HeartPulse, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function CoordinationTypes() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
          Two Types of Blood Coordination
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          LifeLink addresses both immediate medical requests and inventory replenishment logistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Card 1: Direct Blood Needs */}
        <Card className="hover:border-primary/20 transition-all-300 shadow-premium flex flex-col justify-between">
          <div>
            <CardHeader className="p-8">
              <div className="p-3 w-fit rounded-xl bg-primary-light text-primary border border-primary/20 mb-4 shrink-0">
                <HeartPulse className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold">Direct Blood Requirements</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                For patient transfusions during emergency medical care or planned surgery.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-0 text-sm text-slate-700 leading-relaxed flex flex-col gap-3">
              <p>
                In an acute crisis or operation, patients directly need blood units. The request focuses on matching compatible blood types (such as O- negative for universal, A+ positive, etc.) immediately.
              </p>
              <p>
                LifeLink helps coordinate and push alerts to local registered donors matching the requested blood group, facilitating rapid, direct communication between the seeker family and volunteers.
              </p>
            </CardContent>
          </div>
        </Card>

        {/* Card 2: Replacement Donors */}
        <Card className="hover:border-success/20 transition-all-300 shadow-premium flex flex-col justify-between">
          <div>
            <CardHeader className="p-8">
              <div className="p-3 w-fit rounded-xl bg-success-light text-success border border-success/20 mb-4 shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold">Replacement Donor Coordination</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                To replenish inventory at a hospital's licensed blood bank or storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-0 text-sm text-slate-700 leading-relaxed flex flex-col gap-3">
              <p>
                Hospitals or blood banks often issue blood from their current inventory for a patient but ask the family to arrange matching or alternative donors to restore the reserve stocks.
              </p>
              <p>
                Replacement donors may sometimes be accepted regardless of the patient's exact blood type, as the blood is processed for future usage. This significantly expands the pool of eligible family members and friends who can assist.
              </p>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Hospital check advice note card */}
      <div className="p-5 rounded-xl border border-border bg-slate-50 flex items-start gap-3.5 max-w-4xl mx-auto">
        <HelpCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 text-xs text-muted-foreground leading-relaxed">
          <span className="font-bold text-slate-700">Medical Advisory Note:</span>
          <span>
            Policies regarding replacement donation requirements, accepted blood groups, and eligibility timelines vary. Please consult and confirm the exact guidelines with your attending medical team or the local licensed blood bank coordinator. LifeLink coordinates contacts but does not formulate hospital protocols.
          </span>
        </div>
      </div>
    </section>
  );
}
