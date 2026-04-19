import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Incinerator, type IncineratorPayload } from "@/components/Incinerator";
import { BurnLevelSlider } from "@/components/BurnLevelSlider";
import { TerminalRoast } from "@/components/TerminalRoast";
import { ReportCard } from "@/components/ReportCard";
import { ShareCard } from "@/components/ShareCard";
import { Redemption } from "@/components/Redemption";
import { HallOfShame } from "@/components/HallOfShame";
import { SettingsModal } from "@/components/SettingsModal";
import { generateRoast, type BurnLevel, type RoastResult } from "@/lib/roastEngine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Career Crematorium — AI Resume & Content Roaster" },
      {
        name: "description",
        content:
          "Drop your résumé, portfolio, or LinkedIn post and let a cynical AI headhunter incinerate it. Three burn levels, shareable cards, and zero mercy.",
      },
      { property: "og:title", content: "The Career Crematorium" },
      {
        property: "og:description",
        content: "Your career is a joke. Let us write the punchline.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const [level, setLevel] = useState<BurnLevel>(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [active, setActive] = useState(false);

  const handleSubmit = async (p: IncineratorPayload) => {
    setLoading(true);
    setActive(true);
    setResult(null);
    const r = await generateRoast({ content: p.content, level, source: p.source });
    setResult(r);
    setLoading(false);
    // Smooth scroll to the terminal
    setTimeout(() => {
      document.getElementById("furnace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="container mx-auto px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-toxic flex items-center justify-center glow-primary">
            <Flame className="size-5 text-background" />
          </div>
          <div>
            <p className="font-black tracking-tight leading-none">CAREER CREMATORIUM</p>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest">
              v1.0 — DESTROY YOUR EGO
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#hall-of-shame"
            className="text-sm text-muted-foreground hover:text-toxic transition-colors hidden sm:inline"
          >
            Hall of Shame
          </a>
          <SettingsModal />
        </div>
      </header>

      <Hero />

      {/* Bento grid: input + level */}
      <section id="furnace" className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <Incinerator onSubmit={handleSubmit} disabled={loading} />
          </div>
          <div className="lg:col-span-2">
            <BurnLevelSlider value={level} onChange={setLevel} />
          </div>
        </div>
      </section>

      {/* Output */}
      <AnimatePresence>
        {(active || result) && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-6 pb-24"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3">
                <TerminalRoast active={loading} output={result?.roast} verdict={result?.verdict} />
              </div>
              <div className="lg:col-span-2 space-y-4">
                {result ? (
                  <>
                    <ReportCard report={result.report} />
                    <ShareCard result={result} />
                  </>
                ) : (
                  <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 h-full flex items-center justify-center text-center min-h-[300px]">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        Awaiting diagnostic
                      </p>
                      <p className="mt-2 text-muted-foreground text-sm">
                        Failure metrics will appear here once the furnace finishes.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {result && (
              <div className="flex justify-center">
                <Redemption />
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <HallOfShame />

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-6 py-8 flex items-center justify-between flex-wrap gap-4 text-sm text-muted-foreground">
          <p className="font-mono">
            <span className="text-toxic">$</span> made with contempt and caffeine
          </p>
          <p className="font-mono text-xs">// no résumés were harmed (emotionally, all of them)</p>
        </div>
      </footer>
    </div>
  );
}
