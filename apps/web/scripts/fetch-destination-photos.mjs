// Descarga fotografía REAL y atractiva de cada destino desde Wikimedia Commons
// (busca por nombre/escena del lugar, filtra mapas/logos/escudos, prioriza tomas
// apaisadas y de alta resolución), la optimiza NÍTIDA (1920x1200, JPEG q86 +
// realce) y la guarda en public/images/destinations/{slug}.jpg.
//
// Uso: cd apps/web && node scripts/fetch-destination-photos.mjs
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const OUT = "public/images/destinations";
await mkdir(OUT, { recursive: true });

// Consultas escénicas/icónicas (probadas) para fotografía atractiva y nítida.
const TARGETS = [
  // — Hero —
  { slug: "hero-uyuni", q: "Salar de Uyuni reflection sky panorama Bolivia" },
  // — Nacionales (Bolivia) —
  { slug: "uyuni", q: "Salar de Uyuni" },
  { slug: "la-paz", q: "La Paz Bolivia cityscape" },
  { slug: "santa-cruz", q: "Santa Cruz de la Sierra Bolivia city aerial" },
  { slug: "sucre", q: "Sucre Bolivia panoramic white city rooftops" },
  { slug: "copacabana", q: "Copacabana Bolivia Titicaca" },
  { slug: "rurrenabaque", q: "Rurrenabaque Bolivia river" },
  { slug: "cochabamba", q: "Cristo de la Concordia Cochabamba Bolivia panorama" },
  { slug: "tarija", q: "Tarija Bolivia city" },
  // — Internacionales —
  { slug: "buenos-aires", q: "Buenos Aires skyline" },
  { slug: "madrid", q: "Madrid Spain skyline Gran Via cityscape" },
  { slug: "miami", q: "Miami Beach skyline aerial ocean" },
  { slug: "sao-paulo", q: "São Paulo Brazil skyline cityscape Paulista" },
  { slug: "lima", q: "Lima Peru Miraflores" },
  { slug: "santiago", q: "Santiago Chile skyline" },
  { slug: "rio-de-janeiro", q: "Rio de Janeiro Sugarloaf Copacabana aerial" },
  { slug: "bogota", q: "Bogota Colombia city" },
  { slug: "cancun", q: "Cancun Mexico beach" },
  { slug: "punta-cana", q: "Punta Cana Bavaro beach palm Caribbean" },
];

const API = "https://commons.wikimedia.org/w/api.php";
const UA = { "User-Agent": "Vialta-photos/2.0 (travel demo educational; contact ops@vialta.example)" };
const BAD = /(map|flag|seal|coat[_ ]of|logo|diagram|locator|location map|\.svg|icon|chart|graph|\bplan\b|escudo|bandera|mapa|nightlights|satellite|\.tif)/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Pide la API con reintentos ante rate-limit ("too many requests" → no-JSON).
async function apiJson(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: UA });
    const text = await r.text();
    try {
      return JSON.parse(text);
    } catch {
      await sleep(2500 + i * 1500); // backoff
    }
  }
  throw new Error("rate-limited");
}

async function findPhoto(q) {
  const url =
    `${API}?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=40` +
    `&gsrsearch=${encodeURIComponent(q)}&prop=imageinfo&iiprop=url%7Csize%7Cmime&iiurlwidth=2400`;
  const j = await apiJson(url);
  const pages = Object.values(j?.query?.pages ?? {});
  const base = pages
    .map((p) => ({ title: p.title, index: p.index ?? 999, ii: p.imageinfo?.[0] }))
    .filter((c) => c.ii && /image\/(jpeg|png)/.test(c.ii.mime))
    .filter((c) => !BAD.test(c.title));

  const pick = (minW) =>
    base
      .filter((c) => {
        const ar = c.ii.width / c.ii.height;
        return c.ii.width >= minW && ar >= 1.15 && ar <= 2.7;
      })
      .sort((a, b) => {
        const score = (c) => c.index - Math.min(6, Math.log2(c.ii.width / 1300) * 2);
        return score(a) - score(b);
      });

  // Tres niveles: ideal ≥1600px; luego ≥1300px; por último ≥1100px.
  return pick(1600)[0] ?? pick(1300)[0] ?? pick(1100)[0] ?? null;
}

const report = [];
for (const t of TARGETS) {
  await sleep(1300); // respeta el rate-limit de Wikimedia
  try {
    const c = await findPhoto(t.q);
    if (!c) {
      report.push(`${t.slug}: SIN FOTO válida (se conserva la anterior)`);
      continue;
    }
    const src = c.ii.thumburl || c.ii.url;
    const ab = await (await fetch(src, { headers: UA })).arrayBuffer();
    const out = await sharp(Buffer.from(ab))
      .resize(1920, 1200, { fit: "cover", position: "attention" }) // recorte hacia lo "interesante"
      .sharpen({ sigma: 0.8 }) // realce sutil para nitidez percibida
      .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toBuffer();
    await writeFile(`${OUT}/${t.slug}.jpg`, out);
    report.push(
      `${t.slug}: ${c.title.replace(/^File:/, "")} (${c.ii.width}x${c.ii.height}) -> ${Math.round(out.length / 1024)}kb`,
    );
  } catch (e) {
    report.push(`${t.slug}: ERROR ${e.message} (se conserva la anterior)`);
  }
}
console.log(report.join("\n"));
