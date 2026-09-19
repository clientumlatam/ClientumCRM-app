import React, { useState } from 'react';
import {
  Calculator,
  X,
  CheckCircle2,
  Users,
  MessageSquare,
  FileSpreadsheet,
  Bot,
  Zap,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Share2,
  Sparkles
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const QuoteWizardModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { showToast, triggerConfetti } = useCRM();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Team & Reps
  const [teamSize, setTeamSize] = useState<number>(5);
  const [industry, setIndustry] = useState<string>('Distribuidora / Mayorista');

  // Step 2: Channels & Modules required
  const [modules, setModules] = useState<{ [key: string]: boolean }>({
    whatsapp: true,
    afip: true,
    geminiBot: true,
    inventory: false,
    googleMaps: true
  });

  // Step 3: Volume & Invoicing
  const [monthlyContacts, setMonthlyContacts] = useState<number>(500);
  const [monthlyInvoicing, setMonthlyInvoicing] = useState<number>(5000000); // 5M ARS

  if (!isOpen) return null;

  // Real-time calculations
  const basePricePerUser = 15000; // ARS / user / mo
  const whatsappAddon = modules.whatsapp ? 40000 : 0;
  const afipAddon = modules.afip ? 30000 : 0;
  const geminiAddon = modules.geminiBot ? 45000 : 0;
  const inventoryAddon = modules.inventory ? 25000 : 0;
  const mapsAddon = modules.googleMaps ? 20000 : 0;

  const totalMonthlyPlan = (teamSize * basePricePerUser) + whatsappAddon + afipAddon + geminiAddon + inventoryAddon + mapsAddon;

  // Estimated ROI and time savings
  const hoursSavedPerContact = 0.25; // 15 mins saved per contact in manual entry & invoicing
  const totalHoursSavedMonth = Math.round(monthlyContacts * hoursSavedPerContact);
  const projectedSalesIncreasePercent = modules.geminiBot ? 35 : 20;

  const handleToggleModule = (key: string) => {
    setModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShareQuoteWhatsApp = () => {
    const text = `📋 *Cotización Estimada Clientum Latam*\n\n` +
      `🏢 *Equipo:* ${teamSize} usuarios (${industry})\n` +
      `📦 *Módulos seleccionados:* ${Object.keys(modules).filter(k => modules[k]).join(', ')}\n` +
      `📈 *Contactos estimados:* ${monthlyContacts}/mes\n\n` +
      `💰 *Inversión mensual sugerida:* $ ${totalMonthlyPlan.toLocaleString('es-AR')} + IVA\n` +
      `⚡ *Ahorro proyectado:* ~${totalHoursSavedMonth} horas al mes\n` +
      `🚀 *Aumento en ventas estimado:* +${projectedSalesIncreasePercent}%\n\n` +
      `¡Hola! Quiero coordinar una demostración guiada y activar la prueba gratuita.`;

    window.open(`https://wa.me/542984510883?text=${encodeURIComponent(text)}`, '_blank');
    triggerConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 text-xs font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Cotizador Paso a Paso (4 Pasos)</h2>
              <p className="text-[11px] text-slate-500">Estima costos y retorno de inversión en tiempo real</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#64748b] dark:text-white dark:text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
          <div className={`p-2 rounded-xl border ${step >= 1 ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold' : 'bg-slate-50 border-slate-200 text-[#64748b] dark:text-slate-400'}`}>
            1. Equipo
          </div>
          <div className={`p-2 rounded-xl border ${step >= 2 ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold' : 'bg-slate-50 border-slate-200 text-[#64748b] dark:text-slate-400'}`}>
            2. Módulos
          </div>
          <div className={`p-2 rounded-xl border ${step >= 3 ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold' : 'bg-slate-50 border-slate-200 text-[#64748b] dark:text-slate-400'}`}>
            3. Volumen
          </div>
          <div className={`p-2 rounded-xl border ${step >= 4 ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold' : 'bg-slate-50 border-slate-200 text-[#64748b] dark:text-slate-400'}`}>
            4. ROI & Plan
          </div>
        </div>

        {/* Step 1: Team Size & Industry */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <h3 className="font-bold text-slate-900 text-sm">Paso 1: Tamaño de tu Equipo y Vertical</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 block mb-1">
                  Cantidad de Vendedores / Usuarios del CRM: <span className="font-bold text-slate-900 text-sm">{teamSize}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 block mb-1">Rubro o Industria Principal</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
                >
                  <option value="Distribuidora / Mayorista">Distribuidora / Mayorista</option>
                  <option value="Agro e Insumos">Agroindustria & Acopios</option>
                  <option value="Estudio Contable">Estudio Contable & Jurídico</option>
                  <option value="Salud & Clínicas">Salud & Clínicas Médicas</option>
                  <option value="Inmobiliaria">Inmobiliaria & Real Estate</option>
                  <option value="Gastronomía & Bares">Gastronomía & Bares</option>
                  <option value="E-commerce & Retail">E-commerce & Retail</option>
                  <option value="Servicios B2B">Servicios B2B & Consultoría</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Modules Selection */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <h3 className="font-bold text-slate-900 text-sm">Paso 2: Canales y Módulos Necesarios</h3>
            <div className="space-y-2">
              {[
                { key: 'whatsapp', label: 'Suite WhatsApp Multiagente & Baileys QR', desc: 'Centraliza chats de la empresa con varios vendedores' },
                { key: 'afip', label: 'Facturación Electrónica AFIP CAE', desc: 'Facturas A, B, C automáticas con QR oficial' },
                { key: 'geminiBot', label: 'Bot WhatsApp IA 24/7 con Gemini 3.7', desc: 'Atención automática, FAQs y derivación de leads' },
                { key: 'inventory', label: 'Gestor de Stock & Inventario ERP', desc: 'Control de existencias y precios mayoristas' },
                { key: 'googleMaps', label: 'Prospección Masiva con Google Maps', desc: 'Búsqueda de comercios y prospectos en un clic' }
              ].map((m) => (
                <div
                  key={m.key}
                  onClick={() => handleToggleModule(m.key)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all shadow-xs ${
                    modules[m.key]
                      ? 'bg-blue-50/70 border-blue-300 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">{m.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{m.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center border text-xs font-bold transition-colors ${modules[m.key] ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                    {modules[m.key] && '✓'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Volume */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <h3 className="font-bold text-slate-900 text-sm">Paso 3: Volumen de Contactos y Facturación</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">
                  Contactos mensuales entrantes por WhatsApp: <span className="font-bold text-slate-900 text-sm">{monthlyContacts}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={monthlyContacts}
                  onChange={(e) => setMonthlyContacts(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">
                  Facturación mensual estimada de la empresa ($ ARS): <span className="font-bold text-slate-900 text-sm">$ {monthlyInvoicing.toLocaleString('es-AR')}</span>
                </label>
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="500000"
                  value={monthlyInvoicing}
                  onChange={(e) => setMonthlyInvoicing(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary & Real-time ROI */}
        {step === 4 && (
          <div className="space-y-4 py-2">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 border border-blue-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Plan Sugerido Estimado</span>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                    $ {totalMonthlyPlan.toLocaleString('es-AR')}{' '}
                    <span className="text-xs text-slate-500 font-normal">/ mes (+ IVA)</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                  Implementación &lt; 5 Días
                </span>
              </div>

              {/* ROI Metrics */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-500 block">Ahorro en Tareas Manuales</span>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">~{totalHoursSavedMonth} hs/mes</div>
                  <span className="text-[9px] text-[#64748b] dark:text-white dark:text-slate-400">en cargas, avisos y seguimiento</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-500 block">Aumento Estimado de Cierre</span>
                  <div className="text-lg font-black text-blue-600 mt-0.5">+{projectedSalesIncreasePercent}%</div>
                  <span className="text-[9px] text-[#64748b] dark:text-white dark:text-slate-400">por respuesta inmediata 24/7</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleShareQuoteWhatsApp}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <Share2 className="w-4 h-4" />
              <span>Pedir Demo con esta Cotización</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
