import React, { useState } from 'react';
import { getFolderService } from '../data-room';
import useLoadingActions from '../hooks/stateActionHooks/useLoadingActions';
import useErrorActions from '../hooks/stateActionHooks/useErrorActions';
import Modal from './common/Modal';
import Button from './common/Button';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderCreated: () => void;
}

const NewFolderModal: React.FC<NewFolderModalProps> = ({ isOpen, onClose, onFolderCreated }) => {
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { setLoading } = useLoadingActions();
  const { setError, clearError } = useErrorActions();

  const handleCreate = async () => {
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    setIsCreating(true);
    setLoading(true);
    clearError();

    try {
      const folderService = getFolderService();
      const result = await folderService.createFolder(folderName.trim(), null);

      if (result.success) {
        setFolderName('');
        onClose();
        onFolderCreated();
      } else {
        setError(result.error || 'Failed to create folder');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create folder';
      setError(errorMessage);
    } finally {
      setIsCreating(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFolderName('');
    clearError();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="New Folder">
      <div className="mb-4">
        <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-2">
          Folder Name
        </label>
        <input
          id="folderName"
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isCreating}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreate();
            } else if (e.key === 'Escape') {
              handleCancel();
            }
          }}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleCancel}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          isLoading={isCreating}
          loadingText="Creating..."
        >
          Create
        </Button>
      </div>
    </Modal>
  );
};

export default NewFolderModal;