"use client";

import React from "react";

interface SortSelectProps {
  sortBy: string;
  order: "asc" | "desc";
  onChange: (sortBy: string, order: "asc" | "desc") => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({ sortBy, order, onChange }) => {
  const currentKey = sortBy ? `${sortBy}:${order}` : "";

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      onChange("", "asc");
      return;
    }
    const [field, direction] = val.split(":");
    onChange(field, direction as "asc" | "desc");
  };

  return (
    <div className="w-full sm:w-48">
      <select
        value={currentKey}
        onChange={handleSelectChange}
        className="w-full bg-luxury-surface border border-luxury-border/80 text-luxury-text text-sm rounded-lg px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold appearance-none cursor-pointer"
        aria-label="Sort products"
      >
        <option value="">Sort: Default</option>
        <option value="price:asc" className="bg-luxury-card text-luxury-text">Price: Low to High</option>
        <option value="price:desc" className="bg-luxury-card text-luxury-text">Price: High to Low</option>
        <option value="rating:desc" className="bg-luxury-card text-luxury-text">Rating: Highest First</option>
        <option value="rating:asc" className="bg-luxury-card text-luxury-text">Rating: Lowest First</option>
        <option value="title:asc" className="bg-luxury-card text-luxury-text">Title: A to Z</option>
        <option value="title:desc" className="bg-luxury-card text-luxury-text">Title: Z to A</option>
      </select>
    </div>
  );
};

export default SortSelect;
