"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { Product, ProductQueryParams } from "@/types/product";
import productsService from "@/services/products.service";
import { useLocalProducts } from "@/context/LocalProductsContext";
import { NormalizedApiError } from "@/types/api";

interface UseProductsResult {
  products: Product[];
  total: number;
  isLoading: boolean;
  isRefetching: boolean;
  error: NormalizedApiError | null;
  refetch: () => void;
  totalPages: number;
}

export function useProducts(
  params: ProductQueryParams,
  onClampPage?: (validPage: number) => void
): UseProductsResult {
  const { getMergedProductList } = useLocalProducts();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [error, setError] = useState<NormalizedApiError | null>(null);

  // Ref to store pending AbortController to cancel superseded requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ref for incremental request counter to prevent stale response race conditions
  const requestIdRef = useRef<number>(0);

  // Track initial mount vs refetching
  const isMountedRef = useRef<boolean>(false);

  const fetchProducts = useCallback(async () => {
    // 1. Cancel previous pending request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 2. Instantiate new AbortController and increment request ID
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentRequestId = ++requestIdRef.current;

    if (!isMountedRef.current) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }
    setError(null);

    try {
      let response;

      // Select API endpoint based on search query vs category filter vs default list
      if (params.q) {
        response = await productsService.searchProducts(params.q, params, {
          signal: controller.signal,
        });
      } else if (params.category) {
        response = await productsService.getProductsByCategory(params.category, params, {
          signal: controller.signal,
        });
      } else {
        response = await productsService.getProducts(params, {
          signal: controller.signal,
        });
      }

      // Race condition check: Ensure this response matches the latest in-flight request ID
      if (currentRequestId !== requestIdRef.current) {
        return; // Ignore stale response
      }

      // Merge local overlay (added, edited, deleted items)
      const isPageOne = params.page === 1;
      const { mergedProducts, adjustedTotal } = getMergedProductList(
        response.products,
        response.total,
        isPageOne
      );

      // Exclude vehicle, motorcycle, automotive, and bike products as requested
      const EXCLUDED_KEYWORDS = ["vehicle", "motorcycle", "automotive", "bike"];
      const cleanProducts = mergedProducts.filter(
        (p) => !EXCLUDED_KEYWORDS.some((kw) => (p.category || "").toLowerCase().includes(kw))
      );

      // Page clamping verification
      const computedTotalPages = Math.ceil(adjustedTotal / params.limit) || 1;
      if (params.page > computedTotalPages && adjustedTotal > 0) {
        if (onClampPage) {
          onClampPage(computedTotalPages);
          return;
        }
      }

      setProducts(cleanProducts);
      setTotal(adjustedTotal);
      isMountedRef.current = true;
    } catch (err) {
      // If error was caused by request cancellation (AbortController), ignore it silently
      if (axios.isCancel(err)) {
        return;
      }

      if (currentRequestId === requestIdRef.current) {
        const normalizedErr = err as NormalizedApiError;
        setError(normalizedErr);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
        setIsRefetching(false);
      }
    }
  }, [params, getMergedProductList, onClampPage]);

  useEffect(() => {
    fetchProducts();

    return () => {
      // Cleanup on unmount or params change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const totalPages = useMemo(() => Math.ceil(total / params.limit) || 1, [total, params.limit]);

  return {
    products,
    total,
    isLoading,
    isRefetching,
    error,
    refetch: fetchProducts,
    totalPages,
  };
}

export default useProducts;
