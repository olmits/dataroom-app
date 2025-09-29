import { useState } from 'react';
import { useItemDeletionCallbacks } from './useItemDeletionCallbacks';
import type { DataRoomItem } from '../types/dataroom';

interface UseContentItemProps {
  item: DataRoomItem;
  onItemClick: (item: DataRoomItem) => void;
  onItemDeleted?: (item: DataRoomItem) => void;
}

interface UseContentItemResult {
  // State
  deleteModalOpen: boolean;
  isDeleting: boolean;
  
  // Handlers
  handleClick: () => void;
  handleDeleteClick: (e: React.MouseEvent) => void;
  handleDeleteConfirm: () => Promise<void>;
  handleDeleteModalClose: () => void;
}

export const useContentItem = ({
  item,
  onItemClick,
  onItemDeleted
}: UseContentItemProps): UseContentItemResult => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteFolder, deleteFile } = useItemDeletionCallbacks();

  const handleClick = () => {
    onItemClick(item);
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
        onItemDeleted?.(item);
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

  return {
    // State
    deleteModalOpen,
    isDeleting,
    
    // Handlers
    handleClick,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteModalClose,
  };
};