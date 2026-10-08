import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchPlans,
  fetchMySubscription,
  changePlanCheckout,
  renewCheckout,
  fetchPaymentStatus,
} from "../../../../services/api";
import { useAuth } from "../../../../../CustomHooks/AuthContext";
import { IconSparkles } from './SettingsIcons';
import PlanDetailsModal from './PlanDetailsModal';
import ChangePlanConfirmModal from './ChangePlanConfirmModal';

const MP_ORDER_STORAGE_KEY = "mp_checkout";
const POLL_INTERVAL_MS = 2500;
const POLL_MAX_ATTEMPTS = 24; // ~60 s

const readMpReturn = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    orderId: params.get("external_reference"),
    paymentId: params.get("payment_id") || params.get("collection_id"),
    // Retorno fresco de MercadoPago: hay parámetros de pago en la URL.
    isMpReturn: params.has("external_reference") || params.has("payment_id") || params.has("collection_id"),
  };
};

const SubscriptionTab = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsPlan, setDetailsPlan] = useState(null);
  const [changePlanTarget, setChangePlanTarget] = useState(null);
  const [renewing, setRenewing] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const isAdmin = user?.role === "Admin";

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  }, []);

  const loadSubscription = useCallback(async () => {
    try {
      const data = await fetchMySubscription();
      setPlan(data);
    } catch {
      // sin suscripción vigente o error de red: se muestra vacío
    }
  }, []);

  useEffect(() => {
    let alive = true;
    async function init() {
      await loadSubscription();
      if (alive) setLoading(false);
    }
    init();
    fetchPlans().then((data) => {
      if (alive) setPlans(Array.isArray(data) ? data : []);
    });
    return () => {
      alive = false;
    };
  }, [loadSubscription]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  // ── Retorno desde MercadoPago: polling del estado de la orden ────────────────
  useEffect(() => {
    const { orderId: urlOrderId, paymentId, isMpReturn } = readMpReturn();
    const storedOrderId = sessionStorage.getItem(MP_ORDER_STORAGE_KEY);
    const orderId = urlOrderId || storedOrderId;

    const clearPaymentState = () => {
      sessionStorage.removeItem(MP_ORDER_STORAGE_KEY);
      const url = new URL(window.location.href);
      if (url.search) {
        url.search = "";
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      }
    };

    if (!orderId) {
      if (storedOrderId) clearPaymentState();
      return undefined;
    }

    let cancelled = false;
    let timer = null;
    let attempts = 0;

    const finish = (message, type, refresh) => {
      if (cancelled) return;
      cancelled = true;
      if (timer) clearTimeout(timer);
      clearPaymentState();
      if (refresh) loadSubscription();
      if (message) showToast(message, type);
    };

    // paymentId puede faltar (MercadoPago a veces no lo agrega en la back_url);
    // en ese caso el backend resuelve el pago por external_reference.
    const poll = async () => {
      if (cancelled) return;
      attempts += 1;
      try {
        const data = await fetchPaymentStatus(orderId, paymentId);
        const status = data?.status;
        if (status === "approved") {
          // Solo avisa en un retorno fresco de MercadoPago; en un refresh simple
          // (orden ya aprobada) solo refresca sin molestar.
          finish(isMpReturn ? "Pago aprobado. Suscripción actualizada." : null, "success", true);
          return;
        }
        if (status === "rejected" || status === "cancelled" || status === "expired") {
          finish("El pago no se completó", "error", false);
          return;
        }
      } catch (err) {
        if (err?.status === 401) {
          finish("Sesión expirada, volvé a iniciar sesión", "error", false);
          return;
        }
        if (err?.status && err.status < 500 && err.status !== 404) {
          finish("No se pudo consultar el pago", "error", false);
          return;
        }
      }
      if (attempts >= POLL_MAX_ATTEMPTS) {
        finish("Pago pendiente de confirmación", "success", false);
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [loadSubscription, showToast]);

  // ── Checkout ─────────────────────────────────────────────────────────────────
  const startPayment = (result) => {
    if (result?.status === "pending" && result?.initPoint) {
      if (result.orderId) sessionStorage.setItem(MP_ORDER_STORAGE_KEY, result.orderId);
      window.location.href = result.initPoint;
      return true; // el botón queda en spinner hasta salir de la página
    }
    return false;
  };

  const handleConfirmChangePlan = async (selectedPlan) => {
    const planId = selectedPlan?.id ?? selectedPlan?.Id;
    try {
      const result = await changePlanCheckout(planId);
      if (startPayment(result)) return;
      if (result?.status === "noPaymentRequired") {
        await loadSubscription();
        setChangePlanTarget(null);
        showToast("Plan actualizado");
        return;
      }
      setChangePlanTarget(null);
      showToast(result?.status || "No se pudo iniciar el pago", "error");
    } catch (err) {
      setChangePlanTarget(null);
      showToast(err?.message || "No se pudo solicitar el cambio de plan", "error");
    }
  };

  const handleRenew = async () => {
    setRenewing(true);
    try {
      const result = await renewCheckout();
      if (startPayment(result)) return;
      if (result?.status === "noPaymentRequired") {
        await loadSubscription();
        showToast("Subscription renewed");
        return;
      }
      showToast(result?.status || "No se pudo renovar la suscripción", "error");
    } catch (err) {
      showToast(err?.message || "No se pudo renovar la suscripción", "error");
    } finally {
      setRenewing(false);
    }
  };

  const planName = plan?.planName || null;

  const toastEl = toast ? (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-2 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out] ${toast.type === "error" ? "bg-[#b91c1c]" : "bg-[#1a1a2e]"}`}
    >
      {toast.type === "error" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
      {toast.message}
    </div>
  ) : null;

  if (loading) {
    return (
      <div className="flex flex-col w-full max-w-5xl mx-auto">
        <div className="flex justify-center py-12">
          <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
        </div>
        {toastEl}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 mb-8 w-full">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">Current Plan</h2>
        <p className="text-sm text-[#9a9a9a] mb-6 mt-1">{plan?.businessName ? plan.businessName : "Your subscription plan details."}</p>

        <div className="bg-[#fcfbf9] border border-[#e2ddd8] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#f0ede8] rounded-xl flex items-center justify-center text-[#1a1a2e]">
              <IconSparkles />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#1a1a2e]">{plan?.planName || "---"}</span>
                {plan?.status && (
                  <span className="text-[10px] font-bold bg-[#1a1a2e] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">{plan.status}</span>
                )}
              </div>
              <p className="text-xs text-[#9a9a9a]">{plan?.businessName || "---"}</p>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <div className="text-left sm:text-right text-xs text-[#9a9a9a]">
              {plan?.startDate ? (
                <>
                  <span className="block font-medium text-[#1a1a2e]">{new Date(plan.startDate).toLocaleDateString()}</span>
                  <span className="block text-[10px]">to</span>
                  <span className="block font-medium text-[#1a1a2e]">{new Date(plan.endDate).toLocaleDateString()}</span>
                </>
              ) : (
                <span className="text-xl font-bold text-[#1a1a2e]">--</span>
              )}
            </div>

            {isAdmin && plan && (
              <button
                type="button"
                onClick={handleRenew}
                disabled={renewing}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1a1a2e] text-white text-xs font-semibold hover:bg-[#2d2d44] transition-colors disabled:opacity-60 disabled:cursor-not-allowed sm:ml-auto"
              >
                {renewing && (
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {renewing ? "Redirecting…" : "Renew subscription"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Upgrade your plan</h3>
        {plans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e2ddd8] py-12 text-center text-sm text-[#9a9a9a]">
            No plans available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...plans]
              .sort((a, b) => (a.price ?? a.Price ?? 0) - (b.price ?? b.Price ?? 0))
              .map((tier) => {
                const id = tier.id ?? tier.Id;
                const name = tier.name ?? tier.Name;
                const description = tier.description ?? tier.Description;
                const price = tier.price ?? tier.Price;
                const durationDays = tier.durationDays ?? tier.DurationDays;
                const isCurrent = planName && name && planName.toLowerCase() === name.toLowerCase();
                return (
                  <div key={id ?? name} className={`group bg-white rounded-2xl border p-6 flex flex-col relative ${isCurrent ? "border-2 border-[#1a1a2e] shadow-sm" : "border-[#e2ddd8]"}`}>
                    {isCurrent && <div className="absolute top-4 right-4 bg-[#f0ede8] text-[#1a1a2e] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Current</div>}
                    <h4 className="font-semibold text-[#1a1a2e]">{name}</h4>
                    <p className="text-xs text-[#9a9a9a] mt-1 mb-6">{description}</p>
                    <div className="mb-10 flex-1">
                      <span className="text-3xl font-bold text-[#1a1a2e]">${price}</span>
                      {durationDays ? (
                        <span className="text-sm text-[#9a9a9a]"> / {durationDays} days</span>
                      ) : null}
                    </div>
                    <button
                      onClick={() => setDetailsPlan(tier)}
                      className="w-full py-2.5 bg-[#fcfbf9] text-[#1a1a2e] border border-[#e2ddd8] rounded-xl text-sm font-semibold hover:bg-[#f0ede8] transition-all mt-auto opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                    >
                      Show details
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {detailsPlan && (
        <PlanDetailsModal
          plan={detailsPlan}
          isCurrent={Boolean(
            planName &&
              (detailsPlan.name ?? detailsPlan.Name) &&
              planName.toLowerCase() === (detailsPlan.name ?? detailsPlan.Name).toLowerCase()
          )}
          onClose={() => setDetailsPlan(null)}
          onRequestChange={(selectedPlan) => {
            setDetailsPlan(null);
            setChangePlanTarget(selectedPlan);
          }}
        />
      )}

      {changePlanTarget && (
        <ChangePlanConfirmModal
          plan={changePlanTarget}
          onClose={() => setChangePlanTarget(null)}
          onConfirm={handleConfirmChangePlan}
        />
      )}

      {toastEl}
    </div>
  );
};

export default SubscriptionTab;
