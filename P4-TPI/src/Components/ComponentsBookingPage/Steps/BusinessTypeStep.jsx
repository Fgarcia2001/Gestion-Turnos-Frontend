import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { fetchBusinessTypes } from "../../../services/businessService";
import SelectionStep from "./SelectionStep";

const BusinessTypeStep = ({ booking, onSelect }) => {
  const { t } = useTranslation();

  return (
    <SelectionStep
      title={t("selectBusinessType") || "Select Business Type"}
      fetchFn={fetchBusinessTypes}
      deps={[]}
      getId={(item) => item.id}
      isSelected={(item) => item.id === booking.businessTypeId}
      onSelect={(item) => onSelect(item.id, item.name)}
      renderItem={(item) => <span className="font-semibold">{item.name}</span>}
      emptyMessage={t("noBusinessTypesFound") || "No business types found."}
      errorMessage={t("loadBusinessTypesError") || "Couldn't load business types."}
    />
  );
};

export default BusinessTypeStep;
