import type { DataRoomItem } from '../types/dataroom';

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// File name validation
export const validateFileName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'File name cannot be empty' };
  }
  
  if (name.length > 255) {
    return { isValid: false, error: 'File name cannot exceed 255 characters' };
  }
  
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return { isValid: false, error: 'File name contains invalid characters' };
  }
  
  return { isValid: true };
};

// Folder name validation
export const validateFolderName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Folder name cannot be empty' };
  }
  
  if (name.length > 255) {
    return { isValid: false, error: 'Folder name cannot exceed 255 characters' };
  }
  
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return { isValid: false, error: 'Folder name contains invalid characters' };
  }
  
  return { isValid: true };
};

// Duplicate name validation
export const checkDuplicateName = (
  name: string, 
  parentId: string | null, 
  items: DataRoomItem[],
  excludeId?: string
): ValidationResult => {
  const siblings = items.filter(item => 
    item.parentId === parentId && item.id !== excludeId
  );
  
  const duplicate = siblings.find(item => 
    item.name.toLowerCase() === name.toLowerCase()
  );
  
  if (duplicate) {
    return { 
      isValid: false, 
      error: `An item with the name "${name}" already exists in this location` 
    };
  }
  
  return { isValid: true };
};