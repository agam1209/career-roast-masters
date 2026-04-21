import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(fileURLToPath(new URL("..", import.meta.url)));
const read = (f) => readFileSync(path.join(root, f), "utf8");

let failed = false;

for (const file of ["src/styles.css", "src/tailwind-source.css", "src/theme.css"]) {
  if (!existsSync(path.join(root, file))) {
    console.error(`assert-css: missing ${file}`);
    failed = true;
  }
}

if (failed) process.exit(1);

const styles = read("src/styles.css");
const tailwindSource = read("src/tailwind-source.css");
const theme = read("src/theme.css");

// Allow tw-animate import inside tailwind-source.css only, but not in styles.css or theme.css
const forbidden =
  /@import\s+["']tw-animate-css["']/.test(styles) ||
  /@import\s+["']tw-animate-css["']/.test(theme);

if (forbidden) {
  console.error(
    "assert-css: @import tw-animate-css must not appear in styles.css or theme.css.\n" +
      "If you need tw-animate in the build, place the import in src/tailwind-source.css before @source.",
  );
  process.exit(1);
}

const tailwindOrder =
  /@import\s+["']tailwindcss["']/.test(tailwindSource) &&
  /@source\s+/.test(tailwindSource) &&
  tailwindSource.indexOf(`@import "tailwindcss"`) < tailwindSource.indexOf("@source");

if (!tailwindOrder) {
  console.error("assert-css: tailwind-source.css must contain @import tailwindcss before @source.");
  process.exit(1);
}

// If tailwind-source.css references tw-animate-css, enforce it appears after tailwindcss import and before @source
if (/@import\s+["']tw-animate-css["']/.test(tailwindSource)) {
  const idxTailwind = tailwindSource.indexOf(`@import "tailwindcss"`);
  const idxTw = tailwindSource.indexOf(`@import "tw-animate-css"`);
  const idxSource = tailwindSource.indexOf("@source");
  if (!(idxTailwind >= 0 && idxTw >= 0 && idxSource >= 0 && idxTailwind < idxTw && idxTw < idxSource)) {
    console.error(
      "assert-css: if tailwind-source.css references tw-animate-css, it must appear after @import tailwindcss and before @source.",
    );
    process.exit(1);
  }
}

console.log("assert-css: OK");
