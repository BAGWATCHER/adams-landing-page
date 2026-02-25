"use client";

import { useState } from "react";
import { Sidebar, SidebarTrigger } from "@/components/Sidebar";

export function LandingShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <div className="absolute top-4 right-5 sm:right-6 z-20">
        <SidebarTrigger onClick={() => setOpen(true)} />
      </div>
      {children}
    </>
  );
}
