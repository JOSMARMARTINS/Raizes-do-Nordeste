import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction } from './types';
import { reducer, initialState } from './reducer';

// Export everything from the split files so we don't break existing imports
export * from './types';
export * from './mocks';
export * from './loyalty';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const cartTotal = state.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <AppContext.Provider value={{ state, dispatch, cartTotal, cartCount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
