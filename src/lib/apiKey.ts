// Local-only API key storage for future real-AI swap.
// Nothing is sent anywhere yet — the roast engine is mocked.

const KEY = "crematorium.apiKey";
const PROVIDER = "crematorium.provider";

export type Provider = "openai" | "anthropic" | "lovable";

export const apiKeyStore = {
  get(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(KEY) ?? "";
  },
  set(v: string) {
    localStorage.setItem(KEY, v);
  },
  clear() {
    localStorage.removeItem(KEY);
  },
  getProvider(): Provider {
    if (typeof window === "undefined") return "lovable";
    return (localStorage.getItem(PROVIDER) as Provider) ?? "lovable";
  },
  setProvider(p: Provider) {
    localStorage.setItem(PROVIDER, p);
  },
};
