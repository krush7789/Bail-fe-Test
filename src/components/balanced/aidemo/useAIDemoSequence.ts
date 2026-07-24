"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type DemoScenarioId = "lead-qualification" | "customer-support" | "appointment-booking";

export type DemoStage =
  | "idle"
  | "user-msg-1"
  | "bot-typing-1"
  | "bot-msg-1"
  | "user-msg-2"
  | "bot-typing-2"
  | "bot-msg-2"
  | "qualified"
  | "handoff"
  | "context-received"
  | "calling"
  | "connected"
  | "speaking"
  | "booking"
  | "crm-updated"
  | "confirmation-sent"
  | "completed";

export interface ScenarioData {
  id: DemoScenarioId;
  label: string;
  userMsg1: string;
  botMsg1: string;
  userMsg2: string;
  botMsg2: string;
  checklist: string[];
  voiceTranscript: string;
  voiceIntent: string;
  nextAction: string;
  outcomeTitle: string;
  outcomeTime: string;
}

export const SCENARIOS: Record<DemoScenarioId, ScenarioData> = {
  "lead-qualification": {
    id: "lead-qualification",
    label: "Lead Qualification",
    userMsg1: "We want to automate customer support and lead follow-ups for our agency.",
    botMsg1: "I can help with that. Roughly how many customer enquiries do you receive each week?",
    userMsg2: "About 200, mostly through our website and WhatsApp.",
    botMsg2: "Understood! I will arrange a short consultation with our AI automation team.",
    checklist: ["Requirement identified", "200+ Weekly Leads", "Lead qualified"],
    voiceTranscript: "Calling to confirm your 1-on-1 automation consultation for tomorrow at 3:00 PM.",
    voiceIntent: "Confirm Consultation",
    nextAction: "Create Calendar Booking",
    outcomeTitle: "Consultation Booked",
    outcomeTime: "Tomorrow at 3:00 PM",
  },
  "customer-support": {
    id: "customer-support",
    label: "Customer Support",
    userMsg1: "How quickly can your AI chatbot deploy on our e-commerce website?",
    botMsg1: "Our bots deploy in under 7 days, trained on your FAQs, products, and CRM.",
    userMsg2: "Can it escalate complex order disputes to a live voice call?",
    botMsg2: "Yes! High-priority issues instantly trigger our Voice AI Agent with full context.",
    checklist: ["Product FAQ Trained", "Shopify & CRM Sync", "Voice Escalation Active"],
    voiceTranscript: "Hello! Calling from Bits AI Lab to verify your support integration setup.",
    voiceIntent: "Support Escalation",
    nextAction: "Dispatch Technical Brief",
    outcomeTitle: "Support Workflow Live",
    outcomeTime: "7-Day Deployment Locked",
  },
  "appointment-booking": {
    id: "appointment-booking",
    label: "Appointment Booking",
    userMsg1: "I'd like to book a 1-on-1 strategy call with your AI architecture team.",
    botMsg1: "Great! What day and time work best for your team?",
    userMsg2: "Tuesday afternoon around 3:00 PM IST works best.",
    botMsg2: "Perfect. Handing context over to Voice AI to lock in your calendar slot.",
    checklist: ["1-on-1 Scope Defined", "Slot Selected: Tue 3:00 PM", "Auto-Calendar Sync"],
    voiceTranscript: "Confirming your AI Strategy Session with Bits AI Lab for Tuesday at 3:00 PM IST.",
    voiceIntent: "Lock Calendar Slot",
    nextAction: "Sync Google / Outlook Cal",
    outcomeTitle: "Strategy Session Locked",
    outcomeTime: "Tuesday at 3:00 PM IST",
  },
};

export function useAIDemoSequence() {
  const [scenarioId, setScenarioId] = useState<DemoScenarioId>("lead-qualification");
  const [stage, setStage] = useState<DemoStage>("idle");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [callTimer, setCallTimer] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check reduced motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mq.matches);
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (callIntervalRef.current) clearInterval(callIntervalRef.current);
  }, []);

  // Call duration counter
  useEffect(() => {
    if (["connected", "speaking", "booking", "crm-updated", "confirmation-sent", "completed"].includes(stage) && !isPaused) {
      callIntervalRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    }
    return () => {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    };
  }, [stage, isPaused]);

  // Main scripted timeline controller
  const runNextStage = useCallback(
    (currentStage: DemoStage) => {
      clearAllTimers();
      if (isPaused) return;

      const schedule = (next: DemoStage, ms: number) => {
        timerRef.current = setTimeout(() => {
          setStage(next);
          runNextStage(next);
        }, ms);
      };

      switch (currentStage) {
        case "idle":
          schedule("user-msg-1", 600);
          break;
        case "user-msg-1":
          schedule("bot-typing-1", 800);
          break;
        case "bot-typing-1":
          schedule("bot-msg-1", 1200);
          break;
        case "bot-msg-1":
          schedule("user-msg-2", 1400);
          break;
        case "user-msg-2":
          schedule("bot-typing-2", 800);
          break;
        case "bot-typing-2":
          schedule("bot-msg-2", 1200);
          break;
        case "bot-msg-2":
          schedule("qualified", 1200);
          break;
        case "qualified":
          schedule("handoff", 1000);
          break;
        case "handoff":
          schedule("context-received", 1000);
          break;
        case "context-received":
          schedule("calling", 800);
          break;
        case "calling":
          schedule("connected", 1200);
          break;
        case "connected":
          schedule("speaking", 1000);
          break;
        case "speaking":
          schedule("booking", 1800);
          break;
        case "booking":
          schedule("crm-updated", 1200);
          break;
        case "crm-updated":
          schedule("confirmation-sent", 1000);
          break;
        case "confirmation-sent":
          schedule("completed", 1000);
          break;
        case "completed":
          // Hold completed state for 4 seconds then loop
          timerRef.current = setTimeout(() => {
            setCallTimer(0);
            setStage("idle");
            runNextStage("idle");
          }, 4500);
          break;
      }
    },
    [clearAllTimers, isPaused]
  );

  // Restart scenario execution
  const restart = useCallback(() => {
    clearAllTimers();
    setCallTimer(0);
    setStage("idle");
    if (!isPaused && !prefersReducedMotion) {
      runNextStage("idle");
    }
  }, [clearAllTimers, isPaused, prefersReducedMotion, runNextStage]);

  // Change scenario
  const changeScenario = useCallback(
    (id: DemoScenarioId) => {
      setScenarioId(id);
      clearAllTimers();
      setCallTimer(0);
      setStage("idle");
    },
    [clearAllTimers]
  );

  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Reduced motion handling
  useEffect(() => {
    if (prefersReducedMotion) {
      clearAllTimers();
      setStage("completed");
      setCallTimer(18);
    }
  }, [prefersReducedMotion, clearAllTimers]);

  return {
    scenario,
    scenarioId,
    stage,
    isPaused,
    callTimer,
    prefersReducedMotion,
    changeScenario,
    restart,
    togglePause,
    startSequence: () => runNextStage("idle"),
    stopSequence: clearAllTimers,
  };
}
