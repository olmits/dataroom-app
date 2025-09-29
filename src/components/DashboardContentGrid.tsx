import React, { useEffect, useState } from 'react';
import { Folder, ArrowLeft } from 'lucide-react';

import ContentGridItem from './ContentGridItem';
import { useLoadingStateContext } from '../contexts/LoadingContext';
import { useFolderStateContext } from '../contexts/FolderContext';
import useFolderActions from '../hooks/stateActionHooks/useFolderActions';
import { getFolderService } from '../data-room';
import type { DataRoomFolder, DataRoomItem, DataRoomFile } from '../types/dataroom';
import { useFilesStateContext } from '@/contexts/FilesContext';
import { useFolderCallbacks } from '@/hooks/useFolderCallbacks';

const DashboardContentGrid: React.FC = () => {
  const { isLoading } = useLoadingStateContext();
  const { folders, currentFolderId } = useFolderStateContext();
  const { files } = useFilesStateContext();

  const { loadFolderContent } = useFolderCallbacks();
  const { setCurrentFolder } = useFolderActions();

  const [currentFolderDetails, setCurrentFolderDetails] = useState<DataRoomFolder | null>(null);

  useEffect(() => {
    const loadCurrentFolderDetails = async () => {
      if (currentFolderId) {
        try {
          const folderService = getFolderService();
          const result = await folderService.getFolderById(currentFolderId);
          if (result) {
            setCurrentFolderDetails(result);
          }
        } catch (error) {
          console.error('Failed to load current folder details:', error);
          setCurrentFolderDetails(null);
        }
      } else {
        setCurrentFolderDetails(null);
      }
    };

    loadCurrentFolderDetails();
  }, [currentFolderId]);

  useEffect(() => {
    loadFolderContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderId]); 

  const handleItemClick = (item: DataRoomItem) => {
    if (item.type === 'folder') {
      const folder = item as DataRoomFolder;
      setCurrentFolder(folder.id);
    } else if (item.type === 'file') {
      const file = item as DataRoomFile;
      handleFileView(file);
    }
  };

  const handleFileView = (file: DataRoomFile) => {
    try {
      const byteCharacters = atob(file.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.mimeType });
      const url = URL.createObjectURL(blob);
      
      window.open(url, '_blank');
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Failed to open file:', error);
    }
  };

  const handleBackToParent = () => {
    if (currentFolderDetails?.parentId !== undefined) {
      setCurrentFolder(currentFolderDetails.parentId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentFolderDetails && (
        <div className="flex items-center">
          <button
            onClick={handleBackToParent}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to {currentFolderDetails.parentId ? 'Parent Folder' : 'Root'}
          </button>
        </div>
      )}

      {/* Content */}
      {(() => {
        const allItems: DataRoomItem[] = [...folders, ...files];
        
        if (allItems.length === 0) {
          return (
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-full text-center py-12">
                <Folder size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-2">No content yet</p>
                <p className="text-gray-500 mb-4">
                  {currentFolderDetails
                    ? `This folder is empty. Click "New Folder" above to add content.`
                    : `Click "New Folder" above to create your first folder and start organizing your documents`
                  }
                </p>
              </div>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {allItems.map((item) => (
              <ContentGridItem
                key={item.id}
                item={item}
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        );
      })()}
    </div>
  );
};

export default DashboardContentGrid;