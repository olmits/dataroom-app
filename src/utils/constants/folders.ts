// Folder action constants
export const FOLDER_ACTIONS = {
  SET_CURRENT_FOLDER: 'SET_CURRENT_FOLDER',
  NAVIGATE_TO_FOLDER: 'NAVIGATE_TO_FOLDER',
  SET_IS_CREATING: 'SET_IS_CREATING',
} as const;

export type FolderActionType = typeof FOLDER_ACTIONS[keyof typeof FOLDER_ACTIONS];