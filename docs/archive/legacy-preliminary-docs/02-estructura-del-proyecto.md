# 02 · Estructura del Proyecto y Organización de Archivos

## 1. Árbol de Directorios del Código Fuente (`src/`)

ClientumOS sigue una arquitectura modular y escalable para separar componentes de UI, lógica de negocio, contextos de estado y servicios:

```text
/src
├── assets/images/         # Recursos gráficos, mockups y avatares institucionales
├── components/            # Componentes organizados por dominio funcional
│   ├── app/               # Contenedores principales (PrivateEnvironment.tsx, PublicEnvironment.tsx)
│   ├── common/            # Componentes reutilizables (Modales, TableSettings, ClientumLogo)
│   ├── dashboard/         # Vistas analíticas y resúmenes ejecutivos
│   ├── erp/               # Módulos de facturación, inventario, gastos y contabilidad
│   ├── layout/            # Navegación principal, Sidebar, Navbar y CommandPalette
│   ├── opportunities/     # Tableros Kanban, vistas de tabla y logs de auditoría
│   ├── public/            # Landing page, simuladores de ROI y herramientas de conversión
│   ├── settings/          # Centro de ajustes, configuración AFIP e integración de salud
│   └── whatsapp/          # Bandeja omnicanal y automatizaciones de mensajería
├── context/               # Proveedores de estado global (CRMContext.tsx)
├── data/                  # Datos semilla, catálogos iniciales y diccionarios i18n
├── hooks/                 # Custom React hooks (useTableColumns, useSound, etc.)
├── types.ts               # Definiciones globales de TypeScript y modelos de datos
├── index.css              # Estilos globales y sistema modular de variables CSS
└── main.tsx               # Punto de entrada de la aplicación React
```

## 2. Convenciones de Módulos
- Cada módulo funcional encapsula sus vistas, componentes y subcomponentes específicos.
- Los tipos e interfaces globales residen en `src/types.ts` para garantizar tipado estricto en todo el proyecto.
