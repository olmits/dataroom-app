import type { DataRoomFolder, DataRoomItem } from '../types/dataroom';
import { validateFolderName, checkDuplicateName } from '../utils/validation';
import type { IDataLayer } from './DataLayer';

export interface FolderOperationResult {
  success: boolean;
  data?: DataRoomFolder | DataRoomFolder[];
  error?: string;
}

export interface FolderContentsResult {
  success: boolean;
  data?: {
    folders: DataRoomFolder[];
    files: DataRoomItem[];
    totalItems: number;
  };
  error?: string;
}



export interface IFolderService {
  createFolder(name: string, parentId: string | null): Promise<FolderOperationResult>;
  updateFolder(id: string, name: string): Promise<FolderOperationResult>;
  deleteFolder(id: string): Promise<{ success: boolean; deletedIds: string[]; error?: string }>;
  
  getFolderContents(folderId: string | null): Promise<FolderContentsResult>;
  getFolderById(id: string): Promise<DataRoomFolder | null>;
}

export class FolderService implements IFolderService {
  private readonly dataLayer: IDataLayer;

  constructor(dataLayer: IDataLayer) {
    this.dataLayer = dataLayer;
  }
  
  /**
   * Create a new folder
   */
  async createFolder(
    name: string, 
    parentId: string | null
  ): Promise<FolderOperationResult> {
    try {
      const nameValidation = validateFolderName(name);
      if (!nameValidation.isValid) {
        return { success: false, error: nameValidation.error };
      }

      const existingItems = await this.dataLayer.getItemsByParent(parentId);
      const duplicateValidation = checkDuplicateName(name, parentId, existingItems);
      if (!duplicateValidation.isValid) {
        return { success: false, error: duplicateValidation.error };
      }

      if (parentId) {
        const parentFolder = await this.getFolderById(parentId);
        if (!parentFolder) {
          return { success: false, error: 'Parent folder not found' };
        }
      }

      const newFolder = await this.dataLayer.createItem({
        name: name.trim(),
        type: 'folder',
        parentId,
      }) as DataRoomFolder;

      return { success: true, data: newFolder };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create folder' 
      };
    }
  }

  /**
   * Update folder name
   */
  async updateFolder(
    id: string, 
    name: string
  ): Promise<FolderOperationResult> {
    try {
      const folder = await this.getFolderById(id);
      if (!folder) {
        return { success: false, error: 'Folder not found' };
      }

      const nameValidation = validateFolderName(name);
      if (!nameValidation.isValid) {
        return { success: false, error: nameValidation.error };
      }

      const existingSiblings = await this.dataLayer.getItemsByParent(folder.parentId);
      const duplicateValidation = checkDuplicateName(name, folder.parentId, existingSiblings, id);
      if (!duplicateValidation.isValid) {
        return { success: false, error: duplicateValidation.error };
      }

      const updatedFolder = await this.dataLayer.updateItem(id, {
        name: name.trim(),
      }) as DataRoomFolder;

      return { success: true, data: updatedFolder };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update folder' 
      };
    }
  }

  /**
   * Delete folder and all its descendants
   */
  async deleteFolder(
    id: string
  ): Promise<{ success: boolean; deletedIds: string[]; error?: string }> {
    try {
      const folder = await this.getFolderById(id);
      if (!folder) {
        return { success: false, deletedIds: [], error: 'Folder not found' };
      }

      const descendantIds = await this.getFolderDescendants(id);

      for (const descendantId of descendantIds) {
        await this.dataLayer.deleteItem(descendantId);
      }

      return { success: true, deletedIds: descendantIds };
    } catch (error) {
      return { 
        success: false, 
        deletedIds: [],
        error: error instanceof Error ? error.message : 'Failed to delete folder' 
      };
    }
  }

  /**
   * Get folder contents (immediate children only)
   */
  async getFolderContents(
    folderId: string | null
  ): Promise<FolderContentsResult> {
    try {
      const children = await this.dataLayer.getItemsByParent(folderId);
      
      const folders = children.filter((item: DataRoomItem) => item.type === 'folder') as DataRoomFolder[];
      const files = children.filter((item: DataRoomItem) => item.type === 'file');

      folders.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      files.sort((a: DataRoomItem, b: DataRoomItem) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

      return {
        success: true,
        data: {
          folders,
          files,
          totalItems: children.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get folder contents'
      };
    }
  }



  /**
   * Get folder by ID
   */
  async getFolderById(id: string): Promise<DataRoomFolder | null> {
    try {
      const item = await this.dataLayer.getItemById(id);
      if (item && item.type === 'folder') {
        return item as DataRoomFolder;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get all descendants of a folder (recursive) - Private method
   */
  private async getFolderDescendants(folderId: string): Promise<string[]> {
    const descendants: string[] = [];
    const stack = [folderId];

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      descendants.push(currentId);

      // Find all direct children
      const children = await this.dataLayer.getItemsByParent(currentId);
      stack.push(...children.map((child: DataRoomItem) => child.id));
    }

    return descendants;
  }




}
