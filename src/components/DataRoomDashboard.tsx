import React, { useState } from 'react';

import NewFolderModal from './NewFolderModal';
import FileUploadModal from './FileUploadModal';
import DashboardHeader from './DashboardHeader';
import DashboardContentGrid from './DashboardContentGrid';
import DashboardAlertsContainer from './DashboardAlertsContainer';
import { useFolderCallbacks } from '@/hooks/useFolderCallbacks';

const DataRoomDashboard: React.FC = () => {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const { loadFolderContent } = useFolderCallbacks();

  const handleFolderCreated = () => {
    loadFolderContent(); // Refresh both folders and files
  };

  const handleFileUploaded = () => {
    loadFolderContent(); // Refresh both folders and files
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        onNewFolderClick={() => setIsFolderModalOpen(true)}
        onUploadFileClick={() => setIsFileModalOpen(true)}
      />
      <div className="container mx-auto px-4 py-8">
        <DashboardAlertsContainer />
        <DashboardContentGrid />
      </div>
      <NewFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onFolderCreated={handleFolderCreated}
      />
      <FileUploadModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onUploadSuccess={handleFileUploaded}
      />
    </div>
  );
};

export default DataRoomDashboard;