"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

interface SearchInputProps {
  value: string;
  onChange: (searchQuery: string) => void;
  disabled?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, disabled }) => {
  // Local state for immediate smooth typing responsiveness
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Synchronize internal state when prop value changes externally
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Trigger parent URL update only after user stops typing for 400ms
  useEffect(() => {
    if (debouncedSearchTerm !== value) {
      onChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onChange, value]);

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-luxury-muted">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        placeholder="Search products by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={disabled}
        className="w-full bg-luxury-surface border border-luxury-border/80 text-luxury-text text-sm rounded-lg pl-9 pr-9 py-2.5 transition-all duration-200 placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-subtext hover:text-luxury-text transition-colors p-1"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
