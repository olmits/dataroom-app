import { ERROR_ACTIONS } from '../constants/errors';

export type ErrorType = {
  message: string; 
  code?: string;
};

export type SetErrorAction<T extends string> = {
  type: typeof ERROR_ACTIONS.SET_ERROR;
  payload: { key: T; error: ErrorType };
};

export type RemoveErrorAction<T extends string> = {
  type: typeof ERROR_ACTIONS.REMOVE_ERROR;
  payload: { key: T };
};

export type ClearAllErrorsAction = {
  type: typeof ERROR_ACTIONS.CLEAR_ALL_ERRORS;
};

export type ErrorAction<T extends string = string> = 
  | SetErrorAction<T>
  | RemoveErrorAction<T>
  | ClearAllErrorsAction;

export type ErrorState<T extends string = string> = {
  errors: Partial<Record<T, ErrorType>>;
};

export const initialErrorState: ErrorState = {
  errors: {},
};

export const errorReducer = <T extends string>(
  state: ErrorState<T>, 
  action: ErrorAction<T>
): ErrorState<T> => {
  switch (action.type) {
    case ERROR_ACTIONS.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error,
        },
      };
    case ERROR_ACTIONS.REMOVE_ERROR: {
      const newErrors = { ...state.errors };
      delete newErrors[action.payload.key];
      return {
        ...state,
        errors: newErrors,
      };
    }
    case ERROR_ACTIONS.CLEAR_ALL_ERRORS:
      return {
        ...state,
        errors: {},
      };
    default:
      return state;
  }
};