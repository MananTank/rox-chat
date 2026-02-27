"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

interface ChatMessageProps {
  content: string;
  className?: string;
}

export function ChatMessage({ content, className }: ChatMessageProps) {
  return (
    <motion.div
      className={cn("flex justify-end", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easeOutQuint }}
    >
      <div className="bg-card text-foreground px-4 py-2.5 rounded-[18px] text-sm max-w-[80%]">
        {/* TODO - markdown parsing */}
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}
