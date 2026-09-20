# 05 — Mantenimiento, Auditoría y Resolución de Problemas

Este documento detalla el historial de desacoples resueltos en auditorías previas, los comandos de verificación del sistema y la guía de diagnóstico rápido para desarrolladores.

---

## 1. Comandos de Verificación del Sistema

Para asegurar la integridad del código y evitar regresiones en despliegues:

```bash
# 1. Validación estricta de tipos TypeScript (Cero errores)
npm run lint

# 2. Compilación de producción (Vite + esbuild server bundle)
npm run build

# 3. Inicio del servidor en modo desarrollo
npm run dev
```

---

## 2. Historial de Desacoples Detectados y Resueltos

Durante las auditorías de navegación y componentes se corrigieron los siguientes puntos críticos para garantizar que el 100% de las pestañas estén funcionales:

### 2.1. Mapeo del Módulo "Brochures Comerciales" (`activeTab: 'brochure'`)
- **Problema previo:** Existía el botón en el Hub Central pero el enrutador `PrivateEnvironment.tsx` no tenía registrado el caso `'brochure'`, provocando una pantalla en blanco.
- **Solución aplicada:** Se importó el componente `BrochureView` mediante `React.lazy` y se añadió al switch de renderizado.

### 2.2. Normalización del Identificador de "Agente SDR Prospección" (`sdrOutreach`)
- **Problema previo:** La barra lateral enviaba `defaultModule="sdr"`, mientras que la suite interna de herramientas esperaba `defaultModule="outreach"`.
- **Solución aplicada:** Se unificó el identificador a `'outreach'` en `PrivateEnvironment.tsx` y `PowerSuiteView.tsx`, sincronizando las cadencias y secuencias del agente.

### 2.3. Acceso Directo a Subpestañas de Configuración (`roles`, `integrations`, `auditLogs`)
- **Problema previo:** Al hacer clic en *Auditoría & Logs SOC2* o *Integraciones* desde la barra lateral, `SettingsView` siempre abría la primera subpestaña (*Roles*) por omisión.
- **Solución aplicada:** Se adaptó `SettingsView` para que sincronice su pestaña interna con la propiedad `activeTab` del contexto global.

### 2.4. Sincronización en Tiempo Real del Estado de Modelos en Copilot
- **Problema previo:** Al guardar una nueva clave de API en el modal de configuración, el chat del Copilot no actualizaba inmediatamente la píldora del modelo activo hasta recargar la página.
- **Solución aplicada:** Se introdujo el evento global `ai-copilot-settings-updated` y la actualización reactiva en `AICopilot.tsx`.

---

## 3. Guía de Diagnóstico Rápido (Troubleshooting)

### Síntoma: "¿Por qué el Copilot no responde con el modelo Claude 3.5 o DeepSeek?"
1. Abrir la configuración del Copilot haciendo clic en el icono de engranaje o en la barra de estado.
2. Comprobar que en la pestaña **OpenRouter** se haya guardado una clave válida (`sk-or-v1-...`).
3. Hacer clic en **Test Connection**:
   - Si devuelve `HTTP 200 OK`, la clave está activa y verificada.
   - Si devuelve `401 Unauthorized`, verificar que la clave no haya expirado y tenga saldo disponible en OpenRouter.

### Síntoma: "Un nuevo módulo agregado no renderiza contenido"
1. Verificar que el identificador esté declarado en el tipo `activeTab` dentro de `src/context/CRMContext.tsx`.
2. Confirmar que el componente esté registrado en el bloque `switch (activeTab)` dentro de `src/components/app/PrivateEnvironment.tsx`.
3. Comprobar que el archivo `src/config/sidebar.ts` tenga el `id` exactamente idéntico.

---

## 4. Estado de Salud y Métricas de Auditoría

- **Compilación:** 100% Exitosa.
- **Errores TypeScript:** 0 detectados.
- **Módulos Operativos:** 32 / 32 comprobados.
- **Seguridad de Claves:** Cifrado de credenciales del lado del servidor habilitado.
