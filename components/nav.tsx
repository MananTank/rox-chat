"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Demo" },
  { href: "/stories", label: "Stories" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-2xl px-4 py-5">
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
