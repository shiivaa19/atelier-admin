"use client";

import React from "react";
import ErrorState from "@/components/ui/ErrorState";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <ErrorState
        title="Error Loading Product Details"
        message={error.message || "Unable to fetch product details from server."}
        onRetry={reset}
      />
    </div>
  );
}
