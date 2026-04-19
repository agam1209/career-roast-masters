import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";

const TIPS = [
  {
    title: "Lead with verbs that did the work",
    body: "Replace 'responsible for' with what actually shipped. 'Cut onboarding time 40% by rewriting the flow' beats 'managed onboarding initiatives' every time.",
  },
  {
    title: "Quantify, then quantify again",
    body: "Numbers anchor claims. Revenue, users, latency, hours saved — pick the metric your reader cares about and put it first.",
  },
  {
    title: "Kill the buzzword cemetery",
    body: "Synergy, leverage, ecosystem, holistic — these are noise. If a 12-year-old can't picture what you did, rewrite it.",
  },
  {
    title: "One résumé per role",
    body: "Mirror the language of the job posting. Generic résumés get generic outcomes (none).",
  },
  {
    title: "Cut the 'Objective' section",
    body: "Your objective is the job you're applying for. Use that space for a one-line summary of what you're great at.",
  },
];

export function Redemption() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-toxic transition-colors mx-auto"
      >
        <Heart className="size-4 group-hover:fill-toxic group-hover:text-toxic transition-all" />
        <span className="underline underline-offset-4 decoration-dotted">
          Okay, I'm crying. Help me fix it.
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-2xl border border-toxic/40 bg-card p-8 shadow-2xl glow-toxic max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 size-8 rounded-md hover:bg-accent flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
              <p className="text-xs font-mono text-toxic uppercase tracking-widest mb-2">
                // the_redemption_arc
              </p>
              <h2 className="text-3xl font-black tracking-tight mb-2">
                Fine. We'll be nice for a minute.
              </h2>
              <p className="text-muted-foreground mb-8">
                Five things that move résumés from "trash" to "interview."
              </p>
              <div className="space-y-5">
                {TIPS.map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="size-8 rounded-lg bg-toxic/20 text-toxic font-mono font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold">{t.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
