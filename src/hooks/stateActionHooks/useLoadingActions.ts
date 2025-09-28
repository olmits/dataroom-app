import { useLoadingDispatchContext } from '@/contexts/LoadingContext';
import { LOADING_ACTIONS } from '../../utils/constants/loading';

const useLoadingActions = () => {
  const dispatch = useLoadingDispatchContext();

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: LOADING_ACTIONS.SET_LOADING, payload: isLoading });
  };

  return {
    setLoading,
  };
};

export default useLoadingActions;