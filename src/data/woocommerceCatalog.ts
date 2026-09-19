export interface WooCommerceProductRow {
  ID: string;
  Type: string;
  SKU: string;
  Name: string;
  Published: number;
  ShortDescription: string;
  Description: string;
  InStock: number;
  RegularPrice: number;
  Categories: string;
  Tags: string;
}

export const WOOCOMMERCE_CATALOG_CSV_CONTENT = `ID,Type,SKU,Name,Published,Short description,Description,In stock?,Regular price,Categories,Tags
,simple,SRV-srv-1,Consultoría & CRM Omnicanal,1,"Pipeline Drag & Drop a medida, historial unificado de chats y llamadas.","Pipeline Drag & Drop a medida, historial unificado de chats y llamadas.",1,150000.00,Servicios > Consultoría,"servicio,clientum"
,simple,SRV-srv-2,Agentes & Chatbot WhatsApp IA,1,"Atención 24/7, entrenamiento de catálogo y FAQs.","Atención 24/7, entrenamiento de catálogo y FAQs.",1,180000.00,Servicios > Inteligencia Artificial,"servicio,clientum"
,simple,SRV-srv-3,Integraciones AFIP & ERP,1,Conexión directa con AFIP para emisión de facturas electrónicas.,Conexión directa con AFIP para emisión de facturas electrónicas.,1,120000.00,Servicios > Integraciones,"servicio,clientum"
,simple,PLN-inicial,Plan Inicial,1,Para emprendedores y pequeños negocios.,Para emprendedores y pequeños negocios. Web: Landing page responsiva | CRM/ERP: Embudo básico (200 cont.) | Seguridad: Respaldos mensuales | IA & BI: Bot de bienvenida fijo,1,20.00,Planes > Suscripción mensual,"plan,suscripcion,clientum"
,simple,PLN-pyme,Plan PyME,1,Para comercios con ventas activas.,Para comercios con ventas activas. Web: Tienda online estándar | CRM/ERP: Stock + AFIP (1.000 cont.) | Seguridad: Cifrado de base de datos | IA & BI: Bot WhatsApp con FAQs,1,45.00,Planes > Suscripción mensual,"plan,suscripcion,clientum"
,simple,PLN-pro,Plan Pro,1,"Para automatizar con IA, bots y facturación.","Para automatizar con IA, bots y facturación. Web: E-Commerce premium total | CRM/ERP: Multi-embudo ilimitado | Seguridad: Auditorías de software | IA & BI: Agente IA & BI avanzado",1,80.00,Planes > Suscripción mensual,"plan,suscripcion,clientum"
,simple,PLN-corporativo,Plan Corporativo,1,Para empresas con múltiples canales activos.,Para empresas con múltiples canales activos. Web: Portal B2B + Web integral | CRM/ERP: Pipeline multi-sucursal | Seguridad: Hardening y firewall | IA & BI: Analítica predictiva & bots,1,150.00,Planes > Suscripción mensual,"plan,suscripcion,clientum"
,simple,PLN-especializado,Plan Especializado,1,Infraestructura y desarrollos a medida.,Infraestructura y desarrollos a medida. Web: Apps web & mobile infinitas | CRM/ERP: Integraciones ERP legacy | Seguridad: SOC activo 24/7 dedicado | IA & BI: Modelos LLM corporativos,1,250.00,Planes > Suscripción mensual,"plan,suscripcion,clientum"
,simple,CRS-crs-1,Marketing Digital para Principiantes,1,Curso introductorio y 100% práctico pensado para dueños de PyME.,Curso introductorio y 100% práctico pensado para dueños de PyME.,1,0,Cursos > Campus Virtual,"curso,capacitacion,clientum"
,simple,CRS-crs-2,CRM Clientum: Ventas y Pipeline,1,Dominá el ciclo de vida del cliente.,Dominá el ciclo de vida del cliente.,1,0,Cursos > Campus Virtual,"curso,capacitacion,clientum"
,simple,SOL-chatbot,Chatbot WhatsApp,1,"Tu negocio atiende solo, las 24 horas.","Tu negocio atiende solo, las 24 horas.",1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-crm_inteligente,CRM Inteligente,1,Nunca más perdas una venta.,Nunca más perdas una venta.,1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-asistente_ia,Asistente IA,1,"Tu analista de negocio, siempre disponible.","Tu analista de negocio, siempre disponible.",1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-reportes,Reportes Automáticos,1,Dashboards en tiempo real para decisiones basadas en datos.,Dashboards en tiempo real para decisiones basadas en datos.,1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-automatizacion,Automatización,1,Hacé más con menos esfuerzo.,Hacé más con menos esfuerzo.,1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-portal_cliente,Portal del Cliente,1,Tus clientes se autoatienden.,Tus clientes se autoatienden.,1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-desarrollo_web,Desarrollo Web,1,"Tu presencia web, conectada al CRM.","Tu presencia web, conectada al CRM.",1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-integraciones,Integraciones,1,"WhatsApp, AFIP, MercadoPago, Gmail y más de 50 servicios.","WhatsApp, AFIP, MercadoPago, Gmail y más de 50 servicios.",1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-catalogo,Catálogo Completo,1,425 servicios en 14 categorías con precios reales.,425 servicios en 14 categorías con precios reales.,1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-consultoria_erp,Consultoría & ERP,1,"Auditoría de procesos, ERP personalizado y hoja de ruta.","Auditoría de procesos, ERP personalizado y hoja de ruta.",1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-planes_precios,Planes y Precios,1,Desde $20 USD/mes. Implementación en 5 días hábiles.,Desde $20 USD/mes. Implementación en 5 días hábiles.,1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"
,simple,SOL-casos,Casos de Éxito,1,Historias reales de PyMEs que multiplicaron sus ventas.,Historias reales de PyMEs que multiplicaron sus ventas.,1,0,Soluciones > Plataforma,"solucion,plataforma,clientum"`;

export function downloadWooCommerceCsv() {
  const blob = new Blob([WOOCOMMERCE_CATALOG_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'clientum-catalogo-woocommerce.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
