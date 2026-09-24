export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  discountPercentage: string;
  stock: string;
  thumbnail: string;
}

export interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  brand?: string;
  price?: string;
  discountPercentage?: string;
  stock?: string;
  thumbnail?: string;
}

/**
 * Hand-written validator for Product Form data
 */
export function validateProductForm(data: ProductFormData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  // Title: min 3 chars
  if (!data.title.trim()) {
    errors.title = "Product title is required.";
  } else if (data.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters long.";
  }

  // Description: min 10 chars
  if (!data.description.trim()) {
    errors.description = "Description is required.";
  } else if (data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters long.";
  }

  // Category: required
  if (!data.category.trim()) {
    errors.category = "Category selection is required.";
  }

  // Price: > 0
  const numPrice = parseFloat(data.price);
  if (!data.price || isNaN(numPrice)) {
    errors.price = "Valid price is required.";
  } else if (numPrice <= 0) {
    errors.price = "Price must be greater than $0.00.";
  }

  // Stock: integer >= 0
  const numStock = parseInt(data.stock, 10);
  if (data.stock === "" || isNaN(numStock)) {
    errors.stock = "Valid stock count is required.";
  } else if (numStock < 0 || !Number.isInteger(parseFloat(data.stock))) {
    errors.stock = "Stock must be an integer greater than or equal to 0.";
  }

  // Discount percentage: 0 - 100
  const numDiscount = parseFloat(data.discountPercentage || "0");
  if (isNaN(numDiscount) || numDiscount < 0 || numDiscount > 100) {
    errors.discountPercentage = "Discount must be between 0% and 100%.";
  }

  // Thumbnail: valid URL
  if (!data.thumbnail.trim()) {
    errors.thumbnail = "Thumbnail URL is required.";
  } else {
    try {
      new URL(data.thumbnail);
    } catch {
      errors.thumbnail = "Must be a valid HTTP or HTTPS image URL.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
