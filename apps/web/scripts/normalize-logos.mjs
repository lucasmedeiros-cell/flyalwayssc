// Normaliza los logos de aerolíneas para que TODOS se vean del mismo tamaño:
// 1) recorta el espacio en blanco/transparente sobrante (trim),
// 2) los encaja centrados en un lienzo idéntico (mismo aspecto) con margen,
// 3) deja un único `slug.png` por aerolínea (rasteriza SVG en alta calidad).
// Uso: cd apps/web && node scripts/normalize-logos.mjs
import sharp from "sharp";
import { readdir, writeFile, unlink, rename } from "node:fs/promises";

const DIR = "public/logos/airlines";
const W = 240, H = 100, MARGIN = 12; // lienzo uniforme
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const files = (await readdir(DIR)).filter((f) => /\.(svg|png|webp|jpe?g)$/i.test(f));
const ALL_EXTS = ["svg", "png", "webp", "jpg", "jpeg"];
const done = [];

for (const f of files) {
  const slug = f.replace(/\.[^.]+$/, "");
  const input = `${DIR}/${f}`;
  const isSvg = /\.svg$/i.test(f);
  try {
    const buf = await sharp(input, isSvg ? { density: 400 } : {})
      .trim({ threshold: 12 })
      .resize(W - 2 * MARGIN, H - 2 * MARGIN, { fit: "contain", background: TRANSPARENT })
      .extend({ top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN, background: TRANSPARENT })
      .png()
      .toBuffer();

    const tmp = `${DIR}/${slug}.__tmp.png`;
    await writeFile(tmp, buf);
    for (const ext of ALL_EXTS) {
      try { await unlink(`${DIR}/${slug}.${ext}`); } catch {}
    }
    await rename(tmp, `${DIR}/${slug}.png`);
    done.push(`${slug} (desde .${f.split(".").pop()})`);
  } catch (e) {
    console.log(`ERROR ${slug}: ${e.message}`);
  }
}
console.log("Normalizados:\n  " + done.join("\n  "));
console.log(`\nLienzo uniforme: ${W}x${H}px, margen ${MARGIN}px. Todos -> slug.png`);
