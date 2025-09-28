import { dataLayer } from './services/DataLayer';
import { FolderService } from './services/FolderService';

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

// export { dataLayer } from './services/DataLayer';
// export { FolderService } from './services/FolderService';

// Service instances - initialized after dataLayer initialization
let _folderService: FolderService | null = null;

export const getFolderService = (): FolderService => {
  if (!_folderService) {
    throw new Error('Services not initialized. Call initializeServices() first.');
  }
  return _folderService;
};

export const initializeServices = (): void => {
  _folderService = new FolderService(dataLayer);
};