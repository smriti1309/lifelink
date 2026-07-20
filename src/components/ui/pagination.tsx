import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Logic to show a subset of page numbers with ellipsis if totalPages is large
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    
    const visible: (number | string)[] = [];
    if (currentPage <= 3) {
      visible.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      visible.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      visible.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return visible;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center items-center gap-1.5 py-4", className)}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {visiblePages.map((page, idx) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground select-none"
            >
              &bull;&bull;&bull;
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Button
            key={`page-${pageNum}`}
            variant={isActive ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            className={cn("h-9 w-9 p-0 font-medium", {
              "hover:bg-muted": !isActive,
            })}
            aria-label={`Go to page ${pageNum}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2"
        aria-label="Go to next page"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  );
}
