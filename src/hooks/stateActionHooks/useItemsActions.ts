import { ITEMS_ACTIONS } from '../../utils/constants/items';
import type { DataRoomItem } from '../../types/dataroom';
import { useItemsDispatchContext, useItemsStateContext } from '@/contexts/ItemsContext';

// Hook to use both items state and dispatch with helper functions
export const useItems = () => {
  const state = useItemsStateContext();
  const dispatch = useItemsDispatchContext();

  const setItems = (items: DataRoomItem[]) => {
    dispatch({ type: ITEMS_ACTIONS.SET_ITEMS, payload: items });
  };

  const addItem = (item: DataRoomItem) => {
    dispatch({ type: ITEMS_ACTIONS.ADD_ITEM, payload: item });
  };

  const updateItem = (id: string, updates: Partial<DataRoomItem>) => {
    dispatch({ type: ITEMS_ACTIONS.UPDATE_ITEM, payload: { id, updates } });
  };

  const deleteItem = (id: string) => {
    dispatch({ type: ITEMS_ACTIONS.DELETE_ITEM, payload: id });
  };

  const deleteItems = (ids: string[]) => {
    dispatch({ type: ITEMS_ACTIONS.DELETE_ITEMS, payload: ids });
  };

  const setSelectedItems = (ids: string[]) => {
    dispatch({ type: ITEMS_ACTIONS.SET_SELECTED_ITEMS, payload: ids });
  };

  const clearSelection = () => {
    dispatch({ type: ITEMS_ACTIONS.CLEAR_SELECTION });
  };

  // Helper function to get items by parent
  const getItemsByParent = (parentId: string | null) => {
    return state.items.filter(item => item.parentId === parentId);
  };

  return {
    setItems,
    addItem,
    updateItem,
    deleteItem,
    deleteItems,
    setSelectedItems,
    clearSelection,
    getItemsByParent,
  };
};