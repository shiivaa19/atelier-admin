"use client";

import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import CategorySelect from "./CategorySelect";
import { Product } from "@/types/product";
import { ProductFormData, FormErrors, validateProductForm } from "@/lib/validators";
import productsService from "@/services/products.service";
import { useLocalProducts } from "@/context/LocalProductsContext";
import { useToast } from "@/context/ToastContext";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSuccess?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSuccess,
}) => {
  const { addProduct, editProduct } = useLocalProducts();
  const { success, error: toastError } = useToast();

  const isEditing = Boolean(productToEdit);

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    category: "smartphones",
    brand: "",
    price: "",
    discountPercentage: "0",
    stock: "10",
    thumbnail: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // In-flight guard to prevent multi-submit race conditions
  const inFlightRef = useRef<boolean>(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title || "",
        description: productToEdit.description || "",
        category: productToEdit.category || "smartphones",
        brand: productToEdit.brand || "",
        price: productToEdit.price ? productToEdit.price.toString() : "",
        discountPercentage: productToEdit.discountPercentage
          ? productToEdit.discountPercentage.toString()
          : "0",
        stock: productToEdit.stock !== undefined ? productToEdit.stock.toString() : "0",
        thumbnail: productToEdit.thumbnail || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "smartphones",
        brand: "",
        price: "",
        discountPercentage: "0",
        stock: "10",
        thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
      });
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rapid double-click protection
    if (inFlightRef.current || isSubmitting) return;

    const { isValid, errors: validationErrors } = validateProductForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    inFlightRef.current = true;
    setIsSubmitting(true);

    const payload: Partial<Product> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      brand: formData.brand.trim() || undefined,
      price: parseFloat(formData.price),
      discountPercentage: parseFloat(formData.discountPercentage || "0"),
      stock: parseInt(formData.stock, 10),
      thumbnail: formData.thumbnail.trim(),
    };

    try {
      if (isEditing && productToEdit) {
        // If it's a real API product, call DummyJSON PUT /products/{id}
        if (productToEdit.id < 90000) {
          try {
            await productsService.updateProduct(productToEdit.id, payload);
          } catch {
            // Log silent warning if DummyJSON throws 404 for local mock, overlay handles state
          }
        }
        // Update local overlay store
        editProduct(productToEdit.id, payload);
        success(`Product "${payload.title}" updated successfully.`);
      } else {
        // Call DummyJSON POST /products/add
        try {
          await productsService.addProduct(payload);
        } catch {
          // Log silent warning if API fails, overlay handles state
        }
        // Add to local overlay store
        addProduct(payload as Omit<Product, "id">);
        success(`Product "${payload.title}" added to catalog.`);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch {
      toastError("Failed to save product changes. Please try again.");
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Catalog Item" : "Add Executive Product"}
      subtitle={
        isEditing
          ? `Modify specifications for item #${productToEdit?.id}`
          : "Create a new luxury product entry in the catalog"
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Masterpiece Chronograph Watch"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-widest text-luxury-subtext">
              Category
            </label>
            <CategorySelect
              value={formData.category}
              onChange={(val) => handleChange("category", val)}
            />
            {errors.category && (
              <p className="text-xs text-red-400 mt-1 font-medium">{errors.category}</p>
            )}
          </div>

          <Input
            label="Brand"
            placeholder="e.g. Aureus Atelier"
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            error={errors.brand}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Price ($ USD)"
            type="number"
            step="0.01"
            placeholder="e.g. 1450.00"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            error={errors.price}
          />

          <Input
            label="Discount (%)"
            type="number"
            step="1"
            min="0"
            max="100"
            placeholder="0"
            value={formData.discountPercentage}
            onChange={(e) => handleChange("discountPercentage", e.target.value)}
            error={errors.discountPercentage}
          />

          <Input
            label="Stock Quantity"
            type="number"
            step="1"
            min="0"
            placeholder="10"
            value={formData.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            error={errors.stock}
          />
        </div>

        <Input
          label="Thumbnail Image URL"
          placeholder="https://images.unsplash.com/..."
          value={formData.thumbnail}
          onChange={(e) => handleChange("thumbnail", e.target.value)}
          error={errors.thumbnail}
        />

        <div className="w-full space-y-1.5">
          <label className="block text-xs font-medium uppercase tracking-widest text-luxury-subtext">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Provide a detailed description of the product features, craftsmanship, and materials..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full bg-luxury-surface border border-luxury-border/80 text-luxury-text text-sm rounded-lg p-3 transition-all focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold placeholder:text-luxury-muted"
          />
          {errors.description && (
            <p className="text-xs text-red-400 mt-1 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-luxury-border/60">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" isLoading={isSubmitting}>
            {isEditing ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;
