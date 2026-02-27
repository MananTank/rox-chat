import { useRef, useCallback } from "react";
import type { Step, ResponseStatus } from "@/components/chat-response";

export interface ThinkingState {
  status: ResponseStatus;
  steps: Step[];
  currentStepIndex: number;
  thinkingTimeSeconds: number;
  response?: string;
}

interface StepDefinition {
  id: string;
  title: string;
  actions: { icon: "search" | "data"; label: string }[];
  durationMs: number;
}

const MOCK_STEPS: StepDefinition[] = [
  {
    id: "1",
    title:
      "Looking at any recent meetings you have had with this account in the past couple days and summarizing findings",
    actions: [{ icon: "search", label: "Searching over meetings with Stripe" }],
    durationMs: 3000,
  },
  {
    id: "2",
    title:
      "Searching my deals and seeing if there has been any activity on the deal",
    actions: [
      { icon: "search", label: "Retrieving available deal stages" },
      { icon: "data", label: "Retrieving deals for Stripe" },
    ],
    durationMs: 3000,
  },
  {
    id: "3",
    title: "Searching Rox and the web for recent public news on this account",
    actions: [
      {
        icon: "search",
        label: "Retrieving information on public news postings for Stripe",
      },
      {
        icon: "search",
        label: 'Searching the web for "Stripe news September 2025"',
      },
    ],
    durationMs: 3000,
  },
  {
    id: "4",
    title: "Compiling findings and generating summary report",
    actions: [
      { icon: "data", label: "Aggregating meeting notes and deal activity" },
      { icon: "search", label: "Cross-referencing news with account history" },
    ],
    durationMs: 3000,
  },
];

const MOCK_RESPONSE = `Based on my analysis, here are the key developments for Stripe over the past week:

Recent Meetings
You had a call with Sarah Chen (VP of Engineering) on Tuesday discussing the enterprise API integration timeline. Key takeaway: they're looking to accelerate the rollout to Q1 2026.

Deal Activity
The enterprise deal moved from "Negotiation" to "Contract Review" stage. Legal is reviewing the MSA with expected completion by end of month.

Public News
Stripe announced a new partnership with major European banks to expand SEPA instant payments coverage. This aligns with their push into the European market that Sarah mentioned in your call.

Recommended Actions
1. Follow up with Sarah about the Q1 timeline concerns
2. Prepare the technical documentation they requested
3. Loop in your solutions engineer for the API deep-dive scheduled next week`;

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export function useThinking() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startThinking = useCallback(
    async (onUpdate: (state: ThinkingState) => void): Promise<void> => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const startTime = Date.now();
      let currentStepIndex = 0;

      const getThinkingTime = () => Math.floor((Date.now() - startTime) / 1000);

      const buildSteps = (activeIndex: number): Step[] => {
        return MOCK_STEPS.map((step, idx) => ({
          id: step.id,
          title: step.title,
          actions: step.actions,
          status:
            idx < activeIndex
              ? "completed"
              : idx === activeIndex
                ? "active"
                : "pending",
        }));
      };

      onUpdate({
        status: "thinking",
        steps: [],
        currentStepIndex: 0,
        thinkingTimeSeconds: 0,
      });

      try {
        await delay(1500, signal);

        timerRef.current = setInterval(() => {
          if (!signal.aborted) {
            onUpdate({
              status: "thinking",
              steps: buildSteps(currentStepIndex),
              currentStepIndex,
              thinkingTimeSeconds: getThinkingTime(),
            });
          }
        }, 1000);

        onUpdate({
          status: "thinking",
          steps: buildSteps(0),
          currentStepIndex: 0,
          thinkingTimeSeconds: getThinkingTime(),
        });

        for (let i = 0; i < MOCK_STEPS.length; i++) {
          currentStepIndex = i;
          onUpdate({
            status: "thinking",
            steps: buildSteps(i),
            currentStepIndex: i,
            thinkingTimeSeconds: getThinkingTime(),
          });

          await delay(MOCK_STEPS[i].durationMs, signal);
        }

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        onUpdate({
          status: "completed",
          steps: buildSteps(MOCK_STEPS.length),
          currentStepIndex: MOCK_STEPS.length,
          thinkingTimeSeconds: getThinkingTime(),
          response: MOCK_RESPONSE,
        });
      } catch (err) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        if (err instanceof DOMException && err.name === "AbortError") {
          onUpdate({
            status: "stopped",
            steps: buildSteps(currentStepIndex),
            currentStepIndex,
            thinkingTimeSeconds: getThinkingTime(),
          });
        }
      }
    },
    [],
  );

  const stopThinking = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    abortControllerRef.current?.abort();
  }, []);

  return { startThinking, stopThinking };
}
