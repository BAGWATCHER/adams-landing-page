"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAui } from "@assistant-ui/react";
import { ChatThread } from "@/components/chat/ChatThread";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const aui = useAui();
  const sentRef = useRef(false);

  /* Send initial message from ?q= param */
  useEffect(() => {
    const q = searchParams.get("q");
    if (!q || sentRef.current) return;
    sentRef.current = true;

    // Append user message and auto-start run
    aui.thread().append(q);

    // Clean URL
    router.replace("/chat");
  }, [searchParams, aui, router]);

  return (
    <>
      {/* Subtle warm ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.012]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
          aria-label="Back to home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          <span className="text-sm font-medium text-zinc-200">Adam&apos;s Assistant</span>
        </div>

        <NewChatButton />
      </header>

      {/* Thread */}
      <div className="relative z-10 min-h-0 flex-1">
        <ChatThread />
      </div>
    </>
  );
}

function NewChatButton() {
  const aui = useAui();

  return (
    <button
      type="button"
      onClick={() => {
        aui.threads().switchToNewThread();
      }}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
      aria-label="New chat"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
