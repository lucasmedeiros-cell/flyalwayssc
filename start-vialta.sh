#!/usr/bin/env bash
export PATH="$HOME/.local/node/bin:$PATH"
cd /home/lucas/Proyectos/agencias_viajes/apps/web || exit 1
exec npx next dev -p 3001
