import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const OUTPUT_DIR = join(__dirname, "output");
const INDEX_PATH = join(__dirname, "index.json");

/**
 * Builds a word -> filename[] index from each markdown file's first H1.
 *
 * Example index:
 * {
 *   "babka": ["babka-choco-noisette.md"],
 *   "choco": ["babka-choco-noisette.md"],
 *   "carpaccio": ["carpaccio-de-buf.md", "carpaccio-de-courgettes.md", "carpaccio-de-daurade.md"],
 *   ...
 * }
 */

function extractH1(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function tokenize(heading: string): string[] {
  return heading
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length > 0);
}

async function main() {
  const files = (await readdir(OUTPUT_DIR)).filter((f) => f.endsWith(".md"));
  const index: Record<string, string[]> = {};

  for (const file of files) {
    const content = await readFile(join(OUTPUT_DIR, file), "utf-8");
    const heading = extractH1(content);
    if (!heading) {
      console.warn(`No H1 found in ${file}, skipping`);
      continue;
    }

    const words = tokenize(heading);
    for (const word of words) {
      if (!index[word]) index[word] = [];
      if (!index[word].includes(file)) index[word].push(file);
    }
  }

  await writeFile(INDEX_PATH, JSON.stringify(index, null, 2));
  console.log(
    `Indexed ${files.length} files, ${Object.keys(index).length} unique words -> ${INDEX_PATH}`
  );
}

main();
