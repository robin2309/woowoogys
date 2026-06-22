import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const OUTPUT_DIR = join(__dirname, "output");
const INDEX_PATH = join(__dirname, "search-index.json");

const STOP_WORDS = new Set([
  "de", "du", "des", "le", "la", "les", "un", "une",
  "et", "au", "aux", "en", "a", "l", "d",
]);

/**
 * Builds a word -> {fileName, title}[] index from each markdown file's first H1.
 *
 * 1. Extract the first # heading from each .md file
 * 2. Normalize: lowercase + strip diacritics ("Bœuf" -> "boeuf")
 * 3. Tokenize on whitespace/punctuation, drop special chars
 * 4. Filter stop-words (de, le, la, des, un, et, aux...)
 * 5. Map each word to { fileName, title }
 *
 * Example:
 * {
 *   "carpaccio": [{ "fileName": "carpaccio-de-buf.md", "title": "Carpaccio de bœuf" }],
 *   ...
 * }
 */

function extractH1(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function tokenize(heading: string): string[] {
  return normalize(heading)
    .split(/[\s\p{P}]+/u)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w));
}

interface IndexEntry {
  fileName: string;
  title: string;
}

async function main() {
  const files = (await readdir(OUTPUT_DIR)).filter((f) => f.endsWith(".md"));
  const index: Record<string, IndexEntry[]> = {};

  for (const file of files) {
    const content = await readFile(join(OUTPUT_DIR, file), "utf-8");
    const title = extractH1(content);
    if (!title) {
      console.warn(`No H1 found in ${file}, skipping`);
      continue;
    }

    const entry: IndexEntry = { fileName: file, title };
    const words = tokenize(title);
    for (const word of words) {
      if (!index[word]) index[word] = [];
      index[word].push(entry);
    }
  }

  await writeFile(INDEX_PATH, JSON.stringify(index, null, 2));
  console.log(
    `Indexed ${files.length} files, ${Object.keys(index).length} unique words -> ${INDEX_PATH}`
  );
}

main();
