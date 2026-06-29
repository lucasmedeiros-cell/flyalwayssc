/**
 * Utilidades de "pseudo-aleatoriedad determinista": dada una semilla estable
 * (p. ej. el id de un viaje), devuelven siempre el mismo valor. Esto permite
 * mostrar señales de conversión ("45 personas viendo", "reservado hace 7 min")
 * sin usar Math.random()/Date en el render → evita mismatch de hidratación SSR.
 */

/** Hash FNV-1a → entero sin signo de 32 bits. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Float determinista en [0, 1) a partir de una semilla string. */
export function seededFloat(seed: string): number {
  return hashString(seed) / 0xffffffff;
}

/** Entero determinista en [min, max] (ambos inclusive). */
export function seededInt(seed: string, min: number, max: number): number {
  return min + Math.floor(seededFloat(seed) * (max - min + 1));
}

/** Elige un elemento de una lista de forma determinista. */
export function seededPick<T>(seed: string, items: readonly T[]): T {
  return items[seededInt(seed, 0, items.length - 1)];
}
