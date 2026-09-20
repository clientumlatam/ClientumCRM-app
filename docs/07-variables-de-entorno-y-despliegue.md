# 07 · Variables de Entorno y Despliegue en Producción

## 1. Configuración de Variables (`.env.example`)
Todas las credenciales y secretos del sistema deben documentarse en `.env.example` y configurarse en el entorno de ejecución:

```env
# Servidor y Base de Datos
PORT=3000
NODE_ENV=production

# Gemini AI (Servidor)
GEMINI_API_KEY=your_gemini_api_key_here

# Pasarelas y Claves de Terceros (Opcionales / Servidor)
WHATSAPP_API_TOKEN=
MERCADOPAGO_ACCESS_TOKEN=
AFIP_CUIT_DEFAULT=
```

## 2. Proceso de Build y Compilación
- Comando de compilación: `npm run build`
- Empaquetado del servidor backend con `esbuild` hacia `dist/server.cjs`.
- Arranque en producción: `npm start` (`node dist/server.cjs`).
