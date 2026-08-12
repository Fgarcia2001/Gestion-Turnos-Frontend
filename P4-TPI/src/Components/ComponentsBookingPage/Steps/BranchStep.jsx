import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { fetchBranchesByBusiness } from "../../../services/branchService";
import { IconMapPin } from "../Icons";
import SelectionStep from "./SelectionStep";

const BranchStep = ({ booking, onSelect }) => {
  const { t } = useTranslation();

  return (
    <SelectionStep
      title={t("selectBranch") || "Select Branch"}
      fetchFn={() => fetchBranchesByBusiness(booking.businessId)}
      deps={[booking.businessId]}
      getId={(item) => item.id}
      isSelected={(item) => item.id === booking.branchId}
      onSelect={(item) => onSelect(item.id, item.name, item.address)}
      renderItem={(item, selected) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{item.name}</span>
          {item.address && (
            <span className={`flex items-center gap-1.5 text-sm ${selected ? "text-gray-200" : "text-gray-500"}`}>
              <IconMapPin />
              {item.address} - {item.city}
            </span>
          )}
        </div>
      )}
      emptyMessage={t("noBranchesFound") || "No branches found for this business."}
      errorMessage={t("loadBranchesError") || "Couldn't load branches."}
    />
  );
};

export default BranchStep;
