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

const forbidden =
  /@import\s+["']tw-animate-css["']/.test(styles) ||
  /@import\s+["']tw-animate-css["']/.test(tailwindSource) ||
  /@import\s+["']tw-animate-css["']/.test(theme);

if (forbidden) {
  console.error(
    "assert-css: @import tw-animate-css must not appear in styles.css / tailwind-source.css / theme.css.\n" +
      "Use src/tw-animate.entry.css and __root.tsx <link> only.",
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

if (/tw-animate-css/.test(tailwindSource)) {
  console.error("assert-css: tailwind-source.css must not reference tw-animate-css");
  process.exit(1);
}

console.log("assert-css: OK");
