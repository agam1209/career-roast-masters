import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Check } from "lucide-react";
import { apiKeyStore, type Provider } from "@/lib/apiKey";

export function SettingsModal() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [provider, setProvider] = useState<Provider>("lovable");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(apiKeyStore.get());
    setProvider(apiKeyStore.getProvider());
  }, [open]);

  // Hidden access via /admin OR pressing "."  three times? Use button + hash.
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#admin") setOpen(true);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const save = () => {
    apiKeyStore.set(key);
    apiKeyStore.setProvider(provider);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Settings"
        className="size-9 rounded-lg border border-border bg-card/60 backdrop-blur hover:border-primary hover:text-primary flex items-center justify-center transition-all"
      >
        <Settings className="size-4" />
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
              className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-7 shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 size-8 rounded-md hover:bg-accent flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
              <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1">
                // admin_panel
              </p>
              <h2 className="text-2xl font-black tracking-tight mb-1">Settings</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Configure your AI provider for when you swap out the mock engine.
              </p>

              <label className="block text-sm font-medium mb-2">Provider</label>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {(["lovable", "openai", "anthropic"] as Provider[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setProvider(p)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${
                      provider === p
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <label className="block text-sm font-medium mb-2">API Key</label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Stored in your browser only. The current build uses a mock engine — keys aren't sent
                anywhere yet.
              </p>

              <button
                onClick={save}
                className="mt-5 w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
              >
                {saved ? (
                  <>
                    <Check className="size-4" /> Saved
                  </>
                ) : (
                  "Save"
                )}
              </button>

              <p className="text-xs text-muted-foreground mt-4 font-mono">
                Tip: open <span className="text-toxic">/#admin</span> to jump here directly.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
