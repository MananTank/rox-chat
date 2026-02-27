"use client";

import { ChatMessage } from "@/components/chat-message";
import { ChatResponse, Step } from "@/components/chat-response";
import { Nav } from "@/components/nav";

const MOCK_STEPS: Step[] = [
  {
    id: "1",
    title:
      "Looking at any recent meetings you have had with this account in the past couple days and summarizing findings",
    actions: [{ icon: "search", label: "Searching over meetings with Stripe" }],
    status: "completed",
  },
  {
    id: "2",
    title:
      "Searching my deals and seeing if there has been any activity on the deal",
    actions: [
      { icon: "search", label: "Retrieving available deal stages" },
      { icon: "data", label: "Retrieving deals for Stripe" },
    ],
    status: "completed",
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
    status: "active",
  },
  {
    id: "4",
    title: "Compiling findings and generating summary report",
    actions: [
      { icon: "data", label: "Aggregating meeting notes and deal activity" },
      { icon: "search", label: "Cross-referencing news with account history" },
    ],
    status: "pending",
  },
];

const MOCK_RESPONSE = `Based on my analysis, here are the key developments for Stripe over the past week:

Recent Meetings
You had a call with Sarah Chen (VP of Engineering) on Tuesday discussing the enterprise API integration timeline. Key takeaway: they're looking to accelerate the rollout to Q1 2026.

Deal Activity
The enterprise deal moved from "Negotiation" to "Contract Review" stage. Legal is reviewing the MSA with expected completion by end of month.

Public News
Stripe announced a new partnership with major European banks to expand SEPA instant payments coverage. This aligns with their push into the European market that Sarah mentioned in your call.`;

function buildSteps(activeIndex: number): Step[] {
  return MOCK_STEPS.map((step, idx) => ({
    ...step,
    status:
      idx < activeIndex
        ? "completed"
        : idx === activeIndex
          ? "active"
          : "pending",
  }));
}

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-[100px]">
        {/* User Messages */}
        <div className="space-y-4">
          <ChatMessage content="What's new with Stripe?" />
          <ChatMessage content="Can you give me a detailed breakdown of all the recent activity on the Stripe account including meetings, deal updates, and any relevant news?" />
          <ChatMessage content="I need a comprehensive analysis of our enterprise accounts covering the following: 1) Recent meeting summaries and action items, 2) Deal pipeline status and movement, 3) Key stakeholder changes, 4) Competitive intelligence, and 5) Recommended next steps for each account. Please prioritize accounts by revenue potential." />
        </div>

        <ChatResponse
          status="thinking"
          steps={[]}
          currentStepIndex={0}
          totalSteps={4}
          thinkingTimeSeconds={0}
        />

        <ChatResponse
          status="thinking"
          steps={buildSteps(0)}
          currentStepIndex={0}
          totalSteps={4}
          thinkingTimeSeconds={2}
        />

        <ChatResponse
          status="thinking"
          steps={buildSteps(1)}
          currentStepIndex={1}
          totalSteps={4}
          thinkingTimeSeconds={4}
        />

        <ChatResponse
          status="thinking"
          steps={buildSteps(2)}
          currentStepIndex={2}
          totalSteps={4}
          thinkingTimeSeconds={6}
        />

        <ChatResponse
          status="thinking"
          steps={buildSteps(3)}
          currentStepIndex={3}
          totalSteps={4}
          thinkingTimeSeconds={8}
        />

        <ChatResponse
          status="completed"
          steps={buildSteps(4)}
          currentStepIndex={4}
          totalSteps={4}
          thinkingTimeSeconds={12}
          response={MOCK_RESPONSE}
        />

        {/* Stopped at step 1 (only 1 step shown) */}
        <ChatResponse
          status="stopped"
          steps={buildSteps(0)}
          currentStepIndex={0}
          totalSteps={4}
          thinkingTimeSeconds={2}
        />

        {/* Stopped at step 2 (2 steps shown, first completed, second stopped) */}
        <ChatResponse
          status="stopped"
          steps={buildSteps(1)}
          currentStepIndex={1}
          totalSteps={4}
          thinkingTimeSeconds={4}
        />

        {/* Stopped at step 3 (3 steps shown) */}
        <ChatResponse
          status="stopped"
          steps={buildSteps(2)}
          currentStepIndex={2}
          totalSteps={4}
          thinkingTimeSeconds={5}
        />
      </div>
    </div>
  );
}
