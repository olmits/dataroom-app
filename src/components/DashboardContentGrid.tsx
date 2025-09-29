import React, { useEffect, useState } from 'react';
import { Folder, ArrowLeft } from 'lucide-react';
import { useLoadingStateContext } from '../contexts/LoadingContext';
import { useFolderStateContext } from '../contexts/FolderContext';
import { useFolderCallbacks } from '../hooks/useFolderCallbacks';
import useFolderActions from '../hooks/stateActionHooks/useFolderActions';
import { getFolderService } from '../data-room';
import type { DataRoomFolder } from '../types/dataroom';

const DashboardContentGrid: React.FC = () => {
  const { isLoading } = useLoadingStateContext();
  const { folders, currentFolderId } = useFolderStateContext();
  const { loadFolders } = useFolderCallbacks();
  const { setCurrentFolder } = useFolderActions();

  const [currentFolder, setCurrentFolderDetails] = useState<DataRoomFolder | null>(null);

  // Load current folder details when currentFolderId changes
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
    loadFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderId]); 

  // Handle folder click - navigate into folder
  const handleFolderClick = (folder: DataRoomFolder) => {
    setCurrentFolder(folder.id);
  };

  // Handle back to parent folder
  const handleBackToParent = () => {
    if (currentFolder?.parentId !== undefined) {
      setCurrentFolder(currentFolder.parentId);
    }
  };

  // Show loading state
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
      {/* Parent folder navigation - show when inside a folder */}
      {currentFolder && (
        <div className="flex items-center">
          <button
            onClick={handleBackToParent}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to {currentFolder.parentId ? 'Parent Folder' : 'Root'}
          </button>
        </div>
      )}

      {/* Empty state */}
      {folders.length === 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-full text-center py-12">
            <Folder size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">No content yet</p>
            <p className="text-gray-500 mb-4">
              {currentFolder 
                ? `This folder is empty. Click "New Folder" above to add content.`
                : `Click "New Folder" above to create your first folder and start organizing your documents`
              }
            </p>
          </div>
        </div>
      ) : (
        /* Content grid (folders and files) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer group"
              onClick={() => handleFolderClick(folder)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardContentGrid;