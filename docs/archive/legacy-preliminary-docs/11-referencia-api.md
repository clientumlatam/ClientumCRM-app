# 11 · Referencia de la API - ClientumOS

ClientumOS utiliza una arquitectura de API REST para la comunicación entre el frontend y el servidor de backend.

## 1. Gestión de Registros CRM (`/api/crm`)

### `GET /api/crm/records`
Obtiene todos los registros del tenant actual (Oportunidades, Compañías, Personas, Tareas).
- **Header**: `X-Tenant-ID: clientum-default-tenant`
- **Respuesta (200 OK)**:
  ```json
  {
    "success": true,
    "records": [{ "id": "opp_1", "entity_type": "opportunity", "data": { ... } }]
  }
  ```

### `POST /api/crm/records/sync`
Sincroniza y actualiza registros desde el cliente al servidor.
- **Cuerpo**: `{ "records": [...] }`
- **Respuesta (200 OK)**: `{ "success": true, "upsertedCount": 10 }`

### `GET /api/crm/duplicates`
Busca posibles duplicados en la base de datos de contactos.

### `POST /api/crm/duplicates/resolve`
Resuelve un conflicto de duplicados.
- **Cuerpo**: `{ "duplicateId": "...", "resolution": "merge" }`

## 2. Inteligencia Artificial (`/api/ai`)

### `POST /api/ai/voice-note`
Procesa una grabación de voz para transcripción y extracción de tareas.
- **Cuerpo**: `{ "audio": "base64_string" }`
- **Respuesta (200 OK)**:
  ```json
  {
    "transcription": "Llamar a Juan mañana",
    "analysis": {
      "summary": "Recordatorio de llamada",
      "tasks": ["Llamar a Juan"]
    }
  }
  ```

## 3. Integraciones

### `POST /api/integrations/afip/test`
Verifica la conectividad con los Web Services de AFIP.

### `GET /api/integrations/health`
Estado de salud de todas las integraciones activas (Meta, AFIP, Mercado Pago).

---
*Nota: Todas las peticiones deben incluir el header `X-Tenant-ID` para asegurar el aislamiento de datos.*
