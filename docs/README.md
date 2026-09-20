# Clientum OS & CRM — Índice de Documentación Técnica

Bienvenido al centro de documentación técnica y operativa de **Clientum OS / CRM**. Esta serie de documentos contiene la auditoría completa del sistema, arquitectura de navegación, catálogo de módulos, configuración del motor de IA / Copilot, integración con servicios de terceros y guías de mantenimiento.

---

## 📚 Estructura de Documentación

| Archivo | Descripción | Temas Clave |
| :--- | :--- | :--- |
| **[01. Módulos y Funcionalidades](01-modulos-y-funcionalidades.md)** | Catálogo y auditoría de todos los módulos del Dashboard. | CRM, Prospección B2B, Omnicanalidad, AgenteOS, ERP, Facturación y Gobernanza. |
| **[02. Arquitectura y Enrutamiento](02-arquitectura-y-enrutamiento.md)** | Estructura interna, enrutador central y mapa de navegación. | `PrivateEnvironment.tsx`, `sidebar.ts`, lazy loading, `CRMContext.tsx` y ciclo de vida de vistas. |
| **[03. IA, Copilot y Modelos](03-ia-copilot-y-modelos.md)** | Configuración del motor de Inteligencia Artificial. | OpenRouter, OpenAI, Gemini Nativo, Claude 3.5 Sonnet, GPT-4o, DeepSeek R1, Test Connection y Cifrado. |
| **[04. Integraciones y Producción](04-integraciones-y-requisitos-produccion.md)** | Guía de configuración para servicios externos reales. | Google Maps Places, WhatsApp WACE Hub, AFIP Facturación Electrónica, Mercado Pago y SMTP/IMAP. |
| **[05. Mantenimiento y Auditoría](05-mantenimiento-y-auditoria.md)** | Diagnóstico, historial de desacoples resueltos y comandos. | Auditoría de compilación (`tsc`, `vite build`), resolución de incidencias pasadas y checklist de despliegue. |

---

## ⚡ Resumen Ejecutivo del Estado del Sistema

- **Salud del Sistema:** 100% operativo sin errores de compilación ni advertencias bloqueantes.
- **Módulos Activos:** 32 identificadores de navegación y submódulos mapeados y enlazados.
- **Motor de IA:** Soporte tripartito para **Google Gemini** (nativo), **OpenRouter** (Claude 3.5 Sonnet, DeepSeek R1, Llama 3.3) y **OpenAI** (GPT-4o, GPT-4o Mini) con verificación activa mediante *Test Connection*.
- **Persistencia:** Almacenamiento sincronizado con Firebase Firestore y modo local/offline para pruebas de alta velocidad.
