import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMINAL_LOGS } from "@/lib/roastEngine";

interface Props {
  active: boolean;
  output?: string;
  verdict?: string;
}

export function TerminalRoast({ active, output, verdict }: Props) {
  const [shown, setShown] = useState<string[]>([]);
  const [typed, setTyped] = useState("");

  // Loading log stream
  useEffect(() => {
    if (!active || output) return;
    setShown([]);
    let i = 0;
    const id = setInterval(() => {
      setShown((s) => [...s, TERMINAL_LOGS[i]]);
      i++;
      if (i >= TERMINAL_LOGS.length) clearInterval(id);
    }, 280);
    return () => clearInterval(id);
  }, [active, output]);

  // Typewriter for the final roast
  useEffect(() => {
    if (!output) {
      setTyped("");
      return;
    }
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setTyped(output.slice(0, i));
      if (i >= output.length) clearInterval(id);
    }, 12);
    return () => clearInterval(id);
  }, [output]);

  return (
    <div className="relative rounded-2xl border border-toxic/30 bg-terminal overflow-hidden shadow-2xl">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-background/80 border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-destructive" />
          <span className="size-3 rounded-full bg-ember" />
          <span className="size-3 rounded-full bg-toxic" />
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          crematorium@v1.0 — /dev/roast
        </p>
        <span className="text-xs font-mono text-toxic animate-flicker">● LIVE</span>
      </div>

      <div className="relative p-5 font-mono text-sm leading-relaxed min-h-[320px] max-h-[520px] overflow-y-auto scanlines">
        <AnimatePresence mode="wait">
          {!output ? (
            <motion.div key="loading" exit={{ opacity: 0 }} className="space-y-1">
              {shown.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-terminal-foreground"
                >
                  {line}
                </motion.p>
              ))}
              {active && (
                <span className="inline-block w-2 h-4 bg-toxic align-middle animate-blink ml-1" />
              )}
              {!active && shown.length === 0 && (
                <p className="text-muted-foreground">
                  <span className="text-toxic">$</span> awaiting input...{" "}
                  <span className="inline-block w-2 h-4 bg-toxic align-middle animate-blink" />
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="output"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <p className="text-toxic">
                <span className="text-muted-foreground">$</span> generate --burn-level=max
              </p>
              <pre className="whitespace-pre-wrap text-terminal-foreground font-mono text-sm">
                {typed}
                {typed.length < (output?.length ?? 0) && (
                  <span className="inline-block w-2 h-4 bg-toxic align-middle animate-blink ml-0.5" />
                )}
              </pre>
              {verdict && typed.length === output.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-3 mt-3 border-t border-toxic/30"
                >
                  <p className="text-muted-foreground text-xs">// final verdict</p>
                  <p className="text-2xl font-bold text-toxic mt-1 animate-glitch">
                    {verdict.toUpperCase()}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
