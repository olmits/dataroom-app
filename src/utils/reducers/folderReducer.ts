import { FOLDER_ACTIONS, type FolderActionType } from '../constants/folders';
import type { DataRoomFolder } from '../../types/dataroom';

// Folder state type
export interface FolderState {
  currentFolderId: string | null;
  folderPath: DataRoomFolder[];
}

// Folder action type
export type FolderAction = {
  type: FolderActionType;
  payload: string | null;
};

// Initial folder state
export const initialFolderState: FolderState = {
  currentFolderId: null,
  folderPath: [],
};

// Folder reducer
export const folderReducer = (state: FolderState, action: FolderAction): FolderState => {
  switch (action.type) {
    case FOLDER_ACTIONS.SET_CURRENT_FOLDER:
    case FOLDER_ACTIONS.NAVIGATE_TO_FOLDER:
      return { ...state, currentFolderId: action.payload };
    default:
      return state;
  }
};