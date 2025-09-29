import { FILES_ACTIONS } from '../constants/files';
import type { DataRoomFile } from '../../types/dataroom';

// Files state type
export interface FilesState {
  files: DataRoomFile[];
  selectedFiles: string[];
}

// Files action types
export type FilesAction =
  | { type: typeof FILES_ACTIONS.SET_FILES; payload: DataRoomFile[] }
  | { type: typeof FILES_ACTIONS.ADD_FILE; payload: DataRoomFile }
  | { type: typeof FILES_ACTIONS.UPDATE_FILE; payload: { id: string; updates: Partial<DataRoomFile> } }
  | { type: typeof FILES_ACTIONS.DELETE_FILE; payload: string }
  | { type: typeof FILES_ACTIONS.DELETE_FILES; payload: string[] }
  | { type: typeof FILES_ACTIONS.SET_SELECTED_FILES; payload: string[] }
  | { type: typeof FILES_ACTIONS.CLEAR_SELECTION };

// Initial files state
export const initialFilesState: FilesState = {
  files: [],
  selectedFiles: [],
};

// Files reducer
export const filesReducer = (state: FilesState, action: FilesAction): FilesState => {
  switch (action.type) {
    case FILES_ACTIONS.SET_FILES:
      return { ...state, files: action.payload };
    case FILES_ACTIONS.ADD_FILE:
      return { ...state, files: [...state.files, action.payload] };
    case FILES_ACTIONS.UPDATE_FILE:
      return {
        ...state,
        files: state.files.map(file =>
          file.id === action.payload.id
            ? { ...file, ...action.payload.updates, updatedAt: new Date() } as DataRoomFile
            : file
        ),
      };
    case FILES_ACTIONS.DELETE_FILE:
      return {
        ...state,
        files: state.files.filter(file => file.id !== action.payload),
      };
    case FILES_ACTIONS.DELETE_FILES:
      return {
        ...state,
        files: state.files.filter(file => !action.payload.includes(file.id)),
      };
    case FILES_ACTIONS.SET_SELECTED_FILES:
      return { ...state, selectedFiles: action.payload };
    case FILES_ACTIONS.CLEAR_SELECTION:
      return { ...state, selectedFiles: [] };
    default:
      return state;
  }
};