import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Loader2 } from "lucide-react";
import type { RoastResult } from "@/lib/roastEngine";

interface Props {
  result: RoastResult;
}

export function ShareCard({ result }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (!ref.current) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(ref.current, {
        backgroundColor: "#0a0612",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `career-crematorium-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setBusy(false);
    }
  };

  // Truncate roast for shareable card
  const snippet =
    result.roast.length > 360 ? result.roast.slice(0, 340).trim() + "..." : result.roast;

  return (
    <div>
      <button
        onClick={download}
        disabled={busy}
        className="w-full py-3 rounded-xl bg-toxic text-toxic-foreground font-bold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform glow-toxic disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        {busy ? "Cooking the PNG..." : "Share the Burn (download PNG)"}
      </button>

      {/* Off-screen render target sized for stories */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden>
        <div
          ref={ref}
          style={{
            width: 1080,
            height: 1920,
            background:
              "radial-gradient(ellipse at 50% 0%, #5b1d8c 0%, #0a0612 60%), #0a0612",
            color: "white",
            padding: 80,
            fontFamily: "Space Grotesk, Inter, sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "linear-gradient(135deg,#a855f7,#86efac)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                }}
              >
                🔥
              </div>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 22, opacity: 0.7 }}>
                career-crematorium.app
              </p>
            </div>
            <h1
              style={{
                fontSize: 88,
                fontWeight: 900,
                lineHeight: 1,
                marginTop: 60,
                background: "linear-gradient(135deg,#a855f7 0%,#d946ef 50%,#86efac 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              I got roasted.
            </h1>
            <p style={{ fontSize: 28, opacity: 0.6, marginTop: 16 }}>
              Burn Level 0{result.level} — {result.verdict}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(168,85,247,0.4)",
              borderRadius: 24,
              padding: 48,
              fontSize: 32,
              lineHeight: 1.45,
              fontFamily: "JetBrains Mono, monospace",
              color: "#86efac",
              whiteSpace: "pre-wrap",
            }}
          >
            "{snippet}"
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <p style={{ fontSize: 24, opacity: 0.5 }}>
              Get yours roasted →
            </p>
            <p
              style={{
                fontSize: 32,
                fontWeight: 800,
                background: "linear-gradient(135deg,#a855f7,#86efac)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              THE CAREER CREMATORIUM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
