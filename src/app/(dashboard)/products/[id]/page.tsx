"use client";

import React, { useEffect, useState } from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Edit3,
  Trash2,
  Tag,
} from "lucide-react";
import { Product } from "@/types/product";
import productsService from "@/services/products.service";
import { useLocalProducts } from "@/context/LocalProductsContext";
import ProductGallery from "@/components/products/ProductGallery";
import ReviewList from "@/components/products/ReviewList";
import Badge, { getStockBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProductForm from "@/components/products/ProductForm";
import DeleteDialog from "@/components/products/DeleteDialog";
import { formatCurrency, formatCategoryName, calculateOriginalPrice } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getMergedSingleProduct } = useLocalProducts();

  const idStr = params?.id as string;
  const numericId = parseInt(idStr || "", 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Modal State Controls
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isNaN(numericId) || numericId < 1) {
      notFound();
      return;
    }

    async function loadProduct() {
      setIsLoading(true);
      setError(false);

      // Check if it's a local mock item (id >= 90000)
      if (numericId >= 90000) {
        const localMerged = getMergedSingleProduct(numericId);
        if (localMerged) {
          if (isMounted) {
            setProduct(localMerged);
            setIsLoading(false);
          }
          return;
        } else {
          notFound();
        }
      }

      try {
        const apiData = await productsService.getProductById(numericId);
        if (isMounted) {
          const merged = getMergedSingleProduct(numericId, apiData);
          if (!merged) {
            notFound();
          }
          setProduct(merged);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errObj = err as { status?: number };
          if (errObj?.status === 404) {
            notFound();
          } else {
            setError(true);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [numericId, getMergedSingleProduct]);

  if (isNaN(numericId) || numericId < 1) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-4 animate-fadeIn">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-10 w-40 rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
        <p className="text-luxury-subtext mb-4">Failed to load product specification details.</p>
        <Button variant="secondary" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const originalPrice = calculateOriginalPrice(product.price, product.discountPercentage);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Back Button Preserving URL state */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-medium text-luxury-subtext hover:text-luxury-gold transition-colors py-1.5 px-3 rounded-lg bg-luxury-surface border border-luxury-border/60"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products List
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            leftIcon={<Edit3 className="w-4 h-4" />}
          >
            Edit Product
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Details Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5">
          <ProductGallery
            images={product.images || []}
            thumbnail={product.thumbnail}
            title={product.title}
          />
        </div>

        {/* Right Column: Information Specification Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="category">{formatCategoryName(product.category)}</Badge>
              {product.brand && (
                <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                  {product.brand}
                </span>
              )}
              {product.isLocal && <Badge variant="gold">Demo Mode: Local Overlay</Badge>}
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-luxury-text leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-luxury-text font-mono">
                <Star className="w-4 h-4 fill-luxury-gold text-luxury-gold shrink-0" />
                <span className="font-bold">{product.rating.toFixed(1)}</span>
                <span className="text-luxury-subtext font-sans">
                  ({product.reviews?.length || 0} customer reviews)
                </span>
              </div>
              <span className="text-luxury-border">|</span>
              {getStockBadge(product.stock)}
              {product.sku && (
                <>
                  <span className="text-luxury-border">|</span>
                  <span className="font-mono text-luxury-subtext">SKU: {product.sku}</span>
                </>
              )}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-luxury-surface/80 border border-luxury-border/80 flex items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-luxury-subtext font-semibold block">
                EXECUTIVE PRICE
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl font-bold text-luxury-gold">
                  {formatCurrency(product.price)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-luxury-muted line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {product.discountPercentage > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-mono font-bold">
                SAVE {Math.round(product.discountPercentage)}%
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest text-luxury-subtext font-semibold">
              Description & Craftsmanship
            </h3>
            <p className="text-sm text-luxury-text/90 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-luxury-surface/60 border border-luxury-border/60 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-luxury-gold shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase text-luxury-subtext block">WARRANTY</span>
                <span className="text-xs text-luxury-text font-medium truncate block">
                  {product.warrantyInformation || "1 Year Global Assurance"}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-luxury-surface/60 border border-luxury-border/60 flex items-center gap-3">
              <Truck className="w-5 h-5 text-luxury-gold shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase text-luxury-subtext block">SHIPPING</span>
                <span className="text-xs text-luxury-text font-medium truncate block">
                  {product.shippingInformation || "Complimentary Express Delivery"}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-luxury-surface/60 border border-luxury-border/60 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-luxury-gold shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase text-luxury-subtext block">RETURNS</span>
                <span className="text-xs text-luxury-text font-medium truncate block">
                  {product.returnPolicy || "30-Day Atelier Return"}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <Tag className="w-3.5 h-3.5 text-luxury-muted" />
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-luxury-card border border-luxury-border/40 text-[11px] text-luxury-subtext font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="pt-8 border-t border-luxury-border/60">
        <ReviewList reviews={product.reviews} />
      </div>

      {/* Edit Form Modal */}
      <ProductForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        productToEdit={product}
        onSuccess={() => {
          // Re-merge details state
          if (product) {
            const updated = getMergedSingleProduct(product.id, product);
            if (updated) setProduct(updated);
          }
        }}
      />

      {/* Delete Dialog Modal */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        product={product}
        onSuccess={() => {
          router.replace("/products");
        }}
      />
    </div>
  );
}
