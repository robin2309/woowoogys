const fs = require("fs");
const path = require("path");

const extractDir = path.resolve(__dirname, "../../extract");
const dataDir = path.resolve(__dirname, "../assets/data");

fs.mkdirSync(dataDir, { recursive: true });

// Copy ingredient search index
fs.copyFileSync(
  path.join(extractDir, "ingredient-search-index.json"),
  path.join(dataDir, "ingredient-search-index.json")
);
console.log("Copied ingredient-search-index.json");

// Bundle all .md recipe files into a single JSON
const outputDir = path.join(extractDir, "output");
const mdFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(".md"));

const recipes = {};
for (const file of mdFiles) {
  recipes[file] = fs.readFileSync(path.join(outputDir, file), "utf-8");
}

fs.writeFileSync(
  path.join(dataDir, "recipes.json"),
  JSON.stringify(recipes, null, 2)
);
console.log(`Bundled ${mdFiles.length} recipes into recipes.json`);
