import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("bg-luxury-surface/80 skeleton-shimmer rounded-lg", className)}
      {...props}
    />
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-luxury-surface/60 border border-luxury-border/40 animate-fadeIn"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/5" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full shrink-0 hidden sm:block" />
          <Skeleton className="h-5 w-16 shrink-0" />
          <Skeleton className="h-5 w-12 shrink-0 hidden md:block" />
          <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
