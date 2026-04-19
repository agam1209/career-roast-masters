import { LEVEL_META, type BurnLevel } from "@/lib/roastEngine";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  value: BurnLevel;
  onChange: (v: BurnLevel) => void;
}

export function BurnLevelSlider({ value, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Burn Level</p>
          <h3 className="text-xl font-bold mt-1">{LEVEL_META[value].name}</h3>
          <p className="text-sm text-muted-foreground">{LEVEL_META[value].tagline}</p>
        </div>
        <div className="text-5xl font-mono font-black text-gradient-hero leading-none">
          0{value}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {([1, 2, 3] as BurnLevel[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => onChange(lvl)}
            className={cn(
              "relative rounded-xl border p-3 text-left transition-all overflow-hidden group",
              value === lvl
                ? "border-primary bg-primary/10 glow-primary"
                : "border-border hover:border-primary/40 bg-background/30",
            )}
          >
            {value === lvl && (
              <motion.div
                layoutId="burn-active"
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-toxic/10 -z-10"
                transition={{ type: "spring", duration: 0.4 }}
              />
            )}
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: lvl }).map((_, i) => (
                <span key={i} className="text-base">🔥</span>
              ))}
            </div>
            <p className="text-xs font-semibold leading-tight">{LEVEL_META[lvl].name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
