/* ------------------------------------------------------------------ */
/*  Shared attachment utilities (image compression + voice recording)   */
/* ------------------------------------------------------------------ */

export type LocalAttachment = {
  type: "image" | "audio";
  mimeType: string;
  data: string; // raw base64 (no data-url prefix)
  durationMs?: number;
};

export const MAX_ATTACHMENTS = 4;
export const MAX_RECORD_MS = 120_000;

/* ------------------------------------------------------------------ */
/*  Image compression                                                  */
/* ------------------------------------------------------------------ */

export function compressImage(
  file: File,
): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 1024;
      let w = img.width;
      let h = img.height;
      if (w > max || h > max) {
        const ratio = Math.min(max / w, max / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      const raw = dataUrl.split(",")[1];
      resolve({ data: raw, mimeType: "image/jpeg" });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/* ------------------------------------------------------------------ */
/*  Duration formatting                                                */
/* ------------------------------------------------------------------ */

export function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
