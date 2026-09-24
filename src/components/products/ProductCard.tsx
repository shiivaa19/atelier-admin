"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Eye, Edit3, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { formatCurrency, formatCategoryName } from "@/lib/utils";
import Badge, { getStockBadge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/products/${product.id}`)}
      className="p-4 rounded-xl bg-luxury-surface/80 border border-luxury-border/80 shadow-sm space-y-3 cursor-pointer hover:border-luxury-gold/40 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-lg bg-luxury-card border border-luxury-border/60 overflow-hidden shrink-0 flex items-center justify-center p-1">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="category">{formatCategoryName(product.category)}</Badge>
            {product.isLocal && <Badge variant="gold">Local</Badge>}
          </div>

          <h3 className="font-semibold text-luxury-text text-sm truncate">{product.title}</h3>
          {product.brand && <p className="text-xs text-luxury-subtext">{product.brand}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-luxury-border/40">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-luxury-gold">
            {formatCurrency(product.price)}
          </span>
          <div className="flex items-center gap-1 text-xs text-luxury-text">
            <Star className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold shrink-0" />
            <span className="font-mono">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <div>{getStockBadge(product.stock)}</div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-end gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
        <Link
          href={`/products/${product.id}`}
          className="p-2 text-xs font-medium text-luxury-subtext hover:text-luxury-text bg-luxury-card rounded-lg flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </Link>
        <button
          onClick={() => onEdit(product)}
          className="p-2 text-xs font-medium text-luxury-subtext hover:text-luxury-gold bg-luxury-card rounded-lg flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          className="p-2 text-xs font-medium text-red-400 hover:bg-red-950/40 bg-luxury-card rounded-lg flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
