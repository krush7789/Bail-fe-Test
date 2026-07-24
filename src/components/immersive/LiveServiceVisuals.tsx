"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MessageSquare,
  Mic,
  Zap,
  Database,
  Sparkles,
  Target,
  Send,
  MessageCircle,
  BarChart2,
  CheckCircle2,
  PhoneCall,
  Bot,
  FileText,
  Layers,
  Search,
  Share2,
  Clock,
  ArrowRight,
  UserCheck,
  User,
} from "lucide-react";


// ─── 01. AI Chatbots & Assistants Visual ─────────────────────────────────────
export function ChatbotVisual() {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-white/95 rounded-2xl border border-gray-200/90 shadow-sm font-sans text-xs">
      {/* Header status bar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--bail-navy)]/10 flex items-center justify-center text-[var(--bail-navy)]">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-gray-900 block leading-tight">AI Assistant</span>
            <span className="text-[9.5px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online 24/7
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-mono text-[9px]">
          WhatsApp / Web
        </span>
      </div>

      {/* Conversation timeline */}
      <div className="space-y-2.5 my-3">
        {/* Customer bubble */}
        <div className="flex justify-end">
          <div className="max-w-[82%] px-3 py-2 rounded-2xl rounded-tr-xs bg-[var(--bail-navy)] text-white text-[11px] leading-relaxed shadow-sm">
            Can your bot capture leads and sync to our CRM automatically?
          </div>
        </div>

        {/* AI bubble */}
        <div className="flex justify-start items-start gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[var(--bail-orange)]/15 flex items-center justify-center shrink-0 mt-0.5 text-[var(--bail-orange)]">
            <Sparkles className="w-3 h-3" />
          </div>
          <div className="max-w-[82%] px-3 py-2 rounded-2xl rounded-tl-xs bg-gray-100 text-gray-800 text-[11px] leading-relaxed">
            Yes! I answer FAQs instantly, qualify lead details, and sync directly to your CRM in real time.
          </div>
        </div>
      </div>

      {/* Outcome pill */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Lead Captured & CRM Synced</span>
        </div>
        <span className="text-[9.5px] font-mono text-gray-400">Response: 0.4s</span>
      </div>
    </div>
  );
}

// ─── 02. Voice AI Agents Visual ─────────────────────────────────────────────
export function VoiceVisual() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-white/95 rounded-2xl border border-gray-200/90 shadow-sm font-sans text-xs">
      {/* Call Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
          </div>
          <div>
            <span className="font-bold text-gray-900 block leading-tight">Inbound Voice AI</span>
            <span className="text-[9.5px] text-gray-500 font-mono">Exotel Line • 24/7 Active</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-mono text-[9px] font-bold">
          CALL CONNECTED
        </span>
      </div>

      {/* Human Caller <-> Central Telephone Waveform <-> AI Robot Agent */}
      <div className="my-3 flex items-center gap-2.5">
        {/* Left: Human Avatar */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-10 h-10 rounded-full border-2 border-blue-400/80 shadow-md relative overflow-hidden bg-slate-900">
            <img
              src="/images/human-avatar.png"
              alt="Human Caller"
              className="w-full h-full object-cover"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0 z-10" />
          </div>
          <span className="text-[9.5px] font-bold text-gray-700 font-mono">Human</span>
        </div>

        {/* Center: Waveform Bar with Central Telephone Circle Icon */}
        <div className="flex-1 p-2.5 bg-slate-900 rounded-2xl flex items-center justify-between gap-1.5 h-16 shadow-inner relative overflow-hidden border border-slate-800">
          {/* Left Waveform Bars */}
          <div className="flex items-center gap-1 flex-1 justify-around h-full">
            {[40, 75, 30, 90, 60].map((h, i) => (
              <motion.span
                key={`l-${i}`}
                className="w-1 rounded-full bg-gradient-to-t from-[var(--bail-orange)] to-amber-300"
                animate={
                  prefersReducedMotion
                    ? { height: `${h}%` }
                    : { height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }
                }
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: i * 0.08,
                }}
              />
            ))}
          </div>

          {/* Central Telephone Circle Badge */}
          <div className="w-9 h-9 rounded-full bg-[var(--bail-orange)] text-white shadow-lg shadow-orange-500/40 flex items-center justify-center shrink-0 border-2 border-white/20 z-10 relative">
            <PhoneCall className="w-4 h-4 animate-pulse" />
          </div>

          {/* Right Waveform Bars */}
          <div className="flex items-center gap-1 flex-1 justify-around h-full">
            {[60, 90, 35, 85, 50].map((h, i) => (
              <motion.span
                key={`r-${i}`}
                className="w-1 rounded-full bg-gradient-to-t from-amber-300 to-[var(--bail-orange)]"
                animate={
                  prefersReducedMotion
                    ? { height: `${h}%` }
                    : { height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }
                }
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: i * 0.08 + 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: AI Robot Avatar */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/80 shadow-md relative overflow-hidden bg-slate-900">
            <img
              src="/images/robot-avatar.png"
              alt="AI Robot"
              className="w-full h-full object-cover"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--bail-orange)] border-2 border-white absolute bottom-0 right-0 animate-ping z-10" />
          </div>
          <span className="text-[9.5px] font-bold text-gray-700 font-mono">AI Robot</span>
        </div>
      </div>

      {/* Action result */}
      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[var(--bail-orange)] shrink-0" />
          <span className="text-[10.5px] font-bold text-gray-800">
            Appointment Booked: Tomorrow at 2:00 PM
          </span>
        </div>
        <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
          Confirmed
        </span>
      </div>
    </div>
  );
}

// ─── 03. Workflow Automation Visual ─────────────────────────────────────────
export function WorkflowVisual() {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-white/95 rounded-2xl border border-gray-200/90 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--bail-orange)]/10 text-[var(--bail-orange)] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-gray-900">End-to-End Workflow Node Pipeline</span>
        </div>
        <span className="text-[9.5px] font-mono text-gray-400">n8n / Make Engine</span>
      </div>

      {/* Connected Nodes Flow */}
      <div className="my-3 grid grid-cols-3 gap-2 relative">
        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center">
          <span className="text-[9px] font-bold text-gray-400 block font-mono">NODE 01</span>
          <span className="text-[10.5px] font-bold text-gray-800 block mt-0.5">Webhook Trigger</span>
          <span className="text-[9px] text-gray-500 font-mono mt-1 block">Inbound Lead</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[var(--bail-navy)] text-white text-center shadow-md">
          <span className="text-[9px] font-bold text-amber-300 block font-mono">NODE 02</span>
          <span className="text-[10.5px] font-bold block mt-0.5">AI Logic Engine</span>
          <span className="text-[9px] text-blue-200 font-mono mt-1 block">LLM Processing</span>
        </div>

        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center">
          <span className="text-[9px] font-bold text-gray-400 block font-mono">NODE 03</span>
          <span className="text-[10.5px] font-bold text-gray-800 block mt-0.5">CRM Action</span>
          <span className="text-[9px] text-emerald-600 font-mono mt-1 block font-semibold">100% Automated</span>
        </div>
      </div>

      {/* Execution status */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
        <span className="text-gray-500">Status: <strong className="text-gray-900">Zero Manual Friction</strong></span>
        <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
          Execution Time: 120ms
        </span>
      </div>
    </div>
  );
}

// ─── 04. RAG Systems Visual ──────────────────────────────────────────────────
export function RagVisual() {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-white/95 rounded-2xl border border-gray-200/90 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--bail-navy)]/10 text-[var(--bail-navy)] flex items-center justify-center">
            <Database className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-gray-900">Vector Knowledge Retrieval</span>
        </div>
        <span className="text-[9.5px] font-mono text-gray-400">Pinecone RAG</span>
      </div>

      {/* Document Search Simulation */}
      <div className="my-3 space-y-2">
        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-[10.5px] font-medium text-gray-700 truncate max-w-[170px]">
              Query: SLA for custom deployment?
            </span>
          </div>
          <span className="text-[9px] font-bold text-[var(--bail-orange)] bg-[var(--bail-orange)]/10 px-2 py-0.5 rounded">
            98.4% Match
          </span>
        </div>

        {/* Vector Citation Answer */}
        <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/80">
          <p className="text-[10.5px] text-gray-800 font-medium leading-relaxed">
            “Standard deployment takes 10 to 14 business days with full client ownership.”
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-[var(--bail-navy)]" />
            <span className="text-[9px] font-mono font-semibold text-[var(--bail-navy)]">
              Source Citation: Enterprise_SLA_2026.pdf (p.14)
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
        <span className="text-gray-500">Document Sync: <strong className="text-gray-900">Real-time</strong></span>
        <span className="text-emerald-700 font-semibold">Zero Hallucinations</span>
      </div>
    </div>
  );
}

// ─── 05. Custom AI Solution Visual ─────────────────────────────────────────
export function CustomAIVisual() {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-white/95 rounded-2xl border border-gray-200/90 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-gray-900">Custom Architecture Blueprint</span>
        </div>
        <span className="text-[9.5px] font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">
          Bespoke AI
        </span>
      </div>

      {/* Architecture Blocks */}
      <div className="my-3 space-y-2">
        <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-700">01. Data Ingestion & ETL</span>
          <span className="text-[9px] font-mono text-gray-400">REST API / SQL</span>
        </div>
        <div className="p-2 rounded-xl bg-[var(--bail-navy)] text-white flex items-center justify-between shadow-sm">
          <span className="text-[10px] font-bold">02. Fine-Tuned Model Engine</span>
          <span className="text-[9px] font-mono text-amber-300">Proprietary LLM</span>
        </div>
        <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-700">03. Automated Output & Analytics</span>
          <span className="text-[9px] font-mono text-emerald-600 font-bold">ROI Dashboard</span>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
        <span className="text-gray-500">Ownership: <strong className="text-gray-900">100% Client Owned</strong></span>
        <span className="text-[9px] font-mono text-gray-400">Zero Vendor Lock-in</span>
      </div>
    </div>
  );
}

// ─── 06. Lead Generation & Qualification Visual ────────────────────────────
export function LeadGenVisual() {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-white/95 rounded-2xl border border-gray-200/90 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--bail-orange)]/10 text-[var(--bail-orange)] flex items-center justify-center">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-gray-900">BANT Prospect Qualification</span>
        </div>
        <span className="text-[9.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
          Clay Enriched
        </span>
      </div>

      {/* Prospect Table Preview */}
      <div className="my-2.5 space-y-1.5">
        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200/80 flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900 block text-[10.5px]">Enterprise Tech Corp</span>
            <span className="text-[9px] text-gray-400 font-mono">VP of Operations • B2B SaaS</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[var(--bail-orange)] block">ICP Match: 96%</span>
            <span className="text-[8.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">QUALIFIED</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200/80 flex items-center justify-between opacity-80">
          <div>
            <span className="font-bold text-gray-900 block text-[10.5px]">Apex Logistics</span>
            <span className="text-[9px] text-gray-400 font-mono">Head of Growth • Logistics</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[var(--bail-orange)] block">ICP Match: 92%</span>
            <span className="text-[8.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">QUALIFIED</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
        <span className="text-gray-500">Sales Time Saved: <strong className="text-gray-900">60%</strong></span>
        <UserCheck className="w-3.5 h-3.5 text-[var(--bail-orange)]" />
      </div>
    </div>
  );
}

// ─── 07. Sales Outreach Automation Visual ────────────────────────────────────
export function OutreachVisual() {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-white/95 rounded-2xl border border-gray-200/90 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <Send className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-gray-900">Multi-Channel Outreach Engine</span>
        </div>
        <span className="text-[9.5px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
          24/7 Outbound
        </span>
      </div>

      {/* Sequence Timeline */}
      <div className="my-2.5 grid grid-cols-4 gap-1.5 text-center">
        <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
          <span className="text-[8.5px] font-bold text-emerald-700 block font-mono">STEP 01</span>
          <span className="text-[9.5px] font-bold text-gray-800 block mt-0.5">Warmup</span>
          <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">Active</span>
        </div>

        <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
          <span className="text-[8.5px] font-bold text-emerald-700 block font-mono">STEP 02</span>
          <span className="text-[9.5px] font-bold text-gray-800 block mt-0.5">AI Email</span>
          <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">Sent</span>
        </div>

        <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200">
          <span className="text-[8.5px] font-bold text-blue-700 block font-mono">STEP 03</span>
          <span className="text-[9.5px] font-bold text-gray-800 block mt-0.5">LinkedIn</span>
          <span className="text-[8px] text-blue-600 font-bold block mt-0.5">Connected</span>
        </div>

        <div className="p-1.5 rounded-lg bg-[var(--bail-orange)]/10 border border-[var(--bail-orange)]/30">
          <span className="text-[8.5px] font-bold text-[var(--bail-orange)] block font-mono">STEP 04</span>
          <span className="text-[9.5px] font-bold text-gray-800 block mt-0.5">Calendar</span>
          <span className="text-[8px] text-[var(--bail-orange)] font-bold block mt-0.5">Booked</span>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
        <span className="text-gray-500">Inbox Health: <strong className="text-emerald-600">100% Primary Inbox</strong></span>
        <span className="text-[9px] font-mono text-gray-400">Zero Spam Risk</span>
      </div>
    </div>
  );
}

// ─── 08. WhatsApp & Chat Lead Nurturing Visual ──────────────────────────────
export function WhatsAppVisual() {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-white/95 rounded-2xl border border-gray-200/90 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-gray-900">WhatsApp Nurture Flow</span>
        </div>
        <span className="text-[9.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
          5-Sec Response
        </span>
      </div>

      {/* Drip Sequence Progress */}
      <div className="my-3 space-y-2">
        <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
          <span className="text-[10px] font-bold text-emerald-900">Instant Response (5s)</span>
          <span className="text-[9px] font-mono text-emerald-700 font-semibold">Delivered ✓✓</span>
        </div>
        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-700">14-Day Automated Drip</span>
          <span className="text-[9px] font-mono text-gray-400">Active Campaign</span>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
        <span className="text-gray-500">Lead Retention: <strong className="text-gray-900">14 Days Tracked</strong></span>
        <span className="text-emerald-600 font-semibold">Auto-Qualification</span>
      </div>
    </div>
  );
}

// ─── 09. Social Media Content Automation Visual ─────────────────────────────
export function SocialVisual() {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-white/95 rounded-2xl border border-gray-200/90 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <BarChart2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-gray-900">Content Engine Pipeline</span>
        </div>
        <span className="text-[9.5px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          Brand Voice AI
        </span>
      </div>

      {/* Channel Distribution Grid */}
      <div className="my-2.5 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
          <span className="text-[9.5px] font-bold text-gray-900 block">LinkedIn</span>
          <span className="text-[8.5px] font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded mt-1 inline-block">
            Auto-Published
          </span>
        </div>

        <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
          <span className="text-[9.5px] font-bold text-gray-900 block">X / Twitter</span>
          <span className="text-[8.5px] font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded mt-1 inline-block">
            Auto-Published
          </span>
        </div>

        <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
          <span className="text-[9.5px] font-bold text-gray-900 block">YouTube</span>
          <span className="text-[8.5px] font-semibold text-blue-600 bg-blue-50 px-1 py-0.2 rounded mt-1 inline-block">
            Scheduled
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
        <span className="text-gray-500">Weekly Time Saved: <strong className="text-gray-900">15+ Hours</strong></span>
        <Share2 className="w-3.5 h-3.5 text-[var(--bail-navy)]" />
      </div>
    </div>
  );
}

// ─── Visual Component Mapping Matrix ─────────────────────────────────────────
export const SERVICE_VISUALS: Record<number, React.FC> = {
  1: ChatbotVisual,
  2: VoiceVisual,
  3: WorkflowVisual,
  4: RagVisual,
  5: CustomAIVisual,
  6: LeadGenVisual,
  7: OutreachVisual,
  8: WhatsAppVisual,
  9: SocialVisual,
};
