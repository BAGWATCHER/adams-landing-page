"use client";

import { ThreadPrimitive } from "@assistant-ui/react";
import { UserMessage, AssistantMessage } from "./ChatMessage";
import { ChatComposer } from "./ChatComposer";

const SUGGESTIONS = [
  "What can AI automate?",
  "Is my data safe with AI?",
  "I have a project in mind",
  "Show me examples",
];

/* ------------------------------------------------------------------ */
/*  Welcome state (empty thread)                                        */
/* ------------------------------------------------------------------ */

function WelcomeState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-12">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[#b8885a] mb-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636 5.636 18.364" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white mb-1">What can I help you with?</h2>
      <p className="text-sm text-zinc-500 mb-8">Ask about AI automation, pricing, or describe your project</p>
      <div className="grid grid-cols-2 gap-2 w-full max-w-md">
        {SUGGESTIONS.map((s) => (
          <ThreadPrimitive.Suggestion
            key={s}
            prompt={s}
            autoSend
            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-center text-[14px] font-medium text-zinc-300 transition-all duration-200 hover:border-[var(--accent)]/30 hover:bg-white/[0.04] hover:text-white active:scale-[0.98] cursor-pointer"
          >
            {s}
          </ThreadPrimitive.Suggestion>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Typing indicator                                                    */
/* ------------------------------------------------------------------ */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[#b8885a]">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636 5.636 18.364" />
        </svg>
      </div>
      <div className="flex items-center gap-1.5 pt-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" style={{ animation: "dot-bounce 1.4s ease-in-out infinite" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" style={{ animation: "dot-bounce 1.4s ease-in-out 0.2s infinite" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" style={{ animation: "dot-bounce 1.4s ease-in-out 0.4s infinite" }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main ChatThread                                                     */
/* ------------------------------------------------------------------ */

export function ChatThread() {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col">
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 space-y-5">
          <ThreadPrimitive.Empty>
            <WelcomeState />
          </ThreadPrimitive.Empty>

          <ThreadPrimitive.Messages
            components={{
              UserMessage,
              AssistantMessage,
            }}
          />

          <ThreadPrimitive.If running>
            <TypingIndicator />
          </ThreadPrimitive.If>
        </div>
      </ThreadPrimitive.Viewport>

      {/* Composer */}
      <div className="border-t border-white/[0.06] px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <ChatComposer />
          <p className="mt-2 text-center text-[11px] text-zinc-600">
            AI assistant — responses may not always be accurate
          </p>
        </div>
      </div>
    </ThreadPrimitive.Root>
  );
}
