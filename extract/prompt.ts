export const EXTRACT_TO_MD = `
Please extract the text from the provided image of a recipe book page and format it into clean, well-structured Markdown. 

Follow these rules:

1. **Top-Level Summary (Crucial):** The VERY FIRST line of your output must be a Heading 1 (\`#\`) containing a very short summary of the page. It must be **4 words or maximum** (e.g., the exact recipe name, or a brief topic like "Pasta Making Basics"). This must appear before anything else.
2. **Ignore all images/illustrations:** Do not describe or mention any pictures, photos, or graphics on the page. Only extract the text.
3. **Structural Formatting:** 
   - Use a Heading 2 (\`##\`) for the full Recipe Title exactly as it is written on the page.
   - Use Heading 3 (\`###\`) for major sections like "Ingredients", "Instructions", "Method", or "Notes".
   - If there is introductory text or a short description, place it directly below the Heading 2 title as standard text.
4. **Lists:**
   - Use bullet points (\`-\`) for the Ingredients list.
   - Use numbered lists (\`1. \`, \`2. \`) for the Instructions/Steps.
5. **Metadata:** If there is information like Prep Time, Cook Time, Servings, or Difficulty, format them clearly near the top (e.g., \`**Prep time:** 15 mins | **Servings:** 4\`).
6. **Accuracy:** Transcribe the text exactly as it appears. You may fix obvious spelling errors caused by the image scan, but do not change the phrasing, measurements, or actual ingredients.
7. **Language:** The recipes are in french, you will always return french in the markdown, do not translate anything to english

Output strictly the Markdown text starting immediately with the Heading 1 summary, without any conversational filler or introductions.
`