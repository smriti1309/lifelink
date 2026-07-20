'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, Mail, Droplet, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

import { SupportModal } from '@/components/shared/support-modal';

export function FaqHelpCta() {
  const [isSupportModalOpen, setIsSupportModalOpen] = React.useState(false);

  return (
    <>
      <section className="mt-16 md:mt-24 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary/10 via-muted/30 to-primary/5 border border-primary/20 text-center relative overflow-hidden shadow-premium">
        {/* Background Decorative Element */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary shrink-0 shadow-sm">
            <HelpCircle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Still Need Help?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Can&apos;t find the answer you&apos;re looking for? Our team and coordination platform are here to support you.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsSupportModalOpen(true)}
              className="w-full sm:w-auto gap-2 font-semibold shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </Button>

            <Link href={ROUTES.AUTH.NEW_REQUEST} className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto gap-2 font-semibold bg-white dark:bg-card">
                <Droplet className="w-4 h-4 text-primary" />
                <span>Request Blood</span>
              </Button>
            </Link>

            <Link href={ROUTES.AUTH.BECOME_DONOR} className="w-full sm:w-auto">
              <Button variant="secondary" size="md" className="w-full sm:w-auto gap-2 font-semibold">
                <HeartHandshake className="w-4 h-4" />
                <span>Become a Donor</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
}
