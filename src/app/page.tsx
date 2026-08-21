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

const mockProducts: Product[] = [
  { id: 1, name: "Almendras peladas GUARA CHIQUITA 0.075g", price: 2100, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/a21985cf-3e50-3f26-adc4-f20aafb2000a.jpg" },
  { id: 2, name: "Almendras peladas GUARA CHIQUITA 0.125g", price: 3200, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/a21985cf-3e50-3f26-adc4-f20aafb2000a.jpg" },
  { id: 3, name: "Almendras peladas GUARA CHIQUITA 0.250g", price: 6250, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/a21985cf-3e50-3f26-adc4-f20aafb2000a.jpg" },
  { id: 4, name: "Almendras peladas GUARA CHIQUITA 0.500g", price: 12350, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/a21985cf-3e50-3f26-adc4-f20aafb2000a.jpg" },
  { id: 5, name: "Almendras peladas GUARA CHIQUITA 1kg", price: 24500, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/a21985cf-3e50-3f26-adc4-f20aafb2000a.jpg" },
  { id: 6, name: "Almendras peladas NONPAREIL 25/27 0.075g", price: 2800, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/e7862f6c-c508-3744-8ce4-cd314fcd7839.jpg" },
  { id: 7, name: "Almendras peladas NONPAREIL 25/27 0.125g", price: 4500, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/aade86d6-19a2-3bef-89b0-884428da2623.jpg" },
  { id: 8, name: "Almendras peladas NONPAREIL 25/27 0.250g", price: 8850, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/83e4e4f2-b51f-3e4e-be81-0df56532b242.jpg" },
  { id: 9, name: "Almendras peladas NONPAREIL 25/27 0.500g", price: 17500, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/83e4e4f2-b51f-3e4e-be81-0df56532b242.jpg" },
  { id: 10, name: "Almendras peladas NONPAREIL 25/27 1kg", price: 34800, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/83e4e4f2-b51f-3e4e-be81-0df56532b242.jpg" },
  { id: 11, name: "Avellanas con cascara 0.125g", price: 1900, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/419d3e74-1829-35f2-b8f4-31bdea6a0fb9.jpg" },
  { id: 12, name: "Avellanas con cascara 0.250g", price: 3700, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/23d0dbc6-3bff-3464-a360-8647145083ca.jpg" },
  { id: 13, name: "Avellanas peladas 0.075g", price: 3600, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/1e94ac29-d7ff-3129-8143-0bdcaf13a6b9.jpg" },
  { id: 14, name: "Avellanas peladas 0.125g", price: 5900, category: "FRUTOS SECOS", image: "https://img.milocal.app/4340/6266b361-240a-38b0-b3f6-4ebd72513698.jpg" }
];

const bannerImages = [
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
  "https://img.milocal.app/4340/8acc2f16-02be-3122-93bd-15064be00e02.jpg",
  "https://img.milocal.app/4340/966d9b72-557c-3fbb-a183-dabab8fc8d88.jpg"
];

const instagramFeed = [
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1550828520-4cb496926fc9?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1623910271019-35436666ba81?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1585828691566-f5d81db2b24f?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1600189020473-b31c19b48530?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1563636544-7744391696df?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1560155016-bd4879ae8f21?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1620600100793-19965d96a7eb?auto=format&fit=crop&w=400&q=80"
];

const videoRecetas = [
  { id: "1", title: "Desayuno Avena y Nueces", img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=400&q=80", tag: "Desayuno Sano" },
  { id: "2", title: "Pan Keto de Almendras", img: "https://images.unsplash.com/photo-1584314777558-86d3897bc09c?auto=format&fit=crop&w=400&q=80", tag: "Keto" },
  { id: "3", title: "Infusión de Hierbas Medicinales", img: "https://images.unsplash.com/photo-1597481499750-3e6b22687e12?auto=format&fit=crop&w=400&q=80", tag: "Medicinal" },
  { id: "4", title: "Granola Casera Saludable", img: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=400&q=80", tag: "Receta" },
  { id: "5", title: "Beneficios de la Chía", img: "https://images.unsplash.com/photo-1593309605333-e7f0d0bd1c7b?auto=format&fit=crop&w=400&q=80", tag: "Nutrición" },
  { id: "6", title: "Snack de Frutos Secos", img: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=400&q=80", tag: "Snack" },
];

const WHATSAPP_NUMBER = "542916419224";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  
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

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(p => {
      const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const productsByCategory = useMemo(() => {
    const grouped = filteredProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
    
    return Object.keys(grouped).sort((a, b) => categories.indexOf(a) - categories.indexOf(b)).map(category => ({
      category,
      products: grouped[category]
    }));
  }, [filteredProducts]);

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
    <div className="min-h-screen text-[#222222] bg-[#FAFAFA] font-sans selection:bg-[#B68C5E] selection:text-white">
      
      {/* Top Banner */}
      <div className="bg-[#222] text-white text-xs font-semibold py-2 px-4 text-center tracking-wider">
        DISFRUTÁ DE UN 10% OFF EN TU PRIMERA COMPRA — ENVÍOS A TODO EL PAÍS
      </div>

      {/* Header Minimalista */}
      <header className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40 border-b border-gray-100/50 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-6">
          <button onClick={() => setIsMenuOpen(true)} className="text-gray-900 hover:text-[#B68C5E] transition">
            <Menu size={24} strokeWidth={1.5} />
          </button>
          
          {/* Logo Minimalista */}
          <div className="hidden sm:flex font-serif text-2xl tracking-widest font-bold">
            INFINITY
          </div>
        </div>

        {/* Logo Mobile */}
        <div className="flex sm:hidden font-serif text-xl tracking-widest font-bold">
          INFINITY
        </div>

        <div className="flex items-center gap-6">
          {/* Search Box Clean */}
          <div className="hidden md:flex relative items-center">
            <Search className="absolute left-3 text-gray-400" size={16} strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-full text-sm outline-none focus:border-[#B68C5E] transition-colors w-64"
            />
          </div>

          <div className="flex items-center gap-4">
            {!user.isLoggedIn ? (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-gray-900 hover:text-[#B68C5E] transition hidden sm:flex items-center gap-2 text-sm font-medium"
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
              className="relative text-gray-900 hover:text-[#B68C5E] transition"
            >
              <ShoppingCart size={24} strokeWidth={1.5} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#B68C5E] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-12 bg-white border border-gray-200 rounded-full shadow-sm outline-none text-sm focus:border-[#B68C5E]"
          />
        </div>

        {/* Hero Section Editorial */}
        <div className="mt-6 md:mt-10 bg-[#FAF7F2] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-100">
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center order-2 md:order-1">
            <span className="text-[#B68C5E] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">NuezApp Store</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A] leading-tight mb-6">
              Eleva tu nutrición con un sabor atemporal.
            </h1>
            <p className="text-gray-500 text-sm md:text-base mb-8 max-w-md leading-relaxed">
              Descubre nuestra selección de frutos secos y productos saludables, pensados para quienes viven intensamente sin descuidar su bienestar.
            </p>
            <div>
              <button onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#1A1A1A] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#333] transition shadow-lg">
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

        {/* Marquee Ticker */}
        <div className="py-8 border-b border-gray-100 mb-12 overflow-hidden flex gap-8 whitespace-nowrap text-sm font-bold text-gray-300 uppercase tracking-widest">
          <span>ALMENDRAS</span> • <span>NUECES</span> • <span>SEMILLAS</span> • <span>KETO</span> • <span>SALUDABLE</span> • <span>ALMENDRAS</span> • <span>NUECES</span> • <span>SEMILLAS</span>
        </div>

        {/* Our Collection */}
        <section id="collection" className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-[#1A1A1A]">Nuestra Colección</h2>
          </div>

          {/* Categorías Clean Tabs */}
          <div className="flex gap-6 overflow-x-auto whitespace-nowrap pb-4 scrollbar-hide justify-start md:justify-center border-b border-gray-100 mb-8">
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveCategory(cat)}
                className={`text-sm font-medium pb-4 border-b-2 transition-all ${
                  activeCategory === cat 
                    ? 'border-[#1A1A1A] text-[#1A1A1A]' 
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid (Editorial Style) */}
          {productsByCategory.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No encontramos resultados</p>
            </div>
          ) : (
            productsByCategory.map((group) => (
              <div key={group.category} className="mb-12">
                {activeCategory === "Todos" && (
                  <h3 className="font-serif text-xl mb-6 border-l-2 border-[#B68C5E] pl-3">{group.category}</h3>
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
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🌰</div>
                          )}
                          
                          {/* Hover overlay buy button */}
                          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                            {cartItem ? (
                              <div className="flex items-center justify-between bg-white/95 backdrop-blur shadow-lg rounded-full px-2 py-1.5 border border-gray-100">
                                <button onClick={() => updateQuantity(p.id, cartItem.quantity - 1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                  <Minus size={14} />
                                </button>
                                <span className="text-sm font-bold w-6 text-center">{cartItem.quantity}</span>
                                <button onClick={() => addItem(p)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => addItem(p)}
                                className="w-full bg-[#1A1A1A] text-white py-3 rounded-full text-xs font-semibold tracking-wider hover:bg-[#333] transition shadow-lg flex items-center justify-center gap-2"
                              >
                                COMPRAR <ShoppingCart size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-1">{p.category}</p>
                          <h3 className="font-medium text-[13px] leading-relaxed text-[#1A1A1A] line-clamp-2 pr-2" title={p.name}>
                            {p.name}
                          </h3>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="font-bold text-sm text-[#1A1A1A]">${p.price.toLocaleString("es-AR")}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Promo Banner Split */}
        <div className="mb-16 grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-[#B68C5E] text-white p-10 md:p-16 flex flex-col justify-center text-center md:text-left">
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
            <h2 className="font-serif text-3xl text-[#1A1A1A] mb-2">Social Feed</h2>
            <p className="text-sm text-gray-500">Últimas Novedades en NuezApp</p>
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
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-2">Recetas & Bienestar</h2>
              <p className="text-sm text-gray-500 max-w-sm">Inspiración saludable para tu día a día.</p>
            </div>
            <a href="#" className="hidden md:flex text-xs font-bold uppercase tracking-widest text-[#B68C5E] border-b border-[#B68C5E]">Ver Todos</a>
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
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">{video.tag}</p>
                <h3 className="font-serif text-lg leading-tight text-[#1A1A1A] group-hover:text-[#B68C5E] transition-colors line-clamp-2">
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
          <div className="font-serif text-2xl tracking-widest font-bold">INFINITY</div>
          <div className="flex gap-6 text-sm text-gray-500">
            <button onClick={() => setIsContactOpen(true)} className="hover:text-gray-900 transition">Ubicación</button>
            <a href="https://www.instagram.com/nuezapprio/" className="hover:text-gray-900 transition">Instagram</a>
            <button onClick={handleContactWhatsApp} className="hover:text-gray-900 transition">Soporte</button>
          </div>
          <p className="text-xs text-gray-400">&copy; 2026 Infinity. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Sidebar Menu Drawer (Rediseñado) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-[300px] max-w-[85vw] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="font-serif text-xl font-bold tracking-widest">INFINITY</div>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-black transition">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-6 bg-gray-50/50 mb-4 border-b border-gray-100">
              {user.isLoggedIn ? (
                <div>
                  <p className="font-medium text-[#1A1A1A] text-lg">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              ) : (
                <button onClick={() => {setIsMenuOpen(false); setIsLoginModalOpen(true);}} className="text-sm font-semibold border-b border-gray-900 pb-0.5">
                  Iniciar Sesión
                </button>
              )}
            </div>

            <nav className="flex-1 px-6 space-y-6">
              <button onClick={() => {setIsMenuOpen(false); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });}} className="block text-left text-[#1A1A1A] font-serif text-2xl hover:text-[#B68C5E] transition">
                Catálogo
              </button>
              <button onClick={() => {setIsMenuOpen(false); toggleCart();}} className="block text-left text-[#1A1A1A] font-serif text-2xl hover:text-[#B68C5E] transition">
                Mi Carrito
              </button>
              <button onClick={() => {setIsMenuOpen(false); setIsContactOpen(true);}} className="block text-left text-[#1A1A1A] font-serif text-2xl hover:text-[#B68C5E] transition">
                Contacto
              </button>
            </nav>

            <div className="p-6">
              {user.isLoggedIn && (
                <button onClick={() => {logout(); setIsMenuOpen(false);}} className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-sm font-medium transition">
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
              <h2 className="font-serif text-2xl text-[#1A1A1A]">Mi Bolsa</h2>
              <button onClick={toggleCart} className="text-gray-400 hover:text-black transition">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingCart size={48} strokeWidth={1} className="text-gray-200 mb-4" />
                  <p className="text-gray-500 text-sm">Tu bolsa de compras está vacía.</p>
                  <button onClick={toggleCart} className="mt-6 border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition">
                    Ver Productos
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map(item => (
                    <li key={item.id} className="flex gap-4 items-center">
                      <div className="w-20 h-24 bg-gray-100 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight text-[#1A1A1A] mb-1 line-clamp-2">{item.name}</h4>
                        <div className="text-gray-500 text-sm mb-2">${item.price.toLocaleString("es-AR")} c/u</div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-200">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 px-2 text-gray-500 hover:text-black">
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => addItem(item)} className="p-1 px-2 text-gray-500 hover:text-black">
                              <Plus size={12} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-xs text-gray-400 underline hover:text-red-500 transition">
                            Remover
                          </button>
                        </div>
                      </div>
                      <div className="text-right self-start font-bold text-sm text-[#1A1A1A]">
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
                  <span className="font-serif text-2xl text-[#1A1A1A]">${getCartTotal().toLocaleString("es-AR")}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#1A1A1A] text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#333] transition flex justify-center items-center gap-2"
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
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition">
              <X size={20} strokeWidth={1.5} />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="font-serif text-3xl text-[#1A1A1A] mb-2">Bienvenido</h3>
              <p className="text-gray-500 text-sm">Inicia sesión para una experiencia de compra más fluida.</p>
            </div>

            <div className="space-y-3 mb-8">
              <button type="button" onClick={() => setFormData({...formData, name: "Juan Pablo", email: "juan@example.com"})} className="w-full flex items-center justify-center gap-3 border border-gray-200 text-gray-700 text-sm font-medium py-3 hover:bg-gray-50 transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-4 h-4" alt="Google" />
                Continuar con Google
              </button>
            </div>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-xs font-semibold uppercase tracking-widest">Datos manuales</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-none outline-none focus:ring-1 focus:ring-[#1A1A1A] text-sm" placeholder="Nombre completo" />
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-none outline-none focus:ring-1 focus:ring-[#1A1A1A] text-sm" placeholder="Correo electrónico" />
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-none outline-none focus:ring-1 focus:ring-[#1A1A1A] text-sm" placeholder="Teléfono" />
              <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-none outline-none focus:ring-1 focus:ring-[#1A1A1A] text-sm" placeholder="Dirección de envío" />
              <button type="submit" className="w-full bg-[#1A1A1A] text-white text-xs font-bold tracking-widest uppercase py-4 hover:bg-[#333] transition mt-2">
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
            <button onClick={() => setIsContactOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition z-10">
              <X size={20} strokeWidth={1.5} />
            </button>
            
            <div className="md:w-1/2 flex flex-col justify-center">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-4">Nuestra Ubicación</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Visítanos en nuestra tienda física para disfrutar de la experiencia completa y degustar nuestros productos frescos.
                <br /><br />
                <strong>Hipólito Yrigoyen y Sarmiento</strong><br />
                Río Colorado, Río Negro.
              </p>
              
              <div className="flex flex-col gap-3">
                <button onClick={handleContactWhatsApp} className="w-full bg-[#1A1A1A] text-white text-xs font-bold tracking-widest uppercase py-4 hover:bg-[#333] transition flex justify-center items-center gap-2">
                  Escríbenos <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4 brightness-0 invert" />
                </button>
                <a href="https://maps.google.com/?q=-38.99355688461547,-64.09578943096835" target="_blank" rel="noopener noreferrer" className="w-full border border-gray-300 text-[#1A1A1A] text-xs font-bold tracking-widest uppercase py-4 hover:bg-gray-50 transition text-center flex items-center justify-center gap-2">
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
