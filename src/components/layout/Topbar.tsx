"use client";

import React from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const pathname = usePathname();

  let title = "Products Catalog";
  let subtitle = "Manage product listings, stock, and pricing";

  if (pathname.includes("/products/")) {
    title = "Product Details";
    subtitle = "Product specifications, reviews, and inventory status";
  }

  return (
    <header className="h-16 bg-luxury-surface/80 backdrop-blur-md border-b border-luxury-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Drawer Trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-luxury-subtext hover:text-luxury-text hover:bg-luxury-hover rounded-lg transition-colors"
          aria-label="Open Mobile Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-semibold text-luxury-text leading-tight">
            {title}
          </h1>
          <p className="text-xs text-luxury-subtext hidden sm:block font-normal">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
