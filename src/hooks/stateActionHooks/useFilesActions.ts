import { FILES_ACTIONS } from '@/utils/constants/files';
import type { DataRoomFile } from '@/types/dataroom';
import { useFilesDispatchContext } from '@/contexts/FilesContext';

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

  return {
    setFiles,
    addFile,
    updateFile,
    deleteFile,
  };
};

export default useFilesActions;