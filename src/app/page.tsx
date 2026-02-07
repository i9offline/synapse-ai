"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, ChevronRight, MessageSquare, Plug, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

function NotionLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z" />
      <path d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z" fill="white" />
    </svg>
  );
}

function SlackLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat",
    description: "Conversational AI powered by GPT-4o and Claude Sonnet 4.5",
  },
  {
    icon: Plug,
    title: "Connect Sources",
    description: "Integrate Notion pages and Slack channels as knowledge bases",
  },
  {
    icon: BrainCircuit,
    title: "RAG Intelligence",
    description: "Context-aware answers grounded in your actual data",
  },
  {
    icon: Zap,
    title: "Real-time Streaming",
    description: "Instant responses with live token streaming",
  },
];

const steps = [
  {
    number: "1",
    icon: Plug,
    title: "Connect",
    description: "Link your Notion pages and Slack channels in one click",
  },
  {
    number: "2",
    icon: MessageSquare,
    title: "Ask",
    description: "Ask anything in natural language, just like chatting with a colleague",
  },
  {
    number: "3",
    icon: BrainCircuit,
    title: "Get Answers",
    description: "Receive accurate, sourced answers grounded in your actual data",
  },
];

const chatMessages = [
  {
    role: "user" as const,
    content: "What were the key decisions from last week's product meeting?",
  },
  {
    role: "assistant" as const,
    content:
      "Based on your Notion meeting notes from Jan 15, the team decided to:\n\n1. **Prioritize mobile onboarding** for Q1\n2. **Delay the API launch** to March\n3. **Hire 2 frontend engineers**\n\n*Source: Product Meeting Notes — Jan 15, 2025*",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#fafbfc]">
      {/* Decorative background blobs for liquid glass effect */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-purple-200/30 blur-3xl" />
        <div className="absolute top-[55%] left-1/3 w-[600px] h-[400px] rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-200/25 blur-3xl" />
      </div>

      {/* Nav — liquid glass */}
      <nav className="liquid-glass-nav rounded-full mx-4 sm:mx-8 mt-4 px-6 py-3 flex items-center justify-between max-w-6xl lg:mx-auto w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] lg:w-full sticky top-4 z-50">
        <div className="flex items-center gap-2">
          <Logo size={36} />
          <span className="text-xl font-bold text-gray-900 font-[family-name:var(--font-sora)] tracking-tight">SynapseAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" className="liquid-glass-btn text-gray-600 hover:text-gray-900 rounded-full px-5">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-8 sm:px-12 lg:px-16 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Powered by GPT-4o & Claude Sonnet 4.5
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">
            Your Knowledge,
            <br />
            Amplified by <span className="font-[family-name:var(--font-sora)]">SynapseAI</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            Connect your Notion and Slack to an intelligent chatbot that
            understands your data. Ask questions, get answers grounded in your
            actual content.
          </p>

          {/* Section 3: Integration logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <span className="text-xs text-gray-400 uppercase tracking-wider">Works with</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center">
                <NotionLogo className="w-3.5 h-3.5 text-gray-900" />
              </div>
              <span className="text-sm text-gray-500">Notion</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center">
                <SlackLogo className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm text-gray-500">Slack</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white text-base px-8 py-5 rounded-full"
              >
                Start for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-5 rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Section 1: Chat Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 max-w-2xl mx-auto w-full"
          style={{ perspective: "1200px" }}
        >
          <div
            className="liquid-glass rounded-2xl p-1 shadow-lg"
            style={{ transform: "rotateX(2deg)" }}
          >
            {/* Mockup toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Logo size={14} />
                  <span>SynapseAI</span>
                </div>
              </div>
              <div className="w-12" />
            </div>

            {/* Chat messages */}
            <div className="p-5 space-y-4">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.3, duration: 0.5 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Logo size={16} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gray-900 text-white"
                        : "bg-white border border-gray-200 text-gray-700"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="space-y-2">
                        <p>Based on your Notion meeting notes from Jan 15, the team decided to:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li><strong>Prioritize mobile onboarding</strong> for Q1</li>
                          <li><strong>Delay the API launch</strong> to March</li>
                          <li><strong>Hire 2 frontend engineers</strong></li>
                        </ol>
                        <p className="text-xs text-gray-400 mt-2 italic">Source: Product Meeting Notes — Jan 15, 2025</p>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-white">O</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Fake input bar */}
            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200">
                <span className="text-sm text-gray-300 flex-1">Ask a question...</span>
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mt-24 w-full"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              className="border border-gray-200 rounded-xl p-6 flex flex-col gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Section 2: How it works */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-32 max-w-4xl mx-auto w-full"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
            How it works
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-lg mx-auto">
            Three simple steps to unlock your team&apos;s knowledge
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 relative">
            {/* Connectors on desktop */}
            <div className="hidden sm:block absolute top-10 left-[33%] right-[33%] h-px">
              <div className="absolute left-0 right-1/2 top-0 border-t-2 border-dashed border-gray-200" />
            </div>
            <div className="hidden sm:block absolute top-10 left-[66%] right-0 h-px">
              <div className="absolute left-[-50%] right-[50%] top-0 border-t-2 border-dashed border-gray-200" />
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.15, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <step.icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-300 mt-4 sm:hidden" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section 4: Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-32 max-w-4xl mx-auto w-full text-center"
        >
          <div className="relative rounded-3xl px-8 py-20 sm:px-16 overflow-hidden bg-gray-900">
            {/* Decorative gradient orbs */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-blue-500/20 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-3xl" />
            </div>

            <div className="relative z-10">
              <Logo size={40} className="mx-auto mb-6 invert brightness-200" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to amplify your knowledge?
              </h2>
              <p className="text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
                Connect your tools, ask questions, and get answers grounded in your actual data. Start for free, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-white hover:bg-gray-100 text-gray-900 text-base px-8 py-5 rounded-full font-semibold"
                  >
                    Get Started for Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 py-5 rounded-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Section 5: Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={22} />
            <span className="text-sm font-semibold text-gray-900 font-[family-name:var(--font-sora)]">SynapseAI</span>
          </div>
          <span className="text-sm text-gray-400">&copy; 2025 SynapseAI</span>
        </div>
      </footer>
    </div>
  );
}
