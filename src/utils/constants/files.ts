// Files action constants
export const FILES_ACTIONS = {
  SET_FILES: 'SET_FILES',
  ADD_FILE: 'ADD_FILE',
  UPDATE_FILE: 'UPDATE_FILE',
  DELETE_FILE: 'DELETE_FILE',
} as const;

export type FilesActionType = typeof FILES_ACTIONS[keyof typeof FILES_ACTIONS];