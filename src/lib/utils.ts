import { clsx, type ClassValue } from "clsx";

/**
 * Utility for combining Tailwind CSS class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format currency in USD with luxury serif presentation
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Capitalize first letter of category or tag
 */
export function formatCategoryName(slug: string): string {
  if (!slug) return "";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Format "Showing X–Y of Z" pagination range text accurately
 */
export function formatPaginationText(total: number, skip: number, limit: number): string {
  if (total === 0) return "Showing 0 of 0";
  const start = skip + 1;
  const end = Math.min(skip + limit, total);
  return `Showing ${start}–${end} of ${total}`;
}

/**
 * Calculate original price prior to discount
 */
export function calculateOriginalPrice(price: number, discountPercentage: number): number {
  if (!discountPercentage || discountPercentage <= 0) return price;
  return price / (1 - discountPercentage / 100);
}
