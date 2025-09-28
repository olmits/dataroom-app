import { LOADING_ACTIONS, type LoadingActionType } from '../constants/loading';

// Loading state type
export interface LoadingState {
  isLoading: boolean;
}

// Loading action type
export type LoadingAction = {
  type: LoadingActionType;
  payload: boolean;
};

// Initial loading state
export const initialLoadingState: LoadingState = {
  isLoading: false,
};

// Loading reducer
export const loadingReducer = (state: LoadingState, action: LoadingAction): LoadingState => {
  switch (action.type) {
    case LOADING_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};