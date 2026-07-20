'use client';

import * as React from 'react';
import Link from 'next/link';
import { Droplet } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { SupportModal } from './support-modal';

export function Footer() {
  const [isSupportModalOpen, setIsSupportModalOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Tagline */}
            <div className="flex flex-col gap-4">
              <Link href={ROUTES.PUBLIC.HOME} className="flex items-center gap-2 text-white hover:opacity-90 transition-all-300">
                <div className="p-1.5 bg-primary/20 rounded-lg border border-primary/30">
                  <Droplet className="w-5 h-5 fill-primary text-primary" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Life<span className="text-primary">Link</span>
                </span>
              </Link>
              <p className="text-xs text-slate-450 leading-relaxed">
                Connecting lives through timely blood coordination during medical emergencies. Real-time coordination and verified donors.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="flex flex-col gap-2 text-xs">
                <li>
                  <Link href={ROUTES.PUBLIC.FIND_DONORS} className="hover:text-white transition-all-300">
                    Find Blood Donors
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.PUBLIC.REQUESTS} className="hover:text-white transition-all-300">
                    Active Emergency Requests
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.PUBLIC.ABOUT} className="hover:text-white transition-all-300">
                    About the Platform
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.PUBLIC.FAQ} className="hover:text-white transition-all-300">
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal / Policy */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Resources</h4>
              <ul className="flex flex-col gap-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setIsSupportModalOpen(true)}
                    className="hover:text-white transition-all-300 text-left cursor-pointer focus:outline-none"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsSupportModalOpen(true)}
                    className="hover:text-white transition-all-300 text-left cursor-pointer focus:outline-none"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <Link href={ROUTES.PUBLIC.PRIVACY} className="hover:text-white transition-all-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.PUBLIC.TERMS} className="hover:text-white transition-all-300">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mission */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Our Mission</h4>
              <p className="text-xs text-slate-450 leading-relaxed">
                We aim to reduce the search time for emergency blood donors to zero. By organizing data and fostering trust, we help save lives, one request at a time.
              </p>
            </div>
          </div>

          <hr className="border-slate-800 my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; {currentYear} LifeLink. All rights reserved.</p>
            <p>Built with trust for emergency healthcare coordination.</p>
          </div>
        </div>
      </footer>

      {/* Support Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
}
