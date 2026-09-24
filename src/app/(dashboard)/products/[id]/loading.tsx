import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto p-4 md:p-6">
      <Skeleton className="h-6 w-32 rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="w-full aspect-square rounded-2xl" />

        <div className="space-y-4">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/3 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
