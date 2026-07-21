"use client";

import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { DemoStage } from "./useAIDemoSequence";

interface Props {
  stage: DemoStage;
}

export function WorkflowProgress({ stage }: Props) {
  const steps = [
    {
      id: "message",
      label: "Message received",
      isActive: stage !== "idle",
      isDone: [
        "qualified",
        "handoff",
        "context-received",
        "calling",
        "connected",
        "speaking",
        "booking",
        "crm-updated",
        "confirmation-sent",
        "completed",
      ].includes(stage),
    },
    {
      id: "qualified",
      label: "Qualified",
      isActive: [
        "qualified",
        "handoff",
        "context-received",
        "calling",
        "connected",
        "speaking",
        "booking",
        "crm-updated",
        "confirmation-sent",
        "completed",
      ].includes(stage),
      isDone: [
        "context-received",
        "calling",
        "connected",
        "speaking",
        "booking",
        "crm-updated",
        "confirmation-sent",
        "completed",
      ].includes(stage),
    },
    {
      id: "called",
      label: "Called",
      isActive: [
        "calling",
        "connected",
        "speaking",
        "booking",
        "crm-updated",
        "confirmation-sent",
        "completed",
      ].includes(stage),
      isDone: [
        "booking",
        "crm-updated",
        "confirmation-sent",
        "completed",
      ].includes(stage),
    },
    {
      id: "booked",
      label: "Booked",
      isActive: [
        "booking",
        "crm-updated",
        "confirmation-sent",
        "completed",
      ].includes(stage),
      isDone: stage === "completed",
    },
  ];

  return (
    <div className="w-full my-8 p-3.5 md:p-4 rounded-2xl bg-white/5 border border-white/10 font-sans text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-colors ${
                  step.isDone
                    ? "bg-emerald-500 text-slate-950"
                    : step.isActive
                    ? "bg-[var(--bail-orange)] text-white"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {step.isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                ) : (
                  `0${i + 1}`
                )}
              </div>
              <span
                className={`text-xs font-semibold ${
                  step.isActive ? "text-white font-bold" : "text-white/40"
                }`}
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <ArrowRight className="hidden sm:block w-3.5 h-3.5 text-white/20" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
