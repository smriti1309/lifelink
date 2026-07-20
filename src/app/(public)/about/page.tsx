import React from 'react';
import { Metadata } from 'next';
import { AboutHero } from '@/components/about/about-hero';
import { AboutStory } from '@/components/about/about-story';
import { AboutMissionVision } from '@/components/about/about-mission-vision';
import { AboutTimeline } from '@/components/about/about-timeline';
import { AboutWhyChoose } from '@/components/about/about-why-choose';
import { AboutValues } from '@/components/about/about-values';
import { FaqPreview } from '@/components/home/faq-preview';
import { AboutCta } from '@/components/about/about-cta';

export const metadata: Metadata = {
  title: 'About Us | LifeLink Emergency Blood Platform',
  description:
    'Learn how LifeLink connects blood seekers with eligible donors quickly, securely, and transparently during medical emergencies.',
  openGraph: {
    title: 'About Us | LifeLink Emergency Blood Platform',
    description:
      'Learn how LifeLink connects blood seekers with eligible donors quickly, securely, and transparently during medical emergencies.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 1. Hero Section */}
      <AboutHero />

      {/* 2. Our Story Section */}
      <AboutStory />

      {/* 3. Mission & Vision Section */}
      <AboutMissionVision />

      {/* 4. How LifeLink Works (4-Step Timeline) */}
      <AboutTimeline />

      {/* 5. Why Choose LifeLink */}
      <AboutWhyChoose />

      {/* 6. Core Values */}
      <AboutValues />

      {/* 7. FAQ Preview (Reused from Homepage) */}
      <FaqPreview />

      {/* 8. Final Call to Action */}
      <AboutCta />
    </main>
  );
}
