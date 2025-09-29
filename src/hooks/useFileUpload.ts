import { useRef, useState } from 'react';
import { getFileService } from '../data-room';
import { useFolderStateContext } from '../contexts/FolderContext';
import useErrorActions from './stateActionHooks/useErrorActions';
import useLoadingActions from './stateActionHooks/useLoadingActions';
import { ERROR_KEYS } from '../utils/constants/errors';
import { isValidFileType, isValidFileSize } from '../utils/fileHelpers';

interface UseFileUploadResult {
  // State
  selectedFile: File | null;
  dragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  
  // Actions
  handleFileSelect: (file: File) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => Promise<boolean>; // Returns success status
  resetFileInput: () => void;
}

export const useFileUpload = (): UseFileUploadResult => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { currentFolderId } = useFolderStateContext();
  const { setLoading } = useLoadingActions();
  const { setError, clearError } = useErrorActions();

  const errorKey = ERROR_KEYS.FILE_UPLOAD;

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!isValidFileType(file)) {
      setError(errorKey, 'Only PDF files are supported');
      return;
    }

    // Validate file size (10MB max)
    if (!isValidFileSize(file, 10)) {
      setError(errorKey, 'File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    clearError(errorKey);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async (): Promise<boolean> => {
    if (!selectedFile) return false;

    setLoading(true);
    clearError(errorKey);

    try {
      const fileService = getFileService();
      const result = await fileService.uploadFile(selectedFile, currentFolderId);

      if (result.success) {
        resetFileInput();
        return true;
      } else {
        setError(errorKey, result.error || 'Failed to upload file');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      setError(errorKey, errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetFileInput = () => {
    setSelectedFile(null);
    clearError(errorKey);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    // State
    selectedFile,
    dragOver,
    fileInputRef,
    
    // Actions
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInputChange,
    handleUpload,
    resetFileInput,
  };
};