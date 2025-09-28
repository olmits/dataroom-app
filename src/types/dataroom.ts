export interface DataRoomFile {
  id: string;
  name: string;
  type: 'file';
  mimeType: string;
  size: number;
  content: string; // Base64 or blob URL for mock storage
  createdAt: Date;
  updatedAt: Date;
  parentId: string | null;
}

export interface DataRoomFolder {
  id: string;
  name: string;
  type: 'folder';
  createdAt: Date;
  updatedAt: Date;
  parentId: string | null;
}

export type DataRoomItem = DataRoomFile | DataRoomFolder;