import React from 'react';
import { LoadingProvider } from './LoadingContext';
import { ErrorProvider } from './ErrorContext';
import { FolderProvider } from './FolderContext';
import { FilesProvider } from './FilesContext';

export const DataRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LoadingProvider>
      <ErrorProvider>
        <FolderProvider>
          <FilesProvider>
            {children}
          </FilesProvider>
        </FolderProvider>
      </ErrorProvider>
    </LoadingProvider>
  );
};