import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants/routes';

export function EmergencyAction() {
  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="border-primary/20 bg-primary-light/10 shadow-premium-lg">
        <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-4 md:gap-5 flex-1">
            <div className="p-3.5 rounded-2xl bg-primary-light border border-primary/20 text-primary shrink-0">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                Need Blood Urgently?
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
                Create an emergency coordination request to connect with local donors. Specify the required blood type, number of units, location, hospital details, and replacement donor requirements. It takes less than 2 minutes to publish.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
            <Link href={ROUTES.AUTH.NEW_REQUEST} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-bold shadow-premium bg-primary hover:bg-primary-hover text-white px-6">
                Create Emergency Request
              </Button>
            </Link>
            <Link href={ROUTES.PUBLIC.REQUESTS} className="w-full sm:w-auto text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-all-300 py-2">
              <span>View Active Requests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
