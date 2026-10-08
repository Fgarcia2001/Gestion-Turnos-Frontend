import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { STEP_NODES } from "./stepMeta";
import { IconBuilding, IconMapPin, IconClipboard, IconUser, IconCalendar, IconClock } from "./Icons";

const SmallCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ICONS = {
  building: IconBuilding,
  mapPin: IconMapPin,
  clipboard: IconClipboard,
  user: IconUser,
  calendar: IconCalendar,
  clock: IconClock,
  check: SmallCheck,
};

const StepIndicator = ({ currentStep, onStepClick }) => {
  const { t } = useTranslation();

  const activeNodeIndex = STEP_NODES.findIndex((node) => node.steps.includes(currentStep));

  return (
    <section className="w-full overflow-x-auto py-6 px-4">
      <div className="flex items-center min-w-max mx-auto">
        {STEP_NODES.map((node, i) => {
          const Icon = ICONS[node.iconKey];
          const isActive = i === activeNodeIndex;
          const isDone = i < activeNodeIndex;
          const isClickable = isDone && onStepClick;

          return (
            <div className="flex items-center" key={node.labelKey}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(node.steps[0])}
                className={`flex flex-col items-center gap-2 ${isClickable ? "cursor-pointer group" : "cursor-default"}`}
              >
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-[#1a1a2e] text-white shadow-md shadow-[#1a1a2e]/20 scale-110"
                      : isDone
                      ? "bg-[#1a1a2e] text-white group-hover:bg-[#2d2d4d]"
                      : "bg-white border-2 border-[#e2ddd8] text-[#b3aca3]"
                  }`}
                >
                  {isDone ? <SmallCheck /> : <Icon />}
                </div>
                <p
                  className={`text-[11px] text-center max-w-[76px] leading-tight transition-colors ${
                    isActive ? "font-bold text-[#1a1a2e]" : isDone ? "font-semibold text-[#4a4a4a] group-hover:text-[#1a1a2e]" : "font-medium text-[#b3aca3]"
                  }`}
                >
                  {t(node.labelKey) || node.labelKey}
                </p>
              </button>
              {i < STEP_NODES.length - 1 && (
                <div className="w-8 sm:w-12 h-[2px] mb-6 mx-1 rounded-full bg-[#e2ddd8] overflow-hidden">
                  <div
                    className={`h-full bg-[#1a1a2e] transition-all duration-500 ${i < activeNodeIndex ? "w-full" : "w-0"}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StepIndicator;
