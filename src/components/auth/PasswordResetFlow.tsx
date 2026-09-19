import React, { useState } from 'react';
import {
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  sendFirebasePasswordReset,
  verifyResetToken,
  confirmPasswordResetWithToken,
} from '../../firebase';
import { useCRM } from '../../context/CRMContext';

interface PasswordResetFlowProps {
  initialEmail?: string;
  onBackToLogin: () => void;
  onSuccessLogin?: (email: string) => void;
  variant?: 'modal' | 'fullscreen';
}

export const PasswordResetFlow: React.FC<PasswordResetFlowProps> = ({
  initialEmail = '',
  onBackToLogin,
  onSuccessLogin,
  variant = 'fullscreen',
}) => {
  const { showToast, login } = useCRM();

  // Steps: 'request' -> 'verify' -> 'success'
  const [step, setStep] = useState<'request' | 'verify' | 'success'>('request');
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [tokenEmail, setTokenEmail] = useState('');
  const [demoToken, setDemoToken] = useState<string | null>(null);

  // Live password validation criteria
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial && passwordsMatch;

  // Step 1: Send password reset email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Por favor introduce tu correo electrónico.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendFirebasePasswordReset(email.trim());
      setIsLoading(false);

      if (result.success) {
        setDemoToken(result.demoToken || null);
        setStep('verify');
        showToast('Enlace y código de recuperación enviados a tu correo.', 'success');
      } else {
        showToast(result.error || 'Error al enviar el correo de recuperación.', 'error');
      }
    } catch (err: any) {
      setIsLoading(false);
      showToast('Ocurrió un error al contactar al servicio de autenticación.', 'error');
    }
  };

  // Step 2: Verify security token
  const handleVerifyToken = async () => {
    if (!token.trim()) {
      showToast('Ingresa el código o token de verificación.', 'error');
      return;
    }

    setIsVerifyingToken(true);
    try {
      const res = await verifyResetToken(token.trim());
      setIsVerifyingToken(false);

      if (res.success) {
        setTokenVerified(true);
        setTokenEmail(res.email || email);
        showToast('Código verificado con éxito. Procede a crear tu nueva contraseña.', 'success');
      } else {
        setTokenVerified(false);
        showToast(res.error || 'Código de seguridad inválido.', 'error');
      }
    } catch (err) {
      setIsVerifyingToken(false);
      showToast('Error al verificar el código.', 'error');
    }
  };

  // Step 3: Save new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenVerified) {
      showToast('Primero debes verificar el código de seguridad.', 'error');
      return;
    }

    if (!isPasswordValid) {
      showToast('La nueva contraseña no cumple con los requisitos de seguridad.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await confirmPasswordResetWithToken(token.trim(), newPassword);
      setIsLoading(false);

      if (res.success) {
        setStep('success');
        showToast('¡Contraseña restablecida exitosamente!', 'success');
      } else {
        showToast(res.error || 'No se pudo restablecer la contraseña.', 'error');
      }
    } catch (err) {
      setIsLoading(false);
      showToast('Error al actualizar la contraseña.', 'error');
    }
  };

  const handleAutoLogin = () => {
    const targetEmail = tokenEmail || email || 'alex.morgan@clientum.dev';
    login(targetEmail, newPassword);
    if (onSuccessLogin) {
      onSuccessLogin(targetEmail);
    }
    showToast('Sesión iniciada con tu nueva clave de acceso.', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Progress Indicators */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${ step === 'request' ? 'bg-blue-600 text-white' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' }`}
          >
            1
          </span>
          <span className="text-[11px] font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300">Solicitud</span>
        </div>
        <div className="flex-1 h-0.5 mx-2 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#212839]" />
        <div className="flex items-center gap-1.5">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${ step === 'verify' ? 'bg-blue-600 text-white' : step === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#151926] text-[var(--text-muted)] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d]' }`}
          >
            2
          </span>
          <span className="text-[11px] font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300">Verificación</span>
        </div>
        <div className="flex-1 h-0.5 mx-2 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#212839]" />
        <div className="flex items-center gap-1.5">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${ step === 'success' ? 'bg-emerald-600 text-white' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#151926] text-[var(--text-muted)] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d]' }`}
          >
            3
          </span>
          <span className="text-[11px] font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300">Listo</span>
        </div>
      </div>

      {/* Step 1: Request Email */}
      {step === 'request' && (
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div className="text-left">
            <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white tracking-tight">Recuperación de Contraseña</h3>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
              Ingresa el correo electrónico asociado a tu cuenta de ClientumCRM para recibir un enlace seguro y un código de verificación.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">
              Correo Electrónico Corporativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@clientum.dev"
                className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080a0f] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212839] rounded-xl px-3.5 py-2.5 pl-10 text-xs text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Enviando enlace...' : 'Enviar Correo de Recuperación'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('verify');
                setToken('CLM-DEMO99');
              }}
              className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-blue-400 transition-colors py-1 flex items-center justify-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>¿Ya tienes un código o token de seguridad? Ingresar directamente</span>
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Verify Token & New Password */}
      {step === 'verify' && (
        <form onSubmit={handleResetPassword} className="space-y-4 text-left">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white tracking-tight">Verificar Código y Crear Contraseña</h3>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
              Ingresa el código que te enviamos a <strong className="text-[var(--text-primary,#0f172a)] dark:text-slate-200">{email || 'tu email'}</strong> y define tu nueva contraseña segura.
            </p>
          </div>

          {demoToken && (
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs text-blue-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Código de demostración generado:</span>
                <code className="font-mono font-bold text-white bg-blue-600/30 px-1.5 py-0.5 rounded">
                  {demoToken}
                </code>
              </div>
              <button
                type="button"
                onClick={() => setToken(demoToken)}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-200 underline cursor-pointer"
              >
                Autocompletar
              </button>
            </div>
          )}

          {/* Token Input with Verify button */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">
              Código de Seguridad o Token de Recuperación
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <KeyRound className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                    setTokenVerified(false);
                  }}
                  placeholder="Ej: CLM-A89F2"
                  className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080a0f] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212839] rounded-xl px-3.5 py-2.5 pl-10 text-xs font-mono text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all uppercase"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyToken}
                disabled={isVerifyingToken || !token.trim()}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${ tokenVerified ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#1a2133] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#232c44] text-[var(--text-primary,#0f172a)] dark:text-white border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354f]' }`}
              >
                {isVerifyingToken ? (
                  'Verificando...'
                ) : tokenVerified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Válido</span>
                  </>
                ) : (
                  <span>Validar</span>
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa al menos 8 caracteres"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080a0f] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212839] rounded-xl px-3.5 py-2.5 pl-10 text-xs text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Password Security Rules Checklist */}
          <div className="p-3 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080b12] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b2234] space-y-1.5 text-[11px]">
            <span className="font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Criterios de seguridad requeridos:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Mínimo 8 caracteres</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Una mayúscula</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Una minúscula</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Al menos un número</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Un carácter especial</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Contraseñas coinciden</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isLoading || !tokenVerified || !isPasswordValid}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Guardando nueva contraseña...' : 'Actualizar y Restablecer Contraseña'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full py-2 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Solicitar un nuevo código</span>
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 'success' && (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white tracking-tight">¡Contraseña Actualizada!</h3>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 leading-relaxed max-w-sm mx-auto">
              Tu clave de acceso ha sido actualizada de forma segura en Firebase Authentication. Ya puedes ingresar con tu nueva contraseña.
            </p>
          </div>

          <div className="pt-2 space-y-2 max-w-xs mx-auto">
            <button
              type="button"
              onClick={handleAutoLogin}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Entrar Directamente al CRM</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full py-2 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              Volver a la pantalla de inicio de sesión
            </button>
          </div>
        </div>
      )}

      {/* Back button link when not success */}
      {step !== 'success' && (
        <div className="pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b2230] text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Iniciar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};
