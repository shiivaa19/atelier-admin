import api from "@/lib/axios";
import { Category } from "@/types/product";

// Excluded categories (vehicles, motorcycles, automotive, bikes)
const EXCLUDED_CATEGORY_KEYWORDS = ["vehicle", "motorcycle", "automotive", "bike"];

export const categoriesService = {
  /**
   * Fetch categories list
   * GET /products/categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Array<string | Category>>("/products/categories");
    
    // Normalize response if items are strings or Category objects
    const normalized = response.data.map((item) => {
      if (typeof item === "string") {
        return {
          slug: item,
          name: item.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          url: `/products/category/${item}`,
        };
      }
      return item;
    });

    // Exclude vehicle and bike categories as requested
    return normalized.filter(
      (cat) => !EXCLUDED_CATEGORY_KEYWORDS.some((kw) => cat.slug.toLowerCase().includes(kw))
    );
  },
};

export default categoriesService;
