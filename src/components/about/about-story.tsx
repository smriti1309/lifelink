'use client';

import React from 'react';
import { AlertTriangle, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { STORY_HIGHLIGHTS } from '@/lib/constants/about';

export function AboutStory() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Graphic Composition */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-muted/30 border border-border/50 shadow-sm space-y-6">
              {/* Emergency Callout Card */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-200">The Emergency Reality</h4>
                  <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                    Minutes matter when a patient needs rare blood or replacement units.
                  </p>
                </div>
              </div>

              {/* Time Delay Callout */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-200">The Problem We Solve</h4>
                  <p className="text-xs text-rose-900/80 dark:text-rose-300/80 mt-0.5 leading-relaxed">
                    Eliminating chaotic social media forwards and unorganized contact searches.
                  </p>
                </div>
              </div>

              {/* Solution Callout */}
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-primary text-white shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground">The LifeLink Solution</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Automated, verified, real-time matching connecting ready donors with nearby seekers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Narrative Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Why We Started</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Our Story
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                LifeLink was born out of a simple, critical observation: during medical crises, families face immense anxiety trying to locate compatible blood donors under severe time pressure.
              </p>
            </div>

            {/* Narrative Bullet Cards */}
            <div className="space-y-4 pt-2">
              {STORY_HIGHLIGHTS.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-card border border-border/60 shadow-sm transition-all duration-200 hover:border-primary/30">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
