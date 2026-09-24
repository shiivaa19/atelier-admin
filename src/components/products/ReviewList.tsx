import React from "react";
import { Star, UserCheck } from "lucide-react";
import { ProductReview } from "@/types/product";

interface ReviewListProps {
  reviews?: ProductReview[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-luxury-surface/40 border border-luxury-border/60 text-center text-xs text-luxury-subtext">
        No customer reviews published for this item yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-luxury-text flex items-center gap-2">
        Verified Reviews <span className="text-xs font-mono text-luxury-gold">({reviews.length})</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-luxury-surface/60 border border-luxury-border/60 space-y-2.5 animate-fadeIn"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold flex items-center justify-center text-xs font-bold">
                  {rev.reviewerName?.[0] || "U"}
                </div>
                <div>
                  <p className="text-xs font-semibold text-luxury-text">{rev.reviewerName}</p>
                  <p className="text-[10px] text-luxury-subtext">{rev.reviewerEmail}</p>
                </div>
              </div>

              {/* Rating stars */}
              <div className="flex items-center gap-1 bg-luxury-card px-2 py-1 rounded-md border border-luxury-border/40">
                <Star className="w-3 h-3 fill-luxury-gold text-luxury-gold shrink-0" />
                <span className="font-mono text-xs font-medium text-luxury-text">
                  {rev.rating}
                </span>
              </div>
            </div>

            <p className="text-xs text-luxury-subtext leading-relaxed font-light italic">
              "{rev.comment}"
            </p>

            <div className="flex items-center justify-between text-[10px] text-luxury-muted pt-1 border-t border-luxury-border/30">
              <span className="flex items-center gap-1 text-emerald-400">
                <UserCheck className="w-3 h-3" /> Verified Purchase
              </span>
              <span>{new Date(rev.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
