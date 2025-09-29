import React from 'react';
import { Folder, FileText, Trash2 } from 'lucide-react';
import { formatFileSize } from '../utils/fileHelpers';
import { useContentItem } from '../hooks/useContentItem';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import type { DataRoomItem, DataRoomFile } from '../types/dataroom';
import Button from './common/Button';

interface ContentGridItemProps {
  item: DataRoomItem;
  onItemClick: (item: DataRoomItem) => void;
  onItemDeleted?: (item: DataRoomItem) => void;
}

const ContentGridItem: React.FC<ContentGridItemProps> = ({ 
  item, 
  onItemClick,
  onItemDeleted
}) => {
  const isFolder = item.type === 'folder';
  const file = item as DataRoomFile;
  
  const {
    deleteModalOpen,
    isDeleting,
    handleClick,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteModalClose,
  } = useContentItem({ item, onItemClick, onItemDeleted });

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer group relative ${
          isDeleting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleClick}
      >
        {!isDeleting && (
          <Button
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={16} />
          </Button>
        )}

        {isDeleting && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          </div>
        )}


        <div className="flex flex-col items-center text-center">
          {isFolder ? (
            <Folder 
              size={48} 
              className="text-blue-500 group-hover:text-blue-600 transition-colors mb-3" 
            />
          ) : (
            <FileText 
              size={48} 
              className="text-red-500 group-hover:text-red-600 transition-colors mb-3" 
            />
          )}

          <h3 className="font-medium text-gray-900 truncate w-full mb-2">
            {item.name}
          </h3>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Created {new Date(item.createdAt).toLocaleDateString()}</p>
            {!isFolder && (
              <>
                <p>{formatFileSize(file.size)}</p>
                <p className="uppercase">{file.mimeType.split('/')[1] || 'PDF'}</p>
              </>
            )}
          </div>
        </div>
      
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        item={item}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ContentGridItem;