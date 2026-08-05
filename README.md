# Frontend-OCR (React + TypeScript + Vite)

Este repositorio contiene la aplicación Frontend-OCR: una app creada con React, TypeScript y Vite. Este README explica paso a paso cómo instalar, configurar y ejecutar el proyecto para usuarios con conocimientos básicos de informática.

## Requisitos previos
Antes de empezar, asegúrate de tener instalados los siguientes programas:

- Git (para clonar el repositorio)
- Node.js (recomendado: versión 18.x o 20.x). Comprueba con:
  - node -v
- npm (viene con Node) o alternativamente puedes usar `yarn` o `pnpm`.

Si no tienes Node instalado, usa nvm (recomendado) para instalarlo:
- Instalar nvm: https://github.com/nvm-sh/nvm
- Instalar Node (ejemplo con la 18): `nvm install 18` y `nvm use 18`

## Clonar el repositorio
1. Abre una terminal (o Git Bash en Windows).
2. Clona el repositorio y entra a la carpeta del proyecto:
   - git clone https://github.com/sebaslernoud/Frontend-React.git
   - cd Frontend-React/Frontend-OCR

(O si prefieres, clona la rama específica: `git clone --branch feature/initial-layout <repo-url>`)

## Instalar dependencias
En la carpeta `Frontend-OCR` ejecuta uno de los comandos:

- Con npm:
  - npm install
- Con yarn:
  - yarn
- Con pnpm:
  - pnpm install

Esto instalará dependencias listadas en `package.json` (React, Vite, TypeScript, etc.).

## Scripts útiles (qué hacen)
En `package.json` hay scripts preparados:

- `npm run dev` — Inicia el servidor de desarrollo (Vite) con recarga en caliente (HMR).  
- `npm run build` — Compila TypeScript (`tsc -b`) y genera una versión optimizada de producción con Vite (`vite build`).  
- `npm run preview` — Sirve localmente la carpeta de producción generada por `build` para probar el artefacto final.  
- `npm run lint` — Ejecuta ESLint para revisar problemas de estilo o errores comunes.

## Ejecutar en desarrollo (paso a paso)
1. Asegúrate de estar en `Frontend-OCR`.
2. Instala dependencias (si no lo hiciste arriba): `npm install`
3. Ejecuta:
   - npm run dev
4. Abre el navegador en la URL que Vite muestre en la terminal (por defecto: http://localhost:5173).

Opciones útiles:
- Para exponer el servidor a la red local (útil si pruebas en móvil):
  - npm run dev -- --host
- Para cambiar el puerto:
  - npm run dev -- --port 3000

## Compilar para producción y previsualizar
1. Genera la build optimizada:
   - npm run build
2. Previsualiza localmente la build (sirve los archivos estáticos creados):
   - npm run preview
   - Por defecto estará en http://localhost:5173 (o el puerto que indique).

Si prefieres servir la carpeta `dist` con otro servidor estático:
- Instala `serve` y úsalo: `npx serve dist` o `npm i -g serve` y luego `serve dist`.

## Comprobaciones y checks (TypeScript / Lint)
- Revisar errores de TypeScript manualmente:
  - npx tsc --noEmit
- Ejecutar ESLint:
  - npm run lint

Si quieres hacer chequeos en tiempo real, configura tu editor (VSCode recomendado) con las extensiones ESLint y TypeScript.

## Configuraciones comunes (Vite / TypeScript)
- Configuración de Vite mínima está en `vite.config.ts`. Si necesitas cambiar la ruta base para producción (por ejemplo, subir a un subdirectorio), modifica el campo `base` en `defineConfig({ base: '/mi-subruta/', ... })`.
- Para variables de entorno con Vite: crea archivos `.env`, `.env.local` o `.env.production` en la raíz del proyecto. Vite expone las variables que empiezan por `VITE_`. Ejemplo:
  - VITE_API_URL=https://api.ejemplo.com
- Para cambiar puerto o host por defecto en dev puedes usar flags (`--port`, `--host`) como se mostró antes.

## Problemas comunes y soluciones
- Error: Cannot find module 'react' o similar
  - Solución: ejecuta `npm install` en la carpeta correcta (`Frontend-OCR`) y vuelve a correr `npm run dev`.
- Error: EADDRINUSE: puerto en uso
  - Solución: usa otro puerto `npm run dev -- --port 3001` o mata el proceso que ocupa el puerto.
- Problemas con permisos en instalación (EACCES)
  - Solución: instala Node usando nvm o evita usar `sudo` con npm.
- Limpieza cuando algo falla:
  - rm -rf node_modules package-lock.json
  - npm cache clean --force
  - npm install
- Errores de TypeScript en build (`npm run build`)
  - Lee los errores en la terminal; puedes ejecutar `npx tsc --noEmit` para ver sólo los errores de TS.
- ESLint informa fallos
  - Revisa los mensajes que muestra `npm run lint` y corrige los archivos indicados.

## Recomendaciones de editor
- VSCode con extensiones:
  - ESLint
  - TypeScript/TS Server (ya incluido)
  - Prettier (opcional) — si quieres un formateo consistente
- Activa la opción "Format on Save" y "Auto Fix on Save" para ESLint si lo deseas.

## Buenas prácticas para aportar (contribuir)
1. Crea una rama por funcionalidad: `git checkout -b feat/mi-cambio`
2. Ejecuta la app localmente y asegúrate que no hay errores.
3. Corre `npm run lint` y corrige advertencias importantes.
4. Haz commit con mensajes claros y abre un Pull Request describiendo los cambios.

## Información adicional
- Versiones y dependencias clave están en `package.json`.
- Configuración de Vite está en `vite.config.ts`.
- El script de build ejecuta `tsc -b` antes de `vite build`, por eso TypeScript se compila en el proceso de build.

---

Si quieres, puedo:
- Añadir este README directamente al repo (Frontend-OCR/README.md) como commit.
- Generar instrucciones específicas para desplegar la build en un servidor (Netlify, Vercel, GitHub Pages, etc.).
- Añadir ejemplos de `.env` o scripts adicionales (p. ej. `start` para producción).
Dime qué prefieres y lo hago por ti.
