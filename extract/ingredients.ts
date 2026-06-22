import { GoogleGenAI } from "@google/genai";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { EXTRACT_INGREDIENTS } from "./prompt";

const OUTPUT_DIR = join(__dirname, "output");
const INGREDIENTS_PATH = join(__dirname, "ingredients.json");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CONCURRENCY = 5;

async function processFile(
  fileName: string,
  index: number,
  total: number
): Promise<{ fileName: string; ingredients: string[] } | null> {
  console.log(`[${index}/${total}] Sending request for ${fileName}`);

  const markdown = await readFile(join(OUTPUT_DIR, fileName), "utf-8");
  const prompt = EXTRACT_INGREDIENTS.replace("{{markdownRecipe}}", markdown);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config: { temperature: 0 },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text = response.text?.trim() ?? "";
  if (!text) {
    console.error(`[${index}/${total}] No response for ${fileName}`);
    return null;
  }

  const ingredients = text.split(",").map((s) => s.trim()).filter(Boolean);
  console.log(`[${index}/${total}] Got ${ingredients.length} ingredients for ${fileName}`);
  return { fileName, ingredients };
}

async function main() {
  const files = (await readdir(OUTPUT_DIR)).filter((f) => f.endsWith(".md"));
  const total = files.length;
  console.log(`Found ${total} markdown files, processing ${CONCURRENCY} at a time`);

  const results: Record<string, string[]> = {};
  const pending = new Set<Promise<void>>();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const index = i + 1;
    const p = processFile(file, index, total)
      .then((result) => {
        if (result) results[result.fileName] = result.ingredients;
      })
      .catch((err) => console.error(`[${index}/${total}] Failed ${file}:`, err))
      .then(() => { pending.delete(p); });
    pending.add(p);

    if (pending.size >= CONCURRENCY) {
      await Promise.race(pending);
    }
  }
  await Promise.all(pending);

  await writeFile(INGREDIENTS_PATH, JSON.stringify(results, null, 2));
  console.log(`Wrote ${Object.keys(results).length} entries to ${INGREDIENTS_PATH}`);
}

main();
