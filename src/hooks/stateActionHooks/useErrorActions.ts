import { useErrorDispatchContext } from '@/contexts/ErrorContext';
import { ERROR_ACTIONS } from '../../utils/constants/errors';
import { type ErrorType } from '../../utils/reducers/errorReducer';

const useErrorActions = () => {
  const dispatch = useErrorDispatchContext();

  const setError = (key: string, message: string, code?: string) => {
    const error: ErrorType = { message, code };
    dispatch({ 
      type: ERROR_ACTIONS.SET_ERROR, 
      payload: { key, error } 
    });
  };

  const removeError = (key: string) => {
    dispatch({ 
      type: ERROR_ACTIONS.REMOVE_ERROR, 
      payload: { key } 
    });
  };

  const clearAllErrors = () => {
    dispatch({ type: ERROR_ACTIONS.CLEAR_ALL_ERRORS });
  };

  // Convenience method for backward compatibility
  const clearError = (key?: string) => {
    if (key) {
      removeError(key);
    } else {
      clearAllErrors();
    }
  };

  return {
    setError,
    removeError,
    clearError,
    clearAllErrors,
  };
};

export default useErrorActions;