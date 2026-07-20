import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { FAQ_ITEMS } from '@/lib/constants/faq';
import { FaqClient } from '@/components/faq/faq-client';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | LifeLink Emergency Blood Platform',
  description:
    'Find answers to common questions about blood donation, emergency requests, donor eligibility, replacement donors, privacy, and how LifeLink works.',
  openGraph: {
    title: 'Frequently Asked Questions | LifeLink Emergency Blood Platform',
    description:
      'Find answers to common questions about blood donation, emergency requests, donor eligibility, replacement donors, privacy, and how LifeLink works.',
    type: 'website',
  },
};

export default function FaqPage() {
  // Dynamically generate FAQPage JSON-LD schema from pure data constants
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* Schema.org FAQPage Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        }
      >
        <FaqClient />
      </Suspense>
    </>
  );
}
