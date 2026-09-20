# 03 — Motor de IA, Configuración de Copilot y Selección de Modelos

Este documento describe el funcionamiento de la capa de Inteligencia Artificial en Clientum CRM, los modelos soportados, el sistema de verificación de conexiones (*Test Connection*) y las políticas de seguridad de claves.

---

## 1. Arquitectura de Inteligencia Artificial

Clientum cuenta con una arquitectura híbrida de IA que permite operar tanto con modelos nativos en la nube como con proveedores externos avanzados configurados por el usuario.

```
                  ┌──────────────────────────────────────────────┐
                  │          AICopilot.tsx / AgenteOS            │
                  │      (Peticiones de Sugerencia / Chat)       │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │             server.ts (/api/ai/*)            │
                  │      (Resolución de Proveedor y Cifrado)     │
                  └──────┬───────────────┼───────────────┬───────┘
                         │               │               │
                         ▼               ▼               ▼
                  [Google Gemini]  [OpenRouter API] [OpenAI API]
                  (2.5 Flash / Pro)(Claude 3.5 / R1)(GPT-4o / Mini)
```

---

## 2. Proveedores y Modelos Disponibles

### 2.1. OpenRouter (Multi-Proveedor)
Permite acceder a los modelos de razonamiento más potentes del mercado con una sola API Key:
- **Anthropic Claude 3.5 Sonnet (`anthropic/claude-3.5-sonnet`):** Ideal para análisis de tratos comerciales, redacción de propuestas de alto valor y negociación persuasiva.
- **DeepSeek R1 (`deepseek/deepseek-r1`):** Modelo de razonamiento profundo paso a paso (*Chain of Thought*) para proyecciones matemáticas y diagnóstico de pipeline.
- **Meta Llama 3.3 70B (`meta-llama/llama-3.3-70b-instruct`):** Potencia de código abierto con gran balance entre velocidad y precisión.

### 2.2. OpenAI Directo
- **GPT-4o (`gpt-4o`):** Modelo insignia omnimodal con alto rendimiento en análisis de datos estructurados de CRM.
- **GPT-4o Mini (`gpt-4o-mini`):** Respuestas ultra rápidas en milisegundos y mínimo costo de tokens.

### 2.3. Google Gemini Nativo
- **Gemini 2.5 Flash / Pro:** Motor nativo de la plataforma. Siempre disponible por defecto sin necesidad de ingresar claves externas.

---

## 3. Centro de Configuración de Copilot (`AICopilotSettingsModal.tsx`)

La ventana de configuración del Copilot incluye:

1. **Pestaña "Configuración Copilot":**
   - Panel de control principal con indicador del **Modelo Activo** y estado de la clave.
   - Botón interactivo **Test Connection** para validar la conectividad en vivo.
   - Selector visual de tarjetas de modelos con etiquetas de proveedor y estado (*Key Ready* vs *Set Key*).
2. **Pestañas de Proveedores Individuales (OpenRouter / OpenAI / Gemini):**
   - Campos seguros con máscara para ingresar o actualizar las API Keys.
   - Enlaces directos a las consolas oficiales de generación de claves.
   - Diagnóstico detallado del estado de la credencial.

---

## 4. Sistema de Verificación en Vivo (*Test Connection*)

Al presionar el botón **Test Connection**, el sistema ejecuta una llamada ligera al endpoint `/api/ai/copilot/verify-key` en `server.ts`:

- **Si la clave es válida y el servicio responde:**
  - Muestra un banner verde con el icono de verificación (`CheckCircle2`).
  - Indica código `HTTP 200 OK`, latencia en milisegundos y hora exacta del test.
- **Si la clave es inválida, expiró o no tiene saldo:**
  - Muestra un banner rojo con el icono de alerta (`AlertCircle`).
  - Desglosa el código de error devuelto por la API externa (ej: `401 Unauthorized - Invalid API Key`).

---

## 5. Indicadores Visuales en la Interfaz de Chat (`AICopilot.tsx`)

Para que el usuario siempre tenga certeza de qué modelo está respondiendo:
- **Píldora de Modelo en Encabezado:** Muestra el nombre legible del modelo (ej: `Claude 3.5 Sonnet` o `GPT-4o`) junto a un punto verde (activo) o ámbar parpadeante (sin clave).
- **Barra de Estado del Modelo:** Ubicada sobre los mensajes, indica el proveedor activo y un acceso directo a ajustes.
- **Banner de Alerta Contextual:** Si el usuario selecciona OpenRouter u OpenAI pero no tiene clave guardada, aparece un aviso en color ámbar que invita a configurarla con un solo clic.

---

## 6. Seguridad y Almacenamiento de Credenciales

- Las claves de API se almacenan de manera cifrada asociadas al identificador del usuario/inquilino (`tenantCredentials`).
- Las llamadas a las APIs externas se realizan **exclusivamente desde el backend en `server.ts`**; ninguna clave secreta se expone al navegador ni en el código cliente.
