import { ChatHero } from "@/components/ChatHero";
import { ExampleBuilds } from "@/components/ExampleBuilds";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <main>
        <ChatHero />
        <ExampleBuilds />
      </main>

      <footer className="border-t border-white/[0.04] py-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 text-xs text-zinc-500">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Adam Normandin</span>
            <a className="underline underline-offset-4" href="tel:+16037484982">
              Call/text: (603) 748-4982
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
