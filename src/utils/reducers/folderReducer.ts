import { FOLDER_ACTIONS, type FolderActionType } from '../constants/folders';
import type { DataRoomFolder } from '../../types/dataroom';

// Folder state type
export interface FolderState {
  currentFolderId: string | null;
  folderPath: DataRoomFolder[];
  isCreating: boolean;
}

// Folder action type
export type FolderAction = {
  type: FolderActionType;
  payload: string | null | boolean;
};

// Initial folder state
export const initialFolderState: FolderState = {
  currentFolderId: null,
  folderPath: [],
  isCreating: false,
};

// Folder reducer
export const folderReducer = (state: FolderState, action: FolderAction): FolderState => {
  switch (action.type) {
    case FOLDER_ACTIONS.SET_CURRENT_FOLDER:
    case FOLDER_ACTIONS.NAVIGATE_TO_FOLDER:
      return { ...state, currentFolderId: action.payload as string | null };
    case FOLDER_ACTIONS.SET_IS_CREATING:
      return { ...state, isCreating: action.payload as boolean };
    default:
      return state;
  }
};