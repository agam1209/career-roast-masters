import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Link2, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type IncineratorPayload =
  | { source: "text"; content: string; label: string }
  | { source: "url"; content: string; label: string }
  | { source: "pdf"; content: string; label: string };

interface Props {
  onSubmit: (p: IncineratorPayload) => void;
  disabled?: boolean;
}

type Tab = "file" | "url" | "text";

export function Incinerator({ onSubmit, disabled }: Props) {
  const [tab, setTab] = useState<Tab>("file");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    setParsing(true);
    try {
      if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
        // Lazy load pdfjs only in the browser
        const pdfjs = await import("pdfjs-dist");
        // @ts-ignore - worker URL string
        const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const buf = await f.arrayBuffer();
        const doc = await pdfjs.getDocument({ data: buf }).promise;
        let full = "";
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const tc = await page.getTextContent();
          full += tc.items.map((it: any) => it.str).join(" ") + "\n";
        }
        setFile({ name: f.name, text: full.trim() || "(empty document)" });
      } else {
        const t = await f.text();
        setFile({ name: f.name, text: t });
      }
    } catch (e) {
      setFile({ name: f.name, text: `(could not parse: ${(e as Error).message})` });
    } finally {
      setParsing(false);
    }
  }, []);

  const submit = () => {
    if (tab === "text" && text.trim()) {
      onSubmit({ source: "text", content: text.trim(), label: "Pasted content" });
    } else if (tab === "url" && url.trim()) {
      onSubmit({ source: "url", content: url.trim(), label: url.trim() });
    } else if (tab === "file" && file) {
      onSubmit({ source: "pdf", content: file.text, label: file.name });
    }
  };

  const canSubmit =
    (tab === "text" && text.trim().length > 10) ||
    (tab === "url" && /^https?:\/\//.test(url.trim())) ||
    (tab === "file" && !!file && !parsing);

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-2 shadow-2xl">
      <div className="flex gap-1 p-1 rounded-xl bg-background/60 border border-border">
        {(
          [
            { id: "file", label: "Upload", icon: Upload },
            { id: "url", label: "URL", icon: Link2 },
            { id: "text", label: "Paste", icon: FileText },
          ] as { id: Tab; label: string; icon: typeof Upload }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-lg glow-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "file" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "relative cursor-pointer rounded-xl border-2 border-dashed transition-all p-10 text-center",
              dragOver
                ? "border-toxic bg-toxic/10 glow-toxic"
                : "border-border hover:border-primary/60 hover:bg-primary/5",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt,.md,.docx"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            {file ? (
              <div className="flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-lg bg-toxic/20 text-toxic flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.text.length.toLocaleString()} characters extracted
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="size-8 rounded-md hover:bg-destructive/20 hover:text-destructive flex items-center justify-center"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="mx-auto size-14 rounded-2xl bg-gradient-to-br from-primary to-toxic flex items-center justify-center glow-primary"
                >
                  <Upload className="size-6 text-background" />
                </motion.div>
                <div>
                  <p className="font-semibold text-lg">
                    {parsing ? "Reading your sins..." : "Drop your résumé in the furnace"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, DOCX, or plain text. We'll extract every cliché.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "url" && (
          <div className="p-6">
            <label className="text-sm text-muted-foreground font-mono">// portfolio_or_linkedin_url</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://linkedin.com/in/your-tragedy"
              className="mt-2 w-full bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground mt-2">
              We'll fetch and roast the contents of this page.
            </p>
          </div>
        )}

        {tab === "text" && (
          <div className="p-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder="Paste your bio, tweet, cover letter, dating profile — whatever you want incinerated."
              className="w-full bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground mt-2">{text.length} characters</p>
          </div>
        )}

        <button
          disabled={!canSubmit || disabled}
          onClick={submit}
          className={cn(
            "mt-4 w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all relative overflow-hidden",
            canSubmit && !disabled
              ? "bg-gradient-to-r from-primary via-primary to-toxic text-primary-foreground glow-primary hover:scale-[1.01] active:scale-[0.99]"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {parsing ? "Extracting text..." : "🔥 IGNITE"}
        </button>
      </div>
    </div>
  );
}
