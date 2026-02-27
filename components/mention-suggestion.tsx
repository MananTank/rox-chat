"use client";

import { useState, forwardRef, useEffect, useImperativeHandle } from "react";
import { ReactRenderer } from "@tiptap/react";
import type { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import type { MentionNodeAttrs } from "@tiptap/extension-mention";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import { cn } from "@/lib/utils";

export interface MentionItem {
  id: string;
  name: string;
  icon?: string;
}

interface MentionListProps {
  items: MentionItem[];
  command: (item: MentionItem) => void;
}

export const MentionList = forwardRef<
  { onKeyDown: (props: { event: KeyboardEvent }) => boolean },
  MentionListProps
>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-popover border border-border squircle-2xl shadow-lg overflow-hidden min-w-[200px]">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => selectItem(index)}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors",
            index === selectedIndex
              ? "bg-accent/30 text-accent-foreground"
              : "text-popover-foreground hover:bg-accent/30",
          )}
        >
          {item.icon && (
            <img src={item.icon} alt="" className="size-4 rounded-sm" />
          )}
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
});

MentionList.displayName = "MentionList";

interface CreateSuggestionOptions {
  items: MentionItem[];
  onSelect: (item: MentionItem) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export function createSuggestion({
  items,
  onSelect,
  onOpenChange,
}: CreateSuggestionOptions): Omit<
  SuggestionOptions<MentionItem, MentionNodeAttrs>,
  "editor"
> {
  return {
    items: ({ query }: { query: string }) => {
      return items
        .filter((item) =>
          item.name.toLowerCase().startsWith(query.toLowerCase()),
        )
        .slice(0, 8);
    },

    render: () => {
      let component: ReactRenderer<
        { onKeyDown: (props: { event: KeyboardEvent }) => boolean },
        MentionListProps
      >;
      let popup: TippyInstance[];
      let currentProps: SuggestionProps<MentionItem, MentionNodeAttrs>;

      const executeCommand = (item: MentionItem) => {
        currentProps.command({ id: item.id, label: item.name });
        onSelect(item);
      };

      return {
        onStart: (props: SuggestionProps<MentionItem, MentionNodeAttrs>) => {
          currentProps = props;
          onOpenChange?.(true);

          component = new ReactRenderer(MentionList, {
            props: {
              items: props.items,
              command: executeCommand,
            },
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
            offset: [0, 8],
          });
        },

        onUpdate(props: SuggestionProps<MentionItem, MentionNodeAttrs>) {
          currentProps = props;

          component.updateProps({
            items: props.items,
            command: executeCommand,
          });

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect as () => DOMRect,
          });
        },

        onKeyDown(props: { event: KeyboardEvent }) {
          if (props.event.key === "Escape") {
            popup[0].hide();
            onOpenChange?.(false);
            return true;
          }

          return component.ref?.onKeyDown(props) ?? false;
        },

        onExit() {
          onOpenChange?.(false);
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };
}
