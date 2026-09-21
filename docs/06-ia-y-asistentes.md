# 06 · Inteligencia Artificial, Copilot y Modelos Gemini

## 1. Integración con el SDK de Google GenAI (`@google/genai`)
ClientumOS utiliza el SDK oficial `@google/genai` ejecutándose exclusivamente en el servidor (`server.ts`) para proteger las claves API contra la exposición en el navegador.

## 2. Casos de Uso del Asistente Comercial (AI Copilot)
- **Resúmenes Ejecutivos de Negocios**: Análisis predictivo de probabilidad de cierre y recomendaciones de avance de etapa para oportunidades en el pipeline.
- **Redacción Automatizada de Correos y Mensajes**: Generación de propuestas comerciales contextuales en WhatsApp y correo electrónico.
- **Clasificación y Triaje de Consultas**: Categorización automática de tickets y leads entrantes según intención de compra.

## 3. Dictado por Voz y Notas Rápidas
Implementado mediante el endpoint `/api/ai/voice-note`, permite:
1. **Transcripción**: Conversión de voz a texto en tiempo real.
2. **Extracción de Tareas**: La IA identifica compromisos ("Llamar a X el martes") y crea tareas automáticamente en el CRM.
3. **Minutas de Reunión**: Resumen automático de conversaciones grabadas directamente desde el tablero Kanban o el perfil del cliente.

## 4. Configuración del Modelo
- **Modelo Predeterminado**: `gemini-1.5-flash` para velocidad y eficiencia en tareas transaccionales.
- **Modelo Avanzado**: `gemini-1.5-pro` para análisis profundo de pipeline y reportes estratégicos.
- **Temperatura**: Configurada en `0.7` para redacción creativa y `0.2` para análisis de datos estructurados.
