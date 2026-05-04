import { GoogleGenAI } from "@google/genai";
import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { EXTRACT_TO_MD } from "./prompt";

const IMG_DIR = join(__dirname, "img");
const OUTPUT_DIR = join(__dirname, "output");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function extractH1(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (!match) throw new Error("No H1 heading found in response");
  return match[1].trim();
}

function toFilename(heading: string): string {
  return heading
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const CONCURRENCY = 5;

async function processImage(filePath: string, fileName: string, index: number, total: number) {
  console.log(`[${index}/${total}] Sending request for ${fileName}`);

  const imageData = await readFile(filePath);
  const base64 = imageData.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config: { temperature: 0 },
    contents: [
      {
        role: "user",
        parts: [
          { text: EXTRACT_TO_MD },
          { inlineData: { mimeType: "image/heic", data: base64 } },
        ],
      },
    ],
  });

  const markdown = response.text ?? "";
  if (!markdown) {
    console.error(`[${index}/${total}] No response for ${fileName}`);
    return;
  }

  const heading = extractH1(markdown);
  const outputName = `${toFilename(heading)}.md`;
  const outputPath = join(OUTPUT_DIR, outputName);

  await writeFile(outputPath, markdown);
  console.log(`[${index}/${total}] Wrote ${outputName}`);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await readdir(IMG_DIR)).filter((f) =>
    f.toLowerCase().endsWith(".heic")
  );

  const total = files.length;
  console.log(`Found ${total} HEIC images, processing ${CONCURRENCY} at a time`);

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map((file, j) => {
        const index = i + j + 1;
        return processImage(join(IMG_DIR, file), file, index, total).catch((err) =>
          console.error(`[${index}/${total}] Failed ${file}:`, err)
        );
      })
    );
  }

  console.log("Done");
}

main();
