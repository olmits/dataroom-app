import React from 'react';
import { LoadingProvider } from './LoadingContext';
import { ErrorProvider } from './ErrorContext';
import { FolderProvider } from './FolderContext';
import { ItemsProvider } from './ItemsContext';

export const DataRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LoadingProvider>
      <ErrorProvider>
        <FolderProvider>
          <ItemsProvider>
            {children}
          </ItemsProvider>
        </FolderProvider>
      </ErrorProvider>
    </LoadingProvider>
  );
};