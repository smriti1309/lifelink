import Link from 'next/link';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

export function FaqPreview() {
  const faqs = [
    {
      q: 'How do I request blood through LifeLink?',
      a: 'Click "Need Blood Now" to fill out the emergency request form. Specify details like blood type, urgency, hospital, and units needed. Once published, your request will appear on the active requests directory and can be shared via a unique link with friends and networks.',
    },
    {
      q: 'What is a replacement donor?',
      a: 'A replacement donor donates blood to replenish the stocks of a hospital or licensed blood bank that has issued blood for a patient. In many cases, hospitals accept replacement donations of any blood type, as they exchange units within their reserves.',
    },
    {
      q: 'Does LifeLink provide or store blood?',
      a: 'No, LifeLink does not store, issue, or test blood units. We are a coordination platform designed to connect seekers with volunteer donors. All blood screening, processing, and medical procedures are handled exclusively by licensed blood banks and healthcare facilities.',
    },
    {
      q: 'How can I become a donor?',
      a: 'Click "Become a Donor" to register your email, blood type, and district/state location. Your profile will be added to our local donor search pool, allowing seekers or coordinators to reach out if an emergency matches your profile.',
    },
  ];

  return (
    <section className="bg-muted/30 border-y border-border/30 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col gap-3">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Quick answers to help you understand the LifeLink platform.
          </p>
        </div>

        {/* Details/Summary list */}
        <div className="flex flex-col gap-4 mb-12">
          {faqs.map((faq, idx) => {
            return (
              <details
                key={idx}
                className="group border border-border bg-white rounded-xl overflow-hidden transition-all-300 shadow-premium [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between p-5 font-semibold text-sm sm:text-base text-foreground cursor-pointer hover:bg-slate-50 transition-all-300 select-none outline-none">
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180 shrink-0" />
                </summary>
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-border/40 bg-slate-50/50">
                  <p className="mt-3">{faq.a}</p>
                </div>
              </details>
            );
          })}
        </div>

        <div className="text-center">
          <Link href={ROUTES.PUBLIC.FAQ}>
            <Button variant="outline" size="md" className="bg-white gap-2 font-semibold">
              <span>View All FAQs</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
