const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const dataDir = path.join(root, "data");
const recordsPath = path.join(dataDir, "records.json");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".yaml": "text/yaml; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(recordsPath)) {
    fs.writeFileSync(recordsPath, JSON.stringify({ records: {} }, null, 2));
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function readRecords() {
  ensureDataFile();
  try {
    const data = JSON.parse(fs.readFileSync(recordsPath, "utf8"));
    return data.records && typeof data.records === "object" ? data.records : {};
  } catch {
    return {};
  }
}

function writeRecords(records) {
  ensureDataFile();
  fs.writeFileSync(recordsPath, JSON.stringify({ records, updatedAt: new Date().toISOString() }, null, 2));
}

http
  .createServer(async (req, res) => {
    if (req.url.startsWith("/api/records")) {
      try {
        if (req.method === "GET") {
          sendJson(res, 200, { records: readRecords() });
          return;
        }

        if (req.method === "PUT") {
          const body = await readBody(req);
          const payload = body ? JSON.parse(body) : {};
          const records = payload.records && typeof payload.records === "object" ? payload.records : {};
          writeRecords(records);
          sendJson(res, 200, { ok: true, records });
          return;
        }

        sendJson(res, 405, { error: "Method not allowed" });
      } catch (error) {
        sendJson(res, 400, { error: error.message || "Bad request" });
      }
      return;
    }

    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";

    const file = path.normalize(path.join(root, urlPath));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }

    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, host, () => {
    console.log(`Study prep app running at http://${host}:${port}`);
  });
