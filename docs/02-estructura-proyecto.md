# 02 · Estructura del proyecto

## Directorios principales

```text
/
├── api/[...path].ts          # Adaptador de la app Express para Vercel
├── server.ts                 # API, middleware, Vite dev y servidor estático
├── server/                   # Repositorios y dominio de persistencia
├── src/
│   ├── App.tsx               # Composición pública/privada
│   ├── components/           # Vistas organizadas por dominio
│   ├── config/               # Navegación y configuración de módulos
│   ├── context/              # CRMContext, tema y toasts
│   ├── data/                 # Catálogos, semillas y credenciales declaradas
│   ├── firebase.ts           # Inicialización guardada de Firebase
│   ├── lib/                  # API cliente y registro de rutas
│   ├── types.ts              # Tipos globales
│   ├── index.css             # Tokens y estilos globales
│   └── main.tsx              # Entrada React
├── migrations/               # SQL numerado aplicado por el servidor/script
├── scripts/                  # Migración, checks y smoke tests
├── public/                   # Assets servidos sin bundling
├── docs/                     # Documentación canónica y archivo de revisión
├── .env.example              # Nombres de variables, sin valores reales
├── .replit                   # Módulos, workflows y puertos de Replit
└── vercel.json               # Rewrites y headers de Vercel
```

## Responsabilidades

- `components/app/PrivateEnvironment.tsx` monta las vistas privadas y modales;
  no es un router HTTP.
- `config/sidebar.ts` define la navegación visible; el registro URL canónico
  está en `lib/router/routeRegistry.ts`.
- `CRMContext` combina estado de UI, datos locales, sincronización CRM, demo y
  llamadas API. No asumir que cada método del contexto persiste en PostgreSQL.
- `server/crmRepository.ts` contiene lecturas, upserts, importaciones y
  decisiones de calidad de datos con tenant.
- `migrations/001` a `007` crean credenciales, CRM, agentes, auditoría,
  pagos, calidad de datos, billing de plataforma y leads públicos.

## Convenciones

Los componentes nuevos deben vivir junto al dominio que renderizan. Las
peticiones a terceros con secretos pasan por `server.ts`; el cliente solo
recibe configuración pública o resultados sanitizados. Una integración que
solo tiene una pantalla, un fallback o un botón no debe documentarse como
entrega operativa.