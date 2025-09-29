import { FOLDER_ACTIONS, type FolderActionType } from '../constants/folders';
import type { DataRoomFolder } from '../../types/dataroom';

export interface FolderState {
  currentFolderId: string | null;
  folders: DataRoomFolder[];
  isCreating: boolean;
}

export type FolderAction = {
  type: FolderActionType;
  payload: string | null | boolean | DataRoomFolder[] | DataRoomFolder;
};

export const initialFolderState: FolderState = {
  currentFolderId: null,
  folders: [],
  isCreating: false,
};

export const folderReducer = (state: FolderState, action: FolderAction): FolderState => {
  switch (action.type) {
    case FOLDER_ACTIONS.SET_CURRENT_FOLDER:
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