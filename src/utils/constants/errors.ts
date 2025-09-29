// Error action constants
export const ERROR_ACTIONS = {
  SET_ERROR: 'SET_ERROR',
  REMOVE_ERROR: 'REMOVE_ERROR',
  CLEAR_ALL_ERRORS: 'CLEAR_ALL_ERRORS',
} as const;

export type ErrorActionType = typeof ERROR_ACTIONS[keyof typeof ERROR_ACTIONS];

// Error key constants - for identifying different error types across the app
export const ERROR_KEYS = {
  FOLDER_LOADING: 'folder-loading',
  FOLDER_CREATION: 'folder-creation',
  FOLDER_UPDATE: 'folder-update',
  FOLDER_DELETION: 'folder-deletion',
  FILE_UPLOAD: 'file-upload',
  FILE_DELETION: 'file-deletion',
  ITEM_UPDATE: 'item-update',
} as const;

export type ErrorKeyType = typeof ERROR_KEYS[keyof typeof ERROR_KEYS];