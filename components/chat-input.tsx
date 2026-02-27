"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import {
  ArrowUp,
  SquareIcon,
  BookmarkIcon,
  CircleSlashIcon,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SelectMenu, type SelectMenuItem } from "@/components/ui/select-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  createSuggestion,
  type MentionItem,
} from "@/components/mention-suggestion";

function getFaviconUrl(domain: string, size: number = 32) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

const accountsData = [
  { name: "Stripe", domain: "stripe.com" },
  { name: "Bynder", domain: "bynder.com" },
  { name: "Puma Energy", domain: "pumaenergy.com" },
  { name: "Rubrik", domain: "rubrik.com" },
  { name: "Rippling", domain: "rippling.com" },
  { name: "Ramp", domain: "ramp.com" },
  { name: "Cognition", domain: "cognition.ai" },
  { name: "Humain", domain: "humain.com" },
  { name: "Asana", domain: "asana.com" },
  { name: "Couchbase", domain: "couchbase.com" },
  { name: "Tabs", domain: "tabs.inc" },
  { name: "Rho", domain: "rho.co" },
  { name: "Snorkel", domain: "snorkel.ai" },
  { name: "Webflow", domain: "webflow.com" },
  { name: "Hightouch", domain: "hightouch.com" },
];

const accounts: SelectMenuItem[] = accountsData.map((a) => ({
  id: a.domain,
  name: a.name,
  icon: getFaviconUrl(a.domain),
}));

const mentionItems: MentionItem[] = accountsData.map((a) => ({
  id: a.domain,
  name: a.name,
  icon: getFaviconUrl(a.domain),
}));

interface ChatInputProps {
  isLoading?: boolean;
  onSend?: (message: string) => void;
  onStop?: () => void;
}

function EditorSSR() {
  return (
    <div className="w-full resize-none p-4 text-sm text-foreground overscroll-none max-h-[50vh] overflow-y-auto focus:outline-none min-h-[45px]">
      <p className="text-muted-foreground/50">Type @ to change account</p>
    </div>
  );
}

export function ChatInput({
  isLoading = false,
  onSend,
  onStop,
}: ChatInputProps) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const handleAccountSelect = useCallback((item: MentionItem) => {
    const account = accounts.find((a) => a.id === item.id);
    if (account) {
      setSelectedAccount(account);
    }
  }, []);

  const suggestion = useMemo(
    () =>
      createSuggestion({
        items: mentionItems,
        onSelect: handleAccountSelect,
        onOpenChange: setIsSuggestionOpen,
      }),
    [handleAccountSelect],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: "Type @ to change account",
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        suggestion: suggestion as any,
        deleteTriggerWithBackspace: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          "w-full resize-none p-4 text-sm",
          "text-foreground overscroll-none max-h-[50vh] overflow-y-auto",
          "focus:outline-none",
          "min-h-[45px]",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      setHasContent(editor.getText().trim().length > 0);
    },
    immediatelyRender: false,
  });

  const getText = useCallback(() => {
    if (!editor) return "";
    return editor.getText().trim();
  }, [editor]);

  const canSend = hasContent && !isLoading;

  const handleSend = useCallback(() => {
    const text = getText();
    if (text && !isLoading) {
      onSend?.(text);
      editor?.commands.clearContent();
      setHasContent(false);
    }
  }, [editor, getText, isLoading, onSend]);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey && !isSuggestionOpen) {
        const text = getText();
        if (text && !isLoading) {
          event.preventDefault();
          handleSend();
        }
      }
    };

    editor.view.dom.addEventListener("keydown", handleKeyDown);
    return () => {
      editor.view.dom.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, getText, handleSend, isLoading, isSuggestionOpen]);

  return (
    <div>
      <div
        className={cn(
          "relative flex flex-col squircle-2xl bg-card border border-border/40 overflow-hidden",
        )}
      >
        {editor ? <EditorContent editor={editor} /> : <EditorSSR />}

        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground/70 hover:text-foreground"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <BookmarkIcon
                      className={cn("size-4", isBookmarked && "fill-current")}
                    />
                  </Button>
                }
              />
              <TooltipContent>
                {isBookmarked ? "Remove bookmark" : "Save to bookmarks"}
              </TooltipContent>
            </Tooltip>

            <SelectMenu
              items={accounts}
              value={selectedAccount}
              onChange={setSelectedAccount}
              searchPlaceholder="Search account"
            />
          </div>

          {isLoading ? (
            <Button
              onClick={onStop}
              variant="ghost"
              className={cn(
                "rounded-full w-auto h-auto p-2 cursor-pointer transition-all duration-200 bg-muted hover:bg-muted/80",
              )}
            >
              <SquareIcon className="size-4 fill-muted-foreground text-muted-foreground scale-75" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              variant="primary"
              disabled={!canSend}
              className={cn(
                "rounded-full w-auto h-auto p-2 cursor-pointer hover:bg-primary/80 transition-all duration-200",
              )}
            >
              <ArrowUp className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground/30 mt-4">
        Rox command can make mistakes
      </p>
    </div>
  );
}
