import React, { useState } from 'react';
import { useFolderStateContext } from '../contexts/FolderContext';
import { useFolderCallbacks } from '../hooks/useFolderCallbacks';
import useErrorActions from '../hooks/stateActionHooks/useErrorActions';
import { ERROR_KEYS } from '../utils/constants/errors';
import Modal from './common/Modal';
import Button from './common/Button';
import { useErrorStateContext } from '@/contexts/ErrorContext';
import Alert from './common/Alert';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderCreated: () => void;
}

const NewFolderModal: React.FC<NewFolderModalProps> = ({ isOpen, onClose, onFolderCreated }) => {
  const [folderName, setFolderName] = useState('');

  const { errors } = useErrorStateContext();
  const errorMessage = errors?.[ERROR_KEYS.FOLDER_CREATION]?.message;
  const { isCreating } = useFolderStateContext();
  const { createFolder } = useFolderCallbacks();
  const { clearError } = useErrorActions();

  const handleCreate = async () => {
    const result = await createFolder(folderName.trim());
    
    if (result.success) {
      setFolderName('');
      onClose();
      onFolderCreated();
    }
  };

  const handleCancel = () => {
    setFolderName('');
    clearError(ERROR_KEYS.FOLDER_CREATION);
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
      {errorMessage && <Alert message={errorMessage} />}

      <div className="flex justify-end gap-3">
        <Button onClick={handleCancel} disabled={isCreating}>
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