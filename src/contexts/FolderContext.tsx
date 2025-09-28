import React, { createContext, useContext, useReducer, type Dispatch } from 'react';
import { folderReducer, initialFolderState, type FolderState, type FolderAction } from '../utils/reducers/folderReducer';

export const FolderStateContext = createContext<FolderState | undefined>(undefined);
export const FolderDispatchContext = createContext<Dispatch<FolderAction> | undefined>(undefined);

export const FolderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(folderReducer, initialFolderState);

  return (
    <FolderStateContext.Provider value={state}>
      <FolderDispatchContext.Provider value={dispatch}>
        {children}
      </FolderDispatchContext.Provider>
    </FolderStateContext.Provider>
  );
};

// Hook to use folder state
export const useFolderStateContext = () => {
  const context = useContext(FolderStateContext);
  if (!context) {
    throw new Error('useFolderState must be used within a FolderProvider');
  }
  return context;
};

// Hook to use folder dispatch
export const useFolderDispatchContext = () => {
  const context = useContext(FolderDispatchContext);
  if (!context) {
    throw new Error('useFolderDispatch must be used within a FolderProvider');
  }
  return context;
};