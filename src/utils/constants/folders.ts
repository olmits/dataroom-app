// Folder action constants
export const FOLDER_ACTIONS = {
  SET_CURRENT_FOLDER: 'SET_CURRENT_FOLDER',
  NAVIGATE_TO_FOLDER: 'NAVIGATE_TO_FOLDER',
} as const;

export type FolderActionType = typeof FOLDER_ACTIONS[keyof typeof FOLDER_ACTIONS];