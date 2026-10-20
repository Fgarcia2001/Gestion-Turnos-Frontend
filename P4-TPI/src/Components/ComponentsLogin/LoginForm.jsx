import { useEffect, useState } from "react";
import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { useAuth, decodeJwt } from "../../../CustomHooks/AuthContext";
import { dataLogin, DataLogup } from "./Datalogin/Login";
import { useNavigate } from "react-router-dom";
import { fetchBusinessTypes } from "../../services/businessService";
import PhoneField from "../Shared/PhoneField";
import { isValidPhone } from "../Shared/phoneValidation";
import AddressAutocomplete from "../Shared/AddressAutocomplete";
import CityAutocomplete from "../Shared/CityAutocomplete";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
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
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
  </svg>
);
const IconBriefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconCity = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M9 21V7l6-4v18M9 11H3v10" />
  </svg>
);
const IconLoader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ── Reusable input with icon ───────────────────────────────────────────────────
const inputCls = "flex h-12 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-faint)] px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none focus:border-[var(--brand)] focus:bg-[var(--surface)] transition-all duration-200";
const inputWithIconCls = inputCls + " pl-10";
const inputErrorCls = " border-red-400 focus:border-red-500";

const InputIcon = ({ icon: Icon, children, className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
      <Icon />
    </div>
    {children}
  </div>
);


const FieldError = ({ msg }) =>
  msg ? <p className="text-xs text-red-500 mt-1 pl-1">{msg}</p> : null;

// ── Divider ───────────────────────────────────────────────────────────────────
const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">{label}</span>
    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
  </div>
);

// ── Validation helpers ────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLogin = (fields, t) => {
  const errors = {};
  if (!fields.email.trim())               errors.email    = t("emailRequired");
  else if (!EMAIL_RE.test(fields.email))  errors.email    = t("emailInvalid");
  if (!fields.password)                   errors.password = t("passwordRequired");
  else if (fields.password.length < 6)    errors.password = t("passwordMinLength");
  return errors;
};

const validateSignup = (fields, t) => {
  const errors = validateLogin(fields, t);
  if (!fields.name.trim())                                        errors.name             = t("nameRequired");
  if (!fields.adminPhone)                                         errors.adminPhone       = t("phoneRequired");
  else if (!isValidPhone(fields.adminPhone))                      errors.adminPhone       = t("phoneInvalidFormat");
  if (!fields.businessCategory.trim())                            errors.businessCategory = t("categoryRequired");
  if (!fields.city.trim())                                        errors.city             = t("cityRequired");
  if (!fields.address.trim())                                     errors.address          = t("addressRequired");
  if (!fields.branchPhone)                                        errors.branchPhone      = t("branchPhoneRequired");
  else if (!isValidPhone(fields.branchPhone))                     errors.branchPhone      = t("phoneInvalidFormat");
  return errors;
};

// Los endpoints devuelven problemas con { status, title, detail } y también
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

// ── API calls ─────────────────────────────────────────────────────────────────
const BASE_URL = `${import.meta.env.VITE_API_ORIGIN || "https://api.turnify.lat"}/api/Auth`;
const token = import.meta.env.VITE_JWT_TOKEN;

const signIn = async (credentials, t) => {
  const res = await fetch(`${BASE_URL}/SignIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
     },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(extractApiError(err, t("invalidCredentials")));
  }
  return res.json();
};

const signUp = async (payload, t) => {
  const res = await fetch(`${BASE_URL}/SignUp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(extractApiError(err, t("registrationFailed")));
  }
  return res.json();
};

// ── Main component ────────────────────────────────────────────────────────────
const LoginForm = ({ handleRegister, isForgotPassword, setIsForgotPassword, isRegister }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  const navigate = useNavigate();
  const [loginFields, setLoginFields]   = useState({ ...dataLogin });
  const [signupFields, setSignupFields] = useState({ ...DataLogup });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [businessTypes, setBusinessTypes] = useState([]);

  useEffect(() => {
    fetchBusinessTypes().then(setBusinessTypes);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  // Al elegir una sugerencia de Nominatim se completan direccion y ciudad
  // juntas (la ciudad se puede seguir editando a mano si hace falta).
  const handleAddressSelect = ({ address, city }) => {
    setSignupFields((prev) => ({
      ...prev,
      address: address || prev.address,
      city: city || prev.city,
    }));
    setErrors((prev) => ({ ...prev, address: undefined, city: undefined }));
    setServerError("");
  };

  const handleCitySelect = (city) => {
    setSignupFields((prev) => ({ ...prev, city }));
    setErrors((prev) => ({ ...prev, city: undefined }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = isRegister
      ? validateSignup({ ...signupFields, ...loginFields }, t)
      : validateLogin(loginFields, t);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      if (isRegister) {
        const payload = {
          ...signupFields,
          email: loginFields.email,
          password: loginFields.password,
        };
        const data = await signUp(payload, t);
        login(data.token);
        navigate(decodeJwt(data.token)?.role === "SysAdmin" ? "/sysadmin" : "/admin");
      } else {
        const data = await signIn({
          email: loginFields.email,
          password: loginFields.password,
        }, t);
        login(data.token);
        navigate(decodeJwt(data.token)?.role === "SysAdmin" ? "/sysadmin" : "/admin");
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setErrors({});
    setServerError("");
    handleRegister();
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* ── Server error banner ── */}
        {serverError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        {/* ── Email ── */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
            {t("emailLabel")}
          </label>
          <InputIcon icon={IconMail}>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={loginFields.email}
              onChange={handleLoginChange}
              className={inputWithIconCls + (errors.email ? inputErrorCls : "")}
            />
          </InputIcon>
          <FieldError msg={errors.email} />
        </div>

        {/* ── Password (hidden in forgot-password mode) ── */}
        {!isForgotPassword && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                {t("passwordLabel")}
              </label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {t("forgotPass")}
                </button>
              )}
            </div>
            <InputIcon icon={IconLock}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                value={loginFields.password}
                onChange={handleLoginChange}
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
        )}

        {/* ── Register extra fields (hidden in forgot-password mode) ── */}
        {!isForgotPassword && isRegister && (
          <>
            <Divider label={t("businessInfo")} />

            <div className="grid grid-cols-2 gap-3">

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{t("fullName")}</label>
                <InputIcon icon={IconUser}>
                  <input
                    type="text"
                    name="name"
                    placeholder={t("fullNamePlaceholder")}
                    value={signupFields.name}
                    onChange={handleSignupChange}
                    className={inputWithIconCls + (errors.name ? inputErrorCls : "")}
                  />
                </InputIcon>
                <FieldError msg={errors.name} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{t("adminPhone")}</label>
                <PhoneField
                  name="adminPhone"
                  value={signupFields.adminPhone}
                  onChange={handleSignupChange}
                  hasError={!!errors.adminPhone}
                />
                <FieldError msg={errors.adminPhone} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{t("businessCategory")}</label>
                <InputIcon icon={IconBriefcase}>
                  <select
                    name="businessCategory"
                    value={signupFields.businessCategory}
                    onChange={handleSignupChange}
                    className={inputWithIconCls + " appearance-none cursor-pointer" + (errors.businessCategory ? inputErrorCls : "")}
                  >
                    <option value="">{t("businessCategoryPlaceholder")}</option>
                    {businessTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </InputIcon>
                <FieldError msg={errors.businessCategory} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{t("city")}</label>
                <InputIcon icon={IconCity}>
                  <CityAutocomplete
                    name="city"
                    value={signupFields.city}
                    onChange={handleSignupChange}
                    onSelect={handleCitySelect}
                    placeholder={t("cityPlaceholder")}
                    className={inputWithIconCls + (errors.city ? inputErrorCls : "")}
                  />
                </InputIcon>
                <FieldError msg={errors.city} />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{t("address")}</label>
                <InputIcon icon={IconMapPin}>
                  <AddressAutocomplete
                    name="address"
                    value={signupFields.address}
                    onChange={handleSignupChange}
                    onSelect={handleAddressSelect}
                    placeholder={t("addressPlaceholder")}
                    className={inputWithIconCls + (errors.address ? inputErrorCls : "")}
                  />
                </InputIcon>
                <FieldError msg={errors.address} />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{t("branchPhone")}</label>
                <PhoneField
                  name="branchPhone"
                  value={signupFields.branchPhone}
                  onChange={handleSignupChange}
                  hasError={!!errors.branchPhone}
                />
                <FieldError msg={errors.branchPhone} />
              </div>

            </div>
          </>
        )}

        {/* ── Submit ── */}
        <button
          type="submit"
          id="btn-submit-auth"
          className="w-full h-12 bg-[var(--brand)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--brand-hover)] flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 mt-2"
          disabled={isLoading}
        >
          {isLoading
            ? <><IconLoader />{t("loading")}</>
            : isForgotPassword
              ? (t("sendResetLink") ?? "Send reset link")
              : isRegister ? t("signUp") : t("signIn")}
        </button>

      </form>

      {isForgotPassword ? (
        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          <button
            onClick={() => setIsForgotPassword(false)}
            className="font-semibold text-[var(--text-primary)] hover:underline underline-offset-4 cursor-pointer transition-colors"
          >
            {t("backToLogin") ?? "← Back to login"}
          </button>
        </p>
      ) : (
        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          {isRegister ? t("haveAccount") : t("noAccount")}{" "}
          <button
            onClick={handleToggleMode}
            className="font-semibold text-[var(--text-primary)] hover:underline underline-offset-4 cursor-pointer transition-colors"
          >
            {isRegister ? t("signIn") : t("signUp")}
          </button>
        </p>
      )}
    </div>
  );
};

export default LoginForm;