import React from 'react';
import { Plus, Upload } from 'lucide-react';
import { useLoadingStateContext } from '@/contexts/LoadingContext';
import Button from './common/Button';

interface DashboardHeaderProps {
  onNewFolderClick: () => void;
  onUploadFileClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onNewFolderClick, onUploadFileClick }) => {
  const { isLoading } = useLoadingStateContext();
    
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Data Room</h1>
          <div className="flex gap-3">
            <Button
              onClick={onUploadFileClick}
              disabled={isLoading}
              leftIcon={<Upload size={20} />}
              className="border border-gray-300 bg-white hover:bg-gray-50"
            >
              Upload File
            </Button>
            <Button
              onClick={onNewFolderClick}
              disabled={isLoading}
              leftIcon={<Plus size={20} />}
            >
              New Folder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;