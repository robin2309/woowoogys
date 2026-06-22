import ingredientIndex from "../assets/data/ingredient-search-index.json";

type RecipeRef = { fileName: string };
type IngredientIndex = Record<string, RecipeRef[]>;

const index = ingredientIndex as IngredientIndex;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Precompute normalized keys
const normalizedEntries = Object.keys(index).map((key) => ({
  key,
  normalized: normalize(key),
}));

export function searchIngredients(
  query: string
): Array<{ ingredient: string; recipes: RecipeRef[] }> {
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) return [];

  return normalizedEntries
    .filter((entry) => entry.normalized.includes(normalizedQuery))
    .sort((a, b) => a.key.localeCompare(b.key, "fr"))
    .map((entry) => ({
      ingredient: entry.key,
      recipes: index[entry.key],
    }));
}

export function formatRecipeName(fileName: string): string {
  return fileName
    .replace(/\.md$/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getRecipesForIngredient(
  ingredient: string
): RecipeRef[] | undefined {
  return index[ingredient];
}
