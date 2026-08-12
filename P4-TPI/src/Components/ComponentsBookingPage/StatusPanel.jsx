import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { IconAlert } from "./Icons";

const StatusPanel = ({ loading, error, isEmpty, emptyMessage, onRetry, children }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 px-6 text-center">
        <div className="text-[#b91c1c]">
          <IconAlert />
        </div>
        <p className="text-gray-600">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-1 px-6 py-2 rounded-lg border border-gray-200 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return children;
};

export default StatusPanel;
