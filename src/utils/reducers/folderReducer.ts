import { FOLDER_ACTIONS, type FolderActionType } from '../constants/folders';
import type { DataRoomFolder } from '../../types/dataroom';

// Folder state type
export interface FolderState {
  currentFolderId: string | null;
  folderPath: DataRoomFolder[];
  folders: DataRoomFolder[];
  isCreating: boolean;
}

// Folder action type
export type FolderAction = {
  type: FolderActionType;
  payload: string | null | boolean | DataRoomFolder[] | DataRoomFolder;
};

// Initial folder state
export const initialFolderState: FolderState = {
  currentFolderId: null,
  folderPath: [],
  folders: [],
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
    case FOLDER_ACTIONS.SET_FOLDERS:
      return { ...state, folders: action.payload as DataRoomFolder[] };
    case FOLDER_ACTIONS.ADD_FOLDER:
      return { ...state, folders: [...state.folders, action.payload as DataRoomFolder] };
    case FOLDER_ACTIONS.DELETE_FOLDER:
      return { ...state, folders: state.folders.filter(folder => folder.id !== action.payload as string) };
    default:
      return state;
  }
};