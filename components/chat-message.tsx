"use client";

import * as React from "react";
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
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: easeOutQuint }}
    >
      <div className="bg-card text-foreground px-5 py-3 rounded-xl text-sm max-w-[80%]">
        {/* TODO - markdown parsing */}
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}
