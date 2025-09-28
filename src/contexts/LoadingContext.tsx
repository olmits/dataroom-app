import React, { createContext, useContext, useReducer, type Dispatch } from 'react';
import { loadingReducer, initialLoadingState, type LoadingState, type LoadingAction } from '../utils/reducers/loadingReducer';

export const LoadingStateContext = createContext<LoadingState | undefined>(undefined);
export const LoadingDispatchContext = createContext<Dispatch<LoadingAction> | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialLoadingState);

  return (
    <LoadingStateContext.Provider value={state}>
      <LoadingDispatchContext.Provider value={dispatch}>
        {children}
      </LoadingDispatchContext.Provider>
    </LoadingStateContext.Provider>
  );
};

export const useLoadingStateContext = () => {
  const context = useContext(LoadingStateContext);
  if (!context) {
    throw new Error('useLoadingState must be used within a LoadingProvider');
  }
  return context;
};

export const useLoadingDispatchContext = () => {
  const context = useContext(LoadingDispatchContext);
  if (!context) {
    throw new Error('useLoadingDispatch must be used within a LoadingProvider');
  }
  return context;
};