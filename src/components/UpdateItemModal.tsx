import React, { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';

import { useErrorStateContext } from '@/contexts/ErrorContext';
import useErrorActions from '@/hooks/stateActionHooks/useErrorActions';
import { ERROR_KEYS } from '@/utils/constants/errors';
import type { DataRoomItem } from '@/types/dataroom';

import Modal from './common/Modal';
import Button from './common/Button';
import Alert from './common/Alert';

interface UpdateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess?: (updatedItem: DataRoomItem) => void;
  item: DataRoomItem | null;
  isUpdating?: boolean;
}

const UpdateItemModal: React.FC<UpdateItemModalProps> = ({
  isOpen,
  onClose,
  onUpdateSuccess,
  item,
  isUpdating = false
}) => {
  const [newName, setNewName] = useState(item?.name || '');
  
  const { errors } = useErrorStateContext();  
  const { setError } = useErrorActions();
  const updateError = errors[ERROR_KEYS.ITEM_UPDATE];

  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen && item) {
      setNewName(item.name);
    }
  }, [isOpen, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item) return;
    
    const trimmedName = newName.trim();
    
    // Validation
    if (!trimmedName) {
      setError(ERROR_KEYS.ITEM_UPDATE, 'Name cannot be empty');
      return;
    }
    
    if (trimmedName === item.name) {
      // No change, just close
      onClose();
      return;
    }
    
    if (trimmedName.length > 100) {
      setError(ERROR_KEYS.ITEM_UPDATE, 'Name must be less than 100 characters');
      return;
    }
    
    // Create updated item with new name
    const updatedItem: DataRoomItem = {
      ...item,
      name: trimmedName,
      updatedAt: new Date()
    };
    
    // Let the parent handle the actual update through the callback
    onUpdateSuccess?.(updatedItem);
  };

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
    }
  };

  if (!item) return null;

  const itemType = item.type === 'folder' ? 'Folder' : 'File';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Rename ${itemType}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
            {itemType} Name
          </label>
          <input
            id="itemName"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={isUpdating}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            placeholder={`Enter ${itemType.toLowerCase()} name`}
            autoFocus
          />
        </div>
        {updateError && (
          <Alert 
            message={updateError.message} 
            type="error" 
          />
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isUpdating}
            isLoading={isUpdating}
            loadingText="Updating..."
            leftIcon={<Edit3 size={16} />}
          >
            Update {itemType}
          </Button>
          <Button
            type="button"
            onClick={handleClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateItemModal;