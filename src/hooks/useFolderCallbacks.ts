import { getFolderService } from '../data-room';
import useLoadingActions from './stateActionHooks/useLoadingActions';
import useErrorActions from './stateActionHooks/useErrorActions';
import { ERROR_KEYS } from '../utils/constants/errors';
import useFolderActions from './stateActionHooks/useFolderActions';

interface CreateFolderResult {
  success: boolean;
  error?: string;
}

export const useFolderCallbacks = () => {
  const { setIsCreating } = useFolderActions()
  const { setLoading } = useLoadingActions();
  const { setError, clearError } = useErrorActions();

  const createFolder = async (
    folderName: string, 
    parentId: string | null = null
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
      const result = await folderService.createFolder(folderName.trim(), parentId);

      if (result.success) {
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
    createFolder,
  };
};