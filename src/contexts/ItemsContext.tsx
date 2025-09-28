import React, { createContext, useContext, useReducer, type Dispatch } from 'react';
import { itemsReducer, initialItemsState, type ItemsState, type ItemsAction } from '../utils/reducers/itemsReducer';

export const ItemsStateContext = createContext<ItemsState | undefined>(undefined);
export const ItemsDispatchContext = createContext<Dispatch<ItemsAction> | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(itemsReducer, initialItemsState);

  return (
    <ItemsStateContext.Provider value={state}>
      <ItemsDispatchContext.Provider value={dispatch}>
        {children}
      </ItemsDispatchContext.Provider>
    </ItemsStateContext.Provider>
  );
};

export const useItemsStateContext = () => {
  const context = useContext(ItemsStateContext);
  if (!context) {
    throw new Error('useItemsState must be used within an ItemsProvider');
  }
  return context;
};

export const useItemsDispatchContext = () => {
  const context = useContext(ItemsDispatchContext);
  if (!context) {
    throw new Error('useItemsDispatch must be used within an ItemsProvider');
  }
  return context;
};
