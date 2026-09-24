import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "gold",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      onClick,
      ...props
    },
    ref
  ) => {
    // In-flight request protection flag
    const isPending = isLoading || disabled;

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:ring-offset-2 focus:ring-offset-luxury-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-lg select-none active:scale-[0.98]";

    const variants = {
      gold: "bg-luxury-gold text-luxury-bg font-semibold hover:bg-luxury-goldHover shadow-gold hover:shadow-lg",
      secondary: "bg-luxury-card text-luxury-text hover:bg-luxury-hover border border-luxury-border/60",
      danger: "bg-red-950/60 text-red-300 hover:bg-red-900/80 border border-red-800/40",
      ghost: "text-luxury-subtext hover:text-luxury-text hover:bg-luxury-surface",
      outline: "border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-goldLight",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5 font-semibold",
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isPending) {
        e.preventDefault();
        return;
      }
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        disabled={isPending}
        onClick={handleClick}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
