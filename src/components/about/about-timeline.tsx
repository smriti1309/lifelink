'use client';

import React from 'react';
import { FileText, Bell, PhoneCall, CheckCircle, ArrowRight } from 'lucide-react';
import { HOW_LIFELINK_WORKS, AboutTimelineStep } from '@/lib/constants/about';

const TIMELINE_ICONS = {
  'file-text': FileText,
  bell: Bell,
  'phone-call': PhoneCall,
  'check-circle': CheckCircle,
};

export function AboutTimeline() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Simple & Transparent</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How LifeLink Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Our streamlined four-step workflow ensures rapid alert dispatch, privacy protection, and confirmed donation recording.
          </p>
        </div>

        {/* Timeline Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {HOW_LIFELINK_WORKS.map((step: AboutTimelineStep, idx: number) => {
            const Icon = TIMELINE_ICONS[step.icon];
            const isLast = idx === HOW_LIFELINK_WORKS.length - 1;

            return (
              <div
                key={step.step}
                className="relative group p-6 rounded-3xl bg-white dark:bg-card border border-border/60 shadow-sm hover:shadow-premium hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      {Icon ? <Icon className="w-6 h-6" /> : step.step}
                    </div>
                    <span className="text-2xl font-black text-muted-foreground/30 font-mono">
                      0{step.step}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow Connector for Desktop (Hidden on Last Step & Mobile) */}
                {!isLast && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-card border border-border text-muted-foreground items-center justify-center shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
