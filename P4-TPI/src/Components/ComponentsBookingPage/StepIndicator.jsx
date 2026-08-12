import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { STEP_NODES } from "./stepMeta";
import { IconBuilding, IconMapPin, IconClipboard, IconUser, IconCalendar, IconClock, IconCheck } from "./Icons";

const ICONS = {
  building: IconBuilding,
  mapPin: IconMapPin,
  clipboard: IconClipboard,
  user: IconUser,
  calendar: IconCalendar,
  clock: IconClock,
  check: IconCheck,
};

const StepIndicator = ({ currentStep }) => {
  const { t } = useTranslation();

  const activeNodeIndex = STEP_NODES.findIndex((node) => node.steps.includes(currentStep));

  return (
    <section className="w-full overflow-x-auto py-8 px-4">
      <div className="flex items-center justify-center gap-2 min-w-max mx-auto">
        {STEP_NODES.map((node, i) => {
          const Icon = ICONS[node.iconKey];
          const isActive = i === activeNodeIndex;
          const isDone = i < activeNodeIndex;
          return (
            <div className="flex items-center" key={node.labelKey}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`p-3 rounded-full shadow-sm transition-colors ${
                    isActive || isDone
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-white border border-gray-200 text-gray-400"
                  }`}
                >
                  <Icon />
                </div>
                <p
                  className={`text-xs text-center max-w-[80px] ${
                    isActive ? "font-bold border-b-2 border-black pb-1" : "font-medium text-gray-500"
                  }`}
                >
                  {t(node.labelKey) || node.labelKey}
                </p>
              </div>
              {i < STEP_NODES.length - 1 && (
                <div className="w-10 h-[1px] bg-gray-300 mb-6 mx-1" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StepIndicator;
