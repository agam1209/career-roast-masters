import { Flame, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const SAMPLE = [
  {
    id: 1,
    verdict: "Existentially Incinerated",
    level: 3,
    snippet:
      "You did not architect the new spreadsheet template, Brian. You opened a Google Sheet.",
    upvotes: 4821,
    author: "anonymous_ash",
  },
  {
    id: 2,
    verdict: "Cooked",
    level: 2,
    snippet:
      "Your LinkedIn headline says 'I help brands tell their story.' No you don't. You're unemployed.",
    upvotes: 3204,
    author: "burnt_toast_42",
  },
  {
    id: 3,
    verdict: "Reduced to Component Atoms",
    level: 3,
    snippet:
      "You have curated yourself into invisibility. You are a LinkedIn profile in human form.",
    upvotes: 2987,
    author: "char.broiled",
  },
  {
    id: 4,
    verdict: "Politely Declined",
    level: 1,
    snippet:
      "You listed 'Microsoft Word' as a skill. In 2026. Right next to 'proficient in email.'",
    upvotes: 1842,
    author: "sent_to_/dev/null",
  },
];

export function HallOfShame() {
  return (
    <section className="container mx-auto px-6 py-24" id="hall-of-shame">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-xs font-mono text-toxic uppercase tracking-widest mb-2">
            // public_feed
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Hall of <span className="text-gradient-hero">Shame</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl">
            The funniest roasts, voted up by people who chose to share their suffering.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
          <span className="size-2 rounded-full bg-toxic animate-pulse" />
          12,847 souls cremated this week
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 hover:border-primary/50 transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                {Array.from({ length: item.level }).map((_, j) => (
                  <Flame key={j} className="size-4 text-ember" />
                ))}
                <span className="text-xs font-mono uppercase tracking-wider text-toxic">
                  {item.verdict}
                </span>
              </div>
              <button className="flex flex-col items-center px-3 py-1.5 rounded-lg border border-border hover:border-toxic hover:bg-toxic/10 transition-all">
                <ArrowUp className="size-4 text-toxic" />
                <span className="text-xs font-mono font-bold">{item.upvotes.toLocaleString()}</span>
              </button>
            </div>
            <p className="font-mono text-sm leading-relaxed text-foreground/90">"{item.snippet}"</p>
            <p className="text-xs text-muted-foreground mt-4 font-mono">— @{item.author}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
