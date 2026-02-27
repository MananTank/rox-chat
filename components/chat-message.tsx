"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useMemo } from "react";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

interface ChatMessageProps {
  content: string;
  className?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightMentions(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/@([\w.-]+)/g, '<span class="mention">@$1</span>')
    .replace(/\n/g, "<br>");
}

export function ChatMessage({ content, className }: ChatMessageProps) {
  const processedContent = useMemo(() => highlightMentions(content), [content]);

  return (
    <motion.div
      className={cn("flex justify-end", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easeOutQuint }}
    >
      <div className="bg-card text-foreground px-4 py-2.5 rounded-[18px] text-sm max-w-[80%]">
        <div
          className="chat-message-content leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>
    </motion.div>
  );
}
