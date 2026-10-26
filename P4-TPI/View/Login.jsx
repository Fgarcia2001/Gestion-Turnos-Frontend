import LoginForm from "../src/Components/ComponentsLogin/LoginForm";
import ThemeToggle from "../src/Components/Shared/ThemeToggle";
import LanguageToggle from "../src/Components/Shared/LanguageToggle";
import { useTranslation } from "../CustomHooks/TraslateHook";
import { useLandingContent } from "../CustomHooks/useLandingContent";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { t, language } = useTranslation();
  const content = useLandingContent();
  const brandName = content?.brandName || t("brandName");
  const heroTitle = (language === "en" ? content?.heroTitleEn : content?.heroTitleEs) || t("heroTitle");
  const heroDesc = (language === "en" ? content?.heroDescriptionEn : content?.heroDescriptionEs) || t("heroDesc");
  const location = useLocation();
  const navigate = useNavigate();
  // La ruta es la fuente de verdad: /register siempre arranca en modo
  // registro; location.state?.register queda como fallback para quien
  // todavia navegue a /login con ese state.
  const isRegister = location.pathname === "/register" || Boolean(location.state?.register);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const handleRegister = () => {
    navigate(isRegister ? "/login" : "/register");
    setIsForgotPassword(false);
  }
  return (
    <main className="flex min-h-screen w-full bg-[var(--page-bg)] relative">
      {/* Selector de Idioma y modo claro/oscuro, flotantes */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      {/* SECCIÓN IZQUIERDA: Hero / Info */}
      <section className="hidden lg:flex w-1/2 bg-[var(--brand)] text-white p-12 flex-col justify-center">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
          >
            <div className="brand-icon bg-[var(--surface)]/10 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <span className="text-2xl font-bold">{brandName}</span>
          </button>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            {heroTitle}
          </h1>

          <p className="text-[var(--text-muted)] text-lg mb-12">{heroDesc}</p>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold">10M+</div>
              <div className="text-sm text-[var(--text-muted)]">{t("activeUsers")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">50M+</div>
              <div className="text-sm text-[var(--text-muted)]">{t("meetings")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-[var(--text-muted)]">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DERECHA: Formulario */}
      <section className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <button
          onClick={() => navigate("/")}
          className="lg:hidden flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
        >
          <div className="brand-icon bg-[var(--brand)] p-2 rounded-lg text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">{brandName}</span>
        </button>

        <div className="w-full max-w-md bg-[var(--surface)] p-10 rounded-2xl shadow-sm border border-[var(--border-faint)]">
          <div className="text-center mb-8">
            {isForgotPassword ? (
              <>
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">{t("forgotTitle") ?? "Reset password"}</h2>
                <p className="text-[var(--text-muted)] mt-2">{t("forgotSubtitle") ?? "Enter your email and we\'ll send you a reset link."}</p>
              </>
            ) : isRegister ? (
              <>
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">{t("registerTitle")}</h2>
                <p className="text-[var(--text-muted)] mt-2">{t("registerSubtitle")}</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">{t("welcome")}</h2>
                <p className="text-[var(--text-muted)] mt-2">{t("subtitle")}</p>
              </>
            )}
          </div>

          <LoginForm
            handleRegister={handleRegister}
            isForgotPassword={isForgotPassword}
            setIsForgotPassword={setIsForgotPassword}
            isRegister={isRegister}
          />
        </div>
      </section>
    </main>
  );
};

export default Login;
