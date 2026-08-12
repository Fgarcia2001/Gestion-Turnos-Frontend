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
      renderItem={(item, selected) => (
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold">{item.name}</span>
          <span className={`flex items-center gap-1.5 text-sm ${selected ? "text-gray-200" : "text-gray-500"}`}>
            {item.description}
          </span>
          <div className={`flex items-center gap-3 text-sm ${selected ? "text-gray-200" : "text-gray-500"}`}>
            {item.durationMinutes != null && (
              <span className="flex items-center gap-1">
                <IconClock /> {item.durationMinutes} {t("minutesAbbrev") || "min"}
              </span>
            )}
            {item.price != null && (
              <span className="flex items-center gap-1">
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
