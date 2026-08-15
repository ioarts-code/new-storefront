'use client';

import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { CartItem, Product } from './types';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product; quantity?: number }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const CART_STORAGE_KEY = 'ioarts-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find((item) => item.product.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.quantity || 1) }
              : item
          ),
          total: state.total + action.payload.price * (action.quantity || 1),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: action.quantity || 1 }],
        total: state.total + action.payload.price * (action.quantity || 1),
      };
    }

    case 'REMOVE_FROM_CART': {
      const item = state.items.find((item) => item.product.id === action.payload);
      if (!item) return state;
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
        total: state.total - item.product.price * item.quantity,
      };
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find((item) => item.product.id === action.payload.productId);
      if (!item) return state;
      const diff = action.payload.quantity - item.quantity;
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + item.product.price * diff,
      };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    case 'LOAD_CART': {
      const total = action.payload.items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      );

      return {
        items: action.payload.items,
        total,
      };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const [mounted, setMounted] = React.useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, mounted]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
