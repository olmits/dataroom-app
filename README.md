# 📁 Data Room Application

A simple document management app for organizing and managing PDF files in folders.

## 🎯 Application Overview

The Data Room application is designed to provide a secure and intuitive way to manage documents in a virtual data room environment. Users can:

- **📂 Organize Documents**: Create nested folder structures
- **📄 Upload Files**: Drag-and-drop or click to upload PDF documents with validation
- **👁️ View Documents**: Click on files to open them in a new browser tab for viewing
- **✏️ Rename Items**: Rename both folders and files with duplicate detection
- **🗑️ Delete Items**: Remove folders and files with confirmation dialogs
- **🧭 Navigate**: Browse through folder hierarchies

The application emphasizes security, user experience, and data persistence through browser-based storage.

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 19.1.1** - Component-based UI library with latest features
- **TypeScript ~5.8.3** - Type-safe JavaScript with enhanced developer experience
- **Vite 7.1.7** - Fast build tool and development server

### **Styling & UI**
- **Tailwind CSS 4.1.13** - Utility-first CSS framework for responsive design
- **Lucide React 0.544.0** - Beautiful, customizable SVG icons
- **Class Variance Authority** - Utility for managing conditional CSS classes

### **State Management**
- **React Context API** - Built-in React state management solution
- **useReducer Pattern** - Predictable state updates with reducer functions
- **Custom Hooks** - Reusable stateful logic encapsulation

### **Development Tools**
- **ESLint 9.36.0** - Code linting and formatting
- **TypeScript Config** - Strict type checking configuration
- **Vite Plugins** - React Fast Refresh and TypeScript support

## 📁 Project Structure

```
src/
├── components/           # React UI components
│   ├── common/          # Reusable UI components (Button, Modal, Alert)
│   ├── ContentGridItem.tsx    # Individual file/folder display
│   ├── DashboardContentGrid.tsx  # Main content grid layout
│   ├── DashboardHeader.tsx      # Application header with actions
│   ├── DataRoomDashboard.tsx    # Main dashboard component
│   ├── DeleteConfirmationModal.tsx  # Delete confirmation dialog
│   ├── FileUploadModal.tsx     # File upload interface
│   ├── NewFolderModal.tsx      # Folder creation dialog
│   └── UpdateItemModal.tsx     # Item renaming interface
│
├── contexts/            # React Context providers
│   ├── ErrorContext.tsx        # Global error state management
│   ├── FilesContext.tsx        # Files state and operations
│   ├── FolderContext.tsx       # Folders state and navigation
│   └── LoadingContext.tsx      # Loading states management
│
├── hooks/               # Custom React hooks
│   ├── stateActionHooks/       # Context action hooks
│   ├── useContentItem.ts       # Item interaction logic
│   ├── useFileUpload.ts        # File upload functionality
│   ├── useFolderCallbacks.ts   # Folder operations
│   ├── useItemDeletionCallbacks.ts  # Deletion operations
│   └── useItemUpdateCallbacks.ts    # Update operations
│
├── services/            # Business logic layer
│   ├── DataLayer.ts            # IndexedDB data persistence
│   ├── FileService.ts          # File operations and validation
│   └── FolderService.ts        # Folder operations and validation
│
├── types/               # TypeScript type definitions
│   └── dataroom.ts             # Core data types and interfaces
│
├── utils/               # Utility functions and constants
│   ├── constants/              # Application constants
│   ├── reducers/               # State reducer functions
│   ├── fileHelpers.ts          # File manipulation utilities
│   └── validation.ts           # Input validation helpers
│
└── data-room.ts         # Service factory and dependency injection
```

## 🏗️ Architecture Overview

### **State Management with Context API**

The application uses React's Context API for state management, providing a clean and scalable approach:

- **FolderContext**: Manages current folder navigation and folder hierarchy
- **FilesContext**: Handles file state and operations within folders
- **LoadingContext**: Centralized loading state management across components  
- **ErrorContext**: Global error handling with categorized error keys

Each context follows the provider/consumer pattern with custom hooks for easy access to state and actions.

### **Service Layer Architecture**

#### **DataLayer Service**
Handles data storage using IndexedDB - stores files and folders locally in the browser.

```typescript
interface IDataLayer {
  createItem(item: Omit<DataRoomItem, 'id'>): Promise<DataRoomItem>;
  updateItem(id: string, updates: Partial<DataRoomItem>): Promise<DataRoomItem>;
  deleteItem(id: string): Promise<void>;
  getItemsByParent(parentId: string | null): Promise<DataRoomItem[]>;
}
```

#### **FolderService**
Handles all folder-related business logic:

- **Folder Creation**: Validates names and prevents duplicates
- **Folder Updates**: Rename validation with sibling duplicate checking
- **Folder Deletion**: Cascading deletion of all nested content
- **Hierarchy Management**: Parent-child relationship maintenance
- **Content Loading**: Retrieves folder contents with files and subfolders

#### **FileService**  
Manages file operations and validation:

- **File Upload**: PDF validation, size limits (10MB), and base64 encoding
- **File Updates**: Rename operations with validation
- **File Deletion**: Safe removal with cleanup
- **File Viewing**: Base64 to blob conversion for browser viewing
- **MIME Type Handling**: PDF-specific processing and validation

### **Dependency Injection Pattern**

The application uses dependency injection for service instantiation:

```typescript
// data-room.ts - Service Setup
const dataLayer = new DataLayer();
const folderService = new FolderService(dataLayer);
const fileService = new FileService(dataLayer);

export const getFolderService = () => folderService;
export const getFileService = () => fileService;
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dataroom-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### **Available Scripts**

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint code analysis
- `npm run preview` - Preview production build locally

