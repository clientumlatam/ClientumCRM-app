# 03 · Sistema de Navegación y Enrutamiento (`PrivateEnvironment.tsx`)

## 1. Arquitectura de Navegación Privada
El archivo `src/components/app/PrivateEnvironment.tsx` actúa como el enrutador maestro del espacio de trabajo autenticado en ClientumOS. Gestiona dinámicamente el renderizado de vistas basándose en el estado global `activeTab` proveniente de `CRMContext`.

## 2. Pestañas y Módulos Soportados (`ActiveTab`)
La navegación privada soporta más de 20 módulos especializados agrupados por categorías operativas:

- **Ejecutivo & Analítica**: `executive-dashboard`, `analytics`, `reports`.
- **Comercial**: `opportunities`, `companies`, `contacts`, `tasks`, `calendar`.
- **Canales y Comunicación**: `whatsapp-crm`, `messages`, `email-cloudflare`.
- **ERP y Finanzas**: `invoices`, `inventory`, `expenses`, `quotes`.
- **Configuración y Sistema**: `settings`, `integrations`, `team`, `audit-logs`.

## 3. Comportamiento Responsive y Drawer de IA
- **Sidebar Retráctil (`Sidebar.tsx`)**: Permite colapsar grupos secundarios para maximizar el área de trabajo en pantallas medianas y de escritorio.
- **Asistente AI Copilot**: Se despliega como un panel lateral dinámico bajo demanda, evitando obstruir el flujo de trabajo principal en el pipeline y tableros comerciales.
