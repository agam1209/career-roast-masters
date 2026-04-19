import { motion } from "framer-motion";
import type { RoastReport } from "@/lib/roastEngine";

interface Props {
  report: RoastReport;
}

const METRICS: { key: keyof RoastReport; label: string; bad: "high" | "low" }[] = [
  { key: "cliche", label: "Cliché Meter", bad: "high" },
  { key: "buzzwordDensity", label: "Buzzword Density", bad: "high" },
  { key: "readability", label: "Readability", bad: "low" },
  { key: "honesty", label: "Brutal Honesty", bad: "low" },
  { key: "hireability", label: "Hireability", bad: "low" },
];

function colorFor(value: number, bad: "high" | "low") {
  const isBad = bad === "high" ? value > 60 : value < 40;
  return isBad ? "from-destructive to-ember" : "from-toxic to-primary";
}

export function ReportCard({ report }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Diagnostic Report
          </p>
          <h3 className="text-2xl font-bold mt-1">Summary of Failures</h3>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-muted-foreground">HIREABILITY</p>
          <p className="text-2xl font-mono font-black text-destructive">
            {report.hireability < 5 ? "ERR_404" : `${report.hireability}%`}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {METRICS.map((m, i) => (
          <div key={m.key}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium">{m.label}</p>
              <p className="text-sm font-mono font-bold tabular-nums">{report[m.key]}%</p>
            </div>
            <div className="h-2 rounded-full bg-background overflow-hidden border border-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${report[m.key]}%` }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${colorFor(report[m.key], m.bad)} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
