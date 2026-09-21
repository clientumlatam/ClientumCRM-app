# 09 · Guía de Onboarding para Desarrolladores

## 1. Configuración Inicial
¡Bienvenido al equipo de ClientumOS! Esta guía te ayudará a configurar tu entorno y entender las bases del proyecto.

### Requisitos Técnicos
- **Node.js v18+** (Recomendado v20 LTS)
- **Git**
- **Clave de API de Gemini** (Obtenible en [Google AI Studio](https://aistudio.google.com/))
- **Base de Datos PostgreSQL** (Opcional para desarrollo local, puedes usar Neon.tech)

### Pasos de Instalación Rápida
1. **Clonar el repo**: `git clone <repo-url>`
2. **Instalar dependencias**: `npm install`
3. **Configurar el entorno**:
   - Crea un archivo `.env` basado en `.env.example`.
   - Asegúrate de configurar `GEMINI_API_KEY` y las variables de Firebase.
4. **Levantar el servidor**: `npm run dev`

## 2. Flujo de Trabajo (Workflow)

### Desarrollo de Frontend
- **Componentes**: Ubicados en `src/components`, organizados por dominio (ej: `src/components/opportunities`).
- **Estilos**: Usamos **Tailwind CSS v4** con importación directa `@import "tailwindcss";` en `index.css`.
- **Estado**: Preferimos `CRMContext` para estado global y `useState`/`useReducer` para estado local.
- **Iconos**: Importamos exclusivamente de `lucide-react`.

### Desarrollo de Backend
- **Express**: El servidor reside en `server.ts`.
- **Typescript**: El servidor se compila con `esbuild` en tiempo de build.
- **Proxying**: Nunca llames a APIs de terceros directamente desde el cliente si requieren claves secretas. Implementa un endpoint en `server.ts`.

### Calidad de Código
- **Linting**: `npm run lint` ejecuta `tsc --noEmit`. Debe pasar sin errores antes de cualquier commit.
- **Build**: `npm run build` verifica que el bundle de producción sea válido.

## 3. Arquitectura de Archivos Clave
- `src/types.ts`: **Fuente de verdad única** para interfaces y enums.
- `src/context/CRMContext.tsx`: Maneja la hidratación de datos y la sincronización con Firestore.
- `server.ts`: Gestiona la autenticación, proxies de API y el servidor de archivos estáticos en producción.
- `firebase-blueprint.json`: Define la estructura esperada de la base de datos Firestore.

---
*ClientumOS — Construyendo el futuro de la inteligencia comercial.*
