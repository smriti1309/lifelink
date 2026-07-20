'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Droplet, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-muted/20 to-background border-b border-border/30 pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            <Badge variant="primary" className="gap-1.5 py-1 px-3.5 text-xs tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>About LifeLink</span>
            </Badge>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                Connecting Communities.{' '}
                <span className="text-primary block sm:inline">Saving Lives.</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                LifeLink is an emergency blood coordination platform designed to connect blood seekers with eligible donors quickly, securely, and transparently. Our mission is to reduce delays during emergencies by making blood donation coordination simple, reliable, and accessible.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <Link href={ROUTES.AUTH.BECOME_DONOR} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-md">
                  <Heart className="w-4 h-4" />
                  <span>Become a Donor</span>
                </Button>
              </Link>

              <Link href={ROUTES.AUTH.NEW_REQUEST} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 font-bold bg-white dark:bg-card">
                  <Droplet className="w-4 h-4 text-primary" />
                  <span>Request Blood</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Hero Feature Graphic Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none p-6 rounded-3xl bg-white dark:bg-card border border-border/60 shadow-premium">
              {/* Card Header graphic */}
              <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Real-Time Coordination</h3>
                  <p className="text-xs text-muted-foreground">Connecting donors & seekers instantly</p>
                </div>
              </div>

              {/* Graphic badges */}
              <div className="space-y-3 pt-4">
                <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    Verified Donors
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                    Active
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-primary shrink-0" />
                    Emergency Requests
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                    Instant Alert
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/30 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                    Voluntary Community
                  </span>
                  <span className="text-[10px] font-bold text-foreground">100% Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
