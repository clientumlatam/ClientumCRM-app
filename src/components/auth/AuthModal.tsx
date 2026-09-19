import React, { useState } from "react";
import { X, Zap, Mail, Lock, User, Building, Eye, EyeOff, ArrowRight, Sparkles, Clock } from "lucide-react";
import { useCRM } from "../../context/CRMContext";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { signInWithEmail, registerWithEmail, sendFirebasePasswordReset } from "../../firebase";
import { bootstrapClientumAccount } from "../../lib/api";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, showToast, enterApp } = useCRM();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        if (!email.trim() || !password) {
          showToast("Por favor ingresa tu correo y contraseña", "error");
          setIsLoading(false);
          return;
        }

        const res = await signInWithEmail(email.trim(), password);
        setIsLoading(false);

        if (res.success) {
          await bootstrapClientumAccount({
            name: res.user?.displayName || email.trim().split("@")[0],
          });
          login(email.trim(), password);
          showToast("¡Bienvenido a ClientumCRM!", "success");
          handleClose();
          enterApp(true);
        } else {
          showToast(res.error || "Credenciales inválidas", "error");
        }
      } else if (mode === "register") {
        if (!name.trim() || !email.trim() || !password) {
          showToast("Por favor completa los campos requeridos", "error");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          showToast("La contraseña debe tener al menos 6 caracteres", "error");
          setIsLoading(false);
          return;
        }

        const res = await registerWithEmail(name.trim(), email.trim(), password, company.trim());
        setIsLoading(false);

        if (res.success) {
          await bootstrapClientumAccount({
            name: name.trim(),
            company: company.trim(),
          });
          register(name.trim(), email.trim(), password, company.trim());
          showToast("Cuenta de ClientumCRM creada y vinculada con éxito", "success");
          handleClose();
          enterApp(true);
        } else {
          showToast(res.error || "No se pudo crear la cuenta", "error");
        }
      } else if (mode === "forgot") {
        if (!email.trim()) {
          showToast("Por favor ingresa tu correo electrónico", "error");
          setIsLoading(false);
          return;
        }

        const res = await sendFirebasePasswordReset(email.trim());
        setIsLoading(false);

        if (res.success) {
          showToast("Instrucciones de recuperación enviadas a tu correo", "success");
          setMode("login");
        } else {
          showToast(res.error || "No se pudo enviar el correo de recuperación", "error");
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      showToast(err?.message || "Error al procesar la solicitud", "error");
    }
  };

  const handleDemoLogin = () => {
    login("alex.morgan@clientum.dev", "demo");
    showToast("Acceso demo concedido a ClientumCRM", "success");
    handleClose();
    enterApp(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
        <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[440px] overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
          aria-label="Cerrar autenticación"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 pt-7">
          <div className="text-center mb-5">
            <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
              {mode === "login" && "Iniciar sesión en ClientumCRM"}
              {mode === "register" && "Crear cuenta comercial"}
              {mode === "forgot" && "Recuperar contraseña"}
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {mode === "login" && "Ingresa con tus credenciales seguras"}
              {mode === "register" && "Comienza a gestionar tu pipeline comercial"}
              {mode === "forgot" && "Te enviaremos un enlace de restablecimiento seguro"}
            </p>
          </div>

          {/* Quick Demo button */}
          {mode === "login" && (
            <div className="mb-4 rounded-xl border border-[var(--color-primary-border)] bg-[var(--color-primary-light)] p-3">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
              >
                <Zap className="h-3.5 w-3.5 text-white" />
                Entrar con cuenta demo
              </button>
              <p className="mt-2 text-center text-[10px] text-[var(--text-muted)]">
                Explora ClientumCRM al instante sin registrarte.
              </p>
            </div>
          )}

          {/* Google SSO */}
          {mode !== "forgot" && (
            <div className="mb-4">
              <SocialAuthButtons
                layout="grid"
                onSuccess={() => {
                  handleClose();
                  enterApp(true);
                }}
              />
            </div>
          )}

          {mode === "register" && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-300">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span>Incluye 7 Días de Free Trial Completo</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-200/80 leading-relaxed">
                Accedé 1 semana completa con todas las funciones Pro sin tarjeta. Podés continuar o suscribirte con Mercado Pago en cualquier momento.
              </p>
            </div>
          )}

            <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Nombre completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-2.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Empresa / Negocio</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Mi Empresa S.A."
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-2.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Correo electrónico *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-2.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)]">Contraseña *</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[10px] text-[var(--color-primary)] hover:opacity-80"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-2.5 pl-9 pr-9 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-2.5 text-xs font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                "Procesando..."
              ) : mode === "login" ? (
                <>
                  Iniciar sesión
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              ) : mode === "register" ? (
                <>
                  Crear cuenta
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              ) : (
                "Enviar correo de recuperación"
              )}
            </button>
          </form>
        </div>

        <div className="border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#222a3d] px-6 py-4 text-center text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
          {mode === "login" ? (
            <>
              ¿Todavía no tienes una cuenta?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Crear cuenta
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes una cuenta?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
