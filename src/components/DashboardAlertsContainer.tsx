import { useErrorStateContext } from "@/contexts/ErrorContext";
import useErrorActions from "@/hooks/stateActionHooks/useErrorActions";
import { ERROR_KEYS } from "@/utils/constants/errors";
import Alert from "./common/Alert";

const DashboardAlertsContainer: React.FC = () => {
  const { errors } = useErrorStateContext();
  const { clearError } = useErrorActions();

  return (
    <div className="mb-4">
      {errors[ERROR_KEYS.FOLDER_LOADING] && (
        <Alert 
          message={errors[ERROR_KEYS.FOLDER_LOADING]!.message}
          onClose={() => clearError(ERROR_KEYS.FOLDER_LOADING)}
          type="error"
        />
      )}
      {errors[ERROR_KEYS.FILE_UPLOAD] && (
        <Alert 
          message={errors[ERROR_KEYS.FILE_UPLOAD]!.message}
          onClose={() => clearError(ERROR_KEYS.FILE_UPLOAD)}
          type="error"
        />
      )}
    </div>
  );
};

export default DashboardAlertsContainer;