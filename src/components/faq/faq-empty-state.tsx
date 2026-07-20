'use client';

import React from 'react';
import { SearchX } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { FAQ_SEARCH_SUGGESTIONS } from '@/lib/constants/faq';

interface FaqEmptyStateProps {
  onClearSearch: () => void;
  onSelectSuggestion: (suggestion: string) => void;
}

export function FaqEmptyState({
  onClearSearch,
  onSelectSuggestion,
}: FaqEmptyStateProps) {
  return (
    <div className="py-6 flex flex-col items-center">
      <EmptyState
        icon={SearchX}
        title="No FAQs Found"
        description="We couldn't find any questions matching your search query. Try using different keywords or explore our suggested topics below."
        actionText="Clear Search"
        onAction={onClearSearch}
        className="my-0 w-full"
      />

      {/* Suggested Search Chips */}
      <div className="mt-6 text-center space-y-2.5">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Try searching for:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {FAQ_SEARCH_SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSuggestion(suggestion)}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-muted/60 text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/40"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
