"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-luxury-gold shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-400 shrink-0" />,
  };

  const borders = {
    success: "border-luxury-gold/40 bg-luxury-card/95 text-luxury-text shadow-gold",
    error: "border-red-500/40 bg-red-950/90 text-red-100 shadow-luxury",
    info: "border-amber-500/40 bg-luxury-card/95 text-luxury-text shadow-luxury",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md transition-all duration-300 animate-toastIn",
        borders[toast.type]
      )}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-luxury-subtext hover:text-luxury-text p-1 rounded-md transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
