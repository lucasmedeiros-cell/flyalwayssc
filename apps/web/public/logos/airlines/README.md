# Logotipos de aerolíneas

Coloca aquí los logotipos **oficiales** de las aerolíneas. Aparecerán
automáticamente en toda la plataforma (resultados, reservas, perfil, carrusel de
operadores) **sin modificar código**.

## Cómo agregar un logo

1. Consigue el archivo oficial (con autorización de uso o desde la fuente oficial).
2. Renómbralo con el **slug** del operador y colócalo en esta carpeta.
3. Listo. El componente `AirlineLogo` / `OperatorLogo` lo detecta solo.

## Convención de nombres

- Coloca `slug.png` (o `.svg` / `.webp`). El slug es el mismo de
  `apps/web/lib/mock/operators.ts` y `components/home/partners-strip.tsx`.
- Orden de búsqueda: `.png` → `.svg` → `.webp` → placeholder de marca.

## Igualar tamaños (importante)

Los logos vienen con distinto recorte/espaciado, así que se ven de tamaños
distintos. Tras agregar uno nuevo, ejecuta:

```bash
cd apps/web && node scripts/normalize-logos.mjs
```

Esto recorta el espacio sobrante y encaja TODOS los logos en un lienzo idéntico
(240×100) → se muestran exactamente del mismo tamaño en las tarjetas.

## Slugs esperados

| Aerolínea | Archivo |
|---|---|
| Boliviana de Aviación (BoA) | `boa.png` |
| EcoJet | `ecojet.png` |
| LATAM Airlines | `latam.svg` |
| Avianca | `avianca.svg` |
| Copa Airlines | `copa.svg` |
| Air Europa | `air-europa.svg` |
| Air France | `air-france.svg` |
| Iberia | `iberia.svg` |
| Paranair | `paranair.svg` |
| GOL | `gol.svg` |
| Aerolíneas Argentinas | `aerolineas-argentinas.svg` |

## Si el logo aún no existe

No pasa nada: se muestra un **placeholder elegante** (iniciales + color de marca).
No descargues logos desde sitios no oficiales.

> Recomendado: logos con fondo transparente. Se renderizan sobre fondo blanco con
> un pequeño padding para legibilidad en modo claro y oscuro.
