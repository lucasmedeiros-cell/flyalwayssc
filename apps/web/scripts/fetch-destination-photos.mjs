// Descarga fotografías REALES de cada destino boliviano desde Wikimedia Commons
// (busca por nombre del lugar, filtra mapas/logos, elige la mejor foto apaisada),
// las optimiza (1600x1000 jpeg) y guarda en public/images/destinations/{slug}.jpg.
// Uso: cd apps/web && node scripts/fetch-destination-photos.mjs
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const OUT = "public/images/destinations";
await mkdir(OUT, { recursive: true });

const TARGETS = [
  { slug: "santa-cruz",  q: "Plaza 24 de Septiembre Santa Cruz de la Sierra Bolivia" },
  { slug: "sucre",       q: "Sucre Bolivia ciudad vista" },
  { slug: "rurrenabaque",q: "Rurrenabaque Beni river Bolivia" },
];

const API = "https://commons.wikimedia.org/w/api.php";
const UA = { "User-Agent": "Vialta-photos/1.0 (travel demo educational)" };
const BAD = /(map|flag|seal|coat[_ ]of|logo|diagram|locator|location map|\.svg|icon|chart|graph|\bplan\b|escudo|bandera|mapa)/i;

async function findPhoto(q) {
  const url = `${API}?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=25` +
    `&gsrsearch=${encodeURIComponent(q)}&prop=imageinfo&iiprop=url%7Csize%7Cmime&iiurlwidth=1600`;
  const r = await fetch(url, { headers: UA });
  const j = await r.json();
  const pages = Object.values(j?.query?.pages ?? {});
  const cands = pages
    .map((p) => ({ title: p.title, index: p.index ?? 999, ii: p.imageinfo?.[0] }))
    .filter((c) => c.ii && /image\/(jpeg|png)/.test(c.ii.mime))
    .filter((c) => !BAD.test(c.title))
    .filter((c) => {
      const ar = c.ii.width / c.ii.height;
      return c.ii.width >= 1100 && ar >= 1.2 && ar <= 2.6;
    });
  // Orden por RELEVANCIA de búsqueda (no por tamaño) para que coincida el lugar.
  cands.sort((a, b) => a.index - b.index);
  return cands[0] ?? null;
}

const report = [];
for (const t of TARGETS) {
  try {
    const c = await findPhoto(t.q);
    if (!c) { report.push(`${t.slug}: SIN FOTO válida`); continue; }
    const src = c.ii.thumburl || c.ii.url;
    const ab = await (await fetch(src, { headers: UA })).arrayBuffer();
    const out = await sharp(Buffer.from(ab))
      .resize(1600, 1000, { fit: "cover", position: "centre" })
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer();
    await writeFile(`${OUT}/${t.slug}.jpg`, out);
    report.push(`${t.slug}: ${c.title.replace(/^File:/, "")} (${c.ii.width}x${c.ii.height}) -> ${Math.round(out.length / 1024)}kb`);
  } catch (e) {
    report.push(`${t.slug}: ERROR ${e.message}`);
  }
}
console.log(report.join("\n"));
