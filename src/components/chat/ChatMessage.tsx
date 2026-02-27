"use client";

import {
  MessagePrimitive,
  useMessagePartText,
  useMessagePartFile,
} from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";

/* ------------------------------------------------------------------ */
/*  Sparkle icon                                                        */
/* ------------------------------------------------------------------ */

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636 5.636 18.364" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Text part renderers                                                */
/* ------------------------------------------------------------------ */

function AssistantTextPart() {
  return (
    <div className="prose prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-p:leading-relaxed prose-li:leading-relaxed text-[15px]">
      <MarkdownTextPrimitive />
    </div>
  );
}

function UserTextPart() {
  const { text } = useMessagePartText();
  return <div className="whitespace-pre-wrap">{text}</div>;
}

/* ------------------------------------------------------------------ */
/*  File part renderer                                                  */
/* ------------------------------------------------------------------ */

function FilePart() {
  const file = useMessagePartFile();
  if (!file) return null;

  const isImage = file.mimeType?.startsWith("image/");
  const isAudio = file.mimeType?.startsWith("audio/");

  if (isImage) {
    return (
      <img
        src={file.data.startsWith("data:") ? file.data : `data:${file.mimeType};base64,${file.data}`}
        alt=""
        className="h-24 max-w-[180px] rounded-lg object-cover border border-white/10"
      />
    );
  }
  if (isAudio) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        <span className="text-xs text-zinc-400">Voice</span>
      </div>
    );
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Message components                                                  */
/* ------------------------------------------------------------------ */

export function UserMessage() {
  return (
    <MessagePrimitive.Root className="msg-item animate-slide-in-up">
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg bg-[var(--surface-light)] px-4 py-2.5 text-[15px] leading-relaxed text-white">
          <MessagePrimitive.Attachments
            components={{ File: FileAttachmentWrapper }}
          />
          <MessagePrimitive.Parts
            components={{ Text: UserTextPart }}
          />
        </div>
      </div>
    </MessagePrimitive.Root>
  );
}

function FileAttachmentWrapper() {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <FilePart />
    </div>
  );
}

export function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="msg-item animate-slide-in-up">
      <div>
        {/* "Answer" label with sparkle */}
        <div className="flex items-center gap-1.5 mb-2">
          <SparkleIcon className="text-[var(--accent)]" />
          <span className="text-[13px] font-semibold text-[var(--accent)]">Answer</span>
        </div>
        <div className="min-w-0 text-[15px] leading-relaxed text-zinc-200">
          <MessagePrimitive.Parts
            components={{ Text: AssistantTextPart }}
          />
        </div>
      </div>
    </MessagePrimitive.Root>
  );
}
