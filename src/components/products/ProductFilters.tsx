"use client";

import React from "react";
import { FilterX, Info } from "lucide-react";
import SearchInput from "./SearchInput";
import CategorySelect from "./CategorySelect";
import SortSelect from "./SortSelect";
import Button from "@/components/ui/Button";
import { ProductQueryParams } from "@/types/product";

interface ProductFiltersProps {
  params: ProductQueryParams;
  onUpdateParams: (updates: Partial<ProductQueryParams>) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  params,
  onUpdateParams,
  onClearFilters,
  isFiltered,
}) => {
  const isSearching = Boolean(params.q);
  const isCategorySelected = Boolean(params.category);

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-xl bg-luxury-surface/60 border border-luxury-border/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <SearchInput
            value={params.q}
            onChange={(q) => onUpdateParams({ q })}
          />

          {/* Category Select (disabled if searching) */}
          <div className="relative">
            <CategorySelect
              value={params.category}
              onChange={(category) => onUpdateParams({ category })}
              disabled={isSearching}
            />
          </div>

          {/* Sort Select */}
          <SortSelect
            sortBy={params.sortBy}
            order={params.order}
            onChange={(sortBy, order) => onUpdateParams({ sortBy, order })}
          />
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            leftIcon={<FilterX className="w-4 h-4 text-luxury-gold" />}
            className="self-end lg:self-auto border border-luxury-border/60"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Elegant Mutual Exclusion UI Hint */}
      {isSearching && (
        <div className="px-4 py-2 rounded-lg bg-luxury-goldLight border border-luxury-gold/20 flex items-center gap-2 text-xs text-luxury-gold animate-fadeIn">
          <Info className="w-4 h-4 shrink-0 text-luxury-gold" />
          <span>
            <strong>Search active:</strong> Category filter is disabled while searching to preserve true server-side pagination.
          </span>
        </div>
      )}

      {isCategorySelected && (
        <div className="px-4 py-2 rounded-lg bg-luxury-goldLight border border-luxury-gold/20 flex items-center gap-2 text-xs text-luxury-gold animate-fadeIn">
          <Info className="w-4 h-4 shrink-0 text-luxury-gold" />
          <span>
            <strong>Category active:</strong> Search input will clear the selected category to preserve true server-side pagination.
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
