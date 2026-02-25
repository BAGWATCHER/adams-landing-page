"use client";

import { useRef, useState, useEffect } from "react";
import { ComposerPrimitive } from "@assistant-ui/react";
import {
  compressImage,
  formatDuration,
  MAX_ATTACHMENTS,
  MAX_RECORD_MS,
  type LocalAttachment,
} from "@/lib/attachments";

/* ------------------------------------------------------------------ */
/*  Attachment preview                                                  */
/* ------------------------------------------------------------------ */

function AttachmentPreview({
  attachment,
  onRemove,
}: {
  attachment: LocalAttachment;
  onRemove: () => void;
}) {
  return (
    <div className="relative shrink-0">
      {attachment.type === "image" ? (
        <img
          src={`data:${attachment.mimeType};base64,${attachment.data}`}
          alt=""
          className="h-16 w-16 rounded-lg object-cover border border-white/10"
        />
      ) : (
        <div className="flex h-16 w-20 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
          <div className="flex flex-col items-center gap-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            {attachment.durationMs && (
              <span className="text-[10px] text-zinc-400">
                {formatDuration(Math.round(attachment.durationMs / 1000))}
              </span>
            )}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-colors"
        aria-label="Remove attachment"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChatComposer                                                        */
/* ------------------------------------------------------------------ */

export function ChatComposer() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [localAttachments, setLocalAttachments] = useState<LocalAttachment[]>([]);

  /* voice recording state */
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  /* ---- image handling ---- */
  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = MAX_ATTACHMENTS - localAttachments.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const results: LocalAttachment[] = [];
    for (const f of toProcess) {
      try {
        const { data, mimeType } = await compressImage(f);
        results.push({ type: "image", mimeType, data });
      } catch {
        // skip bad files
      }
    }
    if (results.length) setLocalAttachments((prev) => [...prev, ...results]);
  }

  function removeAttachment(idx: number) {
    setLocalAttachments((prev) => prev.filter((_, i) => i !== idx));
  }

  /* ---- voice recording ---- */
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      const recorder = new MediaRecorder(stream, preferredMime ? { mimeType: preferredMime } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const raw = dataUrl.split(",")[1];
          if (raw) {
            const elapsed = Date.now() - startTimeRef.current;
            const mime = recorder.mimeType.split(";")[0];
            setLocalAttachments((prev) =>
              prev.length < MAX_ATTACHMENTS
                ? [...prev, { type: "audio", mimeType: mime, data: raw, durationMs: elapsed }]
                : prev
            );
          }
          setRecording(false);
          setRecordSecs(0);
        };
        reader.readAsDataURL(blob);
      };
      recorderRef.current = recorder;
      startTimeRef.current = Date.now();
      recorder.start();
      setRecording(true);
      setRecordSecs(0);
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setRecordSecs(Math.floor(elapsed / 1000));
        if (elapsed >= MAX_RECORD_MS) {
          recorder.stop();
        }
      }, 500);
    } catch {
      // permission denied or not available
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
    };
  }, []);

  return (
    <ComposerPrimitive.Root className="rounded-2xl border-2 border-white/[0.06] bg-[var(--surface)] transition-all duration-300 focus-within:border-[var(--accent)]/40 focus-within:ring-1 focus-within:ring-[var(--accent)]/15 hover:border-white/[0.1]">
      <div className="px-4 py-3 md:px-5 md:py-3.5">
        <ComposerPrimitive.Input
          autoFocus
          placeholder="Message..."
          rows={1}
          className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-white outline-none placeholder:text-zinc-500 max-h-[160px]"
        />
      </div>

      {/* Preview strip */}
      {localAttachments.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 md:px-5">
          {localAttachments.map((a, i) => (
            <AttachmentPreview
              key={i}
              attachment={a}
              onRemove={() => removeAttachment(i)}
            />
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 pb-2.5 md:px-4">
        <div className="flex items-center gap-1">
          {/* Paperclip (image attach) */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={localAttachments.length >= MAX_ATTACHMENTS}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-300 disabled:opacity-30"
            aria-label="Attach image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>

          {/* Mic (voice) */}
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            disabled={!recording && localAttachments.length >= MAX_ATTACHMENTS}
            className={`flex h-8 items-center justify-center rounded-lg transition-colors ${
              recording
                ? "gap-1.5 bg-red-500/20 px-2.5 text-red-400"
                : "w-8 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300 disabled:opacity-30"
            }`}
            aria-label={recording ? "Stop recording" : "Record voice note"}
          >
            {recording ? (
              <>
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium tabular-nums">{formatDuration(recordSecs)}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            )}
          </button>

          <span className="text-[11px] text-zinc-600 select-none hidden sm:block ml-1">press &crarr; to send</span>
        </div>

        <ComposerPrimitive.Send className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-black transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-20 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
}
