// Error action constants
export const ERROR_ACTIONS = {
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
} as const;

export type ErrorActionType = typeof ERROR_ACTIONS[keyof typeof ERROR_ACTIONS];