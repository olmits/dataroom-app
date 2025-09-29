import React, { createContext, useContext, useReducer, type Dispatch } from 'react';
import { errorReducer, initialErrorState, type ErrorState, type ErrorAction } from '../utils/reducers/errorReducer';

export const ErrorStateContext = createContext<ErrorState | undefined>(undefined);
export const ErrorDispatchContext = createContext<Dispatch<ErrorAction> | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer<string>, initialErrorState);

  return (
    <ErrorStateContext.Provider value={state}>
      <ErrorDispatchContext.Provider value={dispatch}>
        {children}
      </ErrorDispatchContext.Provider>
    </ErrorStateContext.Provider>
  );
};

export const useErrorStateContext = () => {
  const context = useContext(ErrorStateContext);
  if (!context) {
    throw new Error('useErrorState must be used within an ErrorProvider');
  }
  return context;
};

export const useErrorDispatchContext = () => {
  const context = useContext(ErrorDispatchContext);
  if (!context) {
    throw new Error('useErrorDispatch must be used within an ErrorProvider');
  }
  return context;
};