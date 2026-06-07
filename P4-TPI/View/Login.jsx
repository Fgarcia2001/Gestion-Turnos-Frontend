import LoginForm from "../src/Components/ComponentsLogin/LoginForm";
import { useTranslation } from "../CustomHooks/TraslateHook";
import { useState } from "react";

const Login = () => {
  const { t, toggleLanguage, language } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const handleRegister = () => {
    setIsRegister(!isRegister);
    setIsForgotPassword(false);
  }
  return (
    <main className="flex min-h-screen w-full bg-[#F8F5F0] relative">
      {/* Selector de Idioma Flotante */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 z-10 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-all font-medium text-sm flex items-center gap-2"
      >
        <span
          className={
            language === "es" ? "font-bold text-black" : "text-gray-400"
          }
        >
          ES
        </span>
        <span className="text-gray-300">|</span>
        <span
          className={
            language === "en" ? "font-bold text-black" : "text-gray-400"
          }
        >
          EN
        </span>
      </button>

      {/* SECCIÓN IZQUIERDA: Hero / Info */}
      <section className="hidden lg:flex w-1/2 bg-[#1A1A1A] text-white p-12 flex-col justify-center">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-white/10 p-2 rounded-lg">
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
            <span className="text-2xl font-bold">FGSTurniFy</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            {t("heroTitle")}
          </h1>

          <p className="text-gray-400 text-lg mb-12">{t("heroDesc")}</p>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold">10M+</div>
              <div className="text-sm text-gray-500">{t("activeUsers")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">50M+</div>
              <div className="text-sm text-gray-500">{t("meetings")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DERECHA: Formulario */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            {isForgotPassword ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900">{t("forgotTitle") ?? "Reset password"}</h2>
                <p className="text-gray-500 mt-2">{t("forgotSubtitle") ?? "Enter your email and we\'ll send you a reset link."}</p>
              </>
            ) : isRegister ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900">{t("registerTitle")}</h2>
                <p className="text-gray-500 mt-2">{t("registerSubtitle")}</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900">{t("welcome")}</h2>
                <p className="text-gray-500 mt-2">{t("subtitle")}</p>
              </>
            )}
          </div>

          <LoginForm
            handleRegister={handleRegister}
            isForgotPassword={isForgotPassword}
            setIsForgotPassword={setIsForgotPassword}
          />
        </div>
      </section>
    </main>
  );
};

export default Login;
