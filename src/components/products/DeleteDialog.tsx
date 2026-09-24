"use client";

import React, { useState, useRef } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";
import { Product } from "@/types/product";
import productsService from "@/services/products.service";
import { useLocalProducts } from "@/context/LocalProductsContext";
import { useToast } from "@/context/ToastContext";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess?: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const { deleteProduct } = useLocalProducts();
  const { success, error: toastError } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // In-flight double-click protection ref
  const inFlightRef = useRef(false);

  if (!product) return null;

  const handleDelete = async () => {
    if (inFlightRef.current || isDeleting) return;

    inFlightRef.current = true;
    setIsDeleting(true);

    try {
      // If item is from API (id < 90000), call DELETE /products/{id}
      if (product.id < 90000) {
        try {
          await productsService.deleteProduct(product.id);
        } catch {
          // Ignore API error for mock items, local overlay handles state
        }
      }

      deleteProduct(product.id);
      success(`Product "${product.title}" deleted.`);
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      toastError("Failed to delete product. Please try again.");
    } finally {
      inFlightRef.current = false;
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Product Confirmation"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-red-200 text-sm">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
          <p>
            Are you sure you want to delete <strong className="text-luxury-text">{product.title}</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-luxury-surface border border-luxury-border/60 text-xs text-luxury-subtext space-y-1">
          <div className="flex justify-between">
            <span>Product ID:</span>
            <span className="font-mono text-luxury-text">#{product.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Category:</span>
            <span className="text-luxury-text">{product.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-luxury-border/60">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            {isDeleting ? "Deleting..." : "Yes, Delete Product"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDialog;
