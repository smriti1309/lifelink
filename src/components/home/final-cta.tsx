import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

export function FinalCta() {
  return (
    <section className="py-20 bg-gradient-to-t from-primary-light/35 to-background border-t border-border/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
        {/* Heart icon display */}
        <div className="p-4 rounded-full bg-primary-light border border-primary/20 text-primary animate-pulse-slow">
          <Heart className="w-8 h-8 fill-primary" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight max-w-2xl leading-tight">
          Someone's Emergency Could Need You.
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
          By registering as a volunteer blood donor on LifeLink, you make yourself searchable to families in immediate medical need. Your decision today could save a life tomorrow.
        </p>

        {/* Double CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
          <Link href={ROUTES.AUTH.BECOME_DONOR} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto font-bold px-8 shadow-premium bg-primary hover:bg-primary-hover text-white gap-2">
              <Heart className="w-4 h-4 fill-white" />
              Become a Donor
            </Button>
          </Link>
          <Link href={ROUTES.PUBLIC.FIND_DONORS} className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold px-8 bg-white hover:bg-muted text-foreground gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              Find Blood Donors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
