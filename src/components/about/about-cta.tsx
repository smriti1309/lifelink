'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Droplet, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

export function AboutCta() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/20 to-primary/5 border-t border-border/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-white dark:via-card to-primary/5 border border-primary/20 shadow-premium relative overflow-hidden space-y-6">
          {/* Background Decorative Blur */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Our Mission</span>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Together We Can Save Lives
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Whether you&apos;re donating blood or requesting help during an emergency, every action contributes to building a stronger and more compassionate community.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 w-full sm:w-auto">
            <Link href={ROUTES.AUTH.BECOME_DONOR} className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-md">
                <Heart className="w-4 h-4" />
                <span>Become a Donor</span>
              </Button>
            </Link>

            <Link href={ROUTES.AUTH.NEW_REQUEST} className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 font-bold">
                <Droplet className="w-4 h-4" />
                <span>Request Blood</span>
              </Button>
            </Link>

            <Link href={ROUTES.PUBLIC.FAQ} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 font-bold bg-white dark:bg-card">
                <HelpCircle className="w-4 h-4" />
                <span>Browse FAQs</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
