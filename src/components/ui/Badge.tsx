import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "category" | "instock" | "lowstock" | "outstock" | "gold" | "outline";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "category", className }) => {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide uppercase transition-colors";

  const variants = {
    category: "bg-luxury-card text-luxury-subtext border border-luxury-border/80",
    instock: "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40",
    lowstock: "bg-amber-950/60 text-amber-300 border border-amber-800/40",
    outstock: "bg-red-950/60 text-red-300 border border-red-800/40",
    gold: "bg-luxury-goldLight text-luxury-gold border border-luxury-gold/30",
    outline: "border border-luxury-border/80 text-luxury-muted",
  };

  return <span className={cn(baseStyles, variants[variant], className)}>{children}</span>;
};

export function getStockBadge(stock: number) {
  if (stock === 0) {
    return <Badge variant="outstock">Out of Stock</Badge>;
  }
  if (stock < 10) {
    return <Badge variant="lowstock">Low Stock ({stock})</Badge>;
  }
  return <Badge variant="instock">In Stock ({stock})</Badge>;
}

export default Badge;
