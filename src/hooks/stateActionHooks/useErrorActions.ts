import { useErrorDispatchContext } from '@/contexts/ErrorContext';
import { ERROR_ACTIONS } from '../../utils/constants/errors';

// Hook to use both error state and dispatch with helper functions
export const useError = () => {
  const dispatch = useErrorDispatchContext();

  const setError = (error: string | null) => {
    dispatch({ type: ERROR_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ERROR_ACTIONS.CLEAR_ERROR });
  };

  return {
    setError,
    clearError,
  };
};