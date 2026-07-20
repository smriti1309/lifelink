'use client';

import React from 'react';
import {
  Layers,
  HelpCircle,
  Heart,
  AlertCircle,
  Activity,
  ShieldCheck,
  LifeBuoy,
  LucideIcon,
} from 'lucide-react';
import { FAQ_CATEGORIES, FAQCategoryId } from '@/lib/constants/faq';
import { cn } from '@/lib/utils';

export const FAQ_CATEGORY_ICONS: Record<FAQCategoryId, LucideIcon> = {
  general: HelpCircle,
  donors: Heart,
  requests: AlertCircle,
  process: Activity,
  privacy: ShieldCheck,
  technical: LifeBuoy,
};

interface FaqCategoryTabsProps {
  selectedCategory: FAQCategoryId | 'all';
  onSelectCategory: (category: FAQCategoryId | 'all') => void;
  categoryCounts: Record<FAQCategoryId | 'all', number>;
}

export function FaqCategoryTabs({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: FaqCategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 scroll-smooth">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {/* All Tab */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border select-none',
            selectedCategory === 'all'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white dark:bg-card text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/40'
          )}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>All Categories</span>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-bold ml-1',
              selectedCategory === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {categoryCounts['all'] ?? 0}
          </span>
        </button>

        {/* Category Tabs */}
        {FAQ_CATEGORIES.map((cat) => {
          const Icon = FAQ_CATEGORY_ICONS[cat.id];
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border select-none',
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white dark:bg-card text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/40'
              )}
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              <span>{cat.title}</span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold ml-1',
                  isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
