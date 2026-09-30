# Propuesta Técnico-Comercial & Arquitectura Operativa
## Tienda Online, Logística, Stock y CRM — Ventas Koalas

---

### Resumen Ejecutivo
El presente documento consolida la arquitectura funcional, tecnológica y comercial para la operación digital de **Ventas Koalas**. Detalla los mecanismos de sincronización de inventario, tiempos de impacto de mercadería, cálculo dinámico de envíos y radios bonificados, modelo de atención técnica híbrida (Chatbot IA + WhatsApp), así como las estrategias de atracción de tráfico en motores de búsqueda geolocalizados más allá de las redes sociales.

---

## 1. Sincronización y Actualización de Stock en la Página

### 1.1. Tiempo y Frecuencia de Actualización
* **Tiempo Real Nativo (0 segundos de latencia):**
  * La tienda online y la base de datos central operan con comunicación bidireccional basada en **Webhooks y APIs en tiempo real**.
  * Cada vez que un usuario completa un pedido en la tienda web, la unidad queda reservada y descontada inmediatamente en el inventario central.
  * **Prevención de sobreventa (*Over-selling*):** Si dos clientes intentan comprar la última unidad al mismo tiempo, el motor de transacciones bloquea la segunda solicitud en milisegundos, impidiendo quiebres de stock o ventas duplicadas.

### 1.2. Sincronización Multicanal (Local Físico / Depósito / Web)
* Si las ventas se realizan tanto en mostrador físico como en la plataforma digital, cualquier movimiento registrado en el sistema de caja o facturación descuenta el stock de la web al instante.
* En integraciones externas en lote (por ejemplo, sincronizaciones manuales o planillas legacy), el cron de respaldo puede ejecutarse cada 5 a 15 minutos, manteniendo la prioridad en el evento instantáneo.

---

## 2. Ingreso de Mercadería al Stock: Tiempo de Impacto

### 2.1. Carga de Mercadería e Impacto Inmediato
* **Reflejo Automático en Tienda:** En cuanto el responsable de depósito o compras confirma el remito de ingreso (manualmente o mediante lectura con escáner de código de barras/QR), las cantidades quedan registradas en la base de datos central.
* **Activación de Artículos Agotados:** Aquellos productos que estaban catalogados como *"Sin Stock / Agotado"* cambian su estado a *"Disponible"* de manera automática en la tienda online, habilitando nuevamente el botón de compra.

### 2.2. Flujo Operativo Recomendado
1. **Recepción física:** Descarga y verificación visual de bultos.
2. **Ingreso al ERP/Depósito:** Carga del lote y asignación de ubicación física (depósito, pasillo, estante).
3. **Liberación digital (1 clic o escaneo):** Publicación del stock disponible en la web.
4. *(Opcional)* **Modo "Recepción / Cuarentena":** Permite ingresar la mercadería contablemente sin que se publique en la web hasta finalizar el control de calidad.

---

## 3. Logística, Cálculo de Fletes y Entregas Sin Cargo

### 3.1. Cálculo Dinámico del Costo de Envío
El costo del flete se calcula en tiempo real durante el proceso de compra (Checkout) a través de dos mecanismos:

1. **Integración con Correos y Operadores Logísticos Nacionales (Andreani, Correo Argentino, OCA, Shipnow, Moova, Treggo):**
   * El cliente introduce su **Código Postal (CP)** o dirección en el carrito.
   * La API del operador cotiza el valor en segundos cruzando:
     * **Peso y dimensiones del paquete** (cubicaje del artículo o suma del carrito).
     * **Distancia kilométrica / Matriz de zonas tarifarias** (Local, Regional, Nacional).
     * Modalidad elegida (Envío a domicilio estándar, express en el día o retiro en sucursal del correo).

2. **Logística Propia / Cadetería Local por Zonas:**
   * **Zona 1 (Cercanía / Casco Urbano):** Tarifa fija local o cadetería propia.
   * **Zona 2 (Periferia / Municipios Aledaños):** Tarifa diferencial por kilómetro adicional.
   * **Zona 3 (Larga distancia / Expreso):** Derivación al transporte contratado.

### 3.2. Configuración de Entregas Sin Cargo (Envío Gratis)
El sistema permite configurar políticas flexibles y combinables:
* **Por Radio Geográfico Estipulado:**
  * Bonificación del 100% del flete para todos los pedidos dentro de un radio de **X kilómetros** (ej. 3 km, 5 km o radio urbano) desde la sede central de Koalas.
* **Por Monto Mínimo de Compra (Ticket Promedio):**
  * Envío gratis para compras superiores a determinado umbral (ejemplo: *"Envío gratis en compras mayores a $X"*). Es la herramienta de mayor impacto para incrementar el valor medio de cada carrito.
* **Retiro Gratuito en Local (Pick-Up Point):**
  * Opción costo $0 para clientes que eligen retirar su compra directamente por el punto de entrega.

---

## 4. Consultas Técnicas: Chatbot Autónomo vs. Derivación a WhatsApp

Se implementa un **modelo de atención híbrido** para maximizar la conversión sin sobrecargar al equipo humano:

```
[Cliente en Ficha de Producto]
           │
           ├──► [Opción A: Botón Directo WhatsApp] ──► Chat 1 a 1 con Asesor Humano
           │                                          (Lleva producto y SKU precargado)
           │
           └──► [Opción B: Chatbot IA en Web 24/7] ──► Respuestas Técnicas Instantáneas
                                                      (Medidas, materiales, cuidados, uso)
                                                                 │
                                                                 ▼
                                                      ¿Requiere atención humana?
                                                      ├── SÍ ──► Derivación a WhatsApp
                                                      └── NO ──► Cierre de compra en web
```

### 4.1. Chatbot Inteligente en la Web (Atención 24/7)
* Responde al instante las dudas técnicas más habituales: materiales, tablas de medidas, capacidades de carga, recomendaciones de lavado/cuidado, garantías y compatibilidad.
* No descansa: asiste a clientes fuera de horario comercial (noches, fines de semana y feriados), guiándolos hacia el carrito de compras.

### 4.2. Derivación Contextual a WhatsApp
* **Botón en cada ficha de producto:** *"Consultar a un especialista por WhatsApp"*. Al hacer clic, abre la aplicación con un mensaje redactado automáticamente:
  > *"Hola! Vengo de la tienda web y tengo una consulta técnica sobre el producto: [Nombre del Modelo - SKU #123]"*
* **Escalamiento desde el Chatbot:** Si la consulta del cliente supera el alcance de las preguntas frecuentes o solicita hablar con una persona, el bot recopila los datos básicos y transfiere la conversación al WhatsApp oficial de ventas, registrando el contacto en el CRM.

---

## 5. Captación de Clientes Más Allá de las Redes Sociales

Para diversificar las fuentes de adquisición y no depender exclusivamente de la inversión publicitaria en redes (Instagram/Facebook), se activan 5 canales complementarios:

| Canal | Descripción y Funcionamiento | Nivel de Intención de Compra |
| :--- | :--- | :--- |
| **SEO Orgánico en Google** | Posicionamiento natural del catálogo web para búsquedas como *"artículos de [rubro] en [ciudad]"* o nombres específicos de productos. | **Muy Alta** (El cliente busca activamente solucionar una necesidad). |
| **Google Mi Negocio / Maps** | Ficha comercial verificada con geolocalización, reseñas, fotos del local y botón directo hacia la tienda online. | **Inmediata / Local** (Usuarios buscando comercios cercanos). |
| **Google Ads & Shopping** | Anuncios que aparecen en la parte superior de Google mostrando foto, título del producto y precio al buscar términos clave. | **Máxima** (Tráfico con intención transaccional directa). |
| **Recompra WhatsApp / Email** | Campañas segmentadas a clientes históricos notificando ingresos de temporada, reposición de stock o promociones exclusivas. | **Alta fidelización** (Costo de adquisición prácticamente cero). |
| **Packaging & Código QR** | Inclusión de tarjetas con QR en cada paquete entregado: *"Escaneá y obtené 10% OFF en tu próxima compra web"*. | **Retención continua**. |

---

## 6. Búsqueda por Navegador y Radio Geográfico de Ventas

### 6.1. ¿Cómo llega un usuario de Google a la página si marcamos un radio?
**Sí, es totalmente viable y altamente efectivo mediante tres capas de configuración:**

1. **Configuración del Área de Servicio en Google Business Profile:**
   * En la ficha de Google de la empresa se establece con precisión el radio de entrega (ej. municipios específicos, código postal o un radio de 10 a 25 km).
   * Cuando un usuario que vive o se encuentra dentro de esa zona busca artículos del rubro en su navegador, el motor de búsqueda de Google prioriza y destaca los negocios locales que brindan cobertura en esa ubicación.

2. **Campañas de Google Ads con Radio Geocercado (Geofencing):**
   * Es posible delimitar la pauta publicitaria en Google para que **únicamente se muestre a dispositivos ubicados dentro de un radio de X kilómetros** a la redonda del local/depósito.
   * Quien se encuentre fuera de ese radio no visualizará el anuncio publicitario, asegurando que el 100% del presupuesto se dirija a clientes a los que Koalas puede despachar de forma ágil y rentable.

3. **Verificador de Código Postal en la Tienda:**
   * En el encabezado de la web o en la ficha del producto, el visitante puede tipear su código postal para verificar en el acto:
     * Si su domicilio califica para entrega bonificada (Envío Gratis).
     * Si cuenta con entrega express en el día / 24 hs.

---

## 7. Diagrama del Ciclo Completo de Compra

```
[Búsqueda en Google / Local / Web]
               │
               ▼
      [Tienda Online Koalas]
               │
               ├── Consulta técnica (Chatbot o WhatsApp)
               ├── Validación de Código Postal / Radio de entrega
               ▼
      [Checkout & Pago Online]
               │
               ├── Stock descontado en el acto (0 segundos)
               ├── Flete calculado automáticamente (o bonificado por radio/monto)
               ├── Notificación automática a depósito para embalaje
               ▼
      [Despacho y Registro en CRM / ERP]
```

---

## 8. Pasarelas de Pago y Financiación para Maximizar Conversión

### 8.1. Métodos de Pago Integrados
Para garantizar que ningún cliente abandone el carrito por falta de opciones de pago, la tienda se entrega configurada con los medios líderes del mercado argentino:

* **Mercado Pago Checkout Pro & Transparente:**
  * Tarjetas de crédito y débito con acreditación instantánea.
  * Opciones de cuotas (Planes Ahora / Cuota Simple y cuotas del emisor).
  * Saldo en cuenta de Mercado Pago y Mercado Crédito (financiación sin tarjeta).
* **Transferencia Bancaria con Descuento Automático:**
  * Se puede configurar un incentivo del **X% OFF (ej. 10% o 15% de descuento)** para compras abonadas por transferencia directa (CBU/CVU/Alias).
  * El sistema muestra los datos bancarios y permite adjuntar el comprobante en la misma pantalla o enviarlo automáticamente por WhatsApp al bot de validación.
* **Efectivo contra entrega o retiro en sucursal:**
  * Habilitado exclusivamente para los pedidos dentro del radio local o de retiro presencial en local/depósito.

---

## 9. Integración y Automatización Fiscal (AFIP / ARCA WSFE)

### 9.1. Emisión Automática de Comprobantes Electrónicos
* **Conexión Directa mediante Web Service:**
  * Al confirmarse el pago de la orden, el módulo ERP genera la Factura Electrónica (Factura A, B, C o Ticket a Consumidor Final) directamente ante los servidores de AFIP/ARCA vía WSFE.
  * Obtención automática del número de **CAE (Código de Autorización Electrónico)** y fecha de vencimiento.
* **Envío Digital al Comprador:**
  * El cliente recibe el PDF de la factura legal en su casilla de correo electrónico y un enlace de descarga en la notificación de WhatsApp junto con el detalle del pedido.

---

## 10. Protocolo de Depósito: Picking, Packing y Etiquetas de Envío

### 10.1. Circuito Operativo de Despacho
1. **Alerta de Nuevo Pedido:**
   * La terminal del depósito recibe una alerta sonora/visual y emite una orden de preparación (*Picking List*).
2. **Preparación del Paquete (*Packing*):**
   * El operario reúne los artículos y escanea cada producto para verificar que los talles, colores y modelos coincidan exactamente con la orden.
3. **Impresión de Etiqueta Térmica con Código de Seguimiento (*Tracking*):**
   * Con un solo clic, se imprime la etiqueta oficial del correo (Andreani, Correo Argentino u OCA) con código de barras y QR de seguimiento.
4. **Notificación al Cliente:**
   * En el instante en que el paquete es escaneado por el transporte, el cliente recibe un mensaje automático de WhatsApp:
     > *"¡Tu pedido de Koalas ya está en camino! Seguí el envío en tiempo real aquí: [Link de Seguimiento]"*

---

## 11. Panel de Control y Métricas Clave (KPIs en Vivo)

El panel administrativo de Clientum centraliza los datos estratégicos de la tienda en tiempo real:

| Métrica | Utilidad Operativa | Acción Recomendada |
| :--- | :--- | :--- |
| **Tasa de Conversión Web (%)** | Porcentaje de visitantes que completan una compra. | Si cae, optimizar fotos, descripciones o facilidades de pago. |
| **Ticket Promedio ($)** | Monto medio de gasto por orden. | Subir el umbral de "Envío Gratis" para motivar agregar un artículo más. |
| **Carritos Abandonados** | Clientes que iniciaron compra pero no pagaron. | Disparo automático de WhatsApp de rescate a los 30 min con recordatorio o cupón. |
| **Costo Promedio de Flete** | Impacto del costo de envío sobre la venta. | Evaluar acuerdos corporativos por volumen con Andreani/Moova. |
| **Tiempo de Despacho (SLA)** | Horas transcurridas entre el pago y la entrega al correo. | Mantenerlo por debajo de 24 horas hábiles para maximizar satisfacción. |

---

## 12. Cronograma de Implementación Fase por Fase (4 Semanas)

```
Semana 1: Configuración Inicial y Catálogo
├── Alta de productos, fotos en alta resolución, talles y fichas técnicas
├── Carga inicial de stock físico en el módulo de Depósito/ERP
└── Vinculación de dominio propio y certificados de seguridad SSL

Semana 2: Pasarelas de Pago y Logística
├── Conexión de Mercado Pago y cuentas bancarias (alias/CBU)
├── Configuración de matrices de envío (Andreani, OCA, cadetería local)
└── Parametrización del radio de entrega sin cargo y ticket mínimo

Semana 3: Automatizaciones, Chatbot y SEO
├── Carga de preguntas frecuentes e instrucciones técnicas en el Chatbot IA
├── Configuración de botones contextuales de WhatsApp
├── Optimización de Google Mi Negocio (Área de servicio y catálogo local)
└── Pruebas de compra de punta a punta (Checkout de prueba y remito)

Semana 4: Capacitación y Lanzamiento Oficial
├── Taller operativo para el equipo de ventas y depósito
├── Activación de campañas de Google Ads geosegmentadas por radio
└── Salida en vivo (Go-Live) con monitoreo en tiempo real
```

---

## 13. Preguntas Frecuentes Operativas (Personal de Ventas y Depósito)

**P: ¿Qué pasa si un cliente pide anular o modificar un pedido antes del despacho?**  
*R:* Desde el panel de pedidos se cancela o modifica la orden con un solo clic; el sistema devuelve automáticamente el stock reservado al inventario web y genera la nota de crédito electrónica correspondiente.

**P: ¿El cliente puede elegir pagar en efectivo cuando retira en el local?**  
*R:* Sí. En el checkout web se puede habilitar la opción *"Pagar al retirar en sucursal"*. En ese caso, el pedido queda en estado "Pendiente de Cobro" y reserva el stock durante un plazo parametrizable (por ej. 48 hs). Si no se retira en ese lapso, el stock se libera automáticamente.

**P: ¿Se pueden fijar promociones como "2x1" o "combo de artículos"?**  
*R:* Totalmente. El módulo comercial admite reglas de descuento automáticas: combos con descuento, cupones con código secreto para influencers o descuentos por volumen.

---

## 14. Checklist de Requisitos Previos (Información a Aportar por Koalas)

Para dar inicio a la Fase 1 del desarrollo, el equipo de Koalas debe proporcionar los siguientes 6 elementos:

* [ ] **1. Ubicación del Depósito o Local Central:** Dirección exacta y código postal que servirá como "Punto Cero" para trazar el radio de entregas bonificadas y calcular tarifas de flete.
* [ ] **2. Número de WhatsApp Business Oficial:** Línea telefónica dedicada donde se conectará el Chatbot y se derivarán las consultas técnicas de los clientes.
* [ ] **3. Catálogo Inicial de Artículos:** Planilla Excel/CSV o listado con nombres, categorías, precios de venta, variantes (talles/colores), descripción y stock inicial.
* [ ] **4. Carpeta de Material Gráfico:** Logotipo en alta resolución (.png o vectorial), manual de marca básico (si tienen) y fotografías de los productos en fondo blanco o ambientadas.
* [ ] **5. Credenciales de Cobro:** Acceso o vinculación a la cuenta de Mercado Pago (para cobros con tarjeta/QR) y datos de la cuenta bancaria (Alias, CBU, Titular y CUIT) para transferencias con descuento.
* [ ] **6. Datos Fiscales (AFIP / ARCA):** CUIT, Razón Social, Condición de IVA y delegación del servicio de Facturación Electrónica (WSFE) si desean emisión automática de comprobantes.

---

## 15. Cuadro de Inversión y Próximos Pasos para el Inicio

### 15.1. Estructura Económica Típica
1. **Inversión de Implementación (Setup Inicial):**
   * Diseño y desarrollo de la tienda online con dominio propio y SSL.
   * Carga inicial y categorización de productos.
   * Integración de pasarelas de pago (Mercado Pago / CBU) y logística (Andreani / OCA / cadetería).
   * Configuración y entrenamiento del Chatbot IA con catálogo y derivación a WhatsApp.
   * Puesta a punto de Google Mi Negocio, SEO local y radio geocercado.
2. **Abono Mensual de Mantenimiento y Soporte (SaaS):**
   * Servidor en la nube de alta disponibilidad, copias de seguridad automáticas y mantenimiento preventivo.
   * Soporte técnico prioritario, actualizaciones de seguridad y ajustes en catálogo o promociones.

### 15.2. Pasos Inmediatos para Comenzar
1. **Aprobación de la Propuesta:** Confirmación por parte de Koalas del alcance y presupuesto.
2. **Firma y Anticipo de Inicio:** Pago del anticipo acordado (habitualmente 50% de inicio y 50% contra entrega).
3. **Kick-Off Técnico (Reunión de 30 min):** Apertura de canal de comunicación directo (grupo de WhatsApp o Slack) y recepción de la carpeta de fotos y catálogo inicial.
4. **Inicio del Cronograma (Día 1):** Comienzo de la configuración del entorno y carga de la base de datos.

---

## 16. Automatización de Notificaciones por WhatsApp y Email

Todas las comunicaciones transaccionales se disparan sin intervención humana, garantizando que el comprador esté informado en cada etapa del proceso y reduciendo las consultas reiterativas de *"¿Dónde está mi paquete?"*:

### 16.1. Plantillas de Mensajes Transaccionales por WhatsApp

1. **Confirmación de Compra y Pago Exitoso (Instantáneo):**
   > *"¡Hola {nombre}! 🎉 Gracias por tu compra en Koalas (Pedido #{numero_orden}). Ya confirmamos tu pago por ${monto_total}. En este momento tu pedido está pasando a nuestro sector de empaque en el depósito. Te avisaremos apenas el transporte retire tu paquete."*

2. **Despacho y Envío con Link de Seguimiento en Vivo:**
   > *"¡Buenas noticias {nombre}! 📦 Tu pedido #{numero_orden} ya fue retirado por {correo_transporte}. Podés seguir el recorrido en tiempo real acá: {link_seguimiento_tracking}. Tiempo estimado de entrega: {dias_habiles} días hábiles."*

3. **Rescate Automático de Carrito Abandonado (a los 45 minutos):**
   > *"Hola {nombre} 👋 Vimos que dejaste artículos en tu carrito en Koalas. Para ayudarte a completar tu compra, te reservamos el stock por 2 horas y te dejamos un 5% de descuento adicional con el cupón: KOALASEXPRESS. Podés terminar tu pedido acá: {link_carrito}"*

4. **Calificación y Reseña de Google Maps (3 días después de la entrega):**
   > *"¡Hola {nombre}! Esperamos que estés disfrutando tu compra en Koalas 🐨⭐ ¿Nos dejás tu opinión sobre el producto y la velocidad de entrega en Google? Tu reseña nos ayuda a seguir mejorando: {link_google_reviews}"*

---

## 17. Matriz de Roles, Accesos y Seguridad del Personal (RBAC)

Para preservar la confidencialidad de la información financiera y ordenar la operatoria diaria, el sistema asigna permisos específicos según el perfil de cada colaborador:

| Rol de Usuario | Permisos Habilitados | Restricciones de Seguridad |
| :--- | :--- | :--- |
| **Administrador General (Dueño / Gerencia)** | Acceso irrestricto a métricas de facturación, balance de ventas, configuración de pasarelas, márgenes y roles. | Ninguna restricción. Autenticación de dos pasos obligatoria. |
| **Encargado de Depósito / Logística** | Vista de pedidos pendientes de empaque, escaneo de remitos, actualización de stock físico e impresión de etiquetas de correo. | No visualiza datos de tarjetas, márgenes de ganancia ni información fiscal confidencial. |
| **Vendedor Mostrador / Atención al Cliente** | Gestión de chats de WhatsApp, derivaciones de clientes, creación de órdenes manuales y consulta de stock en tiempo real. | No puede anular facturas emitidas ni modificar precios sin clave de supervisor. |
| **Administración / Contabilidad** | Descarga de libro de IVA ventas digital, auditoría de comprobantes AFIP/ARCA y conciliación de liquidaciones de Mercado Pago. | Acceso operativo de solo lectura a los pedidos físicos. |

---

## 18. Gestión de Cambios, Devoluciones y Logística Inversa

Una política de cambios clara y sin fricciones es uno de los mayores impulsores de la tasa de conversión en indumentaria y artículos de diseño:

### 18.1. Circuito de Cambio Ágil
1. **Solicitud de Cambio en Línea:** El cliente ingresa a la sección *"Cambios y Devoluciones"* de la tienda con su número de orden y correo electrónico.
2. **Selección del Motivo y Nueva Variante:** Selecciona el talle/color deseado. El sistema valida automáticamente si hay stock disponible de la variante solicitada.
3. **Generación de Etiqueta Inversa:** Se emite una etiqueta de Correo Argentino/Andreani con franqueo a pagar por la empresa o el cliente según corresponda.
4. **Recepción e Inspección:** Al llegar el artículo al depósito, el operario escanea la devolución, valida las condiciones de la prenda y con 1 solo clic libera el nuevo despacho y reincorpora la unidad devuelta al stock web.

---

## 19. Infraestructura, Continuidad Operativa y Seguridad de Datos

* **Alojamiento en la Nube con Red de Distribución Global (Cloudflare CDN):**
  * Servidores de alta velocidad con caché distribuida que garantizan tiempos de carga inferiores a 1,2 segundos tanto en dispositivos móviles 4G como en conexiones hogareñas.
* **Cifrado y Certificados de Seguridad SSL/TLS 1.3:**
  * Toda la información que viaja entre el navegador del cliente y la tienda está cifrada bajo estándares bancarios internacionales.
* **Copias de Seguridad (Backups) Automatizadas:**
  * Respaldos diarios de la base de datos de productos, clientes y comprobantes contables con retención histórica en servidores redundantes.
* **Continuidad ante Fallas de Conexión Local:**
  * Si el local físico sufre cortes temporales de internet, el personal puede acceder y operar el panel de pedidos y WhatsApp desde cualquier teléfono móvil con datos móviles (4G/5G).

---

## 20. Acuerdos de Nivel de Servicio (SLA) y Soporte Técnico Continuo

El servicio incluye un compromiso de disponibilidad y tiempos de respuesta estipulados por contrato:

* **Disponibilidad de la Tienda Online (Uptime):** **99.8%** de operatividad continua mensual.
* **Tiempos de Respuesta ante Incidencias Técnicas:**
  * *Incidencia Crítica (Tienda o pasarela fuera de servicio):* Respuesta y atención inmediata en menos de **2 horas**.
  * *Consulta Operativa o Ajuste Menor (Cambio de banners, precios o textos):* Resolución en un plazo máximo de **24 horas hábiles**.
* **Canal Exclusivo de Soporte:** Mesa de ayuda directa vía WhatsApp y correo electrónico prioritario.

---

## 21. Acta de Validación y Conformidad

La presente propuesta técnico-comercial tiene una validez de **15 días corridos** a partir de su emisión.

```
Por la Empresa Proveedora:                      Por el Cliente:
CLIENTUM TECNOLOGÍA PyME                        KOALAS INDUMENTARIA & DISEÑO

Firma: ___________________________              Firma: ___________________________
Aclaración: ______________________              Aclaración: ______________________
Cargo: Consultor de Implementación              Cargo: ___________________________
Fecha: _____ / _____ / 2026                     Fecha: _____ / _____ / 2026
```

---

*Documento técnico integral preparado para la implementación de Ventas Koalas — Plataforma Clientum.*



