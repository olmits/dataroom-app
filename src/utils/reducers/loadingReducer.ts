import { LOADING_ACTIONS, type LoadingActionType } from '../constants/loading';

export interface LoadingState {
  isLoading: boolean;
}

export type LoadingAction = {
  type: LoadingActionType;
  payload: boolean;
};

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