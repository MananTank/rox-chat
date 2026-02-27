"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronsUpDownIcon, CheckIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SelectMenuItem {
  id: string;
  name: string;
  icon?: string;
}

interface SelectMenuProps<T extends SelectMenuItem> {
  items: T[];
  value: T;
  onChange: (item: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
}

function ItemIcon({
  src,
  size = 18,
  className,
}: {
  src: string;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("object-contain rounded-[2px]", className)}
      unoptimized
    />
  );
}

export function SelectMenu<T extends SelectMenuItem>({
  items,
  value,
  onChange,
  searchPlaceholder = "Search",
  className,
  triggerClassName,
}: SelectMenuProps<T>) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredItems = React.useMemo(() => {
    if (!search.trim()) return items;
    const query = search.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, search]);

  React.useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSelect = (item: T) => {
    onChange(item);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={className}
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1.5 px-1.5 text-muted-foreground hover:text-foreground",
              triggerClassName,
            )}
          >
            {value.icon && <ItemIcon src={value.icon} size={16} />}
            <span className="text-sm text-muted-foreground font-normal">
              {value.name}
            </span>
            <ChevronsUpDownIcon className="size-3.5 opacity-50" />
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className={cn(
          "w-60 p-0 overflow-hidden squircle-2xl bg-card shadow-lg border-0",
        )}
      >
        <div className="border-b  px-2" onKeyDown={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 px-2">
            <SearchIcon className="size-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent h-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="h-64 overflow-y-auto overscroll-none p-1.5 space-y-0.5">
          {filteredItems.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            filteredItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleSelect(item)}
                className={cn(
                  "gap-2.5 rounded-md px-2 py-2 cursor-pointer",
                  value.id === item.id && "bg-accent/30",
                )}
              >
                {item.icon && <ItemIcon src={item.icon} size={14} />}
                <span className="flex-1 text-sm">{item.name}</span>
                {value.id === item.id && (
                  <CheckIcon className="size-3.5 text-muted-foreground" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
