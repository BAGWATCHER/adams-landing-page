"use client";

import { Suspense } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const runtime = useChatRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-[100dvh] flex-col bg-[var(--background)]">
        <Suspense>{children}</Suspense>
      </div>
    </AssistantRuntimeProvider>
  );
}
