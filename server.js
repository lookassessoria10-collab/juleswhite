// Servidor local sem dependências: node server.js  (porta opcional: PORT=8080)
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = __dirname;
const PORT = +process.env.PORT || 4173;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".webmanifest": "application/manifest+json",
};

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, path.normalize(p));
  if (!file.startsWith(ROOT) || path.basename(file) === "server.js") { res.writeHead(403).end(); return; }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { "Content-Type": "text/plain" }).end("Não encontrado"); return; }
    const ext = path.extname(file);
    res.writeHead(200, {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Content-Length": st.size,
      "Cache-Control": ext === ".webp" ? "public, max-age=604800, immutable" : "no-cache",
    });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, "0.0.0.0", () => {
  console.log(`\n  Apresentação no ar:\n  • Neste computador:  http://localhost:${PORT}`);
  for (const list of Object.values(os.networkInterfaces()))
    for (const a of list || []) if (a.family === "IPv4" && !a.internal) console.log(`  • No celular (mesmo Wi-Fi): http://${a.address}:${PORT}`);
  console.log("");
});
