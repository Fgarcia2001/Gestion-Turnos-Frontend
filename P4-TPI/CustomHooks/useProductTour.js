import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useTranslation } from "./TraslateHook";
import { mascotSvg } from "./tourMascot";

// ── Registro local (por usuario) de que ya vio el tutorial ────────────────────
// Espeja el patrón de NotificationContext (notification_seen_<userId>).
const TOUR_SEEN_PREFIX = "tour_seen_";
const tourSeenKey = (sub) => `${TOUR_SEEN_PREFIX}${sub}`;

export const hasSeenTour = (sub) => {
  if (!sub) return false;
  try {
    return localStorage.getItem(tourSeenKey(sub)) === "1";
  } catch {
    return false;
  }
};

const markTourSeen = (sub) => {
  if (!sub) return;
  try {
    localStorage.setItem(tourSeenKey(sub), "1");
  } catch {
    // storage no disponible: se ignora
  }
};

// ── Roles ─────────────────────────────────────────────────────────────────────
const isProfessional = (role) =>
  role === "2" || role === "Profesional" || role === "Professional";
const isReceptionist = (role) =>
  role === "Recepcionista" || role === "Receptionist";

// ── Pasos ─────────────────────────────────────────────────────────────────────
const sel = (name) => `[data-tour="${name}"]`;

// `section` indica qué sección debe estar montada para que exista el elemento
// del paso (lo usa onNextClick/onPrevClick para navegar antes de avanzar).
// `wait` da margen a que React monte la sección y renderice su contenido.
// `mascot` (opcional) muestra la libreta animada en ese paso.
const step = (
  section,
  element,
  title,
  description,
  { wait = 1500, mascot, side = "bottom", align = "center" } = {}
) => ({
  element: element ? sel(element) : undefined,
  data: { section, mascot },
  waitForElement: wait,
  popover: { title, description, side, align },
});

const buildSteps = (t, role) => {
  const admin = !isProfessional(role) && !isReceptionist(role);

  const welcome = {
    data: { mascot: "wave" },
    popover: {
      title: t("tourWelcomeTitle"),
      description: t("tourWelcomeDesc"),
      align: "center",
    },
  };

  const headerSteps = [
    step(undefined, "greeting", t("tourGreetingTitle"), t("tourGreetingDesc"), { wait: 0 }),
    step(undefined, "notifications", t("tourNotifTitle"), t("tourNotifDesc"), { wait: 0 }),
    step(undefined, "profile", t("tourProfileTitle"), t("tourProfileDesc"), { wait: 0 }),
  ];

  // Profesionales y recepcionistas solo ven Appointments y Help.
  if (!admin) {
    return [
      welcome,
      ...headerSteps,
      step("appointments", "appointments-calendar", t("tourApptTitle"), t("tourApptDesc"), { mascot: "point" }),
      step("appointments", "appointments-new", t("tourApptNewTitle"), t("tourApptNewDesc")),
      step("appointments", "appointments-list", t("tourApptListTitle"), t("tourApptListDesc")),
      step("help", "help-content", t("tourHelpTitle"), t("tourHelpDesc"), { mascot: "celebrate" }),
    ];
  }

  return [
    welcome,
    ...headerSteps,
    step(undefined, "sidebar", t("tourNavTitle"), t("tourNavDesc"), { wait: 0 }),
    step("home", "home-stats", t("tourHomeTitle"), t("tourHomeDesc"), { mascot: "point" }),
    step("home", "plan-usage", t("tourPlanUsageTitle"), t("tourPlanUsageDesc")),
    step("home", "home-branches", t("tourHomeBranchesTitle"), t("tourHomeBranchesDesc")),
    step("managmentBusiness", "business-stats", t("tourBusinessTitle"), t("tourBusinessDesc"), { mascot: "point" }),
    step("managmentBusiness", "business-tabs", t("tourBusinessTabsTitle"), t("tourBusinessTabsDesc")),
    step("managmentBusiness", "business-table", t("tourBusinessTableTitle"), t("tourBusinessTableDesc")),
    step("appointments", "appointments-calendar", t("tourApptTitle"), t("tourApptDesc"), { mascot: "point" }),
    step("appointments", "appointments-new", t("tourApptNewTitle"), t("tourApptNewDesc")),
    step("appointments", "appointments-list", t("tourApptListTitle"), t("tourApptListDesc")),
    step("schedule", "schedule-title", t("tourScheduleTitle"), t("tourScheduleDesc"), { mascot: "point" }),
    step("schedule", "schedule-grid", t("tourScheduleGridTitle"), t("tourScheduleGridDesc")),
    step("settings", "settings-tabs", t("tourSettingsTitle"), t("tourSettingsDesc"), { mascot: "point" }),
    step("settings", "settings-content", t("tourSettingsContentTitle"), t("tourSettingsContentDesc")),
    step("help", "help-content", t("tourHelpTitle"), t("tourHelpDesc"), { mascot: "celebrate" }),
  ];
};

// ── Hook ──────────────────────────────────────────────────────────────────────
// `onNavigate(sectionId)` mueve el estado de sección de Admin (setSection).
// `enabled` permite no auto-arrancar (p.ej. al volver de MercadoPago).
export const useProductTour = ({ onNavigate, enabled = true } = {}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const sub = user?.sub;

  const driverRef = useRef(null);
  const startedRef = useRef(false);
  const startRef = useRef(null);
  // Mascota flotante: vive fuera del popover (a nivel document.body).
  const mascotRef = useRef(null);
  const popoverRef = useRef(null);
  const rafRef = useRef(null);

  const startTour = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    let driver;
    try {
      // Import dinámico: el tutorial queda en su propio chunk y solo se
      // descarga cuando realmente se muestra.
      await import("driver.js/dist/driver.css");
      ({ driver } = await import("driver.js"));
    } catch (e) {
      startedRef.current = false;
      console.error("No se pudo cargar el tutorial:", e);
      return;
    }

    const steps = buildSteps(t, user?.role);

    // Arranca desde la sección del primer paso que la tenga definida.
    const firstSection = steps.find((st) => st.data?.section)?.data.section;
    if (firstSection) onNavigate?.(firstSection);

    const clearMascot = () => {
      if (mascotRef.current) {
        mascotRef.current.remove();
        mascotRef.current = null;
      }
    };

    // Coloca la mascota en el lado con más espacio alrededor del popover.
    const positionMascot = () => {
      const el = mascotRef.current;
      const pop = popoverRef.current;
      if (!el || !pop) return;
      const r = pop.getBoundingClientRect();
      if (!r.width && !r.height) return;
      const size = 112;
      const gap = 14;
      const margin = 12;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      const centerTop = clamp(r.top + r.height / 2 - size / 2, margin, vh - margin - size);

      let left;
      let top;
      if (r.right + gap + size <= vw - margin) {
        left = r.right + gap;
        top = centerTop;
      } else if (r.left - gap - size >= margin) {
        left = r.left - gap - size;
        top = centerTop;
      } else if (r.bottom + gap + size <= vh - margin) {
        left = clamp(r.left + r.width / 2 - size / 2, margin, vw - margin - size);
        top = r.bottom + gap;
      } else {
        left = clamp(r.left + r.width / 2 - size / 2, margin, vw - margin - size);
        top = clamp(r.top - gap - size, margin, vh - margin - size);
      }
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    };

    // El popover se mueve con smoothScroll y los flips del arrow: reposicionamos
    // por frame mientras el tour está abierto.
    const tick = () => {
      if (!driverRef.current) return;
      positionMascot();
      rafRef.current = requestAnimationFrame(tick);
    };

    const instance = driver({
      steps,
      showProgress: true,
      progressText: t("tourProgress"),
      nextBtnText: t("tourNext"),
      prevBtnText: t("tourPrev"),
      doneBtnText: t("tourDone"),
      allowClose: true,
      // Clic afuera no cierra: solo la X (o el botón Listo) cierran el tour.
      overlayClickBehavior: "none",
      // Las flechas del teclado moverían de paso sin pasar por los hooks de
      // navegación y desincronizarían la sección; Esc y cerrar siguen activos.
      allowKeyboardControl: false,
      smoothScroll: true,
      skipMissingElement: true,
      popoverClass: "app-tour",
      // La mascota vive fuera del popover (en body) y se posiciona al lado.
      onPopoverRender: (popover, opts) => {
        popoverRef.current = popover.wrapper;
        const idx =
          opts?.state?.activeIndex ??
          opts?.index ??
          driverRef.current?.getActiveIndex?.() ??
          0;
        const pose = steps[idx]?.data?.mascot;
        clearMascot();
        if (!pose) return;
        const holder = document.createElement("div");
        holder.className = "tour-mascot-float";
        holder.setAttribute("aria-hidden", "true");
        holder.innerHTML = mascotSvg(pose);
        document.body.appendChild(holder);
        mascotRef.current = holder;
        positionMascot();
      },
      onNextClick: (_el, _st, { driver: d, index }) => {
        const next = steps[(index ?? d.getActiveIndex?.() ?? 0) + 1];
        if (next?.data?.section) onNavigate?.(next.data.section);
        d.moveNext();
      },
      onPrevClick: (_el, _st, { driver: d, index }) => {
        const prev = steps[(index ?? d.getActiveIndex?.() ?? 0) - 1];
        if (prev?.data?.section) onNavigate?.(prev.data.section);
        d.movePrevious();
      },
      onDestroyed: () => {
        markTourSeen(sub);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        clearMascot();
        popoverRef.current = null;
        driverRef.current = null;
        // Permite volver a abrirlo desde el botón de Help.
        startedRef.current = false;
      },
    });

    driverRef.current = instance;
    instance.drive();
    rafRef.current = requestAnimationFrame(tick);
  }, [t, user?.role, sub, onNavigate]);

  // El auto-start no depende de la identidad de startTour (que puede cambiar),
  // así que se guarda una referencia actualizada en un efecto.
  useEffect(() => {
    startRef.current = startTour;
  }, [startTour]);

  const autoStartedRef = useRef(false);

  // Auto-start en la primera visita (una sola vez por usuario).
  useEffect(() => {
    if (!enabled || !sub || autoStartedRef.current || hasSeenTour(sub)) return;
    autoStartedRef.current = true;
    const timer = setTimeout(() => startRef.current?.(), 600);
    return () => clearTimeout(timer);
  }, [enabled, sub]);

  // Si se desmonta Admin con el tour abierto, no dejar overlay ni mascota colgados.
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (mascotRef.current) mascotRef.current.remove();
    driverRef.current?.destroy();
  }, []);

  return { startTour };
};

export default useProductTour;
