import type { DataRoomFile } from '../types/dataroom';
import { validateFolderName, checkDuplicateName } from '../utils/validation';
import { fileToBase64 } from '../utils/fileHelpers';
import type { IDataLayer } from './DataLayer';

export interface FileOperationResult {
  success: boolean;
  data?: DataRoomFile;
  error?: string;
}

export interface FileUploadResult {
  success: boolean;
  data?: DataRoomFile;
  error?: string;
}

export interface IFileService {
  uploadFile(file: File, parentId: string | null): Promise<FileUploadResult>;
  updateFileName(id: string, name: string): Promise<FileOperationResult>;
  deleteFile(id: string): Promise<{ success: boolean; error?: string }>;
  getFileById(id: string): Promise<DataRoomFile | null>;
  getFileContent(id: string): Promise<string | null>; // Returns base64 content
}

export class FileService implements IFileService {
  private readonly dataLayer: IDataLayer;

  constructor(dataLayer: IDataLayer) {
    this.dataLayer = dataLayer;
  }

  /**
   * Upload a file (PDF only for now)
   */
  async uploadFile(
    file: File,
    parentId: string | null
  ): Promise<FileUploadResult> {
    try {
      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        return { success: false, error: 'Only PDF files are supported' };
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return { success: false, error: 'File size must be less than 10MB' };
      }

      // Validate file name
      const nameValidation = validateFolderName(file.name);
      if (!nameValidation.isValid) {
        return { success: false, error: nameValidation.error };
      }

      // Check for duplicate names in the same folder
      const existingItems = await this.dataLayer.getItemsByParent(parentId);
      const duplicateValidation = checkDuplicateName(file.name, parentId, existingItems);
      if (!duplicateValidation.isValid) {
        return { success: false, error: duplicateValidation.error };
      }

      // Convert file to base64 for storage
      const base64Content = await fileToBase64(file);

      // Create file record
      const fileData: Omit<DataRoomFile, 'id' | 'createdAt' | 'updatedAt'> = {
        name: file.name,
        type: 'file',
        mimeType: file.type,
        size: file.size,
        content: base64Content,
        parentId,
      };
      
      const newFile = await this.dataLayer.createItem(fileData) as DataRoomFile;

      return { success: true, data: newFile };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file'
      };
    }
  }

  /**
   * Update file name
   */
  async updateFileName(
    id: string,
    name: string
  ): Promise<FileOperationResult> {
    try {
      const file = await this.getFileById(id);
      if (!file) {
        return { success: false, error: 'File not found' };
      }

      const nameValidation = validateFolderName(name);
      if (!nameValidation.isValid) {
        return { success: false, error: nameValidation.error };
      }

      // Check for duplicate names in the same folder
      const existingSiblings = await this.dataLayer.getItemsByParent(file.parentId);
      const duplicateValidation = checkDuplicateName(name, file.parentId, existingSiblings, id);
      if (!duplicateValidation.isValid) {
        return { success: false, error: duplicateValidation.error };
      }

      const updatedFile = await this.dataLayer.updateItem(id, {
        name: name.trim(),
      }) as DataRoomFile;

      return { success: true, data: updatedFile };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update file name'
      };
    }
  }

  /**
   * Delete file
   */
  async deleteFile(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const file = await this.getFileById(id);
      if (!file) {
        return { success: false, error: 'File not found' };
      }

      await this.dataLayer.deleteItem(id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file'
      };
    }
  }

  /**
   * Get file by ID
   */
  async getFileById(id: string): Promise<DataRoomFile | null> {
    try {
      const item = await this.dataLayer.getItemById(id);
      if (item && item.type === 'file') {
        return item as DataRoomFile;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get file content (base64)
   */
  async getFileContent(id: string): Promise<string | null> {
    try {
      const file = await this.getFileById(id);
      return file?.content || null;
    } catch {
      return null;
    }
  }


}