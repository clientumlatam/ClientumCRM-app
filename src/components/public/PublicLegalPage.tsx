import React, { useState } from 'react';
import { ShieldCheck, Lock, FileText, Server, CheckCircle2 } from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';

interface PublicLegalPageProps {
  initialTab?: 'terms' | 'privacy' | 'sla';
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicLegalPage: React.FC<PublicLegalPageProps> = ({ initialTab = 'terms' }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'sla'>(initialTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans bg-white text-slate-900">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Marco Legal, Transparencia & Seguridad de la Información</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Términos Legales & Privacidad
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Última actualización: Septiembre de 2026. Conforme a la Ley N° 25.326 de Protección de Datos Personales de la República Argentina.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Términos de Servicio
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Política de Privacidad
        </button>
        <button
          onClick={() => setActiveTab('sla')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sla'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Acuerdo de Nivel de Servicio (SLA)
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6 shadow-xs">
        
        {activeTab === 'terms' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">1. Condiciones Generales de Uso</h2>
            <p className="text-slate-600">
              El presente contrato regula el acceso y utilización de la plataforma de software como servicio (SaaS) comercializada bajo la marca "Clientum", desarrollada y operada con base legal en la República Argentina.
            </p>
            <h3 className="text-base font-bold text-slate-900">2. Propiedad de los Datos</h3>
            <p className="text-slate-600">
              El Cliente es el único y exclusivo propietario de toda la información, bases de datos de prospectos, clientes, conversaciones de WhatsApp y registros contables introducidos en la plataforma. Clientum no comercializa ni cede a terceros ningún dato alojado por el Cliente.
            </p>
            <h3 className="text-base font-bold text-slate-900">3. Integración con AFIP y Servicios Terceros</h3>
            <p className="text-slate-600">
              La emisión de comprobantes fiscales electrónicos mediante el Web Service de Facturación Electrónica (WSFE) de AFIP requiere que el Cliente posea Clave Fiscal y delegue formalmente el servicio. Clientum actúa exclusivamente como canal de transmisión técnica homologado, no asumiendo responsabilidad por inconsistencias tributarias propias del contribuyente.
            </p>
            <h3 className="text-base font-bold text-slate-900">4. Cancelación y Exportación de Datos</h3>
            <p className="text-slate-600">
              El Cliente puede dar de baja su suscripción en cualquier momento sin penalidad alguna. Al cancelar, el sistema permite exportar la totalidad de contactos, tratos, facturas e historiales en formatos estándares abiertos (CSV, XLSX, JSON).
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Política de Privacidad & Protección de Datos Personales</h2>
            <p className="text-slate-600">
              En cumplimiento estricto de la Ley N° 25.326 de Protección de Datos Personales (Argentina) y las mejores prácticas internacionales de seguridad de la información:
            </p>
            <h3 className="text-base font-bold text-slate-900">1. Tratamiento y Cifrado</h3>
            <p className="text-slate-600">
              Toda la comunicación entre el navegador del usuario y nuestros servidores viaja cifrada mediante protocolos TLS 1.3 de 256 bits. Las contraseñas se almacenan mediante hashes criptográficos salados unidireccionales (Argon2 / bcrypt).
            </p>
            <h3 className="text-base font-bold text-slate-900">2. Privacidad en Modelos de Inteligencia Artificial</h3>
            <p className="text-slate-600">
              Los datos empresariales de los clientes procesados mediante los modelos Gemini (Google Cloud Vertex AI) NO se utilizan para entrenar modelos públicos generales ni se comparten con otras entidades. Cada consulta se ejecuta en un contexto efímero y seguro.
            </p>
            <h3 className="text-base font-bold text-slate-900">3. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h3>
            <p className="text-slate-600">
              Cualquier usuario puede ejercer sus derechos de acceso, rectificación y supresión de sus datos personales enviando un correo electrónico formal a <span className="text-blue-600 font-mono font-semibold">privacidad@clientum.com.ar</span>.
            </p>
          </div>
        )}

        {activeTab === 'sla' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Acuerdo de Nivel de Servicio (SLA 99.9%)</h2>
            <p className="text-slate-600">
              Clientum garantiza una disponibilidad operativa mensual del servicio del 99.9%, respaldada por infraestructura redundante multizona en Google Cloud Platform.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <div className="text-xl font-bold text-emerald-600">99.9% Uptime</div>
                <div className="text-xs text-slate-500">Disponibilidad en servidor de producción</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <div className="text-xl font-bold text-blue-600">&lt; 4 Horas</div>
                <div className="text-xs text-slate-500">Tiempo de respuesta prioritario en soporte</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <div className="text-xl font-bold text-purple-600">Backups Diarios</div>
                <div className="text-xs text-slate-500">Copias de seguridad automáticas geodistribuidas</div>
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900">Ventana de Mantenimiento Programado</h3>
            <p className="text-slate-600">
              Las actualizaciones mayores de infraestructura se realizan los días domingos entre las 02:00 y las 04:00 AM (hora de Argentina), con previo aviso de 72 horas a los administradores de cada cuenta.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
