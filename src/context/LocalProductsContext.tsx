"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";

interface LocalProductsContextType {
  addedProducts: Product[];
  editedProducts: Record<number, Partial<Product>>;
  deletedIds: number[];
  addProduct: (productData: Omit<Product, "id">) => Product;
  editProduct: (id: number, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getMergedProductList: (apiProducts: Product[], total: number, isPageOne: boolean) => {
    mergedProducts: Product[];
    adjustedTotal: number;
  };
  getMergedSingleProduct: (id: number, apiProduct?: Product | null) => Product | null;
  clearOverlay: () => void;
}

const LOCAL_STORAGE_KEY = "aureus_local_products_overlay_v1";

const LocalProductsContext = createContext<LocalProductsContextType | undefined>(undefined);

export const LocalProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [editedProducts, setEditedProducts] = useState<Record<number, Partial<Product>>>({});
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  // Load overlay state from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAddedProducts(parsed.addedProducts || []);
        setEditedProducts(parsed.editedProducts || {});
        setDeletedIds(parsed.deletedIds || []);
      }
    } catch (e) {
      console.error("Failed to load local overlay store", e);
    }
  }, []);

  // Save overlay state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ addedProducts, editedProducts, deletedIds })
      );
    } catch (e) {
      console.error("Failed to save local overlay store", e);
    }
  }, [addedProducts, editedProducts, deletedIds]);

  const addProduct = useCallback((productData: Omit<Product, "id">): Product => {
    // Generate temporary numeric ID starting at 90000 to avoid DummyJSON conflicts
    const nextId = 90000 + Date.now() % 10000;
    const newProduct: Product = {
      ...productData,
      id: nextId,
      isLocal: true,
      rating: productData.rating || 5.0,
      reviews: productData.reviews || [],
      images: productData.images?.length ? productData.images : [productData.thumbnail],
    };

    setAddedProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const editProduct = useCallback((id: number, updatedFields: Partial<Product>) => {
    // If product was locally added, update it directly inside addedProducts array
    if (id >= 90000) {
      setAddedProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
      );
    } else {
      setEditedProducts((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), ...updatedFields },
      }));
    }
  }, []);

  const deleteProduct = useCallback((id: number) => {
    // If product was locally added, filter it out of addedProducts array
    if (id >= 90000) {
      setAddedProducts((prev) => prev.filter((item) => item.id !== id));
    } else {
      setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
  }, []);

  const getMergedProductList = useCallback(
    (apiProducts: Product[], total: number, isPageOne: boolean) => {
      // 1. Filter out deleted IDs from API products
      let filtered = apiProducts.filter((p) => !deletedIds.includes(p.id));

      // 2. Apply local edits to remaining API products
      filtered = filtered.map((p) => {
        if (editedProducts[p.id]) {
          return { ...p, ...editedProducts[p.id] };
        }
        return p;
      });

      // 3. Prepend added products if rendering page 1
      let mergedProducts = filtered;
      if (isPageOne && addedProducts.length > 0) {
        mergedProducts = [...addedProducts, ...filtered];
      }

      // Calculate adjusted total
      const adjustedTotal = Math.max(0, total - deletedIds.length + addedProducts.length);

      return {
        mergedProducts,
        adjustedTotal,
      };
    },
    [addedProducts, editedProducts, deletedIds]
  );

  const getMergedSingleProduct = useCallback(
    (id: number, apiProduct?: Product | null): Product | null => {
      // Check if deleted
      if (deletedIds.includes(id)) {
        return null;
      }

      // Check if it's a locally added product
      const localAdded = addedProducts.find((p) => p.id === id);
      if (localAdded) {
        return localAdded;
      }

      // If API product exists, apply any local edit overrides
      if (apiProduct) {
        if (editedProducts[id]) {
          return { ...apiProduct, ...editedProducts[id] };
        }
        return apiProduct;
      }

      return null;
    },
    [addedProducts, editedProducts, deletedIds]
  );

  const clearOverlay = useCallback(() => {
    setAddedProducts([]);
    setEditedProducts({});
    setDeletedIds([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  return (
    <LocalProductsContext.Provider
      value={{
        addedProducts,
        editedProducts,
        deletedIds,
        addProduct,
        editProduct,
        deleteProduct,
        getMergedProductList,
        getMergedSingleProduct,
        clearOverlay,
      }}
    >
      {children}
    </LocalProductsContext.Provider>
  );
};

export function useLocalProducts(): LocalProductsContextType {
  const context = useContext(LocalProductsContext);
  if (!context) {
    throw new Error("useLocalProducts must be used within a LocalProductsProvider");
  }
  return context;
}
