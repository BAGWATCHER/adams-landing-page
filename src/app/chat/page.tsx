"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAui } from "@assistant-ui/react";
import { ChatThread } from "@/components/chat/ChatThread";
import { Sidebar, SidebarTrigger } from "@/components/Sidebar";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const aui = useAui();
  const sentRef = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Send initial message from ?q= param */
  useEffect(() => {
    const q = searchParams.get("q");
    if (!q || sentRef.current) return;
    sentRef.current = true;
    aui.thread().append(q);
    router.replace("/chat");
  }, [searchParams, aui, router]);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-[var(--border)] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-1">
          <SidebarTrigger onClick={() => setSidebarOpen(true)} />
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
            aria-label="Back to home"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent-dim)]" />
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
      onClick={() => aui.threads().switchToNewThread()}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
      aria-label="New chat"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
