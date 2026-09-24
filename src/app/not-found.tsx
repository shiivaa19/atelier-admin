"use client";

import React from "react";
import Link from "next/link";
import { PackageX, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/40 flex items-center justify-center mb-6 shadow-gold">
        <PackageX className="w-8 h-8 text-luxury-gold" />
      </div>

      <span className="text-xs font-mono uppercase tracking-widest text-luxury-gold block mb-2 font-semibold">
        PAGE NOT FOUND (404)
      </span>

      <h1 className="text-2xl md:text-3xl font-semibold text-luxury-text mb-3">
        Page Not Found
      </h1>

      <p className="text-xs md:text-sm text-luxury-subtext max-w-md mb-8 leading-relaxed font-normal">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link href="/products">
        <Button variant="gold" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Dashboard Products
        </Button>
      </Link>
    </div>
  );
}
