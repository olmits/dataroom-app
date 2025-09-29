import React, { useState, useEffect } from 'react';
import { Folder } from 'lucide-react';
import NewFolderModal from './NewFolderModal';
import DashboardHeader from './DashboardHeader';
import Alert from './common/Alert';
import useErrorActions from '../hooks/stateActionHooks/useErrorActions';
import { useLoadingStateContext } from '../contexts/LoadingContext';
import { useErrorStateContext } from '../contexts/ErrorContext';
import { useFolderStateContext } from '../contexts/FolderContext';
import { useFolderCallbacks } from '../hooks/useFolderCallbacks';
import { ERROR_KEYS } from '../utils/constants/errors';

const DataRoomDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clearError } = useErrorActions();
  const { isLoading } = useLoadingStateContext();
  const { errors } = useErrorStateContext();
  const { folders } = useFolderStateContext();
  const { loadFolders } = useFolderCallbacks();

  useEffect(() => {
    loadFolders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFolderCreated = () => {
    loadFolders(); // Refresh the folder list
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onNewFolderClick={() => setIsModalOpen(true)} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {errors[ERROR_KEYS.FOLDER_LOADING] && (
          <Alert 
            message={errors[ERROR_KEYS.FOLDER_LOADING]!.message}
            onClose={() => clearError(ERROR_KEYS.FOLDER_LOADING)}
            type="error"
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Folders Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {folders.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Folder size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-2">No folders yet</p>
                <p className="text-gray-500 mb-4">Click "New Folder" above to create your first folder and start organizing your documents</p>
              </div>
            ) : (
              folders.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer group"
                >
                  <div className="flex flex-col items-center text-center">
                    <Folder 
                      size={48} 
                      className="text-blue-500 group-hover:text-blue-600 transition-colors mb-3" 
                    />
                    <h3 className="font-medium text-gray-900 truncate w-full" title={folder.name}>
                      {folder.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Created {new Date(folder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      <NewFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFolderCreated={handleFolderCreated}
      />
    </div>
  );
};

export default DataRoomDashboard;