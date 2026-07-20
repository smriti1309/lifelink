'use client';

import React from 'react';
import { CheckCircle2, Shield, Heart, Zap, Sparkles } from 'lucide-react';
import { WHY_CHOOSE_ITEMS, AboutWhyChooseItem } from '@/lib/constants/about';

export function AboutWhyChoose() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 border-y border-border/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Feature Illustration / Graphic Composition */}
          <div className="lg:col-span-5">
            <div className="relative p-8 rounded-3xl bg-white dark:bg-card border border-border/60 shadow-premium space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-foreground">Built for Emergency Trust</h3>
                  <p className="text-xs text-muted-foreground">Why community members choose LifeLink</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 text-center space-y-1">
                  <Zap className="w-5 h-5 text-primary mx-auto" />
                  <span className="block font-bold text-xs text-foreground">Instant Alerts</span>
                  <span className="text-[10px] text-muted-foreground">Zero delay</span>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 text-center space-y-1">
                  <Shield className="w-5 h-5 text-emerald-600 mx-auto" />
                  <span className="block font-bold text-xs text-foreground">Privacy-First</span>
                  <span className="text-[10px] text-muted-foreground">Protected data</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary-light/50 border border-primary/10 flex items-center gap-3 text-xs font-semibold text-primary">
                <Heart className="w-4 h-4 shrink-0 text-primary" />
                <span>100% Free for donors and emergency blood seekers</span>
              </div>
            </div>
          </div>

          {/* Right Checklist Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Platform Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Why Choose LifeLink
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                LifeLink combines rapid donor notification algorithms with transparent verification workflows to deliver a reliable blood coordination experience.
              </p>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {WHY_CHOOSE_ITEMS.map((item: AboutWhyChooseItem) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-card border border-border/60 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-xs sm:text-sm text-foreground">{item.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-snug">{item.description}</p>
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
