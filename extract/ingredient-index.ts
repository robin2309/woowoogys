import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ingredientsPath = join(import.meta.dirname, "ingredients.json");
const outputPath = join(import.meta.dirname, "ingredient-search-index.json");

const recipes: Record<string, string[]> = JSON.parse(
  readFileSync(ingredientsPath, "utf-8")
);

const index: Record<string, { fileName: string }[]> = {};

for (const [fileName, ingredients] of Object.entries(recipes)) {
  for (const ingredient of ingredients) {
    const key = ingredient.toLowerCase();
    if (!index[key]) {
      index[key] = [];
    }
    if (!index[key].some((entry) => entry.fileName === fileName)) {
      index[key].push({ fileName });
    }
  }
}

const sorted = Object.fromEntries(
  Object.entries(index).sort(([a], [b]) => a.localeCompare(b, "fr"))
);

writeFileSync(outputPath, JSON.stringify(sorted, null, 2) + "\n");

console.log(
  `Wrote ${Object.keys(sorted).length} ingredients to ${outputPath}`
);
