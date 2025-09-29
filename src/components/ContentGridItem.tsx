import React from 'react';
import { Folder, FileText } from 'lucide-react';
import { formatFileSize } from '../utils/fileHelpers';
import type { DataRoomItem, DataRoomFile } from '../types/dataroom';

interface ContentGridItemProps {
  item: DataRoomItem;
  onItemClick: (item: DataRoomItem) => void;
}

const ContentGridItem: React.FC<ContentGridItemProps> = ({ 
  item, 
  onItemClick
}) => {
  const isFolder = item.type === 'folder';
  const file = item as DataRoomFile;

  const handleClick = () => {
    onItemClick(item);
  };



  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer group relative"
      onClick={handleClick}
    >


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
  );
};

export default ContentGridItem;