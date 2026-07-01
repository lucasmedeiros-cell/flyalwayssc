// Descarga best-effort de fotografías reales de destinos INTERNACIONALES desde
// Wikimedia Commons (CC). Para cada destino busca un archivo JPG representativo
// (consulta orientada a un hito icónico), descarga una versión escalada y valida
// que sea un JPEG real. Guarda en apps/web/public/images/destinations/{slug}.jpg.
// Uso: node scripts/fetch-intl-destination-photos.mjs
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "apps", "web", "public", "images", "destinations");

// slug -> consultas (en orden de preferencia) hacia fotos icónicas y bien expuestas.
const DESTINATIONS = [
  { slug: "buenos-aires", qs: ["Buenos Aires Puerto Madero panorama", "Obelisco Buenos Aires avenida", "Buenos Aires skyline"] },
  { slug: "madrid", qs: ["Madrid skyline panorama", "Gran Via Madrid panorama", "Plaza de Cibeles Madrid"] },
  { slug: "miami", qs: ["Miami skyline panorama", "Miami Beach aerial", "Downtown Miami skyline"] },
  { slug: "sao-paulo", qs: ["Sao Paulo skyline panorama", "Avenida Paulista skyline", "Sao Paulo city panorama"] },
  { slug: "lima", qs: ["Miraflores Lima", "Lima Peru city", "Costa Verde Lima", "Lima Plaza Mayor"] },
  { slug: "santiago", qs: ["Santiago Chile skyline Andes panorama", "Santiago de Chile skyline", "Gran Torre Santiago skyline"] },
  { slug: "rio-de-janeiro", qs: ["Rio de Janeiro Sugarloaf", "Rio de Janeiro Corcovado", "Copacabana Rio de Janeiro", "Rio de Janeiro city"] },
  { slug: "bogota", qs: ["Bogota Monserrate", "Bogota city", "Bogota Colombia view", "Plaza Bolivar Bogota"] },
  { slug: "cancun", qs: ["Cancun beach", "Cancun Mexico", "Cancun hotel zone", "Playa Cancun"] },
  { slug: "punta-cana", qs: ["Punta Cana beach", "Bavaro beach", "Punta Cana Dominican Republic", "Punta Cana palm beach"] },
];

const api = "https://commons.wikimedia.org/w/api.php";
const UA = { "User-Agent": "FlyAlways-destination-fetch/1.0 (educational)" };
const WIDTH = 1400;
const bad = /(logo|flag|coat of arms|escudo|map\b|mapa|seal|diagram|icon|locator|night|panorama 360|360)/i;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/** fetch con reintentos y backoff ante 429 (Commons limita ráfagas). */
async function fetchRetry(url, tries = 5) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: UA, redirect: "follow" });
    if (r.status === 429) {
      await sleep(2000 * (i + 1));
      continue;
    }
    return r;
  }
  return null;
}

/** Devuelve el mejor candidato (paisaje, ancho>=900) con su thumburl ya escalado. */
async function findBest(query) {
  const url =
    `${api}?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=25` +
    `&gsrsearch=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=${WIDTH}`;
  const r = await fetchRetry(url);
  if (!r || !r.ok) return null;
  const j = await r.json();
  const pages = Object.values(j?.query?.pages ?? {});
  const cands = pages
    .filter((p) => /\.jpe?g$/i.test(p.title) && !bad.test(p.title))
    .map((p) => ({ title: p.title.replace(/^File:/, ""), ii: p.imageinfo?.[0] }))
    .filter((c) => c.ii && c.ii.mime === "image/jpeg" && c.ii.width >= 900 && c.ii.width >= c.ii.height * 0.95)
    .sort((a, b) => b.ii.width - a.ii.width);
  return cands[0] ?? null;
}

async function downloadUrl(u) {
  const r = await fetchRetry(u);
  if (!r || !r.ok) return null;
  const buf = Buffer.from(await r.arrayBuffer());
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (!isJpeg || buf.length < 8000) return null;
  return buf;
}

const ONLY = process.argv.slice(2); // opcional: slugs a (re)descargar
const ok = [], fail = [];
for (const d of DESTINATIONS) {
  if (ONLY.length && !ONLY.includes(d.slug)) continue;
  let done = false;
  for (const q of d.qs) {
    try {
      const best = await findBest(q);
      if (!best) { await sleep(800); continue; }
      const buf = await downloadUrl(best.ii.thumburl);
      if (!buf) { await sleep(800); continue; }
      await writeFile(join(OUT, `${d.slug}.jpg`), buf);
      ok.push(`${d.slug} <- ${best.title} (${Math.round(buf.length / 1024)}kb) [${q}]`);
      done = true;
      break;
    } catch (e) {
      // sigue con la próxima consulta
    }
    await sleep(800);
  }
  if (!done) fail.push(d.slug);
  await sleep(1200);
}
console.log("OK:\n" + (ok.join("\n") || "  (ninguno)"));
console.log("FAIL: " + (fail.join(", ") || "ninguno"));
