import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  isLoggedIn: boolean;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  user: UserProfile;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  setUser: (user: Partial<UserProfile>) => void;
  logout: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      user: {
        name: '',
        email: '',
        phone: '',
        address: '',
        isLoggedIn: false
      },
      
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter(item => item.id !== productId) };
          }
          return {
            items: state.items.map(item =>
              item.id === productId ? { ...item, quantity } : item
            )
          };
        });
      },

      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      setUser: (userData) => set((state) => ({ 
        user: { ...state.user, ...userData, isLoggedIn: true } 
      })),

      logout: () => set({ 
        user: { name: '', email: '', phone: '', address: '', isLoggedIn: false } 
      })
    }),
    {
      name: 'nuezapp-storage',
    }
  )
);
