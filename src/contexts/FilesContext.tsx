import React, { createContext, useContext, useReducer, type Dispatch } from 'react';
import { filesReducer, initialFilesState, type FilesState, type FilesAction } from '../utils/reducers/filesReducer';

export const FilesStateContext = createContext<FilesState | undefined>(undefined);
export const FilesDispatchContext = createContext<Dispatch<FilesAction> | undefined>(undefined);

export const FilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(filesReducer, initialFilesState);

  return (
    <FilesStateContext.Provider value={state}>
      <FilesDispatchContext.Provider value={dispatch}>
        {children}
      </FilesDispatchContext.Provider>
    </FilesStateContext.Provider>
  );
};

export const useFilesStateContext = () => {
  const context = useContext(FilesStateContext);
  if (!context) {
    throw new Error('useFilesState must be used within a FilesProvider');
  }
  return context;
};

export const useFilesDispatchContext = () => {
  const context = useContext(FilesDispatchContext);
  if (!context) {
    throw new Error('useFilesDispatch must be used within a FilesProvider');
  }
  return context;
};