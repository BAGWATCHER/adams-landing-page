"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { HowItWorks } from "./sidebar/HowItWorks";
import { UseCases } from "./sidebar/UseCases";
import { Pricing } from "./sidebar/Pricing";

type Section = "how" | "cases" | "pricing";

const NAV_ITEMS: { key: Section; label: string; desc: string }[] = [
  { key: "how", label: "How It Works", desc: "Architecture, memory, integrations" },
  { key: "cases", label: "Use Cases", desc: "Industry-specific examples" },
  { key: "pricing", label: "Pricing", desc: "Rates, engagement model, what's included" },
];

const CONTENT: Record<Section, ReactNode> = {
  how: <HowItWorks />,
  cases: <UseCases />,
  pricing: <Pricing />,
};

const TITLES: Record<Section, string> = {
  how: "How It Works",
  cases: "Use Cases",
  pricing: "Pricing",
};

/* ---- Hamburger button (exported for use in pages) ---- */

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
      aria-label="Open menu"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
      </svg>
    </button>
  );
}

/* ---- Sidebar panel ---- */

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [section, setSection] = useState<Section | null>(null);

  const close = useCallback(() => {
    setSection(null);
    onClose();
  }, [onClose]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset section when closing
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setSection(null), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={close}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] sm:w-[360px] flex-col bg-[var(--surface)] border-r border-[var(--border)] shadow-2xl shadow-black/40 transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          {section ? (
            <button
              type="button"
              onClick={() => setSection(null)}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </button>
          ) : (
            <span className="text-sm font-medium text-zinc-300">Menu</span>
          )}
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {section === null ? (
            /* Nav list */
            <nav className="py-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSection(item.key)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.04] group"
                >
                  <div className="flex-1">
                    <div className="text-[15px] font-medium text-zinc-200 group-hover:text-white transition-colors">
                      {item.label}
                    </div>
                    <div className="mt-0.5 text-[13px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      {item.desc}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              ))}
            </nav>
          ) : (
            /* Section content */
            <div className="px-5 py-5">
              <h2 className="text-lg font-semibold text-white mb-5">{TITLES[section]}</h2>
              {CONTENT[section]}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-[var(--border)] px-4 py-3">
          <a
            href="tel:+16037484982"
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-[14px] font-semibold text-black transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Call/text Adam: (603) 748-4982
          </a>
        </div>
      </div>
    </>
  );
}
