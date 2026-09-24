import React from "react";
import { PackageSearch } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No products found",
  description = "We couldn't find any catalog items matching your current search or filter criteria.",
  actionLabel = "Clear Filters",
  onAction,
}) => {
  return (
    <div className="p-12 text-center rounded-2xl bg-luxury-surface/40 border border-luxury-border/60 flex flex-col items-center justify-center my-6 max-w-md mx-auto animate-fadeIn">
      <div className="w-14 h-14 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mb-4 shadow-gold">
        <PackageSearch className="w-7 h-7 text-luxury-gold" />
      </div>
      <h3 className="text-lg font-semibold text-luxury-text mb-2">{title}</h3>
      <p className="text-xs md:text-sm text-luxury-subtext leading-relaxed mb-6 max-w-xs">
        {description}
      </p>
      {onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
