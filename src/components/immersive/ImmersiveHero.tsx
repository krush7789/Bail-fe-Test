'use client'

import * as React from 'react'
import { FloatingIconsHero } from '@/components/ui/floating-icons-hero-section'
import type { FloatingIconsHeroProps } from '@/components/ui/floating-icons-hero-section'
import { hero } from '@/content/catalog'

// --- AI platform icons ---

const IconChatGPT = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#000" />
    {/* OpenAI mark — 3 overlapping ellipses at 60° intervals */}
    <g transform="translate(12,12)" stroke="white" strokeWidth="1.7" fill="none">
      <ellipse rx="2.6" ry="5.4" transform="rotate(0)" />
      <ellipse rx="2.6" ry="5.4" transform="rotate(60)" />
      <ellipse rx="2.6" ry="5.4" transform="rotate(120)" />
    </g>
    {/* centre punch-out */}
    <circle cx="12" cy="12" r="2" fill="#000" />
  </svg>
)

const IconClaude = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Anthropic terracotta — correct Claude brand colour */}
    <circle cx="12" cy="12" r="11" fill="#C96A3B" />
    {/* Clean Anthropic A mark */}
    <path d="M9 17L12 7L15 17" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="10.3" y1="13.5" x2="13.7" y2="13.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

// 4-pointed star — the actual Gemini mark
const IconGemini = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#0f172a" />
    <path
      d="M12 3C12 7.97 16.03 12 21 12C16.03 12 12 16.03 12 21C12 16.03 7.97 12 3 12C7.97 12 12 7.97 12 3Z"
      fill="url(#geminiGrad)"
    />
    <defs>
      <linearGradient id="geminiGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285F4" />
        <stop offset="0.5" stopColor="#9AA0F5" />
        <stop offset="1" stopColor="#79D0F1" />
      </linearGradient>
    </defs>
  </svg>
)

// Eye/deep-ocean mark
const IconDeepSeek = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#0C1440" />
    <path
      d="M4 12C4 12 7.5 7 12 7C16.5 7 20 12 20 12C20 12 16.5 17 12 17C7.5 17 4 12 4 12Z"
      stroke="#4D7CFE"
      strokeWidth="1.5"
      fill="none"
    />
    <circle cx="12" cy="12" r="3" fill="#4D7CFE" />
    <circle cx="12" cy="12" r="1.4" fill="#0C1440" />
    <circle cx="13" cy="11" r="0.6" fill="white" fillOpacity="0.9" />
  </svg>
)

// Mistral AI — mosaic block pattern in orange
const IconMistral = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#1a1a1a" />
    <rect x="5" y="5" width="4.5" height="4.5" rx="0.5" fill="#FF7000" />
    <rect x="14.5" y="5" width="4.5" height="4.5" rx="0.5" fill="#FF7000" />
    <rect x="9.75" y="9.75" width="4.5" height="4.5" rx="0.5" fill="#FF7000" fillOpacity="0.75" />
    <rect x="5" y="14.5" width="4.5" height="4.5" rx="0.5" fill="#FF7000" fillOpacity="0.5" />
    <rect x="14.5" y="14.5" width="4.5" height="4.5" rx="0.5" fill="#FF7000" />
  </svg>
)

// Meta Llama — infinity loop
const IconMetaLlama = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#0866FF" />
    <path
      d="M5 12C5 10.3 6.3 9 8 9C9.1 9 10 9.6 10.6 10.5L12 13L13.4 10.5C14 9.6 14.9 9 16 9C17.7 9 19 10.3 19 12C19 13.7 17.7 15 16 15C14.9 15 14 14.4 13.4 13.5L12 11L10.6 13.5C10 14.4 9.1 15 8 15C6.3 15 5 13.7 5 12Z"
      stroke="white"
      strokeWidth="1.8"
      fill="none"
      strokeLinejoin="round"
    />
  </svg>
)

// Perplexity AI — asterisk compass
const IconPerplexity = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#1a1a2e" />
    <line x1="12" y1="5" x2="12" y2="19" stroke="#20B8CD" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" stroke="#20B8CD" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="7.1" y1="7.1" x2="16.9" y2="16.9" stroke="#20B8CD" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="16.9" y1="7.1" x2="7.1" y2="16.9" stroke="#20B8CD" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2.5" fill="#20B8CD" />
  </svg>
)

// n8n
const IconN8n = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#EA4B71" />
    <circle cx="7" cy="12" r="2" fill="white" />
    <circle cx="17" cy="12" r="2" fill="white" />
    <circle cx="12" cy="7.5" r="2" fill="white" />
    <line x1="9" y1="12" x2="15" y2="12" stroke="white" strokeWidth="1.5" />
    <line x1="10.7" y1="9.8" x2="8.4" y2="10.9" stroke="white" strokeWidth="1.5" />
    <line x1="13.3" y1="9.8" x2="15.6" y2="10.9" stroke="white" strokeWidth="1.5" />
  </svg>
)

// Make
const IconMake = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#6E42CA" />
    <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="12" r="2" fill="white" />
    <line x1="12" y1="4" x2="12" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4" y1="12" x2="7" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="17" y1="12" x2="20" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// Zapier
const IconZapier = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#FF4A00" />
    <path d="M13.5 5.5L8.5 13H13L10 19.5L19 9H14L16.5 5.5H13.5Z" fill="white" />
  </svg>
)

// ElevenLabs
const IconElevenLabs = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#111" />
    <rect x="5.5" y="9" width="2" height="6" rx="1" fill="white" />
    <rect x="9" y="7" width="2" height="10" rx="1" fill="white" />
    <rect x="12.5" y="9" width="2" height="6" rx="1" fill="white" />
    <rect x="16" y="10.5" width="2" height="3" rx="1" fill="white" />
  </svg>
)

// LangChain
const IconLangChain = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#1C7C54" />
    <path d="M8.5 10.5a3 3 0 0 0 0 3H10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M15.5 13.5a3 3 0 0 0 0-3H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="10" y1="12" x2="14" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const icons: FloatingIconsHeroProps['icons'] = [
  { id: 1,  icon: IconChatGPT,    className: 'top-[8%] left-[6%]' },
  { id: 2,  icon: IconDeepSeek,   className: 'top-[20%] right-[5%]' },
  { id: 3,  icon: IconGemini,     className: 'top-[5%] left-[35%]' },
  { id: 4,  icon: IconClaude,     className: 'top-[5%] right-[28%]' },
  { id: 5,  icon: IconN8n,        className: 'top-[45%] left-[3%]' },
  { id: 6,  icon: IconMake,       className: 'top-[38%] right-[4%]' },
  { id: 7,  icon: IconZapier,     className: 'top-[25%] left-[16%]' },
  { id: 8,  icon: IconElevenLabs, className: 'top-[75%] left-[8%]' },
  { id: 9,  icon: IconMistral,    className: 'top-[72%] right-[10%]' },
  { id: 10, icon: IconMetaLlama,  className: 'bottom-[6%] left-[32%]' },
  { id: 11, icon: IconPerplexity, className: 'bottom-[5%] right-[30%]' },
  { id: 12, icon: IconLangChain,  className: 'top-[22%] right-[20%]' },
]

export default function ImmersiveHero() {
  return (
    <FloatingIconsHero
      className="bg-ink"
      titleClassName="bg-gradient-to-b from-white to-white/70 text-transparent bg-clip-text"
      subtitleClassName="mt-6 max-w-xl mx-auto text-lg text-white/60"
      iconCardClassName="bg-white/5 border border-white/10"
      title="AI-Powered Services for Growing Businesses"
      subtitle={hero.subheadline}
      ctaText={hero.cta.label}
      ctaHref={hero.cta.href}
      icons={icons}
    />
  )
}
