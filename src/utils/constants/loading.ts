// Loading action constants
export const LOADING_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
} as const;

export type LoadingActionType = typeof LOADING_ACTIONS[keyof typeof LOADING_ACTIONS];