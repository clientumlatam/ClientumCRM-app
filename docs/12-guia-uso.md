# 12 · Guía de uso de ClientumOS

Esta guía describe la experiencia disponible en la aplicación. Un módulo
visible puede ser local, demo o dependiente de un proveedor; los avisos de
requisito son parte del flujo.

## 1. Ingreso y workspace

1. Abre la portada y elige iniciar sesión o crear una cuenta.
2. Con Firebase configurado puedes usar email/password y los proveedores
   visibles en la pantalla.
3. Si estás en desarrollo sin Firebase, aparece el acceso demo explícito.
   Sirve para explorar la UI y datos semilla; no crea una identidad productiva.
4. Tras ingresar, completa nombre y empresa. El servidor intenta inicializar
   el workspace mediante `/api/account/bootstrap`.
5. Si el workspace no carga, revisa primero sesión, PostgreSQL y `/ready`.

## 2. Dashboard y CRM

Desde el dashboard puedes revisar el resumen y navegar a:

- **Pipeline:** oportunidades por etapa y vistas de tabla/Kanban.
- **Contactos y empresas:** personas, cuentas y relaciones comerciales.
- **Actividades y calendario:** tareas, notas, llamadas y agenda.
- **Propuestas:** presupuestos y documentos generados por la UI.
- **Prospección:** resultados de Google Places, IA o fallback según claves.
- **Reportes:** métricas y análisis disponibles en el workspace.

Crear, editar o borrar en la UI puede quedar local si no hay PostgreSQL. Con
persistencia disponible, `CRMContext` sincroniza con `/api/crm/bootstrap` y
registra importaciones, calidad de datos y auditoría según el flujo.

## 3. Comunicación

WhatsApp, mensajes, webmail, bots y campañas aparecen como módulos de
comunicación. Para enviar mensajes reales hay que configurar el proveedor,
tokens, IDs de negocio, webhooks y permisos. La pantalla, una bandeja vacía o
un estado “operational” no demuestran entrega.

Email puede usar Resend o SMTP. `/api/email/test` puede validar localmente y
devolver `simulated:true` cuando no hay una clave Resend utilizable.

## 4. IA

Copilot, AgenteOS, estrategia, copy, transcripción, objetivos y
enriquecimiento llaman a rutas del servidor cuando están configuradas. Si una
ruta entrega texto de fallback, úsalo como borrador: no es evidencia de que
Gemini u otro proveedor haya procesado el pedido. Revisa la configuración del
módulo y valida manualmente contenido antes de compartirlo.

## 5. ERP, AFIP y cobros

- **Facturación AFIP:** carga CUIT, punto de venta, certificado y clave solo en
  el formulario seguro. La emisión depende de certificados, ambiente y
  disponibilidad de AFIP; la pantalla no garantiza CAE.
- **Inventario y gastos:** pueden funcionar como estado local; persistencia y
  categorización IA dependen de PostgreSQL/proveedor.
- **Mercado Pago:** billing de plataforma requiere PostgreSQL, token de
  plataforma y `APP_URL` HTTPS para callbacks. El estado queda `pending`
  hasta una confirmación válida del proveedor.

No ingreses credenciales de producción en una sesión demo ni compartas claves
en capturas.

## 6. Importaciones, exportaciones y datos personalizados

El módulo CSV trabaja con oportunidades, empresas y personas, valida tamaño y
registra un batch reversible cuando la API persistente está disponible.
Después de importar, revisa duplicados y usa deshacer si el batch no es
correcto. Las exportaciones y objetos personalizados pueden permanecer en el
estado local del navegador según el módulo.

## 7. Ajustes y equipo

En Ajustes puedes revisar empresa, tema, módulos, credenciales, roles, claves
API y salud. Las claves API se muestran como metadata y se revocan; una clave
de workspace no debe confundirse con un secreto de plataforma. Los permisos
de UI no sustituyen el scoping del servidor.

## 8. Fallos comunes

| Síntoma | Qué comprobar |
| --- | --- |
| No aparece login real | Configuración `VITE_FIREBASE_*`, proveedores habilitados en Firebase y consola del navegador |
| La API privada devuelve `AUTH_PROVIDER_NOT_CONFIGURED` | Configurar en el servidor `FIREBASE_SERVICE_ACCOUNT_JSON` o las tres variables server-only de Firebase Admin |
| El demo funciona pero no guarda | PostgreSQL, `DATABASE_URL`/`PG*`, migraciones y `GET /ready` |
| Integración verde pero no entrega | Token, permisos, webhook, firma, logs y prueba del proveedor |
| Billing queda pendiente | `APP_URL` pública, token de Mercado Pago, webhook y confirmación externa |
| La ruta privada vuelve a `/` | sesión lista/autenticada y ruta incluida en `routeRegistry.ts` |
| Email aparece enviado sin entrega | verificar si la respuesta contiene `simulated:true` y consultar estado |

Para reportar un problema incluye ruta, modo (demo o Firebase), estado de
PostgreSQL, proveedor implicado y respuesta HTTP; nunca incluyas secretos.