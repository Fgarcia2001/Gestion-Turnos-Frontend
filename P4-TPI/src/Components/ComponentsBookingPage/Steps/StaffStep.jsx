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
      renderItem={(item, selected) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold shrink-0 ${
              selected ? "bg-white text-[#1A1A1A]" : "bg-gray-100 text-gray-600"
            }`}
          >
            {getInitials(item.name)}
          </div>
          <span className="font-semibold">{item.name}</span>
        </div>
      )}
      emptyMessage={t("noStaffFound") || "No professionals found at this branch."}
      errorMessage={t("loadStaffError") || "Couldn't load professionals."}
    />
  );
};

export default StaffStep;
