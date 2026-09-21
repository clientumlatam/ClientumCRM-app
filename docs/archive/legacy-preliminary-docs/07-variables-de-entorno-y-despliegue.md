# 07 · Variables de Entorno y Despliegue en Producción

## 1. Configuración de Variables (`.env.example`)
Todas las credenciales y secretos del sistema deben documentarse en `.env.example` y configurarse en el entorno de ejecución:

```env
# Servidor y Base de Datos
PORT=3000
NODE_ENV=production

# Base de Datos (PostgreSQL / Neon)
NEON_DATABASE_URL=your_database_url_here

# Seguridad y Cifrado
WORKFLOW_ENCRYPTION_KEY=    # Clave para cifrar credenciales
API_KEY_PEPPER=             # Sal para hashing de API Keys
SESSION_SECRET=             # Secreto para sesiones Express

# Gemini AI (Servidor)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase (Configuración del Cliente - VITE_)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Mensajería y Notificaciones
RESEND_API_KEY=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

## 2. Gestión de Secretos
El sistema utiliza un servidor Express que actúa como proxy para todas las APIs de terceros. Las claves que no comienzan con `VITE_` son estrictamente accesibles solo desde el lado del servidor, garantizando la seguridad de las credenciales de AFIP, Mercado Pago y Gemini.

## 3. Proceso de Build y Compilación
- Comando de compilación: `npm run build`
- Empaquetado del servidor backend con `esbuild` hacia `dist/server.cjs`.
- Arranque en producción: `npm start` (`node dist/server.cjs`).
