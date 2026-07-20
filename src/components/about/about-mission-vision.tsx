'use client';

import React from 'react';
import { Target, Eye, CheckCircle } from 'lucide-react';
import { MISSION_HIGHLIGHTS } from '@/lib/constants/about';

export function AboutMissionVision() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 border-y border-border/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Our Mission</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Fast, Reliable & Transparent Blood Coordination
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Our mission is to eliminate life-threatening delays during medical emergencies by providing an efficient digital platform that connects seekers directly with willing, eligible blood donors.
            </p>

            <ul className="space-y-3 pt-2">
              {MISSION_HIGHLIGHTS.map((text, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-card border border-border/60 shadow-premium space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mx-auto sm:mx-0">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-foreground">Why Speed & Verification Matter</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                In critical healthcare situations, having verified donor blood group compatibility and real-time availability saves crucial time. LifeLink standardizes the coordination process, ensuring seekers get responsive help without chaos.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Banner Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-muted/20 border border-primary/20 relative overflow-hidden text-center max-w-4xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 mx-auto mb-4 shadow-sm">
            <Eye className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">Our Vision</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-4">
            A Future Where No One Waits for Blood
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We envision a world where every medical emergency is met with instant, community-driven support—creating stronger, healthier societies through voluntary blood donation, faster emergency coordination, and trusted digital healthcare support.
          </p>
        </div>
      </div>
    </section>
  );
}
