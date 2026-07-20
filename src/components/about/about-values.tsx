'use client';

import React from 'react';
import { Heart, ShieldCheck, Zap, Users, Award } from 'lucide-react';
import { CORE_VALUES, AboutCoreValue } from '@/lib/constants/about';

const VALUE_ICONS = {
  heart: Heart,
  'shield-check': ShieldCheck,
  zap: Zap,
  users: Users,
  award: Award,
};

export function AboutValues() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">What Drives Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Our Core Values
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            The principles that guide our platform development, donor relations, and emergency coordination.
          </p>
        </div>

        {/* 5 Values Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_VALUES.map((val: AboutCoreValue) => {
            const Icon = VALUE_ICONS[val.icon];

            return (
              <div
                key={val.id}
                className="p-6 rounded-3xl bg-white dark:bg-card border border-border/60 shadow-sm hover:shadow-premium hover:border-primary/40 transition-all duration-300 space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                  {Icon && <Icon className="w-6 h-6" />}
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-base text-foreground">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
