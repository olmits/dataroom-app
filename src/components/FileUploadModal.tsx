import { Upload, X } from 'lucide-react';
import Button from './common/Button';
import Modal from './common/Modal';
import Alert from './common/Alert';
import { useFileUpload } from '../hooks/useFileUpload';
import useErrorActions from '../hooks/stateActionHooks/useErrorActions';
import { useLoadingStateContext } from '../contexts/LoadingContext';
import { useErrorStateContext } from '../contexts/ErrorContext';
import { ERROR_KEYS } from '../utils/constants/errors';
import { formatFileSize } from '../utils/fileHelpers';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export default function FileUploadModal({ isOpen, onClose, onUploadSuccess }: FileUploadModalProps) {
  const { clearError } = useErrorActions();
  const { isLoading } = useLoadingStateContext();
  const { errors } = useErrorStateContext();

  const {
    selectedFile,
    dragOver,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleUpload: uploadFile,
    resetFileInput
  } = useFileUpload();

  const handleClose = () => {
    resetFileInput();
    clearError(ERROR_KEYS.FILE_UPLOAD);
    onClose();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const success = await uploadFile();
    if (success) {
      onUploadSuccess?.();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload File">
      <div className="space-y-6">
        {errors[ERROR_KEYS.FILE_UPLOAD] && (
          <Alert
            message={errors[ERROR_KEYS.FILE_UPLOAD]!.message}
            onClose={() => clearError(ERROR_KEYS.FILE_UPLOAD)}
            type="error"
          />
        )}

        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : selectedFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {selectedFile ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Upload size={32} className="text-green-600" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetFileInput();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload size={32} className="text-gray-400 mx-auto" />
              <p className="text-gray-600">Drop your PDF file here, or click to browse</p>
              <p className="text-xs text-gray-500">Maximum file size: 10MB</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            isLoading={isLoading}
          >
            Upload File
          </Button>
        </div>
      </div>
    </Modal>
  );
}