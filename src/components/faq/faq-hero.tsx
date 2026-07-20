'use client';

import React from 'react';
import { Search, X, Sparkles, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { POPULAR_FAQ_TOPICS, FAQTopic, FAQCategoryId } from '@/lib/constants/faq';

interface FaqHeroProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onSelectTopic: (query: string, categoryId?: FAQCategoryId) => void;
}

export function FaqHero({
  searchValue,
  onSearchChange,
  onClearSearch,
  onSelectTopic,
}: FaqHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-muted/20 to-background border-b border-border/30 pt-12 pb-14 md:pt-16 md:pb-20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
        {/* Top Badge */}
        <Badge variant="primary" className="gap-1.5 py-1 px-3.5 text-xs tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>Frequently Asked Questions</span>
        </Badge>

        {/* Heading & Subtitle */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Everything You Need to Know About <span className="text-primary">LifeLink</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Find answers to common questions about blood donations, emergency requests, donor eligibility, replacement donors, privacy, and how LifeLink works.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="w-full max-w-xl relative mt-2 group">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 pointer-events-none" />
            <Input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search FAQs (e.g. eligibility, request, replacement)..."
              className="pl-12 pr-10 py-3.5 h-12 text-sm sm:text-base rounded-2xl border-border/60 bg-white/90 dark:bg-card/90 backdrop-blur shadow-premium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            {searchValue && (
              <button
                type="button"
                onClick={onClearSearch}
                aria-label="Clear search query"
                className="absolute right-3.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Popular Topic Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-muted-foreground font-medium flex items-center gap-1 mr-1">
            <Tag className="w-3.5 h-3.5 text-muted-foreground/70" />
            <span>Popular Topics:</span>
          </span>
          {POPULAR_FAQ_TOPICS.map((topic: FAQTopic, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectTopic(topic.query, topic.categoryId)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-card border border-border/60 text-foreground font-medium hover:border-primary/40 hover:bg-primary-light hover:text-primary transition-all duration-200 shadow-sm active:scale-95"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
