"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Eye, Edit3, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { formatCurrency, formatCategoryName } from "@/lib/utils";
import Badge, { getStockBadge } from "@/components/ui/Badge";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-luxury-border/80 bg-luxury-surface/40 shadow-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-luxury-border/80 bg-luxury-surface/80 text-luxury-subtext font-medium tracking-wider uppercase text-[10px]">
            <th className="py-3.5 px-4 w-16">Item</th>
            <th className="py-3.5 px-4">Title & Brand</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Price</th>
            <th className="py-3.5 px-4">Rating</th>
            <th className="py-3.5 px-4">Stock Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-luxury-border/40">
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => router.push(`/products/${product.id}`)}
              className="hover:bg-luxury-hover/60 transition-colors cursor-pointer group"
            >
              {/* Thumbnail */}
              <td className="py-3 px-4">
                <div className="w-11 h-11 rounded-lg bg-luxury-card border border-luxury-border/60 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
              </td>

              {/* Title & Brand */}
              <td className="py-3 px-4">
                <div className="space-y-0.5 max-w-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-luxury-text text-sm group-hover:text-luxury-gold transition-colors line-clamp-1">
                      {product.title}
                    </span>
                    {product.isLocal && <Badge variant="gold">Local</Badge>}
                  </div>
                  {product.brand && (
                    <span className="text-[11px] text-luxury-subtext block font-light">
                      {product.brand}
                    </span>
                  )}
                </div>
              </td>

              {/* Category Chip */}
              <td className="py-3 px-4">
                <Badge variant="category">{formatCategoryName(product.category)}</Badge>
              </td>

              {/* Price in Clean Font */}
              <td className="py-3 px-4">
                <span className="text-sm font-semibold text-luxury-gold tracking-tight">
                  {formatCurrency(product.price)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-[10px] text-emerald-400 block font-mono">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                )}
              </td>

              {/* Rating */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-1 text-luxury-text">
                  <Star className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold shrink-0" />
                  <span className="font-mono font-medium">{product.rating.toFixed(1)}</span>
                </div>
              </td>

              {/* Stock Badge */}
              <td className="py-3 px-4">{getStockBadge(product.stock)}</td>

              {/* Row Actions */}
              <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/products/${product.id}`}
                    className="p-1.5 text-luxury-subtext hover:text-luxury-text hover:bg-luxury-card rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onEdit(product)}
                    className="p-1.5 text-luxury-subtext hover:text-luxury-gold hover:bg-luxury-goldLight rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-1.5 text-luxury-subtext hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
