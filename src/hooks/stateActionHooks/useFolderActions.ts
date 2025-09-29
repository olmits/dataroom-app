import { useFolderDispatchContext } from '@/contexts/FolderContext';
import { FOLDER_ACTIONS } from '@/utils/constants/folders';
import type { DataRoomFolder } from '@/types/dataroom';

const useFolderActions = () => {
  const dispatch = useFolderDispatchContext();

  const setCurrentFolder = (folderId: string | null) => {
    dispatch({ type: FOLDER_ACTIONS.SET_CURRENT_FOLDER, payload: folderId });
  };

  const setIsCreating = (isCreating: boolean) => {
    dispatch({ type: FOLDER_ACTIONS.SET_IS_CREATING, payload: isCreating });
  };

  const setFolders = (folders: DataRoomFolder[]) => {
    dispatch({ type: FOLDER_ACTIONS.SET_FOLDERS, payload: folders });
  };

  const addFolder = (folder: DataRoomFolder) => {
    dispatch({ type: FOLDER_ACTIONS.ADD_FOLDER, payload: folder });
  };

  const deleteFolder = (folderId: string) => {
    dispatch({ type: FOLDER_ACTIONS.DELETE_FOLDER, payload: folderId });
  };

  return {
    setCurrentFolder,
    setIsCreating,
    setFolders,
    addFolder,
    deleteFolder,
  };
};

export default useFolderActions;