import { getFolderService, getFileService } from '@/data-room';
import { ERROR_KEYS } from '@/utils/constants/errors';
import type { DataRoomItem } from '@/types/dataroom';

import { useFolderCallbacks } from './useFolderCallbacks';
import useErrorActions from './stateActionHooks/useErrorActions';
import useLoadingActions from './stateActionHooks/useLoadingActions';

interface UpdateResult {
  success: boolean;
  data?: DataRoomItem;
  error?: string;
}

interface UseItemUpdateCallbacksResult {
  updateFolder: (id: string, name: string) => Promise<UpdateResult>;
  updateFile: (id: string, name: string) => Promise<UpdateResult>;
}

export const useItemUpdateCallbacks = (): UseItemUpdateCallbacksResult => {
  const { setError, clearError } = useErrorActions();
  const { setLoading } = useLoadingActions();
  const { loadFolderContent } = useFolderCallbacks();

  const updateFolder = async (id: string, name: string): Promise<UpdateResult> => {
    setLoading(true);
    clearError(ERROR_KEYS.ITEM_UPDATE);

    try {
      const folderService = getFolderService();
      const result = await folderService.updateFolder(id, name);

      if (result.success && result.data) {
        // Refresh the folder contents to show the updated item
        await loadFolderContent();
        return { success: true, data: result.data as DataRoomItem };
      } else {
        setError(ERROR_KEYS.ITEM_UPDATE, result.error || 'Failed to update folder');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update folder';
      setError(ERROR_KEYS.ITEM_UPDATE, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateFile = async (id: string, name: string): Promise<UpdateResult> => {
    setLoading(true);
    clearError(ERROR_KEYS.ITEM_UPDATE);

    try {
      const fileService = getFileService();
      const result = await fileService.updateFileName(id, name);

      if (result.success && result.data) {
        // Refresh the folder contents to show the updated item
        await loadFolderContent();
        return { success: true, data: result.data as DataRoomItem };
      } else {
        setError(ERROR_KEYS.ITEM_UPDATE, result.error || 'Failed to update file');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update file';
      setError(ERROR_KEYS.ITEM_UPDATE, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateFolder,
    updateFile,
  };
};