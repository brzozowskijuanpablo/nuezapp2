"use client";

import { useState, useMemo, useEffect } from "react";
import { useCartStore, Product } from "@/store/cartStore";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  X, Plus, Minus, Trash2, ShoppingCart, Search, 
  MapPin, Menu, User, LogOut, ChevronRight, PlayCircle
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
  "https://img.milocal.app/4340/966d9b72-557c-3fbb-a183-dabab8fc8d88.jpg"
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
  
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  const { 
    items, isCartOpen, toggleCart, addItem, 
    removeItem, updateQuantity, getCartTotal, getCartCount,
    user, setUser, logout
  } = useCartStore();

  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4500 })]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    let message = "Hola NuezApp! Quiero hacer el siguiente pedido:\n\n";
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString("es-AR")})\n`;
    });
    message += `\n*Total:* $${getCartTotal().toLocaleString("es-AR")}\n\n`;
    
    if (user.isLoggedIn) {
      message += `*Mis datos para el envío:*\nNombre: ${user.name}\nDirección: ${user.address}\nTeléfono: ${user.phone}`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setIsLoginModalOpen(false);
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
            {!user.isLoggedIn ? (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-gray-900 hover:text-[#CE6908] transition hidden sm:flex items-center gap-2 text-sm font-medium"
              >
                Ingresar
              </button>
            ) : (
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="text-sm font-medium border-b border-gray-900 pb-0.5"
              >
                Hola, {user.name.split(' ')[0]}
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
                  <p className="text-[#828282] text-xs">{user.email}</p>
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

      {/* Login Modal (Rediseñado) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsLoginModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-[#828282] hover:text-black transition">
              <X size={20} strokeWidth={1.5} />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="font-serif text-3xl text-[#2B2118] mb-2">Bienvenido</h3>
              <p className="text-[#828282] text-sm">Inicia sesión para una experiencia de compra más fluida.</p>
            </div>

            <div className="space-y-3 mb-8">
              <button type="button" onClick={() => setFormData({...formData, name: "Juan Pablo", email: "juan@example.com"})} className="w-full flex items-center justify-center gap-3 border border-gray-200 text-gray-700 text-sm font-medium py-3 hover:bg-gray-50 transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-4 h-4" alt="Google" />
                Continuar con Google
              </button>
            </div>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-[#828282] text-xs font-semibold uppercase tracking-widest">Datos manuales</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-none outline-none focus:ring-1 focus:ring-[#2B2118] text-sm" placeholder="Nombre completo" />
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-none outline-none focus:ring-1 focus:ring-[#2B2118] text-sm" placeholder="Correo electrónico" />
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-none outline-none focus:ring-1 focus:ring-[#2B2118] text-sm" placeholder="Teléfono" />
              <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-none outline-none focus:ring-1 focus:ring-[#2B2118] text-sm" placeholder="Dirección de envío" />
              <button type="submit" className="w-full bg-[#2B2118] text-white text-xs font-bold tracking-widest uppercase py-4 hover:opacity-90 transition mt-2">
                Guardar y Continuar
              </button>
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
