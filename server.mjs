import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".ico", "image/x-icon"]
]);

function resolveRequest(url) {
  const parsed = new URL(url, `http://localhost:${port}`);
  const pathname = decodeURIComponent(parsed.pathname);
  const normalized = path.normalize(pathname).replace(/^([/\\])+/, "");
  const target = path.join(root, normalized || "index.html");
  const relative = path.relative(root, target);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return target;
}

async function getFile(target) {
  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      return path.join(target, "index.html");
    }
    return target;
  } catch {
    return path.join(root, "index.html");
  }
}

const server = createServer(async (request, response) => {
  const target = resolveRequest(request.url || "/");

  if (!target) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const file = await getFile(target);
  try {
    const body = await readFile(file);
    const contentType = mimeTypes.get(path.extname(file)) || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Datei nicht gefunden");
  }
});

server.listen(port, host, () => {
  console.log(`Projektverwaltung_WTF laeuft auf http://localhost:${port}`);
});
