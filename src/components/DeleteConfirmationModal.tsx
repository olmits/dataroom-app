import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './common/Modal';
import Button from './common/Button';
import type { DataRoomItem } from '../types/dataroom';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: DataRoomItem | null;
  isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  isDeleting = false
}) => {
  if (!item) return null;

  const isFolder = item.type === 'folder';
  const itemType = isFolder ? 'folder' : 'file';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${itemType}`}>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="text-red-500" size={24} />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Are you sure you want to delete this {itemType}?
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              "{item.name}"
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">
            {isFolder 
              ? "This will permanently delete the folder and all its contents. This action cannot be undone."
              : "This will permanently delete the file. This action cannot be undone."
            }
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            isLoading={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Delete {itemType}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;