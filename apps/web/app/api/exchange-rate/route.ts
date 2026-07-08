import { NextResponse } from "next/server";

/**
 * Cotización oficial del dólar (BCB — Banco Central de Bolivia).
 *
 * Fuente: https://www.bcb.gob.bo/?q=content/tipo-de-cambio-oficial-del-dólar-estadounidense
 *
 * Nota: esa página renderiza el valor por JavaScript, así que un fetch del HTML
 * no siempre lo trae. Además, el tipo de cambio oficial boliviano está ANCLADO
 * desde 2011 en Bs 6,96 (venta) / 6,86 (compra) por USD — no fluctúa. Por eso se
 * intenta parsear del BCB y, si no aparece, se usa el valor oficial vigente.
 */
export const revalidate = 21600; // 6 h

const BCB_URL =
  "https://www.bcb.gob.bo/?q=content/tipo-de-cambio-oficial-del-d%C3%B3lar-estadounidense";

/** Valores oficiales vigentes (BCB). Bs por 1 USD. */
const OFFICIAL = { sell: 6.96, buy: 6.86 };

export async function GET() {
  let bobPerUsd = OFFICIAL.sell; // "venta" = lo que se usa para convertir precios a Bs
  let source: "bcb" | "oficial" = "oficial";

  try {
    const res = await fetch(BCB_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FlyAlways/1.0)" },
      next: { revalidate },
    });
    if (res.ok) {
      const html = await res.text();
      // Intenta ubicar el valor de venta (6,9x) si estuviera embebido.
      const m =
        html.match(/(?:venta|vende)[\s\S]{0,60}?(6[.,]\d{2})/i) ||
        html.match(/\b(6[.,]9\d)\b/);
      const val = m ? Number(m[1].replace(",", ".")) : NaN;
      if (Number.isFinite(val) && val > 5 && val < 8) {
        bobPerUsd = val;
        source = "bcb";
      }
    }
  } catch {
    // Silencioso: usamos el valor oficial de respaldo.
  }

  return NextResponse.json({
    bobPerUsd,
    buy: OFFICIAL.buy,
    sell: OFFICIAL.sell,
    source,
    provider: "Banco Central de Bolivia",
    url: BCB_URL,
    fetchedAt: new Date().toISOString(),
  });
}
