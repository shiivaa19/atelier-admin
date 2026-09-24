"use client";

import React, { useState, useCallback, Suspense } from "react";
import { Plus, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductFilters from "@/components/products/ProductFilters";
import ProductTable from "@/components/products/ProductTable";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/products/Pagination";
import PageSizeSelect from "@/components/products/PageSizeSelect";
import ProductForm from "@/components/products/ProductForm";
import DeleteDialog from "@/components/products/DeleteDialog";
import { TableSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import useProductParams from "@/hooks/useProductParams";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/types/product";

function ProductsContent() {
  const { params, updateParams, clearFilters, isFiltered } = useProductParams();

  // Page clamp handler: safely updates URL if page exceeds total available pages
  const handleClampPage = useCallback(
    (validPage: number) => {
      updateParams({ page: validPage });
    },
    [updateParams]
  );

  const { products, total, isLoading, isRefetching, error, refetch, totalPages } = useProducts(
    params,
    handleClampPage
  );

  // Modal State Controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleOpenAddForm = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product: Product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-luxury-text">
            Inventory & Catalog
          </h2>
          <p className="text-xs md:text-sm text-luxury-subtext mt-1 font-normal">
            Real-time management of products, category classifications, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={refetch}
            isLoading={isRefetching}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="shrink-0"
            title="Refresh list"
          >
            Refresh
          </Button>
          <Button
            variant="gold"
            size="md"
            onClick={handleOpenAddForm}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto shrink-0 shadow-gold"
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <ProductFilters
        params={params}
        onUpdateParams={updateParams}
        onClearFilters={clearFilters}
        isFiltered={isFiltered}
      />

      {/* Data Views Area */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : products.length === 0 ? (
        <EmptyState
          title={isFiltered ? "No matching products" : "No products available"}
          description={
            isFiltered
              ? `No catalog items matched search query "${params.q || params.category}".`
              : "The product list is currently empty."
          }
          actionLabel="Clear All Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="space-y-6 relative">
          {/* Dimmed Refetching Overlay */}
          {isRefetching && (
            <div className="absolute inset-0 bg-luxury-bg/40 backdrop-blur-[1px] z-10 rounded-xl flex items-center justify-center transition-opacity">
              <div className="w-6 h-6 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Desktop HTML Table View */}
          <div className="hidden md:block">
            <ProductTable
              products={products}
              onEdit={handleOpenEditForm}
              onDelete={handleOpenDelete}
            />
          </div>

          {/* Mobile Stacked Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleOpenEditForm}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>

          {/* Controls Footer: Page Size Selector & Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <PageSizeSelect
              limit={params.limit}
              onLimitChange={(newLimit) => updateParams({ limit: newLimit })}
            />

            <Pagination
              page={params.page}
              limit={params.limit}
              total={total}
              totalPages={totalPages}
              onPageChange={(newPage) => updateParams({ page: newPage })}
            />
          </div>
        </div>
      )}

      {/* Reusable Product Add/Edit Form Slide-Over Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        product={productToDelete}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
