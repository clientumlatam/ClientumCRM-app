# 09 · Onboarding de desarrolladores

## Primer arranque

1. Instalar Node.js compatible y npm.
2. Ejecutar `npm install`.
3. Copiar `.env.example` a `.env`; usar placeholders, nunca valores reales en
   el repositorio.
4. Configurar Firebase público si se probará login real.
5. Configurar PostgreSQL con `DATABASE_URL` o `PG*` si se probará persistencia.
6. Ejecutar `npm run db:migrate` y luego `PORT=5000 npm run dev`.

Sin Firebase en desarrollo se puede usar el botón de demo explícito. Sin
PostgreSQL se puede explorar la UI, pero las rutas durables responden error de
dependencia.

## Recorrido del código

- Empieza en `src/main.tsx` y `src/App.tsx`.
- Lee `src/lib/router/routeRegistry.ts` antes de añadir una ruta.
- Usa `PrivateEnvironment.tsx` para una vista privada y `PublicSite` para
  contenido público.
- Reutiliza `CRMContext` y los tipos de `src/types.ts`.
- Para persistencia, sigue desde `src/lib/api.ts` hasta `server.ts` y
  `server/crmRepository.ts`.
- Añade SQL a `migrations/` solo con revisión y orden numérico.

## Flujo de trabajo

```bash
npm run lint
npm run build
npm run check:root-layout
npm run check:artifact-inventory
```

Para una modificación de servidor, reiniciar `Start application` y leer sus
logs. Para una integración, probar ausencia de credencial y respuesta del
proveedor, no solo el estado de la pantalla.