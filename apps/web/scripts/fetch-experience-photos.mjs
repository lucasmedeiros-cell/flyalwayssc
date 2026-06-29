// Descarga fotos por categoría de "Completa tu viaje" desde Wikimedia Commons.
// Uso: cd apps/web && node scripts/fetch-experience-photos.mjs
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const OUT = "public/images/experiences";
await mkdir(OUT, { recursive: true });

const TARGETS = [
  { slug: "autos", q: "Audi sedan car automobile silver" },
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
  cands.sort((a, b) => a.index - b.index);
  return cands[0] ?? null;
}

const report = [];
for (const t of TARGETS) {
  try {
    const c = await findPhoto(t.q);
    if (!c) { report.push(`${t.slug}: SIN FOTO`); continue; }
    const ab = await (await fetch(c.ii.thumburl || c.ii.url, { headers: UA })).arrayBuffer();
    const out = await sharp(Buffer.from(ab))
      .resize(1400, 1000, { fit: "cover", position: "centre" })
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer();
    await writeFile(`${OUT}/${t.slug}.jpg`, out);
    report.push(`${t.slug}: ${c.title.replace(/^File:/, "")} -> ${Math.round(out.length / 1024)}kb`);
  } catch (e) {
    report.push(`${t.slug}: ERROR ${e.message}`);
  }
}
console.log(report.join("\n"));
