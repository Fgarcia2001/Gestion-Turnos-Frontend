import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "../CustomHooks/TraslateHook";
import ThemeToggle from "../src/Components/Shared/ThemeToggle";
import LanguageToggle from "../src/Components/Shared/LanguageToggle";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);
const IconLoader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ── Styles (mismos tokens que LoginForm) ───────────────────────────────────────
const inputCls = "flex h-12 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-faint)] px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none focus:border-[var(--brand)] focus:bg-[var(--surface)] transition-all duration-200";
const inputWithIconCls = inputCls + " pl-10";
const inputErrorCls = " border-red-400 focus:border-red-500";

const InputIcon = ({ icon: Icon, children }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
      <Icon />
    </div>
    {children}
  </div>
);

const FieldError = ({ msg }) =>
  msg ? <p className="text-xs text-red-500 mt-1 pl-1">{msg}</p> : null;

// Mismo formato de error que usa LoginForm: { status, title, detail } o
// ValidationProblemDetails con { errors: { Campo: ["mensaje"] } }.
const extractApiError = (err, fallback) => {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err.errors && typeof err.errors === "object") {
    const first = Object.values(err.errors).flat().find(Boolean);
    if (first) return first;
  }
  return err.detail || err.title || err.message || fallback;
};

const BASE_URL = `${import.meta.env.VITE_API_ORIGIN || "https://api.turnify.lat"}/api/Auth`;

const resetPassword = async (newPassword, token, t) => {
  const res = await fetch(`${BASE_URL}/resetPassword?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPassword),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(extractApiError(err, t("resetPasswordFailed")));
  }
};

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    setServerError("");
  };

  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = {};
    if (!password) validationErrors.password = t("passwordRequired");
    else if (password.length < 6) validationErrors.password = t("passwordMinLength");
    if (!confirmPassword) validationErrors.confirmPassword = t("confirmPasswordRequired") ?? "Please confirm your password.";
    else if (password !== confirmPassword) validationErrors.confirmPassword = t("passwordMismatch") ?? "Passwords don't match.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      await resetPassword(password, token, t);
      setSuccess(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-[var(--page-bg)] relative items-center justify-center p-8">
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md bg-[var(--surface)] p-10 rounded-2xl shadow-sm border border-[var(--border-faint)]">
        {!token ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {t("invalidResetLink") ?? "Invalid or missing reset link."}
            </h2>
            <Link to="/login" className="inline-block text-sm font-semibold text-[var(--brand)] hover:underline underline-offset-4">
              {t("goToLogin") ?? "Go to login"}
            </Link>
          </div>
        ) : success ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {t("resetPasswordSuccess") ?? "Your password has been reset. You can now sign in."}
            </h2>
            <Link to="/login" className="inline-block text-sm font-semibold text-[var(--brand)] hover:underline underline-offset-4">
              {t("goToLogin") ?? "Go to login"}
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                {t("resetPasswordTitle") ?? "Set a new password"}
              </h2>
              <p className="text-[var(--text-muted)] mt-2">
                {t("resetPasswordSubtitle") ?? "Enter your new password below."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {serverError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {serverError}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  {t("newPasswordLabel") ?? "New password"}
                </label>
                <InputIcon icon={IconLock}>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={handlePasswordChange}
                    className={inputWithIconCls + " pr-11" + (errors.password ? inputErrorCls : "")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </InputIcon>
                <FieldError msg={errors.password} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  {t("confirmPasswordLabel") ?? "Confirm password"}
                </label>
                <InputIcon icon={IconLock}>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={confirmPassword}
                    onChange={handleConfirmChange}
                    className={inputWithIconCls + (errors.confirmPassword ? inputErrorCls : "")}
                  />
                </InputIcon>
                <FieldError msg={errors.confirmPassword} />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[var(--brand)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--brand-hover)] flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 mt-2"
                disabled={isLoading}
              >
                {isLoading
                  ? <><IconLoader />{t("loading")}</>
                  : (t("resetPasswordButton") ?? "Reset password")}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
};

export default ResetPassword;
