import { ITEMS_ACTIONS } from '../constants/items';
import type { DataRoomItem } from '../../types/dataroom';

// Items state type
export interface ItemsState {
  items: DataRoomItem[];
  selectedItems: string[];
}

// Items action types
export type ItemsAction =
  | { type: typeof ITEMS_ACTIONS.SET_ITEMS; payload: DataRoomItem[] }
  | { type: typeof ITEMS_ACTIONS.ADD_ITEM; payload: DataRoomItem }
  | { type: typeof ITEMS_ACTIONS.UPDATE_ITEM; payload: { id: string; updates: Partial<DataRoomItem> } }
  | { type: typeof ITEMS_ACTIONS.DELETE_ITEM; payload: string }
  | { type: typeof ITEMS_ACTIONS.DELETE_ITEMS; payload: string[] }
  | { type: typeof ITEMS_ACTIONS.SET_SELECTED_ITEMS; payload: string[] }
  | { type: typeof ITEMS_ACTIONS.CLEAR_SELECTION };

// Initial items state
export const initialItemsState: ItemsState = {
  items: [],
  selectedItems: [],
};

// Items reducer
export const itemsReducer = (state: ItemsState, action: ItemsAction): ItemsState => {
  switch (action.type) {
    case ITEMS_ACTIONS.SET_ITEMS:
      return { ...state, items: action.payload };
    case ITEMS_ACTIONS.ADD_ITEM:
      return { ...state, items: [...state.items, action.payload] };
    case ITEMS_ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates, updatedAt: new Date() } as DataRoomItem
            : item
        ),
      };
    case ITEMS_ACTIONS.DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case ITEMS_ACTIONS.DELETE_ITEMS:
      return {
        ...state,
        items: state.items.filter(item => !action.payload.includes(item.id)),
      };
    case ITEMS_ACTIONS.SET_SELECTED_ITEMS:
      return { ...state, selectedItems: action.payload };
    case ITEMS_ACTIONS.CLEAR_SELECTION:
      return { ...state, selectedItems: [] };
    default:
      return state;
  }
};