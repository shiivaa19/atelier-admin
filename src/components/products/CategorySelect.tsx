"use client";

import React, { useEffect, useState } from "react";
import categoriesService from "@/services/categories.service";
import { Category } from "@/types/product";

interface CategorySelectProps {
  value: string;
  onChange: (categorySlug: string) => void;
  disabled?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, disabled }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const data = await categoriesService.getCategories();
        if (isMounted) setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full sm:w-48">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isLoading}
        className="w-full bg-luxury-surface border border-luxury-border/80 text-luxury-text text-sm rounded-lg px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug} className="bg-luxury-card text-luxury-text">
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
