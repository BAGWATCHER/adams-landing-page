"use client";

import { Suspense, useMemo } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { DefaultChatTransport } from "ai";
import { useSearchParams } from "next/navigation";

function ChatRuntimeProvider({
  children,
  demo,
}: {
  children: React.ReactNode;
  demo: string | null;
}) {
  // When in demo mode, use DefaultChatTransport with { demo } in the body.
  // For the default (Adam's Assistant) we omit the transport so assistant-ui
  // uses its full AssistantChatTransport (which adds tools / call settings).
  const transport = useMemo(
    () => (demo ? new DefaultChatTransport({ body: { demo } }) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // stable — component remounts via key when demo changes
  );

  const runtime = useChatRuntime(transport ? { transport } : undefined);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}

function ChatLayoutInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const demo = searchParams.get("demo");

  return (
    // key forces full remount → fresh thread when switching demo bots
    <ChatRuntimeProvider key={demo ?? "default"} demo={demo}>
      <div className="flex h-[100dvh] flex-col bg-[var(--background)]">
        {children}
      </div>
    </ChatRuntimeProvider>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <ChatLayoutInner>{children}</ChatLayoutInner>
    </Suspense>
  );
}
