"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPaginationText, cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
}) => {
  const skip = (page - 1) * limit;
  const paginationText = formatPaginationText(total, skip, limit);

  /**
   * Helper function to compute page numbers array with ellipsis
   * Example: [1, "...", 4, 5, 6, "...", 20]
   */
  const getPageNumbers = (): Array<number | string> => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: Array<number | string> = [];
    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("..");
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-luxury-border/60 text-xs text-luxury-subtext">
      {/* Pagination Text Range */}
      <span className="font-mono">{paginationText}</span>

      {/* Pagination Buttons Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-luxury-border/80 bg-luxury-surface text-luxury-text hover:bg-luxury-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (typeof p === "string") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-luxury-muted select-none">
                  …
                </span>
              );
            }

            const isActive = p === page;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={cn(
                  "min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-luxury-gold text-luxury-bg font-bold shadow-gold"
                    : "bg-luxury-surface text-luxury-text hover:bg-luxury-hover border border-luxury-border/60"
                )}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || total === 0}
          className="p-2 rounded-lg border border-luxury-border/80 bg-luxury-surface text-luxury-text hover:bg-luxury-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
