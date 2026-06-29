# Logotipos de operadores terrestres y ferroviarios

Coloca aquí los logotipos **oficiales** de operadores de bus, tren y flota privada.
Aparecerán automáticamente en toda la plataforma **sin modificar código**.

## Cómo agregar un logo

1. Consigue el archivo oficial (con autorización de uso o desde la fuente oficial).
2. Renómbralo con el **slug** del operador y colócalo en esta carpeta.
3. Listo. El componente `OperatorLogo` lo detecta solo.

## Convención de nombres

- Formato preferido: **SVG** → `slug.svg`. Alternativas: `slug.png`, `slug.webp`.
- Orden de búsqueda: `.svg` → `.png` → `.webp` → placeholder de marca.
- El slug es el mismo de `apps/web/lib/mock/operators.ts`.

## Slugs esperados

| Operador | Archivo |
|---|---|
| Trans Copacabana | `trans-copacabana.svg` |
| El Dorado | `el-dorado.svg` |
| Flota Bolívar | `flota-bolivar.svg` |
| Trans Aroma | `trans-aroma.svg` |
| Cosmos | `cosmos.svg` |
| Ferroviaria Andina (FCA) | `ferroviaria-andina.svg` |
| Ferroviaria Oriental | `ferroviaria-oriental.svg` |
| Expreso del Sur | `expreso-del-sur.svg` |
| Andes Privado | `andes-privado.svg` |
| Uyuni VIP Transfer | `uyuni-vip.svg` |

## Si el logo aún no existe

Se muestra un **placeholder elegante** (iniciales + color de marca). No descargues
logos desde sitios no oficiales.

> Recomendado: logos con fondo transparente. Se renderizan sobre fondo blanco con
> un pequeño padding para legibilidad en modo claro y oscuro.
