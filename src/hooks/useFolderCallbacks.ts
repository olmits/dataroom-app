import { getFolderService } from '../data-room';
import useLoadingActions from './stateActionHooks/useLoadingActions';
import useErrorActions from './stateActionHooks/useErrorActions';
import { ERROR_KEYS } from '../utils/constants/errors';
import useFolderActions from './stateActionHooks/useFolderActions';
import { useFolderStateContext } from '../contexts/FolderContext';
import { useFilesActions } from './stateActionHooks/useFilesActions';
import type { DataRoomFile } from '../types/dataroom';

interface CreateFolderResult {
  success: boolean;
  error?: string;
}

interface LoadFolderContentResult {
  success: boolean;
  error?: string;
}

export const useFolderCallbacks = () => {
  const { currentFolderId } = useFolderStateContext();
  const { setIsCreating, setFolders, addFolder } = useFolderActions();
  const { setFiles } = useFilesActions();
  const { setLoading } = useLoadingActions();
  const { setError, clearError } = useErrorActions();

  const loadFolderContent = async (): Promise<LoadFolderContentResult> => {
    setLoading(true);
    clearError(ERROR_KEYS.FOLDER_LOADING);
  
    try {
      const folderService = getFolderService();
      // Load both folders and files based on current folder context (null for root)
      console.log('Loading folder content for folder ID:', currentFolderId);
      const result = await folderService.getFolderContents(currentFolderId);
  
      if (result.success && result.data) {        
        // Update both folders and files in their respective contexts
        setFolders(result.data.folders);
        setFiles(result.data.files as DataRoomFile[]);
        return { success: true };
      } else {
        const error = result.error || 'Failed to load folder content';
        setError(ERROR_KEYS.FOLDER_LOADING, error);
        return { success: false, error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load folder content';
      setError(ERROR_KEYS.FOLDER_LOADING, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (
    folderName: string, 
  ): Promise<CreateFolderResult> => {
    const errorKey = ERROR_KEYS.FOLDER_CREATION;
    
    if (!folderName.trim()) {
      const error = 'Folder name is required';
      setError(errorKey, error);
      return { success: false, error };
    }

    // Set creating state
    setIsCreating(true);
    setLoading(true);
    clearError(errorKey);

    try {
      const folderService = getFolderService();
      const result = await folderService.createFolder(folderName.trim(), currentFolderId);

      if (result.success && result.data) {
        if (!Array.isArray(result.data)) {
          addFolder(result.data);
        }
        return { success: true };
      } else {
        const error = result.error || 'Failed to create folder';
        setError(errorKey, error);
        return { success: false, error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create folder';
      setError(errorKey, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsCreating(false);
      setLoading(false);
    }
  };

  return {
    loadFolderContent,
    createFolder,
  };
};