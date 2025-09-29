import React, { useState } from 'react';
import NewFolderModal from './NewFolderModal';
import DashboardHeader from './DashboardHeader';
import DashboardContentGrid from './DashboardContentGrid';
import Alert from './common/Alert';
import useErrorActions from '../hooks/stateActionHooks/useErrorActions';
import { useErrorStateContext } from '../contexts/ErrorContext';
import { useFolderCallbacks } from '../hooks/useFolderCallbacks';
import { ERROR_KEYS } from '../utils/constants/errors';

const DataRoomDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { clearError } = useErrorActions();
  const { errors } = useErrorStateContext();
  const { loadFolders } = useFolderCallbacks();

  const handleFolderCreated = () => {
    loadFolders(); // Refresh the folder list
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onNewFolderClick={() => setIsModalOpen(true)} />
      <div className="container mx-auto px-4 py-8">
        {errors[ERROR_KEYS.FOLDER_LOADING] && (
          <Alert 
            message={errors[ERROR_KEYS.FOLDER_LOADING]!.message}
            onClose={() => clearError(ERROR_KEYS.FOLDER_LOADING)}
            type="error"
          />
        )}
        <DashboardContentGrid />
      </div>
      <NewFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFolderCreated={handleFolderCreated}
      />
    </div>
  );
};

export default DataRoomDashboard;