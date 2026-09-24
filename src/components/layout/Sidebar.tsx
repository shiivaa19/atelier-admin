"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LogOut, Layers } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocalProducts } from "@/context/LocalProductsContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { addedProducts, editedProducts, deletedIds } = useLocalProducts();

  const hasLocalChanges =
    addedProducts.length > 0 ||
    Object.keys(editedProducts).length > 0 ||
    deletedIds.length > 0;

  const navItems = [
    {
      label: "Products Catalog",
      href: "/products",
      icon: Package,
    },
  ];

  return (
    <aside className="w-64 bg-luxury-surface border-r border-luxury-border flex flex-col justify-between h-full select-none">
      {/* Brand Header (Simplified logo & clean font) */}
      <div>
        <div className="p-6 border-b border-luxury-border/60">
          <span className="font-semibold text-lg text-luxury-text block leading-none tracking-tight">
            Aureus
          </span>
          <span className="text-[11px] text-luxury-subtext block mt-1 font-normal">
            Product Admin Dashboard
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <span className="px-3 text-[10px] uppercase tracking-wider text-luxury-subtext font-semibold block mb-2">
            NAVIGATION
          </span>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 shadow-sm"
                    : "text-luxury-subtext hover:text-luxury-text hover:bg-luxury-hover"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-luxury-gold" : "text-luxury-muted group-hover:text-luxury-text")} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer & User Profile Block */}
      <div className="p-4 border-t border-luxury-border/60 space-y-4">
        {/* Local Overlay Status Indicator */}
        {hasLocalChanges && (
          <div className="p-2.5 rounded-lg bg-luxury-goldLight border border-luxury-gold/20 flex items-center gap-2 text-[11px] text-luxury-gold">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium truncate">Demo Mode: Changes Saved Locally</span>
          </div>
        )}

        {/* User Block */}
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-luxury-card border border-luxury-border/60">
          <div className="flex items-center gap-2.5 min-w-0">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.username}
                className="w-8 h-8 rounded-full border border-luxury-border object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold flex items-center justify-center font-bold text-xs shrink-0">
                {user?.firstName?.[0] || "E"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-luxury-text truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : "Emily Sprouse"}
              </p>
              <p className="text-[10px] text-luxury-subtext truncate">@{user?.username || "emilys"}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-luxury-subtext hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors shrink-0"
            title="Sign Out"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
