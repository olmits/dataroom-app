import { useLoadingDispatchContext } from '@/contexts/LoadingContext';
import { LOADING_ACTIONS } from '../../utils/constants/loading';

// Hook to use both loading state and dispatch with helper functions
export const useLoading = () => {
  const dispatch = useLoadingDispatchContext();

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: LOADING_ACTIONS.SET_LOADING, payload: isLoading });
  };

  return {
    setLoading,
  };
};