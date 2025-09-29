import { getFolderService, getFileService } from '@/data-room';
import { ERROR_KEYS } from '@/utils/constants/errors';

import useLoadingActions from './stateActionHooks/useLoadingActions';
import useErrorActions from './stateActionHooks/useErrorActions';
import useFolderActions from './stateActionHooks/useFolderActions';
import useFilesActions from './stateActionHooks/useFilesActions';

interface DeleteResult {
  success: boolean;
  error?: string;
}

export const useItemDeletionCallbacks = () => {
  const { setLoading } = useLoadingActions();
  const { setError, clearError } = useErrorActions();
  const { deleteFolder: removeFolderFromContext } = useFolderActions();
  const { deleteFile: removeFileFromContext } = useFilesActions();

  const deleteFolder = async (folderId: string): Promise<DeleteResult> => {
    setLoading(true);
    clearError(ERROR_KEYS.FOLDER_DELETION);

    try {
      const folderService = getFolderService();
      const result = await folderService.deleteFolder(folderId);

      if (result.success) {
        // Remove from context - deleteFolder returns deletedIds array for cascading deletes
        result.deletedIds?.forEach(id => removeFolderFromContext(id));
        return { success: true };
      } else {
        const error = result.error || 'Failed to delete folder';
        setError(ERROR_KEYS.FOLDER_DELETION, error);
        return { success: false, error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete folder';
      setError(ERROR_KEYS.FOLDER_DELETION, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string): Promise<DeleteResult> => {
    setLoading(true);
    clearError(ERROR_KEYS.FILE_DELETION);

    try {
      const fileService = getFileService();
      const result = await fileService.deleteFile(fileId);

      if (result.success) {
        // Remove from context
        removeFileFromContext(fileId);
        return { success: true };
      } else {
        const error = result.error || 'Failed to delete file';
        setError(ERROR_KEYS.FILE_DELETION, error);
        return { success: false, error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
      setError(ERROR_KEYS.FILE_DELETION, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteFolder,
    deleteFile,
  };
};