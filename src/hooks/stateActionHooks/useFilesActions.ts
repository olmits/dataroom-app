import { FILES_ACTIONS } from '../../utils/constants/files';
import type { DataRoomFile } from '../../types/dataroom';
import { useFilesDispatchContext } from '../../contexts/FilesContext';

// Hook to use both files state and dispatch with helper functions
export const useFilesActions = () => {
  const dispatch = useFilesDispatchContext();

  const setFiles = (files: DataRoomFile[]) => {
    dispatch({ type: FILES_ACTIONS.SET_FILES, payload: files });
  };

  const addFile = (file: DataRoomFile) => {
    dispatch({ type: FILES_ACTIONS.ADD_FILE, payload: file });
  };

  const updateFile = (id: string, updates: Partial<DataRoomFile>) => {
    dispatch({ type: FILES_ACTIONS.UPDATE_FILE, payload: { id, updates } });
  };

  const deleteFile = (id: string) => {
    dispatch({ type: FILES_ACTIONS.DELETE_FILE, payload: id });
  };

  const deleteFiles = (ids: string[]) => {
    dispatch({ type: FILES_ACTIONS.DELETE_FILES, payload: ids });
  };

  const setSelectedFiles = (ids: string[]) => {
    dispatch({ type: FILES_ACTIONS.SET_SELECTED_FILES, payload: ids });
  };

  const clearSelection = () => {
    dispatch({ type: FILES_ACTIONS.CLEAR_SELECTION });
  };

  return {
    setFiles,
    addFile,
    updateFile,
    deleteFile,
    deleteFiles,
    setSelectedFiles,
    clearSelection,
  };
};

export default useFilesActions;