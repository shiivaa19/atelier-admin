"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  thumbnail: string;
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [],
  thumbnail,
  title,
}) => {
  // Combine thumbnail and additional images into a deduplicated list
  const allImages = Array.from(new Set([thumbnail, ...images])).filter(Boolean);
  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] || thumbnail);

  return (
    <div className="space-y-4">
      {/* Main Large Gallery Image */}
      <div className="w-full aspect-square max-h-[420px] rounded-2xl bg-luxury-surface/80 border border-luxury-border/80 overflow-hidden p-6 flex items-center justify-center shadow-luxury">
        <img
          src={selectedImage}
          alt={title}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnails list */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {allImages.map((imgUrl, index) => {
            const isSelected = imgUrl === selectedImage;
            return (
              <button
                key={index}
                onClick={() => setSelectedImage(imgUrl)}
                className={cn(
                  "w-16 h-16 rounded-xl bg-luxury-surface border overflow-hidden p-1 shrink-0 transition-all duration-200 focus:outline-none",
                  isSelected
                    ? "border-luxury-gold ring-2 ring-luxury-gold/30 shadow-gold scale-105"
                    : "border-luxury-border/60 opacity-60 hover:opacity-100 hover:border-luxury-border"
                )}
                aria-label={`View thumbnail image ${index + 1}`}
              >
                <img src={imgUrl} alt={`${title} view ${index + 1}`} className="w-full h-full object-contain" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
