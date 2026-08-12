import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { fetchBusinessesByType } from "../../../services/businessService";
import SelectionStep from "./SelectionStep";

const BusinessStep = ({ booking, onSelect }) => {
  const { t } = useTranslation();

  return (
    <SelectionStep
      title={t("selectBusiness") || "Select Business"}
      fetchFn={() => fetchBusinessesByType(booking.businessTypeId)}
      deps={[booking.businessTypeId]}
      getId={(item) => item.id}
      isSelected={(item) => item.id === booking.businessId}
      onSelect={(item) => onSelect(item.id, item.name)}
      renderItem={(item) => <span className="font-semibold">{item.name}</span>}
      emptyMessage={t("noBusinessesFound") || "No businesses found for this type."}
      errorMessage={t("loadBusinessesError") || "Couldn't load businesses."}
    />
  );
};

export default BusinessStep;
