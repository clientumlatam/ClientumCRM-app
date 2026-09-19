import { ClientumLogo } from "../common/ClientumLogo";
import React, { useState } from 'react';
import { z } from 'zod';
import {
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Globe,
  Zap,
  Kanban,
  CreditCard,
  MessageSquare,
  Compass,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Language } from '../../types';
import { SocialAuthButtons } from './SocialAuthButtons';
import { PasswordResetFlow } from './PasswordResetFlow';
import { signInWithEmail, registerWithEmail } from '../../firebase';
import { bootstrapClientumAccount } from '../../lib/api';

// Zod schema for password validation
const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial (!@#$%)');

export const AuthScreen: React.FC = () => {
  const { login, register, showToast, language, setLanguage } = useCRM();

  // Mode: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        if (!email.trim()) {
          showToast('Por favor ingresa tu correo electrónico', 'error');
          setIsLoading(false);
          return;
        }
        if (!password) {
          showToast('Por favor ingresa tu contraseña', 'error');
          setIsLoading(false);
          return;
        }

        const authRes = await signInWithEmail(email.trim(), password);
        setIsLoading(false);

        if (authRes.success) {
          await bootstrapClientumAccount({
            name: authRes.user?.displayName || email.trim().split('@')[0],
          });
          login(email.trim(), password);
          showToast('¡Bienvenido a ClientumCRM!', 'success');
        } else {
          showToast(authRes.error || 'Credenciales inválidas', 'error');
        }
      } else if (authMode === 'register') {
        if (!name.trim() || !email.trim() || !password) {
          showToast('Por favor completa todos los campos requeridos', 'error');
          setIsLoading(false);
          return;
        }

        // Zod Password Validation
        passwordSchema.parse(password);

        const regRes = await registerWithEmail(name.trim(), email.trim(), password, company.trim());
        setIsLoading(false);

        if (regRes.success) {
          await bootstrapClientumAccount({
            name: name.trim(),
            company: company.trim(),
          });
          register(name.trim(), email.trim(), password, company.trim());
          showToast('Cuenta de ClientumCRM creada y vinculada con éxito', 'success');
        } else {
          showToast(regRes.error || 'No se pudo crear la cuenta', 'error');
        }
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof z.ZodError) {
        showToast(error.issues[0]?.message || 'Formato de datos inválido', 'error');
      } else {
        showToast('Ha ocurrido un error inesperado al autenticar', 'error');
      }
    }
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('alex.morgan@clientum.dev', 'secret');
      showToast('Acceso rápido a ClientumCRM concedido', 'success');
    }, 300);
  };

  return (
    <div className="min-h-screen w-screen bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#07090e] text-[var(--text-primary,#0f172a)] dark:text-slate-200 flex flex-col justify-between overflow-x-hidden selection:bg-blue-600 selection:text-white font-['Inter',sans-serif] relative">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1017] rounded-[11px] flex items-center justify-center">
              <ClientumLogo className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-1.5">
              ClientumCRM
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </span>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202738] rounded-xl p-1 text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 ml-1.5" />
            {(['es', 'pt', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${ language === lang ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Value Proposition & Highlights */}
          <div className="lg:col-span-6 space-y-6 text-left hidden lg:block pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Plataforma Todo-en-Uno ClientumCRM</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold text-[var(--text-primary,#0f172a)] dark:text-white tracking-tight leading-tight">
              Potencia tu ciclo comercial con <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">ClientumCRM</span>
            </h1>

            <p className="text-sm text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed">
              Gestión inteligente de embudos de ventas, prospección de clientes con Google Maps, bots conversacionales de WhatsApp 24/7, scoring MEDDIC y facturación electrónica en un único ecosistema.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10141f]/80 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d2436] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <Kanban className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Pipeline Kanban</h4>
                  <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Control visual y pronóstico con MEDDIC</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10141f]/80 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d2436] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">WhatsApp 24/7</h4>
                  <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Respuestas y cierre con agentes de IA</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10141f]/80 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d2436] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Maps Prospector</h4>
                  <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Extracción y contacto de negocios locales</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10141f]/80 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d2436] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">AFIP & Mercado Pago</h4>
                  <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Facturación y cobros automáticos</p>
                </div>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Autenticación cifrada, sesiones protegidas y respaldo en la nube.</span>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0f131d]/90 backdrop-blur-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21293c] rounded-2xl shadow-2xl p-6 sm:p-7 relative overflow-hidden">
              {/* Header Title inside card */}
              <div className="text-center mb-5">
                <h2 className="text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white tracking-tight flex items-center justify-center gap-2">
                  <ClientumLogo className="w-5 h-5" />
                  ClientumCRM
                </h2>
                <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
                  {authMode === 'login' && 'Ingresa a tu espacio de trabajo comercial'}
                  {authMode === 'register' && 'Crea tu cuenta empresarial en segundos'}
                  {authMode === 'forgot' && 'Recupera el acceso seguro a tu cuenta'}
                </p>
              </div>

              {/* Segmented Mode Switcher */}
              <div className="flex rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080a0f] p-1 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b212f] mb-5">
                <button
                  id="auth-tab-login-btn"
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${ authMode === 'login' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm font-semibold' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  id="auth-tab-register-btn"
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${ authMode === 'register' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm font-semibold' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                >
                  Registrarse
                </button>
                <button
                  id="auth-tab-forgot-btn"
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${ authMode === 'forgot' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm font-semibold' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                >
                  Recuperar
                </button>
              </div>

              {/* Form Views */}
              {authMode === 'forgot' ? (
                <PasswordResetFlow
                  initialEmail={email}
                  onBackToLogin={() => setAuthMode('login')}
                  variant="fullscreen"
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name field for Register */}
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">
                        Nombre Completo
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="auth-screen-name-input"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080a0f] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212839] rounded-xl px-3.5 py-2.5 pl-10 text-xs text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Company field for Register */}
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">
                        Nombre de la Empresa u Organización
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="auth-screen-company-input"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Clientum Tech Latam"
                          className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080a0f] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212839] rounded-xl px-3.5 py-2.5 pl-10 text-xs text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field (All modes) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="auth-screen-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex.morgan@clientum.dev"
                        className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080a0f] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212839] rounded-xl px-3.5 py-2.5 pl-10 text-xs text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field (Login & Register) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">
                        Contraseña
                      </label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setAuthMode('forgot')}
                          className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="auth-screen-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080a0f] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212839] rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary,#475569)] dark:hover:text-slate-300 p-0.5 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Main Action Submit Button */}
                  <button
                    id="auth-screen-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    <span>
                      {isLoading
                        ? 'Procesando en ClientumCRM...'
                        : authMode === 'login'
                        ? 'Iniciar Sesión en ClientumCRM'
                        : 'Crear Cuenta en ClientumCRM'}
                    </span>
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>

                  {/* Social SSO Auth Buttons (Google, Meta/Facebook, LinkedIn) */}
                  <SocialAuthButtons />

                  {/* Quick 1-Click Demo Button for instant testing */}
                  {authMode === 'login' && Boolean((import.meta as any).env?.DEV) && (
                    <div className="pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a202d] space-y-2">
                      <button
                        id="auth-screen-demo-btn"
                        type="button"
                        onClick={handleQuickDemo}
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-[var(--bg-card,#ffffff)] dark:bg-[#141926] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a2234] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#263148] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer group"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>🚀 Acceso Inmediato Demo (Alex Morgan)</span>
                      </button>
                      <p className="text-[10px] text-center text-[var(--text-muted)]">
                        Accede al instante para evaluar todas las funciones de ClientumCRM sin registro previo.
                      </p>
                    </div>
                  )}
                </form>
              )}

              {/* Mode Switcher Footer Links */}
              {authMode !== 'forgot' && (
                <div className="mt-5 pt-4 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b2230] text-center text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  {authMode === 'login' && (
                    <p>
                      ¿Aún no tienes cuenta?{' '}
                      <button
                        id="auth-switch-to-register-btn"
                        type="button"
                        onClick={() => setAuthMode('register')}
                        className="text-blue-400 font-semibold hover:underline cursor-pointer ml-1"
                      >
                        Regístrate gratis
                      </button>
                    </p>
                  )}
                  {authMode === 'register' && (
                    <p>
                      ¿Ya tienes una cuenta?{' '}
                      <button
                        id="auth-switch-to-login-btn"
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-blue-400 font-semibold hover:underline cursor-pointer ml-1"
                      >
                        Inicia sesión
                      </button>
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 px-6 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#141824] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#07090e]/80 text-center text-[11px] text-[var(--text-muted)]">
        <p>
          © 2026 <strong className="text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium">ClientumCRM</strong>. Todos los derechos reservados. Plataforma segura de gestión comercial y ERP.
        </p>
      </footer>
    </div>
  );
};
