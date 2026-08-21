"use client";

import { useState, useMemo, useEffect } from "react";
import { useCartStore, Product } from "@/store/cartStore";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  X, Plus, Minus, Trash2, ShoppingCart, Search, 
  MapPin, Menu, User, LogOut, ChevronRight, PlayCircle,
  Package, Clock, CheckCircle2, AlertCircle, ShoppingBag,
  Settings, Edit3
} from "lucide-react";

// Mocks & Constants
const categories = [
  "Todos",
  "FRUTOS SECOS", "MEDICINAL", "ALMACEN", "ACEITES", "VINOS/CERVEZAS",
  "CONFIT/GOLOSINAS", "CONDIMENTOS", "COSMETICA"
];

import mockProducts from "@/data/products.json";

const bannerImages = [
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
  "https://img.milocal.app/4340/8acc2f16-02be-3122-93bd-15064be00e02.jpg",
  "https://img.milocal.app/4340/966d9b72-557c-3fbb-a183-dabab8fc8d88.jpg",
  "https://img.milocal.app/4340/572b0cd3-b157-3e7c-a5a1-3322c5a0288c.jpg",
  "https://img.milocal.app/4340/f5222bdc-d7ba-3651-b46c-eaabfc9e8149.jpg",
  "https://img.milocal.app/4340/919c98ad-0fee-33e9-9b16-26a8f3c29bf1.jpg"
];

const INITIAL_INSTAGRAM_FEED = [
  "/instagram/insta_0.jpg",
  "/instagram/insta_1.jpg",
  "/instagram/insta_2.jpg",
  "/instagram/insta_3.jpg",
  "/instagram/insta_4.jpg"
];

const videoRecetas = [
  { id: "1", title: "Desayuno Avena y Nueces", img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=400&q=80", tag: "Desayuno Sano" },
  { id: "2", title: "Pan Keto de Almendras", img: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=400&q=80", tag: "Keto" },
  { id: "3", title: "Infusión de Hierbas Medicinales", img: "https://images.unsplash.com/photo-1555529902-601e3895e4e2?auto=format&fit=crop&w=400&q=80", tag: "Medicinal" },
  { id: "4", title: "Granola Casera Saludable", img: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=400&q=80", tag: "Receta" },
  { id: "5", title: "Beneficios de la Chía", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80", tag: "Nutrición" },
  { id: "6", title: "Snack de Frutos Secos", img: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=400&q=80", tag: "Snack" },
];

const WHATSAPP_NUMBER = "542916419224";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [instagramFeed, setInstagramFeed] = useState(INITIAL_INSTAGRAM_FEED);
  
  useEffect(() => {
    fetch('/api/instagram')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setInstagramFeed(data);
        }
      })
      .catch(err => console.error("Error fetching instagram", err));
  }, []);
  
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isPendingCheckout, setIsPendingCheckout] = useState(false);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const { 
    items, isCartOpen, toggleCart, addItem, 
    removeItem, updateQuantity, getCartTotal, getCartCount,
    user, logout, login, register, loginWithSSO, restoreSession,
    isOrdersOpen, toggleOrders, orders, fetchOrders, saveOrder, isLoadingOrders,
    isProfileOpen, toggleProfile, updateProfile
  } = useCartStore();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", address: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (user.isLoggedIn) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4500 })]);

  useEffect(() => {
    setMounted(true);
    restoreSession();
  }, [restoreSession]);

  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setVisibleCount(24);
  }, [activeCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(p => {
      const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const productsByCategory = useMemo(() => {
    const grouped = displayedProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, (Product & { id: string | number })[]>);
    
    return Object.keys(grouped).sort((a, b) => categories.indexOf(a) - categories.indexOf(b)).map(category => ({
      category,
      products: grouped[category]
    }));
  }, [displayedProducts]);

  const getUserLocation = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`https://maps.google.com/?q=${latitude},${longitude}`);
        },
        (err) => {
          console.warn("Geolocation not available or denied:", err);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 4000, maximumAge: 60000 }
      );
    });
  };

  const executeCheckout = async () => {
    if (items.length === 0) return;
    
    // Obtener ubicación GPS fija actual
    const locationUrl = await getUserLocation();

    // Guardar pedido en base de datos
    await saveOrder({
      shippingAddress: user.address,
      phone: user.phone,
      notes: locationUrl ? `Ubicación: ${locationUrl}` : undefined
    });

    let message = "Hola NuezApp! Quiero hacer el siguiente pedido:\n\n";
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString("es-AR")})\n`;
    });
    message += `\n*Total:* $${getCartTotal().toLocaleString("es-AR")}\n\n`;
    
    if (user.isLoggedIn) {
      message += `*Mis datos para el envío:*\nNombre: ${user.name}\nDirección: ${user.address}\nTeléfono: ${user.phone}\n`;
    }

    if (locationUrl) {
      message += `📍 *Ubicación de entrega:*\n${locationUrl}\n`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Si el usuario no está logueado, priorizamos que inicie sesión o se registre
    if (!user.isLoggedIn) {
      setIsPendingCheckout(true);
      setAuthError("");
      setIsLoginModalOpen(true);
      return;
    }

    executeCheckout();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (authMode === "login") {
        const res = await login(authForm.email, authForm.password);
        if (!res.success) {
          setAuthError(res.error || "Error al iniciar sesión");
          setAuthLoading(false);
          return;
        }
      } else {
        const res = await register({
          name: authForm.name,
          email: authForm.email,
          password: authForm.password,
          phone: authForm.phone,
          address: authForm.address
        });
        if (!res.success) {
          setAuthError(res.error || "Error al registrar usuario");
          setAuthLoading(false);
          return;
        }
      }
      setIsLoginModalOpen(false);
      setAuthForm({ name: "", email: "", password: "", phone: "", address: "" });

      if (isPendingCheckout) {
        setIsPendingCheckout(false);
        setTimeout(() => {
          executeCheckout();
        }, 300);
      }
    } catch (err) {
      setAuthError("Ocurrió un error inesperado");
    } finally {
      setAuthLoading(false);
    }
  };

  const [ssoConsentModal, setSsoConsentModal] = useState<{
    isOpen: boolean;
    provider: 'google' | 'microsoft';
    email: string;
    name: string;
  }>({
    isOpen: false,
    provider: 'google',
    email: '',
    name: ''
  });

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'SSO_AUTH_SUCCESS') {
        const { provider, email, name } = event.data;
        if (email) {
          setAuthLoading(true);
          const res = await loginWithSSO(provider, { email, name });
          setAuthLoading(false);
          if (res.success) {
            setIsLoginModalOpen(false);
            setSsoConsentModal(prev => ({ ...prev, isOpen: false }));
            if (isPendingCheckout) {
              setIsPendingCheckout(false);
              setTimeout(() => {
                executeCheckout();
              }, 300);
            }
          } else {
            setAuthError(res.error || `Error al autenticar con ${provider}`);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPendingCheckout, loginWithSSO]);

  const GOOGLE_CLIENT_ID = "165694210780-3jtmfc1ae3b77e1vhl059c7jinouhkdi.apps.googleusercontent.com";

  const handleSSOClick = async (provider: 'google' | 'microsoft') => {
    setAuthError("");

    if (provider === "google") {
      // Usar Google Identity Services oficial
      if (typeof window !== "undefined" && (window as any).google?.accounts?.oauth2) {
        try {
          const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile openid',
            callback: async (tokenResponse: any) => {
              if (tokenResponse.error) {
                setAuthError("No se completó la autorización con Google.");
                return;
              }
              if (tokenResponse.access_token) {
                setAuthLoading(true);
                try {
                  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                  });
                  const userData = await userInfoRes.json();
                  if (userData.email) {
                    const res = await loginWithSSO('google', {
                      email: userData.email,
                      name: userData.name || userData.email.split('@')[0]
                    });
                    setAuthLoading(false);
                    if (res.success) {
                      setIsLoginModalOpen(false);
                      if (isPendingCheckout) {
                        setIsPendingCheckout(false);
                        setTimeout(() => executeCheckout(), 300);
                      }
                    } else {
                      setAuthError(res.error || "Error al autenticar con Google");
                    }
                  }
                } catch (err) {
                  setAuthLoading(false);
                  setAuthError("Error al obtener datos de Google");
                }
              }
            },
          });
          client.requestAccessToken({ prompt: 'consent select_account' });
          return;
        } catch (e) {
          console.warn("Google GIS init fallback:", e);
        }
      }
    }

    // Microsoft / Fallback OAuth popup
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback/${provider}`);
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    let oauthUrl = "";
    if (provider === "google") {
      oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile%20openid&prompt=consent%20select_account`;
    } else {
      const msClientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || "common";
      oauthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${msClientId}&response_type=token&redirect_uri=${redirectUri}&scope=user.read%20openid%20profile%20email&prompt=select_account`;
    }

    const popup = window.open(
      oauthUrl,
      `${provider}_login`,
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,location=no,status=no`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setAuthError("Por favor habilita las ventanas emergentes en tu navegador para continuar.");
      return;
    }
  };

  const handleConfirmSSOConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ssoConsentModal.email) return;

    setAuthLoading(true);
    setAuthError("");

    const res = await loginWithSSO(ssoConsentModal.provider, {
      email: ssoConsentModal.email.trim(),
      name: ssoConsentModal.name.trim() || ssoConsentModal.email.split('@')[0]
    });

    setAuthLoading(false);
    if (res.success) {
      setSsoConsentModal(prev => ({ ...prev, isOpen: false }));
      setIsLoginModalOpen(false);
      if (isPendingCheckout) {
        setIsPendingCheckout(false);
        setTimeout(() => {
          executeCheckout();
        }, 300);
      }
    } else {
      setAuthError(res.error || "Error al autenticar cuenta");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    setProfileLoading(true);

    const res = await updateProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      address: profileForm.address
    });

    setProfileLoading(false);
    if (res.success) {
      setProfileSuccess(true);
      setTimeout(() => {
        setProfileSuccess(false);
        toggleProfile();
      }, 1200);
    } else {
      setProfileError(res.error || "Error al actualizar perfil");
    }
  };

  const handleContactWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20NuezApp!`, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-[#2B2118] bg-white font-sans selection:bg-[#CE6908] selection:text-white">
      
      {/* Top Banner */}
      {isBannerVisible && (
        <div className="bg-[#675B37] text-white text-xs font-semibold py-2 px-4 text-center tracking-wider relative flex items-center justify-center">
          <span>DISFRUTÁ DE UN 10% OFF EN TU PRIMERA COMPRA — ENVÍOS A TODO EL PAÍS</span>
          <button 
            onClick={() => setIsBannerVisible(false)} 
            className="absolute right-4 text-white/80 hover:text-white transition p-1"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Header Minimalista */}
      <header className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40 border-b border-gray-100/50 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-6">
          <button onClick={() => setIsMenuOpen(true)} className="text-gray-900 hover:text-[#CE6908] transition">
            <Menu size={24} strokeWidth={1.5} />
          </button>
          
          {/* Logo Minimalista */}
          <div className="hidden sm:flex items-center gap-2">
            <img src="/icon.png" alt="Logo" className="h-12 object-contain" />
            <div className="flex flex-col justify-center">
              <span className="font-serif font-bold text-[#675B37] text-xl leading-none">Nuez App</span>
              <span className="font-sans text-[10px] tracking-[0.2em] text-[#675B37] uppercase mt-0.5">Shopp</span>
            </div>
          </div>
        </div>

        {/* Logo Mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <img src="/icon.png" alt="Logo" className="h-10 object-contain" />
          <div className="flex flex-col justify-center">
            <span className="font-serif font-bold text-[#675B37] text-lg leading-none">Nuez App</span>
            <span className="font-sans text-[9px] tracking-[0.2em] text-[#675B37] uppercase mt-0.5">Shopp</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Search Box Clean */}
          <div className="hidden md:flex relative items-center">
            <Search className="absolute left-3 text-[#828282]" size={16} strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-full text-sm outline-none focus:border-[#CE6908] transition-colors w-64"
            />
          </div>

          <div className="flex items-center gap-4">
            {user.isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-3">
                <button 
                  onClick={toggleOrders}
                  className="text-xs font-semibold text-[#675B37] hover:text-[#2B2118] bg-[#675B37]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition"
                >
                  <Package size={14} /> Mis Pedidos
                </button>
                <button 
                  onClick={toggleProfile}
                  className="text-sm font-medium border-b border-gray-900 pb-0.5 hover:text-[#CE6908] transition flex items-center gap-1.5"
                  title="Editar mis datos"
                >
                  Hola, {user.name.split(' ')[0]} <Edit3 size={13} className="text-[#675B37]" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthMode("login"); setAuthError(""); setIsLoginModalOpen(true); }}
                className="text-gray-900 hover:text-[#CE6908] transition hidden sm:flex items-center gap-2 text-sm font-medium"
              >
                Ingresar
              </button>
            )}

            <button 
              onClick={toggleCart}
              className="relative text-gray-900 hover:text-[#CE6908] transition"
            >
              <ShoppingCart size={24} strokeWidth={1.5} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#CE6908] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Mobile */}
        <div className="md:hidden relative mt-6 mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#828282]" size={18} strokeWidth={1.5} />
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-12 bg-white border border-gray-200 rounded-full shadow-sm outline-none text-sm focus:border-[#CE6908]"
          />
        </div>

        {/* Hero Section Editorial */}
        <div className="mt-6 md:mt-10 bg-[#FAF7F2] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-100">
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center order-2 md:order-1">
            <span className="text-[#CE6908] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">NuezApp Store</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2B2118] leading-tight mb-6">
              Eleva tu nutrición con un sabor atemporal.
            </h1>
            <p className="text-[#828282] text-sm md:text-base mb-8 max-w-md leading-relaxed">
              Descubre nuestra selección de frutos secos y productos saludables, pensados para quienes viven intensamente sin descuidar su bienestar.
            </p>
            <div>
              <button onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#2B2118] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition shadow-lg">
                Ver Colección
              </button>
            </div>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto relative order-1 md:order-2 overflow-hidden" ref={emblaRef}>
            <div className="flex h-full">
              {bannerImages.map((src, i) => (
                <div className="flex-[0_0_100%] min-w-0 h-full relative" key={i}>
                  <img src={src} alt="Hero" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <section id="collection" className="mb-16">
          {/* Categorías Clean Tabs */}
          <div className="flex gap-6 overflow-x-auto whitespace-nowrap pb-4 scrollbar-hide justify-start md:justify-center border-b border-gray-100 mb-8 mt-12">
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveCategory(cat)}
                className={`text-sm font-medium pb-4 border-b-2 transition-all ${
                  activeCategory === cat 
                    ? 'border-[#2B2118] text-[#2B2118]' 
                    : 'border-transparent text-[#828282] hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid (Editorial Style) */}
          <div 
            className="h-[800px] max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar"
            onScroll={(e) => {
              const target = e.currentTarget;
              if (target.scrollHeight - target.scrollTop <= target.clientHeight + 200) {
                if (visibleCount < filteredProducts.length) {
                  setVisibleCount(prev => prev + 24);
                }
              }
            }}
          >
          {productsByCategory.length === 0 ? (
            <div className="text-center py-20 text-[#828282]">
              <p className="text-lg">No encontramos resultados</p>
            </div>
          ) : (
            productsByCategory.map((group) => (
              <div key={group.category} className="mb-12">
                {activeCategory === "Todos" && (
                  <h3 className="font-serif text-xl mb-6 border-l-2 border-[#CE6908] pl-3">{group.category}</h3>
                )}
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
                  {group.products.map((p) => {
                    const cartItem = items.find(i => i.id === p.id);
                    return (
                      <div key={p.id} className="group relative">
                        <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4 relative transition-all">
                          {p.image ? (
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className={`w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out ${p.image === '/logo.png' ? 'object-contain p-10 opacity-30 grayscale' : 'object-cover'}`}
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🌰</div>
                          )}
                          
                          {/* Always visible buy button */}
                          <div className="absolute inset-x-0 bottom-0 p-3 z-10">
                            {cartItem ? (
                              <div className="flex items-center justify-between bg-[#675B37] text-white shadow-lg rounded-full px-2 py-1.5 border border-[#675B37]">
                                <button onClick={() => updateQuantity(p.id, cartItem.quantity - 1)} className="p-2 hover:bg-white/20 rounded-full transition">
                                  <Minus size={14} />
                                </button>
                                <span className="text-sm font-bold w-6 text-center">{cartItem.quantity}</span>
                                <button onClick={() => addItem(p)} className="p-2 hover:bg-white/20 rounded-full transition">
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => addItem(p)}
                                className="w-full bg-[#675B37] text-white py-3 rounded-full text-xs font-semibold tracking-wider hover:bg-[#2B2118] transition shadow-lg flex items-center justify-center gap-2"
                              >
                                COMPRAR <ShoppingCart size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-[#828282] mb-1">{p.category}</p>
                          <h3 className="font-medium text-[13px] leading-relaxed text-[#2B2118] line-clamp-2 pr-2" title={p.name}>
                            {p.name}
                          </h3>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="font-bold text-sm text-[#2B2118]">${p.price.toLocaleString("es-AR")}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          </div>
        </section>

        {/* Promo Banner Split */}
        <div className="mb-16 grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-[#CE6908] text-white p-10 md:p-16 flex flex-col justify-center text-center md:text-left">
            <h2 className="font-serif text-3xl md:text-4xl mb-4 leading-tight">Tu satisfacción es nuestra prioridad.</h2>
            <p className="text-amber-50 text-sm md:text-base opacity-90 max-w-sm mx-auto md:mx-0">
              Estamos aquí para entregarte la mejor experiencia. Calidad premium en cada grano.
            </p>
          </div>
          <div className="h-64 md:h-auto">
            <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80" alt="Quality" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Instagram Visual Layout */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-[#2B2118] mb-2">Social Feed</h2>
            <p className="text-sm text-[#828282]">Últimas Novedades en NuezApp</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1 mb-8">
            {instagramFeed.slice(0, 5).map((img, i) => (
              <a key={i} href="https://www.instagram.com/nuezapprio/" target="_blank" rel="noopener noreferrer" className="group relative aspect-square block overflow-hidden">
                <img src={img} alt="Instagram" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold uppercase tracking-widest border border-white/50 px-4 py-2">Ver más</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Recipes Vertical Scroll */}
        <section className="mb-20">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="font-serif text-3xl text-[#2B2118] mb-2">Recetas & Bienestar</h2>
              <p className="text-sm text-[#828282] max-w-sm">Inspiración saludable para tu día a día.</p>
            </div>
            <a href="#" className="hidden md:flex text-xs font-bold uppercase tracking-widest text-[#CE6908] border-b border-[#CE6908]">Ver Todos</a>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {videoRecetas.map((video) => (
              <a 
                key={video.id} 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-start shrink-0 w-48 md:w-60 group block"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden relative mb-4">
                  <img src={video.img} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy"/>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="text-white" size={48} strokeWidth={1} />
                  </div>
                </div>
                <p className="text-[10px] uppercase font-bold text-[#828282] tracking-wider mb-1">{video.tag}</p>
                <h3 className="font-serif text-lg leading-tight text-[#2B2118] group-hover:text-[#CE6908] transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </a>
            ))}
          </div>
        </section>

      </main>

      {/* Footer Minimalista */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="Logo" className="h-14 object-contain" />
            <div className="flex flex-col justify-center">
              <span className="font-serif font-bold text-[#675B37] text-2xl leading-none">Nuez App</span>
              <span className="font-sans text-[11px] tracking-[0.2em] text-[#675B37] uppercase mt-1">Shopp</span>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-[#828282]">
            <button onClick={() => setIsContactOpen(true)} className="hover:text-[#2B2118] transition">Ubicación</button>
            <a href="https://www.instagram.com/nuezapprio/" className="hover:text-[#2B2118] transition">Instagram</a>
            <button onClick={handleContactWhatsApp} className="hover:text-[#2B2118] transition">Soporte</button>
          </div>
          <p className="text-xs text-[#828282]">&copy; 2026 NuezApp. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Sidebar Menu Drawer (Rediseñado) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-[300px] max-w-[85vw] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src="/icon.png" alt="Logo" className="h-10 object-contain" />
                <div className="flex flex-col justify-center">
                  <span className="font-serif font-bold text-[#675B37] text-lg leading-none">Nuez App</span>
                  <span className="font-sans text-[9px] tracking-[0.2em] text-[#675B37] uppercase mt-0.5">Shopp</span>
                </div>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-[#828282] hover:text-black transition">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-6 bg-gray-50/50 mb-4 border-b border-gray-100">
              {user.isLoggedIn ? (
                <div>
                  <p className="font-medium text-[#2B2118] text-lg">{user.name}</p>
                  <p className="text-[#828282] text-xs mb-2">{user.email}</p>
                  <button 
                    onClick={() => { setIsMenuOpen(false); toggleProfile(); }}
                    className="text-xs font-semibold text-[#675B37] hover:text-[#2B2118] flex items-center gap-1.5 transition py-1"
                  >
                    <Edit3 size={13} /> Editar mis datos
                  </button>
                </div>
              ) : (
                <button onClick={() => {setIsMenuOpen(false); setIsLoginModalOpen(true);}} className="text-sm font-semibold border-b border-gray-900 pb-0.5">
                  Iniciar Sesión
                </button>
              )}
            </div>

            <nav className="flex-1 px-6 space-y-6">
              <button onClick={() => {setIsMenuOpen(false); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });}} className="block text-left text-[#2B2118] font-serif text-2xl hover:text-[#CE6908] transition">
                Catálogo
              </button>
              <button onClick={() => {setIsMenuOpen(false); toggleCart();}} className="block text-left text-[#2B2118] font-serif text-2xl hover:text-[#CE6908] transition">
                Mi Carrito
              </button>
              {user.isLoggedIn && (
                <button onClick={() => {setIsMenuOpen(false); toggleOrders();}} className="block text-left text-[#2B2118] font-serif text-2xl hover:text-[#CE6908] transition flex items-center justify-between w-full">
                  <span>Mis Pedidos</span>
                  <Package size={20} className="text-[#675B37]" />
                </button>
              )}
              <button onClick={() => {setIsMenuOpen(false); setIsContactOpen(true);}} className="block text-left text-[#2B2118] font-serif text-2xl hover:text-[#CE6908] transition">
                Contacto
              </button>
            </nav>

            <div className="p-6">
              {user.isLoggedIn && (
                <button onClick={() => {logout(); setIsMenuOpen(false);}} className="flex items-center gap-2 text-[#828282] hover:text-red-500 text-sm font-medium transition">
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer (Rediseñado) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={toggleCart} />
          
          <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-serif text-2xl text-[#2B2118]">Mi Bolsa</h2>
              <button onClick={toggleCart} className="text-[#828282] hover:text-black transition">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingCart size={48} strokeWidth={1} className="text-gray-200 mb-4" />
                  <p className="text-[#828282] text-sm">Tu bolsa de compras está vacía.</p>
                  <button onClick={toggleCart} className="mt-6 border border-[#2B2118] text-[#2B2118] px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition">
                    Ver Productos
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map(item => (
                    <li key={item.id} className="flex gap-4 items-center">
                      <div className="w-20 h-24 bg-gray-100 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className={`w-full h-full ${item.image === '/logo.png' ? 'object-contain p-2 opacity-30 grayscale' : 'object-cover'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight text-[#2B2118] mb-1 line-clamp-2">{item.name}</h4>
                        <div className="text-[#828282] text-sm mb-2">${item.price.toLocaleString("es-AR")} c/u</div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-200">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 px-2 text-[#828282] hover:text-black">
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => addItem(item)} className="p-1 px-2 text-[#828282] hover:text-black">
                              <Plus size={12} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-xs text-[#828282] underline hover:text-red-500 transition">
                            Remover
                          </button>
                        </div>
                      </div>
                      <div className="text-right self-start font-bold text-sm text-[#2B2118]">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {items.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-gray-600">Subtotal</span>
                  <span className="font-serif text-2xl text-[#2B2118]">${getCartTotal().toLocaleString("es-AR")}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#2B2118] text-white py-4 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition flex justify-center items-center gap-2"
                >
                  Confirmar Pedido <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4 brightness-0 invert opacity-80" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SSO Consent & Quick Connect Modal */}
      {ssoConsentModal.isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => { setSsoConsentModal(prev => ({ ...prev, isOpen: false })); setIsLoginModalOpen(true); }} />
          <div className="relative bg-white w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 rounded-2xl">
            <button onClick={() => { setSsoConsentModal(prev => ({ ...prev, isOpen: false })); setIsLoginModalOpen(true); }} className="absolute top-4 right-4 text-gray-400 hover:text-black transition p-1">
              <X size={20} strokeWidth={1.5} />
            </button>
            
            <div className="flex items-center gap-3 mb-5">
              {ssoConsentModal.provider === 'google' ? (
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              ) : (
                <svg className="w-8 h-8" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
              )}
              <div>
                <h3 className="font-semibold text-lg text-[#2B2118]">
                  Acceder con {ssoConsentModal.provider === 'google' ? 'Google' : 'Microsoft'}
                </h3>
                <p className="text-xs text-gray-500">Para continuar en NuezApp Shop</p>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-xl text-xs text-blue-900 mb-5 leading-relaxed">
              <p className="font-semibold mb-1">Permisos solicitados:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-blue-800">
                <li>Nombre de perfil</li>
                <li>Dirección de correo electrónico</li>
              </ul>
            </div>

            <form onSubmit={handleConfirmSSOConsent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cuenta de {ssoConsentModal.provider === 'google' ? 'Google' : 'Microsoft'} a vincular
                </label>
                <input
                  required
                  type="email"
                  value={ssoConsentModal.email}
                  onChange={e => setSsoConsentModal(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#675B37] rounded-lg transition"
                  placeholder="ejemplo@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nombre a mostrar
                </label>
                <input
                  type="text"
                  value={ssoConsentModal.name}
                  onChange={e => setSsoConsentModal(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#675B37] rounded-lg transition"
                  placeholder="Tu nombre"
                />
              </div>

              <p className="text-[11px] text-gray-400 text-center leading-tight">
                Al continuar, autorizas a NuezApp Shop a utilizar estos datos para gestionar tus pedidos y envíos.
              </p>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setSsoConsentModal(prev => ({ ...prev, isOpen: false })); setIsLoginModalOpen(true); }}
                  className="flex-1 border border-gray-300 text-gray-700 text-xs font-bold tracking-wider uppercase py-3.5 hover:bg-gray-50 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="flex-1 bg-[#675B37] text-white text-xs font-bold tracking-wider uppercase py-3.5 hover:bg-[#2B2118] rounded-lg transition disabled:opacity-50"
                >
                  {authLoading ? "Conectando..." : "Autorizar y Continuar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal (Login / Register con SQLite) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsLoginModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-[#828282] hover:text-black transition p-1">
              <X size={20} strokeWidth={1.5} />
            </button>
            
            <div className="text-center mb-5">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2B2118] mb-1.5">
                {authMode === "login" ? "Bienvenido" : "Crear Cuenta"}
              </h3>
              <p className="text-[#828282] text-xs sm:text-sm">
                {authMode === "login" 
                  ? "Inicia sesión para guardar tu carrito y ver tus pedidos anteriores." 
                  : "Regístrate para guardar tu carrito y tener historial de pedidos."}
              </p>
            </div>

            {/* Selector de modo Login / Register */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setAuthError(""); }}
                className={`flex-1 pb-3 text-sm font-semibold transition border-b-2 ${
                  authMode === "login" 
                    ? "border-[#675B37] text-[#675B37]" 
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("register"); setAuthError(""); }}
                className={`flex-1 pb-3 text-sm font-semibold transition border-b-2 ${
                  authMode === "register" 
                    ? "border-[#675B37] text-[#675B37]" 
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Registrarse
              </button>
            </div>

            {isPendingCheckout && (
              <div className="mb-5 p-3.5 bg-amber-50/90 border border-[#CE6908]/30 text-[#2B2118] text-xs rounded-lg flex items-start gap-2.5">
                <Package size={18} className="shrink-0 text-[#CE6908] mt-0.5" />
                <div>
                  <strong className="block text-sm font-semibold text-[#CE6908] mb-0.5">¡Estás a un paso de finalizar tu pedido!</strong>
                  <span>Para enviarte el resumen y coordinar tu entrega por WhatsApp, por favor inicia sesión o crea tu cuenta.</span>
                </div>
              </div>
            )}

            {/* Botones de SSO (Google y Microsoft) */}
            <div className="space-y-2.5 mb-6">
              <button
                type="button"
                onClick={() => handleSSOClick("google")}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 text-gray-700 text-xs font-semibold py-3 hover:bg-gray-50 transition shadow-sm bg-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                {authMode === "login" ? "Continuar con Google" : "Registrarse con Google"}
              </button>

              <button
                type="button"
                onClick={() => handleSSOClick("microsoft")}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 text-gray-700 text-xs font-semibold py-3 hover:bg-gray-50 transition shadow-sm bg-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                {authMode === "login" ? "Continuar con Microsoft" : "Registrarse con Microsoft"}
              </button>
            </div>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-[#828282] text-[10px] font-bold uppercase tracking-widest">O con tu correo</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre Completo *</label>
                  <input 
                    required 
                    type="text" 
                    value={authForm.name} 
                    onChange={e => setAuthForm({...authForm, name: e.target.value})} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#675B37] transition" 
                    placeholder="Ej: Juan Pérez" 
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Correo Electrónico *</label>
                <input 
                  required 
                  type="email" 
                  value={authForm.email} 
                  onChange={e => setAuthForm({...authForm, email: e.target.value})} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#675B37] transition" 
                  placeholder="tu@email.com" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña *</label>
                <input 
                  required 
                  type="password" 
                  value={authForm.password} 
                  onChange={e => setAuthForm({...authForm, password: e.target.value})} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#675B37] transition" 
                  placeholder="••••••••" 
                />
              </div>

              {authMode === "register" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Teléfono / WhatsApp</label>
                    <input 
                      type="tel" 
                      value={authForm.phone} 
                      onChange={e => setAuthForm({...authForm, phone: e.target.value})} 
                      className="w-full p-3 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#675B37] transition" 
                      placeholder="Ej: +54 9 2931 123456" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Dirección de Entrega</label>
                    <input 
                      type="text" 
                      value={authForm.address} 
                      onChange={e => setAuthForm({...authForm, address: e.target.value})} 
                      className="w-full p-3 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#675B37] transition" 
                      placeholder="Calle, número, piso/depto" 
                    />
                  </div>
                </>
              )}

              <button 
                type="submit" 
                disabled={authLoading}
                className="w-full bg-[#675B37] text-white text-xs font-bold tracking-widest uppercase py-4 hover:bg-[#2B2118] transition mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {authLoading ? "Procesando..." : (authMode === "login" ? "Entrar a mi Cuenta" : "Crear mi Cuenta")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Orders Drawer (Mis Pedidos) */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={toggleOrders} />
          
          <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Package className="text-[#675B37]" size={22} />
                <h2 className="font-serif text-2xl text-[#2B2118]">Mis Pedidos</h2>
              </div>
              <button onClick={toggleOrders} className="text-[#828282] hover:text-black transition">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-white space-y-4">
              {isLoadingOrders ? (
                <div className="text-center py-12 text-gray-400">
                  <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-[#675B37]" />
                  <p className="text-sm">Cargando tus pedidos...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <ShoppingBag size={48} strokeWidth={1} className="text-gray-200 mb-4" />
                  <h3 className="font-serif text-xl text-[#2B2118] mb-1">Sin pedidos registrados</h3>
                  <p className="text-[#828282] text-sm max-w-xs">Aún no has realizado compras con tu cuenta.</p>
                  <button onClick={() => { toggleOrders(); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-6 bg-[#675B37] text-white px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#2B2118] transition">
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-5 hover:border-[#675B37] transition bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-100">
                      <div>
                        <span className="font-bold text-xs text-[#675B37] uppercase tracking-wider block">{order.id}</span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {order.status}
                      </span>
                    </div>

                    <ul className="space-y-2 mb-3">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-xs text-gray-600">
                          <span className="line-clamp-1">{item.quantity}x {item.name}</span>
                          <span className="font-medium text-gray-900">${(item.price * item.quantity).toLocaleString("es-AR")}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-500 text-xs">Total abonado</span>
                      <span className="font-bold text-[#CE6908] text-base">${order.total.toLocaleString("es-AR")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={toggleProfile} />
          <div className="relative bg-white w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl">
            <button onClick={toggleProfile} className="absolute top-4 right-4 text-[#828282] hover:text-black transition p-1">
              <X size={20} strokeWidth={1.5} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#675B37]/10 text-[#675B37] rounded-full">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#2B2118]">Mi Perfil</h3>
                <p className="text-[#828282] text-xs">Actualiza tus datos para tus compras y envíos.</p>
              </div>
            </div>

            {profileSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span><strong>¡Excelente!</strong> Tus datos han sido actualizados con éxito.</span>
              </div>
            )}

            {profileError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre Completo *</label>
                <input 
                  required 
                  type="text" 
                  value={profileForm.name} 
                  onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#675B37] transition" 
                  placeholder="Tu nombre completo" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Correo Electrónico (No editable)</label>
                <input 
                  disabled 
                  type="email" 
                  value={user.email} 
                  className="w-full p-3 bg-gray-100/70 border border-gray-200 text-sm text-gray-500 cursor-not-allowed outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Teléfono / WhatsApp</label>
                <input 
                  type="tel" 
                  value={profileForm.phone} 
                  onChange={e => setProfileForm({...profileForm, phone: e.target.value})} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#675B37] transition" 
                  placeholder="Ej: +54 9 2931 123456" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Dirección de Entrega Predeterminada</label>
                <input 
                  type="text" 
                  value={profileForm.address} 
                  onChange={e => setProfileForm({...profileForm, address: e.target.value})} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#675B37] transition" 
                  placeholder="Calle, número, piso/depto" 
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={toggleProfile}
                  className="flex-1 border border-gray-300 text-gray-700 text-xs font-bold tracking-widest uppercase py-3.5 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={profileLoading}
                  className="flex-1 bg-[#675B37] text-white text-xs font-bold tracking-widest uppercase py-3.5 hover:bg-[#2B2118] transition disabled:opacity-50"
                >
                  {profileLoading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal (Rediseñado) */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsContactOpen(false)} />
          <div className="relative bg-white w-full max-w-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row gap-8">
            <button onClick={() => setIsContactOpen(false)} className="absolute top-4 right-4 text-[#828282] hover:text-black transition z-10">
              <X size={20} strokeWidth={1.5} />
            </button>
            
            <div className="md:w-1/2 flex flex-col justify-center">
              <h2 className="font-serif text-3xl text-[#2B2118] mb-4">Nuestra Ubicación</h2>
              <p className="text-[#828282] text-sm mb-8 leading-relaxed">
                Visítanos en nuestra tienda física para disfrutar de la experiencia completa y degustar nuestros productos frescos.
                <br /><br />
                <strong>Hipólito Yrigoyen y Sarmiento</strong><br />
                Río Colorado, Río Negro.
              </p>
              
              <div className="flex flex-col gap-3">
                <button onClick={handleContactWhatsApp} className="w-full bg-[#2B2118] text-white text-xs font-bold tracking-widest uppercase py-4 hover:opacity-90 transition flex justify-center items-center gap-2">
                  Escríbenos <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4 brightness-0 invert" />
                </button>
                <a href="https://maps.google.com/?q=-38.99355688461547,-64.09578943096835" target="_blank" rel="noopener noreferrer" className="w-full border border-gray-300 text-[#2B2118] text-xs font-bold tracking-widest uppercase py-4 hover:bg-gray-50 transition text-center flex items-center justify-center gap-2">
                  Abrir en Google Maps
                </a>
              </div>
            </div>

            <div className="md:w-1/2 h-64 md:h-auto bg-gray-100">
              <iframe 
                src="https://maps.google.com/maps?q=-38.99355688461547,-64.09578943096835&hl=es&z=16&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
