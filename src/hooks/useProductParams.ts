"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ProductQueryParams } from "@/types/product";

const ALLOWED_LIMITS = [10, 20, 50];
const ALLOWED_SORT_BY = ["price", "rating", "title"];

export function useProductParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derive and sanitize parameters strictly from URL
  const params: ProductQueryParams = useMemo(() => {
    // 1. Sanitize page: must be a positive integer
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    // 2. Sanitize limit: must be 10, 20, or 50
    const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
    const limit = ALLOWED_LIMITS.includes(rawLimit) ? rawLimit : 10;

    // 3. Sanitize search query
    const q = (searchParams.get("q") || "").trim();

    // 4. Sanitize category slug
    const category = (searchParams.get("category") || "").trim();

    // 5. Sanitize sort field
    const rawSortBy = searchParams.get("sortBy") || "";
    const sortBy = ALLOWED_SORT_BY.includes(rawSortBy) ? rawSortBy : "";

    // 6. Sanitize sort order
    const rawOrder = searchParams.get("order");
    const order: "asc" | "desc" = rawOrder === "desc" ? "desc" : "asc";

    return {
      page,
      limit,
      q,
      category,
      sortBy,
      order,
    };
  }, [searchParams]);

  /**
   * Helper to update URL query string
   */
  const updateParams = useCallback(
    (updates: Partial<ProductQueryParams>) => {
      const current = new URLSearchParams(searchParams.toString());

      // Combine current state with new updates
      const nextParams = { ...params, ...updates };

      // Handle Mutual Exclusion: Search vs Category
      // If user typed a search query, clear category
      if (updates.q !== undefined && updates.q !== "") {
        nextParams.category = "";
      }
      // If user selected a category, clear search query
      if (updates.category !== undefined && updates.category !== "") {
        nextParams.q = "";
      }

      // Reset to page 1 if query, category, limit, or sort changes (unless page was explicitly updated)
      if (
        updates.page === undefined &&
        (updates.q !== undefined ||
          updates.category !== undefined ||
          updates.limit !== undefined ||
          updates.sortBy !== undefined ||
          updates.order !== undefined)
      ) {
        nextParams.page = 1;
      }

      // Build clean search params (omit default clean values)
      const newSearchParams = new URLSearchParams();

      if (nextParams.page > 1) {
        newSearchParams.set("page", nextParams.page.toString());
      }
      if (nextParams.limit !== 10) {
        newSearchParams.set("limit", nextParams.limit.toString());
      }
      if (nextParams.q) {
        newSearchParams.set("q", nextParams.q);
      }
      if (nextParams.category) {
        newSearchParams.set("category", nextParams.category);
      }
      if (nextParams.sortBy) {
        newSearchParams.set("sortBy", nextParams.sortBy);
        newSearchParams.set("order", nextParams.order);
      }

      const queryString = newSearchParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [params, pathname, router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const isFiltered = Boolean(params.q || params.category || params.sortBy);

  return {
    params,
    updateParams,
    clearFilters,
    isFiltered,
  };
}

export default useProductParams;
