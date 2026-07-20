'use client';

import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Check, Copy, Info, Headphones } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const supportEmail = 'support@lifelink-demo.org';
  const supportPhone = '+91 98765 43210';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleReportIssue = () => {
    setToastMessage('This feature will be available in a future version of LifeLink.');
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={true}
      footer={
        <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReportIssue}
            className="w-full sm:w-auto font-semibold text-xs py-2 px-4 justify-center"
          >
            Report an Issue
          </Button>

          <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyEmail}
              className="w-full sm:w-auto gap-2 font-semibold text-xs py-2 px-4 justify-center"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">✓ Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span>Copy Email</span>
                </>
              )}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
              className="w-full sm:w-auto font-bold text-xs py-2 px-5 justify-center shadow-sm"
            >
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 py-1">
        {/* Centered Header */}
        <div className="flex flex-col items-center text-center space-y-2 max-w-lg mx-auto pt-1">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-xs mb-1">
            <Headphones className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Contact LifeLink Support
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Need assistance or have a question? Our support team is here to help with platform-related queries, blood donation guidance, and emergency request support.
          </p>
        </div>

        {/* Toast Notification for "Report an Issue" */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xs">
            <Info className="w-4 h-4 shrink-0 text-primary" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Support Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Email Card */}
          <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-1 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span>Email</span>
            </div>
            <a
              href={`mailto:${supportEmail}`}
              className="font-bold text-foreground hover:text-primary transition-colors block text-xs sm:text-sm pt-0.5 truncate focus:outline-none focus:ring-1 focus:ring-primary rounded"
            >
              {supportEmail}
            </a>
          </div>

          {/* Phone Card */}
          <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-1 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span>Phone</span>
            </div>
            <a
              href={`tel:${supportPhone.replace(/\s+/g, '')}`}
              className="font-bold text-foreground hover:text-primary transition-colors block text-xs sm:text-sm pt-0.5 truncate focus:outline-none focus:ring-1 focus:ring-primary rounded"
            >
              {supportPhone}
            </a>
          </div>

          {/* Support Hours Card */}
          <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-muted text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span>Support Hours</span>
            </div>
            <div className="pt-0.5">
              <span className="font-bold text-foreground block text-xs sm:text-sm">Monday – Saturday</span>
              <span className="text-xs text-muted-foreground font-medium block">9:00 AM – 6:00 PM</span>
            </div>
          </div>

          {/* Location Card */}
          <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-muted text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span>Location</span>
            </div>
            <div className="pt-0.5">
              <span className="font-bold text-foreground block text-xs sm:text-sm">LifeLink Support Center</span>
              <span className="text-xs text-muted-foreground font-medium block">Bengaluru, Karnataka</span>
            </div>
          </div>
        </div>

        {/* Demo Notice Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3 text-xs shadow-2xs">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold text-amber-900 dark:text-amber-200 text-xs">
              Demo Project
            </strong>
            <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed text-[11px] sm:text-xs">
              This project was created for educational and demonstration purposes. The contact information shown above is fictional and intended only to demonstrate the user interface.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
