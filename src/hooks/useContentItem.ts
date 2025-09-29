import { useState } from 'react';

import { openFileInNewTab } from '@/utils/fileHelpers';
import type { DataRoomFile, DataRoomFolder, DataRoomItem } from '@/types/dataroom';

import { useItemDeletionCallbacks } from './useItemDeletionCallbacks';
import { useItemUpdateCallbacks } from './useItemUpdateCallbacks';
import useFolderActions from './stateActionHooks/useFolderActions';

interface UseContentItemResult {
  // State
  deleteModalOpen: boolean;
  isDeleting: boolean;
  updateModalOpen: boolean;
  isUpdating: boolean;
  
  // Handlers
  handleClick: () => void;
  handleDeleteClick: (e: React.MouseEvent) => void;
  handleDeleteConfirm: () => Promise<void>;
  handleDeleteModalClose: () => void;
  handleUpdateClick: (e: React.MouseEvent) => void;
  handleUpdateModalClose: () => void;
  handleUpdateSuccess: (updatedItem: DataRoomItem) => void;
}

export const useContentItem = (item: DataRoomItem): UseContentItemResult => {
  const { setCurrentFolder } = useFolderActions();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { deleteFolder, deleteFile } = useItemDeletionCallbacks();
  const { updateFolder, updateFile } = useItemUpdateCallbacks();

  const handleClick = () => {
    if (item.type === 'folder') {
      const folder = item as DataRoomFolder;
      setCurrentFolder(folder.id);
    } else if (item.type === 'file') {
      const file = item as DataRoomFile;
      openFileInNewTab(file);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleting) {
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    
    try {
      let result;
      if (item.type === 'folder') {
        result = await deleteFolder(item.id);
      } else {
        result = await deleteFile(item.id);
      }

      if (result.success) {
        setDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleUpdateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleting && !isUpdating) {
      setUpdateModalOpen(true);
    }
  };

  const handleUpdateModalClose = () => {
    if (!isUpdating) {
      setUpdateModalOpen(false);
    }
  };

  const handleUpdateSuccess = async (updatedItem: DataRoomItem) => {
    setIsUpdating(true);
    
    try {
      let result;
      if (updatedItem.type === 'folder') {
        result = await updateFolder(updatedItem.id, updatedItem.name);
      } else {
        result = await updateFile(updatedItem.id, updatedItem.name);
      }

      if (result.success) {
        setUpdateModalOpen(false);
      }
      // Error handling is done in the update callbacks through error context
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    // State
    deleteModalOpen,
    isDeleting,
    updateModalOpen,
    isUpdating,
    
    // Handlers
    handleClick,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteModalClose,
    handleUpdateClick,
    handleUpdateModalClose,
    handleUpdateSuccess,
  };
};