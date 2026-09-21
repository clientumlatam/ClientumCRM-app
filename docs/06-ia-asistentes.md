# 06 · IA y asistentes

## Arquitectura

Las rutas de IA viven en `server.ts`. Las claves se leen del entorno o de la
bóveda de credenciales del workspace y no deben estar en el bundle del cliente.
El servidor usa `@google/genai` cuando hay una clave compatible; ciertos flujos
también contemplan proveedores configurados en el módulo correspondiente.

## Rutas activas

| Ruta | Uso | Estado |
| --- | --- | --- |
| `POST /api/ai/copilot` | conversación y asistencia comercial | Configurable; fallback textual si no hay proveedor |
| `POST /api/ai/copilot/test-connection` | prueba de configuración | Configurable |
| `GET /api/ai/copilot/provider-status` | estado del proveedor | Diagnóstico, no prueba de calidad |
| `POST /api/ai/cmo` | estrategia de marketing | Configurable con fallback |
| `POST /api/ai/gtm` | estrategia go-to-market | Configurable con fallback |
| `POST /api/ai/adcopy` | variantes de copy | Configurable con fallback |
| `POST /api/ai/voice-note` | nota de voz y análisis | Requiere payload válido y proveedor |
| `POST /api/ai/transcribe` | transcripción | Requiere audio/proveedor |
| `POST /api/ai/prospect` | enriquecimiento/prospección | Puede usar Places, IA o datos fallback |
| `POST /api/ai/smart-goals` | objetivos inteligentes | Configurable |
| `POST /api/contacts/enrich` | enriquecimiento de contacto | Configurable; no garantiza perfiles externos |
| `POST /api/expense/categorize` | categorización de gasto | Configurable |
| `POST /api/public-agent` | asistente público | Ruta pública; no confundir con el workspace |

Las rutas privadas están detrás del middleware de aplicación. Las rutas
públicas no deben recibir secretos. Consulte la [referencia REST](./11-referencia-rest.md)
para cuerpos y respuestas representativas.

## Fallbacks y límites

Un `200` con texto o resultados generados localmente puede indicar un fallback,
no una llamada a Gemini. El usuario debe revisar el estado del proveedor y los
logs del servidor. No documentamos modelos, temperaturas, transcripción en
tiempo real ni creación automática de tareas como garantías: deben comprobarse
en el handler y en la configuración vigente.

No enviar datos sensibles a un proveedor sin confirmar su configuración y
retención. Las respuestas de IA requieren revisión humana antes de enviarse a
clientes o usarse para decisiones comerciales.