import { FILES_ACTIONS } from '../constants/files';
import type { DataRoomFile } from '../../types/dataroom';

export interface FilesState {
  files: DataRoomFile[];
  selectedFiles: string[];
}

export type FilesAction =
  | { type: typeof FILES_ACTIONS.SET_FILES; payload: DataRoomFile[] }
  | { type: typeof FILES_ACTIONS.ADD_FILE; payload: DataRoomFile }
  | { type: typeof FILES_ACTIONS.UPDATE_FILE; payload: { id: string; updates: Partial<DataRoomFile> } }
  | { type: typeof FILES_ACTIONS.DELETE_FILE; payload: string };

export const initialFilesState: FilesState = {
  files: [],
  selectedFiles: [],
};

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
            ? { ...file, ...action.payload.updates } as DataRoomFile
            : file
        ),
      };
    case FILES_ACTIONS.DELETE_FILE:
      return {
        ...state,
        files: state.files.filter(file => file.id !== action.payload),
      };
    default:
      return state;
  }
};