import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "../pdf-summary/node_modules/pdf-parse/dist/pdf-parse/esm/index.js";

const source = "C:/Users/พิรุฬห์/Documents/คัมภีร์สารัมภ์.pdf";
const outputDir = path.resolve("scratch/sarampha");

const data = await readFile(source);
const parser = new PDFParse({ data });
const info = await parser.getInfo({ parsePageInfo: true });
const text = await parser.getText();
await parser.destroy();

const normalized = text.text
  .replace(/\r\n/g, "\n")
  .replace(/[ \t]+\n/g, "\n")
  .replace(/\n{4,}/g, "\n\n\n")
  .trim();

await writeFile(path.join(outputDir, "sarampha-full-text.txt"), normalized, "utf8");
await writeFile(
  path.join(outputDir, "sarampha-metadata.json"),
  JSON.stringify(
    {
      source,
      totalPages: info.total,
      info: info.info,
      textLength: normalized.length,
    },
    null,
    2,
  ),
  "utf8",
);

console.log(`Extracted ${normalized.length} characters from ${info.total} pages.`);
