'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem, FAQCategory, FAQ_CATEGORIES } from '@/lib/constants/faq';
import { FAQ_CATEGORY_ICONS } from './faq-category-tabs';
import { cn } from '@/lib/utils';

interface HighlightTextProps {
  text: string;
  query: string;
}

/**
 * Renders text with search query term highlighted dynamically
 */
export function HighlightText({ text, query }: HighlightTextProps) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return <>{text}</>;
  }

  // Escape special regex characters
  const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === trimmedQuery.toLowerCase() ? (
          <mark
            key={i}
            className="bg-primary/15 text-primary font-bold px-1 py-0.5 rounded transition-colors"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

interface FaqAccordionProps {
  items: FAQItem[];
  searchQuery: string;
  openId: string | null;
  onToggle: (id: string) => void;
  groupByCategory?: boolean;
}

export function FaqAccordion({
  items,
  searchQuery,
  openId,
  onToggle,
  groupByCategory = true,
}: FaqAccordionProps) {
  // If grouping by category, organize items under their respective categories
  const categoriesToRender = React.useMemo(() => {
    if (!groupByCategory) {
      return null;
    }
    return FAQ_CATEGORIES.map((cat) => ({
      category: cat,
      items: items.filter((item) => item.categoryId === cat.id),
    })).filter((group) => group.items.length > 0);
  }, [items, groupByCategory]);

  const renderFaqCard = (item: FAQItem) => {
    const isOpen = openId === item.id;
    const contentId = `faq-content-${item.id}`;
    const headerId = `faq-header-${item.id}`;

    return (
      <div
        key={item.id}
        className={cn(
          'border rounded-xl bg-white dark:bg-card overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-border',
          isOpen ? 'border-primary/40 ring-2 ring-primary/5 bg-primary/2 dark:bg-card' : 'border-border/60'
        )}
      >
        <button
          type="button"
          id={headerId}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => onToggle(item.id)}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onToggle(item.id);
            }
          }}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-foreground hover:bg-slate-50/80 dark:hover:bg-muted/40 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        >
          <span className="pr-4 leading-snug">
            <HighlightText text={item.question} query={searchQuery} />
          </span>
          <div
            className={cn(
              'p-1 rounded-full text-muted-foreground transition-transform duration-300 shrink-0',
              isOpen ? 'rotate-180 bg-primary/10 text-primary' : 'bg-muted/50'
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {isOpen && (
          <div
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-border/30 animate-fade-in"
          >
            <p className="mt-3">
              <HighlightText text={item.answer} query={searchQuery} />
            </p>
          </div>
        )}
      </div>
    );
  };

  if (groupByCategory && categoriesToRender) {
    return (
      <div className="space-y-10">
        {categoriesToRender.map(({ category, items: categoryItems }) => {
          const Icon = FAQ_CATEGORY_ICONS[category.id];

          return (
            <div key={category.id} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                {Icon && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-foreground tracking-tight">
                    {category.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </div>

              {/* Items under category */}
              <div className="space-y-3">
                {categoryItems.map((item) => renderFaqCard(item))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <div className="space-y-3">{items.map((item) => renderFaqCard(item))}</div>;
}
