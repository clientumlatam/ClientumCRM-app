# Roadmap de implementación

Este documento convierte el estado técnico actual en tareas implementables. No
promete fechas ni convierte una pantalla de demostración en una integración
operativa. Cada tarea debe mover una capacidad desde **configurable** o
**demo/simulado** hacia **implementado y verificable**.

## Cómo leer este roadmap

- **P0**: bloquea seguridad, aislamiento de datos o publicación confiable.
- **P1**: permite operar una capacidad crítica con persistencia y diagnóstico.
- **P2**: completa integraciones externas y módulos que ya tienen superficie de
  producto.
- **P3**: mejoras de producto que deben comenzar después de estabilizar la base.

Una tarea solo está terminada cuando incluye código, configuración documentada,
prueba reproducible, manejo de error y actualización de la referencia REST o la
guía de uso cuando corresponda.

## Estado actual resumido

| Área | Estado | Trabajo que falta |
| --- | --- | --- |
| Navegación y CRM local | Implementado | Mantener regresiones cubiertas |
| CRM durable, tenants e importaciones | Implementado con PostgreSQL | Reforzar consistencia y pruebas de aislamiento |
| Firebase Auth | Implementado con configuración server-only | Mantener rotación de credenciales y ampliar pruebas de identidad |
| Bóveda de credenciales | Implementada | Operación de claves, rotación y fallos explícitos |
| IA | Rutas y fallbacks | Diferenciar fallback de proveedor real y mejorar observabilidad |
| Mercado Pago | Checkout, estado y webhook | Configuración productiva y pruebas de confirmación reales |
| AFIP | Superficie de configuración | Emisión CAE comprobable en sandbox |
| WhatsApp, email y Maps | Componentes y rutas | Entrega real con contratos de proveedor |
| Cloudflare y Vercel | Consultas administrativas | Permisos, diagnóstico y acciones explícitas |

## Fase P0 — Seguridad y publicación confiable

### P0-01 — Verificar la identidad Firebase en el backend

**Estado:** Implementado en el backend y cliente. La operación productiva
requiere configurar Firebase Admin; las pruebas ampliadas de tokens reales y
rotación continúan en `P0-03`.

**Objetivo:** dejar de aceptar un `Bearer` o `x-clientum-user-id` con formato
válido como si fuera una identidad autenticada en producción.

**Alcance:**

- Añadir verificación server-side de Firebase ID tokens usando credenciales
  server-only.
- Derivar el usuario únicamente del token verificado en producción.
- Mantener el fallback demo solo en desarrollo y fuera de rutas productivas.
- Diferenciar `401` por sesión ausente de `403` por usuario autenticado sin
  permiso.

**Archivos/superficies:** `server.ts`, `src/firebase.ts`,
`src/context/CRMContext.tsx`, `api/[...path].ts`, variables de entorno y
documentación de autenticación.

**Dependencias:** ninguna; debe preceder a cualquier nueva ruta privada.

**Terminado cuando:**

- Un token inválido, expirado o manipulado no accede a `/api/account`,
  `/api/crm`, `/api/billing`, `/api/ai` ni `/api/user-*`.
- Una identidad verificada conserva el aislamiento de su workspace.
- El modo demo no puede activarse con `NODE_ENV=production`.
- Hay smoke tests para ausencia, token inválido y token válido.

### P0-02 — Auditar aislamiento de tenant y ownership

**Objetivo:** comprobar que cada operación durable usa el tenant derivado de la
identidad y no un identificador enviado por el cliente.

**Alcance:**

- Revisar `server/crmRepository.ts`, `src/server/routes/crm.routes` y los
  handlers legacy de `server.ts`.
- Eliminar o encapsular usos nuevos de `x-tenant-id`,
  `x-clientum-tenant` y valores equivalentes.
- Añadir casos cruzados para CRM, tareas, auditoría, importaciones, claves y
  billing.

**Dependencias:** `P0-01`.

**Terminado cuando:**

- Usuario A no puede leer, modificar, eliminar ni cancelar recursos de B.
- Cada consulta SQL durable tiene un filtro de tenant, usuario o ownership
  explícito.
- Los tests de aislamiento fallan si se quita ese filtro.

### P0-03 — Hacer explícita la configuración de producción

**Objetivo:** evitar que el servidor arranque con una configuración que parece
válida pero no puede proteger datos o procesar pagos.

**Alcance:**

- Validar al arranque los secretos requeridos para producción:
  `SESSION_SECRET`, `WORKFLOW_ENCRYPTION_KEY` o equivalente, configuración
  Firebase server-side y PostgreSQL.
- Rechazar placeholders y valores vacíos.
- Mantener `VITE_*` limitado a configuración pública.
- Exponer en `/ready` códigos accionables sin revelar secretos.

**Archivos/superficies:** `server.ts`, `.env.example`, `scripts/migrate.mjs`,
workflow y documentación de despliegue.

**Dependencias:** `P0-01`.

**Terminado cuando:**

- Una configuración incompleta falla con un mensaje seguro y accionable.
- La UI distingue “no configurado” de “proveedor rechazó la solicitud”.
- El arranque local demo sigue funcionando sin habilitarlo en producción.

### P0-04 — Convertir la verificación de release en una puerta repetible

**Objetivo:** que publicar no dependa de comprobaciones manuales o de un puerto
implícito.

**Alcance:**

- Mantener lint, build, layout, inventario, navegación y aislamiento en un
  comando de release.
- Ejecutar los smoke tests contra el puerto configurado por el workflow.
- Añadir validación de enlaces de documentación y migraciones aplicables.
- Documentar qué checks requieren PostgreSQL, Firebase o proveedores externos.

**Dependencias:** `P0-01` y `P0-02`.

**Terminado cuando:**

- Un comando devuelve fallo si una comprobación crítica no se puede ejecutar.
- El resultado identifica si el fallo es de código, entorno o proveedor.
- La guía de contribución y el workflow usan los mismos comandos.

## Fase P1 — Persistencia, billing y diagnóstico

### P1-01 — Cerrar la operación productiva de Mercado Pago

**Objetivo:** habilitar cobros reales sin conceder acceso por crear un checkout.

**Alcance:**

- Configurar y comprobar `PLATFORM_MERCADOPAGO_ACCESS_TOKEN`,
  `PLATFORM_MERCADOPAGO_WEBHOOK_SECRET`, `APP_URL` y PostgreSQL.
- Crear planes recurrentes mensuales/anuales de forma idempotente.
- Probar estados `pending`, `approved`, `rejected`, `paused` y `cancelled`.
- Verificar firma, consulta server-side del recurso e idempotencia de webhook.
- Confirmar que cancelar localmente no ocurre si Mercado Pago rechaza la
  operación.

**Archivos/superficies:** `server.ts`, migraciones de billing,
`PlatformBillingView.tsx`, `MercadoPagoSubscriptionModal.tsx`,
`scripts/setup-mp-plans.mjs`, `docs/11-referencia-rest.md`.

**Dependencias:** `P0-01`, `P0-03` y una cuenta de Mercado Pago de prueba.

**Terminado cuando:**

- El acceso pagado solo se activa después de una confirmación verificable.
- Un webhook repetido no duplica ni degrada un estado confirmado.
- El usuario puede consultar, pausar o cancelar su suscripción y recibe el
  error correcto cuando el proveedor no está disponible.

### P1-02 — Definir una fuente de verdad para CRM durable

**Objetivo:** evitar divergencias entre estado local, Firebase y PostgreSQL.

**Alcance:**

- Documentar qué sistema es fuente de verdad para cada entidad.
- Formalizar la sincronización de `CRMContext` con el bootstrap durable.
- Resolver reintentos, conflictos, borrado y recuperación de lotes.
- Añadir métricas de sincronización pendiente y errores persistentes.

**Archivos/superficies:** `src/context/CRMContext.tsx`, `src/lib/api.ts`,
`server/crmRepository.ts`, rutas CRM y migraciones.

**Dependencias:** `P0-02`.

**Terminado cuando:**

- Recargar la aplicación conserva los cambios confirmados.
- Un fallo parcial no borra datos locales ni marca el lote como exitoso.
- Importaciones, duplicados y undo permanecen acotados al tenant correcto.

### P1-03 — Operar la bóveda de credenciales con rotación

**Objetivo:** que las credenciales de workspace sean utilizables sin exponerlas
ni dejarlas bloqueadas tras una rotación.

**Alcance:**

- Definir rotación de la clave de cifrado y procedimiento de migración.
- Añadir versión de cifrado, validación de descifrado y error explícito.
- Auditar lectura, escritura, borrado y metadata por workspace.
- Añadir una prueba de recuperación después de reinicio del servidor.

**Dependencias:** `P0-02` y PostgreSQL operativo.

**Terminado cuando:**

- Rotar la clave no deja credenciales ilegibles sin un procedimiento de
  recuperación.
- Las respuestas nunca incluyen valores secretos.
- El servidor diferencia clave ausente, clave inválida y proveedor rechazado.

### P1-04 — Hacer observable el comportamiento de IA

**Objetivo:** que un resultado de fallback no se confunda con una respuesta real
de un proveedor.

**Alcance:**

- Unificar el contrato de estado de proveedor, fallback y error.
- Añadir correlation ID, latencia, proveedor y motivo de fallback a la
  auditoría, sin guardar prompts sensibles innecesarios.
- Definir límites de tamaño, timeout, rate limit y reintentos.
- Cubrir copilot, CMO, GTM, ad copy, transcripción, prospecting y goals.

**Archivos/superficies:** handlers de IA en `server.ts`, `src/lib/api.ts`,
componentes de IA, auditoría y `docs/06-ia-asistentes.md`.

**Dependencias:** `P0-03`.

**Terminado cuando:**

- La UI distingue respuesta de proveedor, fallback y error.
- Los logs permiten encontrar una solicitud sin exponer secretos o contenido
  sensible por defecto.
- Cada ruta documenta su timeout y comportamiento de proveedor ausente.

## Fase P2 — Integraciones externas verificables

### P2-01 — AFIP en sandbox con emisión comprobable

**Objetivo:** convertir la superficie fiscal en un flujo verificable sin afirmar
que una pantalla equivale a un CAE.

**Dependencias:** `P0-01`, `P0-03` y certificado sandbox válido.

**Terminado cuando:**

- Se puede validar certificado, CUIT, punto de venta y ambiente.
- Una factura de prueba devuelve CAE o un error del Web Service trazable.
- Se evita duplicar comprobantes mediante idempotency key.
- La UI muestra estado pendiente, aprobado y rechazado.

### P2-02 — WhatsApp con envío y webhook end-to-end

**Objetivo:** demostrar entrega real y sincronización de estados.

**Dependencias:** `P0-01`, `P0-02` y credenciales Meta de prueba.

**Terminado cuando:**

- Se valida firma y verify token del webhook.
- Un mensaje de prueba tiene estado enviado, entregado o fallido.
- Reintentos de Meta son idempotentes.
- La UI nunca presenta una entrega simulada como enviada por Meta.

### P2-03 — Email con proveedor real y trazabilidad

**Objetivo:** separar email simulado, SMTP y Resend, con resultados observables.

**Dependencias:** `P0-03`.

**Terminado cuando:**

- El estado muestra proveedor configurado, prueba enviada y error real.
- Cada envío guarda un identificador de proveedor sin guardar contenido
  sensible innecesario.
- Los webhooks o consultas de estado actualizan tracking de forma idempotente.

### P2-04 — Maps/Places con resultados reales y límites claros

**Objetivo:** que la prospección geolocalizada distinga Places real de fallback.

**Dependencias:** `P0-03` y una clave de Maps restringida.

**Terminado cuando:**

- La clave se usa server-side donde corresponda y tiene restricciones.
- La respuesta informa origen, paginación, límites y errores del proveedor.
- Los resultados se pueden guardar en el tenant sin mezclar workspaces.

### P2-05 — Cloudflare y Vercel con permisos mínimos

**Objetivo:** hacer seguras las consultas y futuras acciones administrativas.

**Dependencias:** `P0-01`, `P0-02` y tokens con scopes mínimos.

**Terminado cuando:**

- Se valida cuenta/tenant antes de devolver zonas o deployments.
- Los tokens no aparecen en cliente, logs ni respuestas.
- Las acciones mutables requieren una operación explícita y auditoría.

## Fase P3 — Producto y mantenimiento

### P3-01 — Ejecutar workflows de forma durable

**Objetivo:** que el editor visual de workflows no sea solo configuración local.

**Dependencias:** `P1-02` y `P1-04`.

**Terminado cuando:**

- Un workflow publicado tiene versión, trigger, estado y ejecución durable.
- Cada nodo registra entrada, salida, error y reintento.
- Pausar, reanudar y cancelar una ejecución son operaciones seguras.

### P3-02 — Mantener la guía de usuario alineada con capacidades reales

**Objetivo:** evitar que el producto prometa integraciones o automatizaciones
que todavía dependen de configuración.

**Alcance:**

- Después de cada tarea de integración, actualizar
  `docs/12-guia-uso.md`, `docs/05-integraciones-persistencia-salud.md` y
  `docs/11-referencia-rest.md`.
- Marcar ejemplos demo, sandbox y producción por separado.
- Añadir un recorrido reproducible para cada capacidad confirmada.

**Dependencias:** cada tarea funcional que cambie el estado documentado.

**Terminado cuando:** cada capacidad publicada tiene requisitos, límites,
errores esperables y una prueba reproducible.

## Orden recomendado de ejecución

1. `P0-01` identidad backend.
2. `P0-02` aislamiento de tenant.
3. `P0-03` configuración productiva.
4. `P0-04` puerta de release.
5. `P1-01` Mercado Pago.
6. `P1-02` CRM durable y `P1-03` bóveda.
7. `P1-04` IA observable.
8. `P2-01` a `P2-05` según el proveedor disponible.
9. `P3-01` workflows.
10. `P3-02` actualización documental continua.

## Criterio común de entrega

Antes de marcar cualquier tarea como terminada:

```bash
npm run lint
npm run build
npm run check:root-layout
npm run check:artifact-inventory
npm run smoke:navigation
npm run smoke:credentials
```

Las tareas que cambien `server.ts`, migraciones, autenticación o proveedores
también deben incluir una prueba de configuración ausente, una prueba de
rechazo del proveedor y una prueba de ownership/tenant cuando corresponda.