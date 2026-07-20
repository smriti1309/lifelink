'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';

export interface ComboboxProps {
  id?: string;
  label?: string;
  error?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
  icon?: React.ReactNode;
}

export function Combobox({
  id,
  label,
  error,
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  disabled = false,
  emptyMessage = 'No options found.',
  icon,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    // When dropdown is not open, or query matches selected value, show all options
    if (!isOpen && searchQuery === value) {
      return options;
    }
    return options.filter(opt =>
      opt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, isOpen, value]);

  // Handle click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectOption = (opt: string) => {
    onChange(opt);
    setSearchQuery(opt);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        setIsOpen(true);
        setSearchQuery(value);
        setHighlightedIndex(-1);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          selectOption(filteredOptions[highlightedIndex]);
        } else if (filteredOptions.length === 1) {
          selectOption(filteredOptions[0]);
        } else if (searchQuery && filteredOptions.includes(searchQuery)) {
          selectOption(searchQuery);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  // Derive the value to display in the input
  const displayValue = isOpen ? searchQuery : value;

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-1.5 relative">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-muted-foreground pointer-events-none select-none z-10">
            {icon}
          </div>
        )}
        <input
          id={id}
          ref={inputRef}
          type="text"
          className={cn(
            "w-full bg-white border border-border text-foreground placeholder-muted-foreground/60 text-sm rounded-lg px-4 py-2.5 outline-none transition-all-300 focus:border-primary focus:ring-2 focus:ring-primary/20 pr-10",
            {
              "pl-10": icon,
              "border-destructive focus:border-destructive focus:ring-destructive/20": error,
            }
          )}
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setHighlightedIndex(-1);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchQuery(value);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
        />
        
        <div className="absolute right-3 flex items-center gap-1">
          {displayValue && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setSearchQuery('');
                setHighlightedIndex(-1);
                inputRef.current?.focus();
              }}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (!disabled) {
                setIsOpen(prev => {
                  const next = !prev;
                  if (next) {
                    setSearchQuery(value);
                    setHighlightedIndex(-1);
                  }
                  return next;
                });
                inputRef.current?.focus();
              }
            }}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", { "transform rotate-180": isOpen })} />
          </button>
        </div>
      </div>

      {isOpen && !disabled && (
        <ul className="absolute left-0 right-0 top-[100%] mt-1 max-h-60 overflow-y-auto bg-white border border-border rounded-lg shadow-premium z-50 py-1 divide-y divide-border/20 glassmorphism animate-in fade-in slide-in-from-top-1 duration-200">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => {
              const isSelected = value === opt;
              const isHighlighted = highlightedIndex === idx;
              return (
                <li
                  key={opt}
                  className={cn(
                    "px-4 py-2 text-sm cursor-pointer select-none transition-colors duration-150 text-foreground",
                    {
                      "bg-primary-light text-primary font-medium": isSelected,
                      "bg-muted": isHighlighted && !isSelected,
                    }
                  )}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  {opt}
                </li>
              );
            })
          ) : (
            <li className="px-4 py-2 text-sm text-muted-foreground select-none">
              {emptyMessage}
            </li>
          )}
        </ul>
      )}

      {error && (
        <p className="text-xs text-destructive font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
