import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isLoggedIn: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  shippingAddress?: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  isOrdersOpen: boolean;
  token: string | null;
  user: UserProfile;
  orders: Order[];
  isLoadingOrders: boolean;

  addItem: (product: Product) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  toggleOrders: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  setUser: (user: Partial<UserProfile>) => void;
  setToken: (token: string | null) => void;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string }) => Promise<{ success: boolean; error?: string }>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
  syncCartWithDb: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  saveOrder: (orderDetails?: { shippingAddress?: string; phone?: string; notes?: string }) => Promise<{ success: boolean; orderId?: string; error?: string }>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isOrdersOpen: false,
      token: null,
      user: {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        isLoggedIn: false
      },
      orders: [],
      isLoadingOrders: false,
      
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            newItems = [...state.items, { ...product, quantity: 1 }];
          }
          return { items: newItems };
        });
        get().syncCartWithDb();
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
        get().syncCartWithDb();
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          let newItems: CartItem[];
          if (quantity <= 0) {
            newItems = state.items.filter(item => item.id !== productId);
          } else {
            newItems = state.items.map(item =>
              item.id === productId ? { ...item, quantity } : item
            );
          }
          return { items: newItems };
        });
        get().syncCartWithDb();
      },

      clearCart: () => {
        set({ items: [] });
        get().syncCartWithDb();
      },
      
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      toggleOrders: () => set((state) => ({ isOrdersOpen: !state.isOrdersOpen })),
      
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

      setToken: (token) => set({ token }),

      syncCartWithDb: async () => {
        const { token, items, user } = get();
        if (!token || !user.isLoggedIn) return;

        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items })
          });
        } catch (e) {
          console.error('Error syncing cart with DB:', e);
        }
      },

      login: async (email, password) => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          const data = await res.json();
          if (!res.ok) {
            return { success: false, error: data.error || 'Error al iniciar sesin' };
          }

          const currentItems = get().items;
          // Merge items or use DB items if local is empty
          let finalItems = currentItems;
          if (data.cart && data.cart.length > 0 && currentItems.length === 0) {
            finalItems = data.cart;
          }

          set({
            token: data.token,
            user: data.user,
            items: finalItems
          });

          // Sync merged cart
          get().syncCartWithDb();
          // Fetch user orders
          get().fetchOrders();

          return { success: true };
        } catch (err) {
          return { success: false, error: 'Error de conexin' };
        }
      },

      register: async (registerData) => {
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
          });

          const data = await res.json();
          if (!res.ok) {
            return { success: false, error: data.error || 'Error al registrar usuario' };
          }

          set({
            token: data.token,
            user: data.user
          });

          get().syncCartWithDb();
          return { success: true };
        } catch (err) {
          return { success: false, error: 'Error de conexin' };
        }
      },

      restoreSession: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!res.ok) {
            // Invalid session
            set({
              token: null,
              user: { name: '', email: '', phone: '', address: '', isLoggedIn: false }
            });
            return;
          }

          const data = await res.json();
          const currentItems = get().items;
          let finalItems = currentItems;
          if (data.cart && data.cart.length > 0 && currentItems.length === 0) {
            finalItems = data.cart;
          }

          set({
            user: data.user,
            items: finalItems
          });

          get().fetchOrders();
        } catch (err) {
          console.error('Error restoring session:', err);
        }
      },

      logout: async () => {
        const { token } = get();
        if (token) {
          try {
            await fetch('/api/auth/logout', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (e) {
            console.error('Error logging out:', e);
          }
        }

        set({
          token: null,
          user: { name: '', email: '', phone: '', address: '', isLoggedIn: false },
          orders: []
        });
      },

      fetchOrders: async () => {
        const { token, user } = get();
        if (!token || !user.isLoggedIn) return;

        set({ isLoadingOrders: true });
        try {
          const res = await fetch('/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (res.ok) {
            const data = await res.json();
            set({ orders: data.orders || [] });
          }
        } catch (err) {
          console.error('Error fetching orders:', err);
        } finally {
          set({ isLoadingOrders: false });
        }
      },

      saveOrder: async (orderDetails) => {
        const { token, items, getCartTotal, user } = get();
        if (items.length === 0) return { success: false, error: 'Carrito vaco' };

        try {
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const res = await fetch('/api/orders', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              items,
              total: getCartTotal(),
              shippingAddress: orderDetails?.shippingAddress || user.address,
              phone: orderDetails?.phone || user.phone,
              notes: orderDetails?.notes,
              guestUser: !user.isLoggedIn ? {
                name: user.name,
                email: user.email,
              } : undefined
            })
          });

          const data = await res.json();
          if (res.ok) {
            if (token) {
              get().fetchOrders();
            }
            return { success: true, orderId: data.orderId };
          } else {
            return { success: false, error: data.error };
          }
        } catch (err) {
          console.error('Error saving order:', err);
          return { success: false, error: 'Error al registrar pedido' };
        }
      }
    }),
    {
      name: 'nuezapp-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        items: state.items
      })
    }
  )
);
