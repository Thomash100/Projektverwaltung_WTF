import { createServer } from "node:http";
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const product = "Projektverwaltung_WTF";
const version = "26.05.15.003.DEV.BETA";
const syncEnabled = ["1", "true", "yes"].includes(String(process.env.SYNC_ENABLED || "").toLowerCase());
const syncToken = process.env.SYNC_TOKEN || "";
const dataDir = process.env.DATA_DIR || path.join(root, ".projektverwaltung-data");
const syncStateFile = path.join(dataDir, "projektverwaltung-state.json");
const corsOrigin = process.env.CORS_ORIGIN || "*";

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

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Sync-Token",
    "Access-Control-Max-Age": "86400"
  };
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    ...corsHeaders(),
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(body, null, 2));
}

function isAuthorized(request) {
  if (!syncToken) return true;
  return request.headers["x-sync-token"] === syncToken;
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const text = Buffer.concat(chunks).toString("utf8");
  if (!text.trim()) return {};
  return JSON.parse(text);
}

async function handleApi(request, response, parsed) {
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders());
    response.end();
    return true;
  }

  if (parsed.pathname === "/api/health" || parsed.pathname === "/api/discovery") {
    sendJson(response, 200, {
      product,
      version,
      mode: syncEnabled ? "sync-server" : "demo-server",
      syncEnabled,
      host,
      port,
      serverTime: new Date().toISOString()
    });
    return true;
  }

  if (parsed.pathname === "/api/sync/state") {
    if (!syncEnabled) {
      sendJson(response, 403, {
        error: "SYNC_DISABLED",
        message: "Die Server-Synchronisation ist auf diesem Server nicht aktiviert."
      });
      return true;
    }

    if (!isAuthorized(request)) {
      sendJson(response, 401, {
        error: "UNAUTHORIZED",
        message: "Der Sync-Token fehlt oder ist ungültig."
      });
      return true;
    }

    if (request.method === "GET") {
      try {
        const payload = JSON.parse(await readFile(syncStateFile, "utf8"));
        sendJson(response, 200, {
          product,
          version,
          savedAt: payload.serverSavedAt || payload.savedAt || null,
          payload
        });
      } catch {
        sendJson(response, 200, {
          product,
          version,
          savedAt: null,
          payload: null
        });
      }

      return true;
    }

    if (request.method === "POST" || request.method === "PUT") {
      try {
        const payload = await readJsonBody(request);
        const serverSavedAt = new Date().toISOString();
        const storedPayload = {
          ...payload,
          serverSavedAt,
          serverVersion: version
        };

        await mkdir(dataDir, { recursive: true });
        try {
          await copyFile(syncStateFile, `${syncStateFile}.bak`);
        } catch {
          // A missing backup source is fine during the first sync.
        }

        await writeFile(syncStateFile, JSON.stringify(storedPayload, null, 2), "utf8");
        sendJson(response, 200, {
          product,
          version,
          savedAt: serverSavedAt,
          bytes: Buffer.byteLength(JSON.stringify(storedPayload), "utf8")
        });
      } catch (error) {
        sendJson(response, 400, {
          error: "SYNC_WRITE_FAILED",
          message: error.message
        });
      }

      return true;
    }

    sendJson(response, 405, {
      error: "METHOD_NOT_ALLOWED"
    });
    return true;
  }

  return false;
}

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
  const parsed = new URL(request.url || "/", `http://localhost:${port}`);

  try {
    if (await handleApi(request, response, parsed)) {
      return;
    }
  } catch (error) {
    sendJson(response, 500, {
      error: "SERVER_ERROR",
      message: error.message
    });
    return;
  }

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
  const displayHost = host === "0.0.0.0" ? "0.0.0.0" : "localhost";
  console.log(`${product} läuft auf http://${displayHost}:${port}`);
  console.log(`Sync-API: ${syncEnabled ? "aktiv" : "inaktiv"} (${version})`);
});
