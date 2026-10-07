import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { fetchServicesByBusiness } from "../../../services/servicesService";
import { IconClock, IconDollar } from "../Icons";
import SelectionStep from "./SelectionStep";

const ServiceStep = ({ booking, onSelect }) => {
  const { t } = useTranslation();

  return (
    <SelectionStep
      title={t("selectService") || "Select Service"}
      fetchFn={() => fetchServicesByBusiness(booking.businessId)}
      deps={[booking.businessId]}
      getId={(item) => item.id}
      isSelected={(item) => item.id === booking.serviceId}
      onSelect={(item) => onSelect(item.id, item.name, item.durationMinutes, item.price)}
      renderItem={(item) => (
        <div className="flex flex-col gap-1.5 pr-4">
          <span className="font-semibold text-[#1a1a2e]">{item.name}</span>
          {item.description && (
            <span className="text-sm text-[#6b6b6b]">{item.description}</span>
          )}
          <div className="flex items-center gap-3 text-sm mt-1">
            {item.durationMinutes != null && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F8F5F0] text-[#4a4a4a]">
                <IconClock /> {item.durationMinutes} {t("minutesAbbrev") || "min"}
              </span>
            )}
            {item.price != null && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F8F5F0] text-[#4a4a4a]">
                <IconDollar /> {item.price}
              </span>
            )}
          </div>
        </div>
      )}
      emptyMessage={t("noServicesFound") || "No services found for this business."}
      errorMessage={t("loadServicesError") || "Couldn't load services."}
    />
  );
};

export default ServiceStep;
