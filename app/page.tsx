"use client";

import { useRef, useState, Fragment } from "react";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { ChatResponse } from "@/components/chat-response";
import { EmptyState } from "@/components/empty-state";
import { Nav } from "@/components/nav";
import { useThinking, type ThinkingState } from "@/hooks/use-thinking";

interface ConversationItem {
  id: string;
  userMessage: string;
  thinkingState: ThinkingState;
}

const initialThinkingState: ThinkingState = {
  status: "thinking",
  steps: [],
  currentStepIndex: 0,
  thinkingTimeSeconds: 0,
};

export default function Page() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { startThinking, stopThinking } = useThinking();
  const mainRef = useRef<HTMLElement>(null);

  const handleSend = async (message: string) => {
    const conversationId = Date.now().toString();

    const newConversation: ConversationItem = {
      id: conversationId,
      userMessage: message,
      thinkingState: initialThinkingState,
    };

    setConversations((prev) => [...prev, newConversation]);
    setIsLoading(true);

    requestAnimationFrame(() => {
      mainRef.current?.scrollTo({
        top: mainRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

    await startThinking((state) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, thinkingState: state } : conv,
        ),
      );

      if (state.status === "completed" || state.status === "stopped") {
        setIsLoading(false);
      }
    });
  };

  const handleStop = () => {
    stopThinking();
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <Nav />
      <main ref={mainRef} className="flex-1 overflow-y-auto flex flex-col">
        <div className="mx-auto w-full max-w-2xl px-4 py-8 space-y-6 flex flex-col grow">
          {conversations.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {conversations.map((conversation) => (
                <Fragment key={conversation.id}>
                  <ChatMessage content={conversation.userMessage} />
                  <ChatResponse
                    status={conversation.thinkingState.status}
                    steps={conversation.thinkingState.steps}
                    currentStepIndex={
                      conversation.thinkingState.currentStepIndex
                    }
                    totalSteps={4}
                    thinkingTimeSeconds={
                      conversation.thinkingState.thinkingTimeSeconds
                    }
                    response={conversation.thinkingState.response}
                  />
                </Fragment>
              ))}

              {/* this allows us to scroll the user's sent messages to top*/}
              <div className="min-h-[50vh]" />
            </>
          )}
        </div>
      </main>

      <div className="w-full pb-6 pt-4 max-w-2xl px-4 mx-auto">
        <ChatInput
          isLoading={isLoading}
          onSend={handleSend}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}
