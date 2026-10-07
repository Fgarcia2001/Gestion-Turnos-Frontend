import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { fetchStaffByBranch } from "../../../services/staffService";
import SelectionStep from "./SelectionStep";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const StaffStep = ({ booking, onSelect }) => {
  const { t } = useTranslation();

  return (
    <SelectionStep
      title={t("selectProfessional") || "Select Professional"}
      fetchFn={() => fetchStaffByBranch(booking.branchId)}
      deps={[booking.branchId]}
      getId={(item) => item.id}
      isSelected={(item) => item.id === booking.staffId}
      onSelect={(item) => onSelect(item.id, item.name)}
      renderItem={(item) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shrink-0 bg-[#1a1a2e] text-white">
            {getInitials(item.name)}
          </div>
          <span className="font-semibold text-[#1a1a2e]">{item.name}</span>
        </div>
      )}
      emptyMessage={t("noStaffFound") || "No professionals found at this branch."}
      errorMessage={t("loadStaffError") || "Couldn't load professionals."}
    />
  );
};

export default StaffStep;
