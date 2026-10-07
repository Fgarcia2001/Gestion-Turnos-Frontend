import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { IconAlert } from "./Icons";

const StatusPanel = ({ loading, error, isEmpty, emptyMessage, onRetry, children }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 px-6 text-center">
        <div className="text-[#b91c1c]">
          <IconAlert />
        </div>
        <p className="text-[#6b6b6b]">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-1 px-6 py-2 rounded-lg border border-[#e2ddd8] font-semibold text-sm text-[#1a1a2e] hover:bg-[#F8F5F0] transition-colors"
          >
            {t("retry") || "Retry"}
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center py-14 px-6 text-center">
        <p className="text-[#9a9a9a]">{emptyMessage}</p>
      </div>
    );
  }

  return children;
};

export default StatusPanel;
