import { dataLayer } from './services/DataLayer';
import { FolderService } from './services/FolderService';
import { FileService } from './services/FileService';

/**
 * Initialize the application's data layer and services
 */
export async function initializeDataLayer(): Promise<void> {
  try {
    await dataLayer.initialize();
    initializeServices();
    console.log('DataLayer and services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize DataLayer:', error);
    throw error;
  }
}

// Service instances - initialized after dataLayer initialization
let _folderService: FolderService | null = null;
let _fileService: FileService | null = null;

export const getFolderService = (): FolderService => {
  if (!_folderService) {
    throw new Error('Services not initialized. Call initializeServices() first.');
  }
  return _folderService;
};

export const getFileService = (): FileService => {
  if (!_fileService) {
    throw new Error('Services not initialized. Call initializeServices() first.');
  }
  return _fileService;
};

export const initializeServices = (): void => {
  _folderService = new FolderService(dataLayer);
  _fileService = new FileService(dataLayer);
};