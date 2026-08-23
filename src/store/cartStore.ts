import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  unit?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
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
  ordersByUser: Record<string, Order[]>;
  isLoadingOrders: boolean;

  addItem: (product: Product) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  toggleOrders: () => void;
  toggleProfile: () => void;
  isProfileOpen: boolean;
  sessionExpiresAt: number | null;
  getCartTotal: () => number;
  getCartCount: () => number;
  setUser: (user: Partial<UserProfile>) => void;
  setToken: (token: string | null) => void;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string }) => Promise<{ success: boolean; error?: string }>;
  loginWithSSO: (provider: 'google' | 'microsoft', ssoData: { email: string; name?: string; phone?: string; address?: string }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { name?: string; phone?: string; address?: string }) => Promise<{ success: boolean; error?: string }>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
  syncCartWithDb: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  saveOrder: (orderDetails?: { shippingAddress?: string; phone?: string; notes?: string }) => Promise<{ success: boolean; orderId?: string; error?: string }>;
}

const getUserKey = (email?: string, id?: string) => {
  if (email && email.trim().length > 0) return email.trim().toLowerCase();
  if (id && id.trim().length > 0) return id.trim().toLowerCase();
  return 'guest';
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isOrdersOpen: false,
      isProfileOpen: false,
      token: null,
      sessionExpiresAt: null,
      user: {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        isLoggedIn: false
      },
      orders: [],
      ordersByUser: {},
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


      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      toggleOrders: () => {
        set((state) => {
          const next = !state.isOrdersOpen;
          if (next) {
            get().fetchOrders();
          }
          return { isOrdersOpen: next };
        });
      },

      toggleProfile: () => {
        set((state) => ({ isProfileOpen: !state.isProfileOpen }));
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      setUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      },


      setToken: (token) => {
        set({ token });
      },

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
            return { success: false, error: data.error || 'Error al iniciar sesión' };
          }

          const currentItems = get().items;
          let finalItems = currentItems;
          if (data.cart && data.cart.length > 0 && currentItems.length === 0) {
            finalItems = data.cart;
          }


          const ONE_DAY_MS = 24 * 60 * 60 * 1000;
          const expiresAt = Date.now() + ONE_DAY_MS;
          const userKey = getUserKey(data.user?.email || email, data.user?.id);
          const existingOrders = (get().ordersByUser[userKey] || []).slice(0, 50);

          set({
            token: data.token,
            sessionExpiresAt: expiresAt,
            user: { ...data.user, isLoggedIn: true },
            items: finalItems,
            orders: existingOrders
          });

          get().syncCartWithDb();
          get().fetchOrders();

          return { success: true };
        } catch (err) {
          return { success: false, error: 'Error de conexión' };
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


          const ONE_DAY_MS = 24 * 60 * 60 * 1000;
          const expiresAt = Date.now() + ONE_DAY_MS;
          const userKey = getUserKey(registerData.email);
          const existingOrders = (get().ordersByUser[userKey] || []).slice(0, 50);


          set({
            token: data.token,
            sessionExpiresAt: expiresAt,
            user: { ...data.user, isLoggedIn: true },
            orders: existingOrders
          });

          get().syncCartWithDb();
          return { success: true };
        } catch (err) {
          return { success: false, error: 'Error de conexión' };
        }
      },

      loginWithSSO: async (provider, ssoData) => {
        try {
          const res = await fetch('/api/auth/sso', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              provider,
              email: ssoData.email,
              name: ssoData.name,
              phone: ssoData.phone,
              address: ssoData.address
            })
          });

          const data = await res.json();
          if (!res.ok) {
            return { success: false, error: data.error || 'Error al autenticar con SSO' };
          }


          const currentItems = get().items;
          let finalItems = currentItems;
          if (data.cart && data.cart.length > 0 && currentItems.length === 0) {
            finalItems = data.cart;
          }

          const ONE_DAY_MS = 24 * 60 * 60 * 1000;
          const expiresAt = Date.now() + ONE_DAY_MS;
          const userKey = getUserKey(data.user?.email || ssoData.email, data.user?.id);
          const existingOrders = (get().ordersByUser[userKey] || []).slice(0, 50);

          set({
            token: data.token,
            sessionExpiresAt: expiresAt,
            user: { ...data.user, isLoggedIn: true },
            items: finalItems,
            orders: existingOrders
          });

          get().syncCartWithDb();
          get().fetchOrders();
          return { success: true };
        } catch (err) {
          return { success: false, error: 'Error de conexión con el proveedor' };
        }
      },

      updateProfile: async (profileData) => {
        const { token, user } = get();

        try {
          const res = await fetch('/api/auth/me', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              ...profileData,
              email: user.email,
              id: user.id
            })
          });

          const data = await res.json();
          if (!res.ok) {
            set((state) => ({
              user: { ...state.user, ...profileData }
            }));
            return { success: true };
          }

          set((state) => ({
            user: { ...state.user, ...data.user }
          }));

          return { success: true };
        } catch (err) {
          set((state) => ({
            user: { ...state.user, ...profileData }
          }));
          return { success: true };
        }
      },


      restoreSession: async () => {
        const { token, user, sessionExpiresAt, orders, ordersByUser } = get();

        if (sessionExpiresAt && Date.now() > sessionExpiresAt) {
          const userKey = getUserKey(user.email, user.id);
          set({
            token: null,
            sessionExpiresAt: null,
            user: { id: '', name: '', email: '', phone: '', address: '', isLoggedIn: false },
            orders: [],
            ordersByUser: userKey !== 'guest' && orders.length > 0
              ? { ...ordersByUser, [userKey]: orders.slice(0, 50) }
              : ordersByUser
          });
          return;
        }

        if (user.isLoggedIn) {
          const userKey = getUserKey(user.email, user.id);
          if (orders.length === 0 && ordersByUser[userKey]) {
            set({ orders: ordersByUser[userKey].slice(0, 50) });
          }
          if (!sessionExpiresAt) {
            set({ sessionExpiresAt: Date.now() + 24 * 60 * 60 * 1000 });
          }
        }

        if (!token) return;

        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            const currentItems = get().items;
            let finalItems = currentItems;
            if (data.cart && data.cart.length > 0 && currentItems.length === 0) {
              finalItems = data.cart;
            }

            const userKey = getUserKey(data.user?.email || user.email, data.user?.id || user.id);
            const userOrders = (get().ordersByUser[userKey] || get().orders || []).slice(0, 50);


            set((state) => ({
              user: { ...state.user, ...data.user, isLoggedIn: true },
              items: finalItems,
              orders: userOrders
            }));

            get().fetchOrders();
          }
        } catch (err) {
          console.warn('Background session sync:', err);
        }
      },


      logout: async () => {
        const { token, user, orders, ordersByUser } = get();
        const userKey = getUserKey(user.email, user.id);

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


        // Preservar los pedidos de este usuario en el historial permanente ordersByUser
        const updatedOrdersByUser = userKey !== 'guest' && orders.length > 0
          ? { ...ordersByUser, [userKey]: orders.slice(0, 50) }
          : ordersByUser;


        set({
          token: null,
          sessionExpiresAt: null,
          user: { id: '', name: '', email: '', phone: '', address: '', isLoggedIn: false },
          orders: [],
          ordersByUser: updatedOrdersByUser
        });
      },


      fetchOrders: async () => {
        const { token, user, ordersByUser } = get();
        if (!user.isLoggedIn) return;


        const userKey = getUserKey(user.email, user.id);
        set({ isLoadingOrders: true });


        try {
          const headers: Record<string, string> = {};
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const query = user.email ? `?email=${encodeURIComponent(user.email)}` : '';
          const res = await fetch(`/api/orders$query`, { headers });

          if (res.ok) {
            const data = await res.json();
            if (data.orders) {
              set((state) => {
                const map = new Map<string, Order>();
                data.orders.forEach((o: Order) => map.set(o.id, o));
                const localOrders = state.ordersByUser[userKey] || state.orders || [];
                localOrders.forEach((o: Order) => {
                  if (!map.has(o.id)) map.set(o.id, o);
                });

                const combined = Array.from(map.values()).sort(
                  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ).slice(0, 50);

                return {
                  orders: combined,
                  ordersByUser: {
                    ...state.ordersByUser,
                    [userKey]: combined
                  }
                };
              });
            }
          }
        } catch (err) {
          console.error('Error fetching orders:', err);
        } finally {
          set({ isLoadingOrders: false });
        }
      },

      saveOrder: async (orderDetails) => {
        const { token, items, getCartTotal, user, clearCart } = get();
        if (items.length === 0) return { success: false, error: 'Carrito vacio' };

        const currentItems = [...items];
        const total = getCartTotal();
        const generatedOrderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const userKey = getUserKey(user.email, user.id);

        const newOrder: Order = {
          id: generatedOrderId,
          items: currentItems,
          total,
          status: 'confirmado',
          shippingAddress: orderDetails?.shippingAddress || user.address,
          phone: orderDetails?.phone || user.phone,
          paymentMethod: 'Efectivo/Transferencia',
          notes: orderDetails?.notes,
          createdAt: new Date().toISOString()
        };

        // 1. Guardar de forma inmediata e infalible en el historial (máximo 50 pedidos, eliminando el más antiguo si supera 50)
        set((state) => {
          const prevUserOrders = state.ordersByUser[userKey] || state.orders || [];
          const updatedOrders = [newOrder, ...prevUserOrders.filter(o => o.id !== newOrder.id)].slice(0, 50);

          return {
            orders: updatedOrders,
            ordersByUser: {
              ...state.ordersByUser,
              [userKey]: updatedOrders
            },
            isCartOpen: false
          };
        });

        // 2. Vaciar el carrito de inmediato
        clearCart();


        // 3. Sincronizar en segundo plano con la base de datos
        try {
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const res = await fetch('/api/orders', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              items: currentItems,
              total,
              shippingAddress: orderDetails?.shippingAddress || user.address,
              phone: orderDetails?.phone || user.phone,
              notes: orderDetails?.notes,
              userEmail: user.email,
              userId: user.id,
              guestUser: !user.isLoggedIn ? {
                name: user.name,
                email: user.email,
              } : undefined
            })
          });


          if (res.ok) {
            const data = await res.json();
            if (data.orderId && data.orderId !== generatedOrderId) {
              set((state) => {
                const mapUpdated = (list: Order[]) => list.map(o => o.id === generatedOrderId ? { ...o, id: data.orderId } : o);
                return {
                  orders: mapUpdated(state.orders),
                  ordersByUser: {
                    ...state.ordersByUser,
                    [userKey]: mapUpdated(state.ordersByUser[userKey] || [])
                  }
                };
              });
            }
          }
        } catch (err) {
          console.warn('Backend sync for order completed locally:', err);
        }


        return { success: true, orderId: generatedOrderId };
      }
    }),
    {
      name: 'nuezapp-storage',
      partialize: (state) => ({
        token: state.token,
        sessionExpiresAt: state.sessionExpiresAt,
        user: state.user,
        items: state.items,
        orders: state.orders.slice(0, 50),
        ordersByUser: state.ordersByUser
      })
    }
  )
);
