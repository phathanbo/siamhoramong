import fs from "node:fs/promises";
import path from "node:path";
import { createWorker } from "tesseract.js";

const sourceDir =
  "D:\\ตำราตั้งชื่อเด็ก ; คัมภีร์โสฬสปุรำสร้างบ้านสร้างรั้ว ; ตำราคัณฐีจักรทิปนีพระญาณเวท";
const outputDir = path.resolve("ocr-output");
const combinedPath = path.join(
  outputDir,
  "ตำราตั้งชื่อเด็ก-โสฬสปุรำ-คัณฐีจักรทิปนี_OCR.txt",
);

function pageNumber(filename) {
  const match = filename.match(/_Page(\d+)\.jpg$/i);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function normalizeText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

await fs.mkdir(outputDir, { recursive: true });

const entries = await fs.readdir(sourceDir, { withFileTypes: true });
const images = entries
  .filter((entry) => entry.isFile() && /_Page\d+\.jpg$/i.test(entry.name))
  .map((entry) => ({
    name: entry.name,
    page: pageNumber(entry.name),
    fullPath: path.join(sourceDir, entry.name),
  }))
  .sort((a, b) => a.page - b.page || a.name.localeCompare(b.name));

if (images.length === 0) {
  throw new Error(`No *_Page*.jpg images found in ${sourceDir}`);
}

console.log(`Found ${images.length} images.`);

const worker = await createWorker("tha+eng");
const combined = [];

try {
  for (const [index, image] of images.entries()) {
    const label = `Page ${image.page}`;
    console.log(`[${index + 1}/${images.length}] OCR ${label}: ${image.name}`);

    const result = await worker.recognize(image.fullPath);
    const text = normalizeText(result.data.text);
    const pageText = `===== ${label} =====\n\n${text}\n`;

    combined.push(pageText);
    await fs.writeFile(
      path.join(outputDir, `page-${String(image.page).padStart(3, "0")}.txt`),
      pageText,
      "utf8",
    );
  }
} finally {
  await worker.terminate();
}

await fs.writeFile(combinedPath, combined.join("\n"), "utf8");
console.log(`Wrote ${combinedPath}`);
