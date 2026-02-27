"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  BriefcaseIcon,
  CheckIcon,
  ChevronDownIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { RoxIcon } from "@/components/icons/rox";
import { FluidHeight } from "fluid-height";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { motion, AnimatePresence } from "motion/react";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

export interface StepAction {
  icon: "search" | "data";
  label: string;
}

export interface Step {
  id: string;
  title: string;
  status: "pending" | "active" | "completed";
  actions: StepAction[];
}

export type ResponseStatus = "thinking" | "completed" | "stopped";

export interface ChatResponseProps {
  status: ResponseStatus;
  steps: Step[];
  currentStepIndex: number;
  totalSteps: number;
  thinkingTimeSeconds: number;
  response?: string;
  className?: string;
}

export function ChatResponse({
  status,
  steps,
  currentStepIndex,
  totalSteps,
  thinkingTimeSeconds,
  response,
  className,
}: ChatResponseProps) {
  const [showThinking, setShowThinking] = useState(false);

  const isComplete = status === "completed" || status === "stopped";

  return (
    <div className={className}>
      {!isComplete ? (
        <FluidHeight>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {steps.length === 0 ? (
                <motion.div
                  key="thinking"
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: easeOutQuint }}
                >
                  <ResponseIcon />
                  <AnimatedShinyText
                    className="text-base font-medium"
                    variant="primary"
                  >
                    Thinking...
                  </AnimatedShinyText>
                </motion.div>
              ) : (
                <motion.div
                  key="steps"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: easeOutQuint }}
                >
                  <div className="flex items-center gap-3">
                    <ResponseIcon />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <AnimatedShinyText
                          className="text-base font-medium"
                          variant="primary"
                        >
                          Step {currentStepIndex + 1} of {totalSteps}
                        </AnimatedShinyText>
                        <motion.span
                          key={currentStepIndex}
                          className="text-base font-medium text-muted-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {Math.max(
                            0,
                            Math.ceil((totalSteps - currentStepIndex) * 0.5),
                          )}{" "}
                          min left
                        </motion.span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: totalSteps }).map((_, idx) => (
                          <motion.div
                            key={idx}
                            className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
                          >
                            <motion.div
                              className="h-full bg-primary-foreground"
                              initial={{ width: 0 }}
                              animate={{
                                width: idx <= currentStepIndex ? "100%" : "0%",
                              }}
                              transition={{
                                duration: 0.4,
                                ease: easeOutQuint,
                                delay: idx * 0.05,
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 relative">
                    <motion.div
                      className="absolute left-[20px] -top-[24px] h-[12px] w-px bg-border"
                      initial={{ scaleY: 0, originY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3, ease: easeOutQuint }}
                    />
                    <StepsList
                      steps={steps}
                      currentStepIndex={currentStepIndex}
                      mode="thinking"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FluidHeight>
      ) : (
        <div className="space-y-4">
          <FluidHeight>
            <div className="space-y-4">
              <button
                onClick={() => setShowThinking(!showThinking)}
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ResponseIcon />
                <span className="text-base font-medium text-primary-foreground">
                  {status === "stopped"
                    ? `Stopped after ${thinkingTimeSeconds} seconds`
                    : `Thought for ${thinkingTimeSeconds} seconds`}
                </span>
                <ChevronDownIcon
                  className={cn(
                    "size-4 transition-transform duration-200",
                    showThinking ? "rotate-180" : "rotate-0",
                  )}
                />
              </button>

              <AnimatePresence mode="popLayout" initial={false}>
                {showThinking ? (
                  <div>
                    <div className="h-5" />
                    <motion.div
                      key="thinking-expanded"
                      className="pb-4 relative"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: easeOutQuint }}
                    >
                      <div className="absolute left-[20px] -top-[24px] h-[12px] w-px bg-border/50" />
                      <StepsList
                        steps={steps}
                        currentStepIndex={currentStepIndex}
                        mode="completed"
                        wasStopped={status === "stopped"}
                      />
                    </motion.div>
                  </div>
                ) : (
                  <motion.div key="thinking-collapsed" className="h-1" />
                )}
              </AnimatePresence>
            </div>
          </FluidHeight>

          {response && (
            <motion.div
              className="prose prose-sm prose-invert max-w-none"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: easeOutQuint }}
            >
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {response}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

function ResponseIcon() {
  return (
    <div
      className="size-10 rounded-full border border-border/70 flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <RoxIcon className="size-6 text-primary-foreground" />
    </div>
  );
}

function StepsList({
  steps,
  currentStepIndex,
  mode,
  wasStopped = false,
}: {
  steps: Step[];
  currentStepIndex?: number;
  mode: "thinking" | "completed";
  wasStopped?: boolean;
}) {
  const visibleSteps = steps.slice(0, (currentStepIndex ?? 0) + 1);
  const isCompleted = mode === "completed";

  return (
    <div className="pl-14 relative space-y-8">
      <AnimatePresence mode="popLayout">
        {visibleSteps.map((step, idx) => {
          const isLast = idx === visibleSteps.length - 1;
          const isStepComplete =
            wasStopped && isLast
              ? false
              : isCompleted || step.status === "completed";
          const isActive = !isCompleted && step.status === "active";

          return (
            <motion.div
              key={step.id}
              className="relative"
              initial={{ opacity: 0, y: isCompleted ? 0 : -12 }}
              animate={{ opacity: 1, y: isCompleted ? 0 : 0 }}
              transition={{
                duration: 0.4,
                type: "spring",
                bounce: 0.0,
                delay: isCompleted ? 0 : 0.2,
              }}
              layout
            >
              {!isLast &&
                (isCompleted ? (
                  <div className="absolute left-[-34px] top-12 bottom-[-12px] w-px bg-border" />
                ) : (
                  <motion.div
                    className="absolute left-[-34px] top-12 bottom-[-12px] w-px bg-border"
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      duration: 0.4,
                      ease: easeOutQuint,
                      delay: 0.1,
                    }}
                  />
                ))}
              <motion.div
                className={cn(
                  "absolute -left-[54px] -top-1 size-10 rounded-full flex items-center justify-center",
                  isStepComplete && "bg-muted/15",
                )}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: easeOutQuint }}
              >
                {isActive && (
                  <div className="absolute size-10 rounded-full border border-dashed border-primary-foreground/50 animate-spin [animation-duration:4s]" />
                )}
                <motion.div
                  className={cn(
                    "size-6 rounded-full flex items-center justify-center",
                    isStepComplete && "bg-muted-foreground/30",
                    isActive && "bg-primary/60",
                    wasStopped && isLast && "bg-destructive/10",
                  )}
                  layout
                >
                  {wasStopped && isLast ? (
                    <XIcon className="size-3.5 text-destructive" />
                  ) : isCompleted ? (
                    <CheckIcon className="size-3.5 text-foreground" />
                  ) : (
                    <AnimatePresence mode="wait">
                      {isStepComplete ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            duration: 0.2,
                            bounce: 0.3,
                          }}
                        >
                          <CheckIcon className="size-3.5 text-foreground" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="number"
                          className={cn(
                            "text-xs font-medium",
                            isActive
                              ? "text-primary-foreground"
                              : "text-muted-foreground",
                          )}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {idx + 1}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              </motion.div>

              <div
                className={cn(
                  "space-y-3 transition-opacity duration-300",
                  mode !== "completed" && !isActive && "opacity-50",
                )}
              >
                {isActive ? (
                  <AnimatedShinyText className="text-sm leading-relaxed">
                    {step.title}
                  </AnimatedShinyText>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.title}
                  </p>
                )}

                {step.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {step.actions.map((action, actionIdx) => (
                      <ActionPill action={action} key={actionIdx} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function ActionPill({ action }: { action: StepAction }) {
  return (
    <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2">
      {action.icon === "search" ? (
        <SearchIcon className="size-3.5 text-muted-foreground" />
      ) : (
        <BriefcaseIcon className="size-3.5 text-muted-foreground" />
      )}
      <span className="text-xs text-muted-foreground">{action.label}</span>
    </div>
  );
}
