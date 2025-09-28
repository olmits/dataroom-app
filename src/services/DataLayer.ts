import type { DataRoomItem } from '../types/dataroom';

const DB_NAME = 'DataRoomDB';
const DB_VERSION = 1;
const STORE_NAME = 'items';

export interface IDataLayer {
  initialize(): Promise<void>;
  getAllItems(): Promise<DataRoomItem[]>;
  getItemById(id: string): Promise<DataRoomItem | undefined>;
  getItemsByParent(parentId: string | null): Promise<DataRoomItem[]>;
  createItem(item: Omit<DataRoomItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataRoomItem>;
  updateItem(id: string, updates: Partial<Omit<DataRoomItem, 'id' | 'createdAt'>>): Promise<DataRoomItem>;
  deleteItem(id: string): Promise<void>;
  deleteItemsInParent(parentId: string): Promise<void>;
}

export class IndexedDBDataLayer implements IDataLayer {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          
          store.createIndex('parentId', 'parentId', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('name', 'name', { unique: false });
        }
      };
    });
  }

  async getAllItems(): Promise<DataRoomItem[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        // Convert date strings back to Date objects
        const items = request.result.map((item: DataRoomItem) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        resolve(items);
      };

      request.onerror = () => {
        reject(new Error('Failed to get all items'));
      };
    });
  }

  async getItemById(id: string): Promise<DataRoomItem | undefined> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const item = request.result;
        if (item) {
          resolve({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          });
        } else {
          resolve(undefined);
        }
      };

      request.onerror = () => {
        reject(new Error(`Failed to get item with id: ${id}`));
      };
    });
  }

  async getItemsByParent(parentId: string | null): Promise<DataRoomItem[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('parentId');
      const request = index.getAll(parentId);

      request.onsuccess = () => {
        const items = request.result.map((item: DataRoomItem) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        resolve(items);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get items for parent: ${parentId}`));
      };
    });
  }

  async createItem(itemData: Omit<DataRoomItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataRoomItem> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const now = new Date();
    const item = {
      ...itemData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    } as DataRoomItem;

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.add(item);

      request.onsuccess = () => {
        resolve(item);
      };

      request.onerror = () => {
        reject(new Error('Failed to create item'));
      };
    });
  }

  async updateItem(id: string, updates: Partial<Omit<DataRoomItem, 'id' | 'createdAt'>>): Promise<DataRoomItem> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const existingItem = await this.getItemById(id);
    if (!existingItem) {
      throw new Error(`Item with id ${id} not found`);
    }

    const updatedItem = {
      ...existingItem,
      ...updates,
      id,
      createdAt: existingItem.createdAt,
      updatedAt: new Date(),
    } as DataRoomItem;

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(updatedItem);

      request.onsuccess = () => {
        resolve(updatedItem);
      };

      request.onerror = () => {
        reject(new Error(`Failed to update item with id: ${id}`));
      };
    });
  }

  async deleteItem(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete item with id: ${id}`));
      };
    });
  }

  async deleteItemsInParent(parentId: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const items = await this.getItemsByParent(parentId);
    
    const deletePromises = items.map(item => this.deleteItem(item.id));
    await Promise.all(deletePromises);
  }
}

export const dataLayer = new IndexedDBDataLayer();