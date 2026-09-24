"use client";

import React from "react";

interface PageSizeSelectProps {
  limit: number;
  onLimitChange: (newLimit: number) => void;
}

export const PageSizeSelect: React.FC<PageSizeSelectProps> = ({ limit, onLimitChange }) => {
  return (
    <div className="flex items-center gap-2 text-xs text-luxury-subtext">
      <span>Show</span>
      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="bg-luxury-surface border border-luxury-border/80 text-luxury-text text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-luxury-gold cursor-pointer"
        aria-label="Items per page"
      >
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
      </select>
    </div>
  );
};

export default PageSizeSelect;
