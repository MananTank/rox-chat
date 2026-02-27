"use client";

import { RoxIcon } from "@/components/icons/rox";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center grow select-none">
      <div className="relative">
        <RoxIcon className="size-20 text-muted-foreground/10" />
      </div>
    </div>
  );
}
