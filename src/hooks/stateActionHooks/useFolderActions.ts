import { useFolderDispatchContext } from '../../contexts/FolderContext';
import { FOLDER_ACTIONS } from '../../utils/constants/folders';

// Hook to use both folder state and dispatch with helper functions
export const useFolder = () => {
  const dispatch = useFolderDispatchContext();

  const setCurrentFolder = (folderId: string | null) => {
    dispatch({ type: FOLDER_ACTIONS.SET_CURRENT_FOLDER, payload: folderId });
  };

  const navigateToFolder = (folderId: string | null) => {
    dispatch({ type: FOLDER_ACTIONS.NAVIGATE_TO_FOLDER, payload: folderId });
  };

  return {
    setCurrentFolder,
    navigateToFolder,
  };
};