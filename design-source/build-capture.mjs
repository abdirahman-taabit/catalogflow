import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outputDirectory = join(here, "rendered");
const stylesheet = await readFile(join(here, "catalogflow.css"), "utf8");
const pages = ["foundations", "components", "desktop", "mobile", "flow"];

await mkdir(outputDirectory, { recursive: true });

for (const page of pages) {
  const body = await readFile(join(here, `${page}.body.html`), "utf8");
  const document = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CatalogFlow — ${page[0].toUpperCase()}${page.slice(1)}</title>
  <style>${stylesheet}</style>
</head>
<body>${body}</body>
</html>`;
  await writeFile(join(outputDirectory, `${page}.html`), document, "utf8");
}

console.log(`Built ${pages.length} self-contained Figma capture files in ${outputDirectory}`);
