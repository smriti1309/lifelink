'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  FAQCategoryId,
  FAQItem,
} from '@/lib/constants/faq';
import { FaqHero } from './faq-hero';
import { FaqCategoryTabs } from './faq-category-tabs';
import { FaqAccordion } from './faq-accordion';
import { FaqEmptyState } from './faq-empty-state';
import { FaqHelpCta } from './faq-help-cta';

export function FaqClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial params from URL
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = (searchParams.get('category') as FAQCategoryId) || 'all';

  // Local state for instant input feedback
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategoryId | 'all'>(
    initialCategory
  );
  const [openId, setOpenId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if URL changes externally (e.g. back/forward navigation)
  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || '';
    const catFromUrl = (searchParams.get('category') as FAQCategoryId) || 'all';
    setSearchValue(queryFromUrl);
    setSelectedCategory(catFromUrl);
  }, [searchParams]);

  // Debounced URL updates preserving existing search params
  const updateUrlParams = useCallback(
    (newQuery: string, newCategory: FAQCategoryId | 'all') => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));

        if (newQuery.trim()) {
          params.set('q', newQuery.trim());
        } else {
          params.delete('q');
        }

        if (newCategory !== 'all') {
          params.set('category', newCategory);
        } else {
          params.delete('category');
        }

        const queryString = params.toString();
        const targetPath = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(targetPath, { scroll: false });
      }, 300);
    },
    [searchParams, pathname, router]
  );

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Smooth scroll handler targeting list container with header offset
  const scrollToFaqList = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Handle Search Input Change
  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    updateUrlParams(val, selectedCategory);
  };

  // Handle Category Change
  const handleCategoryChange = (category: FAQCategoryId | 'all') => {
    setSelectedCategory(category);
    updateUrlParams(searchValue, category);
    scrollToFaqList();
  };

  // Handle Popular Topic Chip Click
  const handleSelectTopic = (query: string, categoryId?: FAQCategoryId) => {
    setSearchValue(query);
    const targetCat = categoryId || 'all';
    setSelectedCategory(targetCat);
    updateUrlParams(query, targetCat);
    scrollToFaqList();
  };

  // Handle Clear Search
  const handleClearSearch = () => {
    setSearchValue('');
    updateUrlParams('', selectedCategory);
  };

  // Category map for search filtering
  const categoryMap = useMemo(() => {
    const map = new Map<FAQCategoryId, string>();
    FAQ_CATEGORIES.forEach((c) => map.set(c.id, c.title.toLowerCase()));
    return map;
  }, []);

  // Filtered FAQ Items (Memoized)
  const filteredItems = useMemo(() => {
    const trimmedQuery = searchValue.trim().toLowerCase();

    return FAQ_ITEMS.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // 2. Search Query Filter (checks question, answer, and category title)
      if (!trimmedQuery) {
        return true;
      }

      const qMatch = item.question.toLowerCase().includes(trimmedQuery);
      const aMatch = item.answer.toLowerCase().includes(trimmedQuery);
      const catTitle = categoryMap.get(item.categoryId) || '';
      const catMatch = catTitle.includes(trimmedQuery);

      return qMatch || aMatch || catMatch;
    });
  }, [searchValue, selectedCategory, categoryMap]);

  // Compute FAQ Counts per category
  const categoryCounts = useMemo(() => {
    const trimmedQuery = searchValue.trim().toLowerCase();
    const counts: Record<FAQCategoryId | 'all', number> = {
      all: 0,
      general: 0,
      donors: 0,
      requests: 0,
      process: 0,
      privacy: 0,
      technical: 0,
    };

    const matchingItems = FAQ_ITEMS.filter((item) => {
      if (!trimmedQuery) return true;
      const qMatch = item.question.toLowerCase().includes(trimmedQuery);
      const aMatch = item.answer.toLowerCase().includes(trimmedQuery);
      const catTitle = categoryMap.get(item.categoryId) || '';
      const catMatch = catTitle.includes(trimmedQuery);
      return qMatch || aMatch || catMatch;
    });

    counts.all = matchingItems.length;
    matchingItems.forEach((item) => {
      counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
    });

    return counts;
  }, [searchValue, categoryMap]);

  // Auto expand single search result logic & preserve expanded item if still matching
  useEffect(() => {
    if (filteredItems.length === 1) {
      setOpenId(filteredItems[0].id);
    } else if (openId && !filteredItems.some((item) => item.id === openId)) {
      setOpenId(null);
    }
  }, [filteredItems, openId]);

  // Accordion toggle handler
  const handleAccordionToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <FaqHero
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onSelectTopic={handleSelectTopic}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Scroll Target Container with Header Offset */}
        <div ref={listRef} className="scroll-mt-24 space-y-8">
          {/* Category Tabs */}
          <FaqCategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            categoryCounts={categoryCounts}
          />

          {/* Results Header Summary */}
          {searchValue.trim() && (
            <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground pb-2 border-b border-border/30">
              <span>
                Found <strong className="text-foreground">{filteredItems.length}</strong>{' '}
                {filteredItems.length === 1 ? 'question' : 'questions'} matching &quot;
                <strong className="text-primary">{searchValue.trim()}</strong>&quot;
              </span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* FAQ Accordion or Empty State */}
          {filteredItems.length > 0 ? (
            <FaqAccordion
              items={filteredItems}
              searchQuery={searchValue}
              openId={openId}
              onToggle={handleAccordionToggle}
              groupByCategory={selectedCategory === 'all' && !searchValue.trim()}
            />
          ) : (
            <FaqEmptyState
              onClearSearch={handleClearSearch}
              onSelectSuggestion={(suggestion) => handleSearchChange(suggestion)}
            />
          )}

          {/* Help CTA */}
          <FaqHelpCta />
        </div>
      </main>
    </div>
  );
}
