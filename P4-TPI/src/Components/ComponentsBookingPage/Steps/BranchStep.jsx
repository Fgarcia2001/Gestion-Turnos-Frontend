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
      renderItem={(item) => (
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F8F5F0] text-[#1a1a2e] shrink-0">
            <IconMapPin />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-semibold text-[#1a1a2e]">{item.name}</span>
            {item.address && (
              <span className="text-sm text-[#6b6b6b] truncate">
                {item.address}{item.city ? ` · ${item.city}` : ""}
              </span>
            )}
          </div>
        </div>
      )}
      emptyMessage={t("noBranchesFound") || "No branches found for this business."}
      errorMessage={t("loadBranchesError") || "Couldn't load branches."}
    />
  );
};

export default BranchStep;
