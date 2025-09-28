import { ERROR_ACTIONS, type ErrorActionType } from '../constants/errors';

// Error state type
export interface ErrorState {
  error: string | null;
}

// Error action type
export type ErrorAction = {
  type: ErrorActionType;
  payload?: string | null;
};

// Initial error state
export const initialErrorState: ErrorState = {
  error: null,
};

// Error reducer
export const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case ERROR_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload || null };
    case ERROR_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};