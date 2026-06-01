import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const port = Number(process.argv[2] || 4177);
const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
]);

http
  .createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://localhost:${port}`);
      const pathname = decodeURIComponent(url.pathname === "/" ? "/sarampha-calculator.html" : url.pathname);
      const filePath = path.resolve(root, `.${pathname}`);
      if (!filePath.startsWith(root)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      const body = await readFile(filePath);
      response.writeHead(200, { "Content-Type": types.get(path.extname(filePath)) || "application/octet-stream" });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Static server: http://127.0.0.1:${port}/sarampha-calculator.html`);
  });
