'use client';

import * as React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
  showFiltersButton?: boolean;
  onFiltersClick?: () => void;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  className,
  initialValue = '',
  showFiltersButton = false,
  onFiltersClick,
}: SearchBarProps) {
  const [value, setValue] = React.useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full items-center gap-2", className)}
    >
      <div className="relative flex flex-1 items-center">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none select-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-border text-foreground placeholder-muted-foreground/60 text-sm rounded-lg pl-10 pr-10 py-2.5 outline-none transition-all-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all-300 cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <Button type="submit" size="md">
        Search
      </Button>
      {showFiltersButton && onFiltersClick && (
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onFiltersClick}
          className="px-3"
        >
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        </Button>
      )}
    </form>
  );
}
