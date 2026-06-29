// Descarga best-effort de logotipos de aerolíneas desde Wikimedia Commons.
// Para cada aerolínea: busca el archivo SVG por nombre, lo descarga y valida.
// Guarda en apps/web/public/logos/airlines/{slug}.svg.
// Uso: node scripts/fetch-airline-logos.mjs
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "apps", "web", "public", "logos", "airlines");

const AIRLINES = [
  { slug: "boa", q: "Boliviana de Aviacion logo" },
  { slug: "amaszonas", q: "Amaszonas logo" },
  { slug: "latam", q: "LATAM Airlines logo" },
  { slug: "avianca", q: "Avianca logo" },
  { slug: "copa", q: "Copa Airlines logo" },
  { slug: "air-europa", q: "Air Europa logo" },
  { slug: "iberia", q: "Iberia logo" },
  { slug: "gol", q: "Gol Linhas Aereas logo" },
  { slug: "aerolineas-argentinas", q: "Aerolineas Argentinas logo" },
  { slug: "paranair", q: "Paranair logo" },
];

const api = "https://commons.wikimedia.org/w/api.php";
const UA = { "User-Agent": "Vialta-logo-fetch/1.0 (educational)" };

async function findSvg(query) {
  const url = `${api}?action=query&format=json&list=search&srnamespace=6&srlimit=12&srsearch=${encodeURIComponent(query)}`;
  const r = await fetch(url, { headers: UA });
  if (!r.ok) return null;
  const j = await r.json();
  const hits = j?.query?.search ?? [];
  const svg = hits.find((h) => /\.svg$/i.test(h.title));
  return (svg ?? hits[0])?.title ?? null; // File:Xxx.svg
}

async function download(title) {
  const file = title.replace(/^File:/, "");
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;
  const r = await fetch(url, { headers: UA, redirect: "follow" });
  if (!r.ok) return null;
  const buf = Buffer.from(await r.arrayBuffer());
  const head = buf.subarray(0, 300).toString("utf8").toLowerCase();
  const isSvg = head.includes("<svg") || head.includes("<?xml");
  const isPng = buf[0] === 0x89 && buf[1] === 0x50;
  if (!isSvg && !isPng) return null;
  return { buf, ext: isSvg ? "svg" : "png", title: file };
}

const ok = [], fail = [];
for (const a of AIRLINES) {
  try {
    const title = await findSvg(a.q);
    if (!title) { fail.push(a.slug); continue; }
    const dl = await download(title);
    if (!dl) { fail.push(a.slug); continue; }
    await writeFile(join(OUT, `${a.slug}.${dl.ext}`), dl.buf);
    ok.push(`${a.slug} <- ${dl.title} (${dl.buf.length}b)`);
  } catch (e) {
    fail.push(`${a.slug}(${e.message})`);
  }
}
console.log("OK:\n" + (ok.join("\n") || "  (ninguno)"));
console.log("FAIL: " + (fail.join(", ") || "ninguno"));
