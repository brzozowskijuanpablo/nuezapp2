"use client";

import { useState, useMemo, useEffect } from "react";
import { useCartStore, Product } from "@/store/cartStore";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  X, Plus, Minus, Trash2, ShoppingCart, Search, 
  MapPin, Menu, ShoppingBag, User, 
  LogOut, Map, ChevronRight, Infinity, PlayCircle
} from "lucide-react";

// Mocks & Constants
const categories = [
  "Todos",
  "FRUTOS SECOS", "MEDICINAL", "ALMACEN", "ACEITES", "VINOS/CERVEZAS/ALCOHOL",
  "CONFIT/GOLOS/BARRAS CEREAL", "CONDIMENTOS", "COSMETICA"
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
  "https://img.milocal.app/4340/8acc2f16-02be-3122-93bd-15064be00e02.jpg",
  "https://img.milocal.app/4340/966d9b72-557c-3fbb-a183-dabab8fc8d88.jpg",
  "https://img.milocal.app/4340/572b0cd3-b157-3e7c-a5a1-3322c5a0288c.jpg",
  "https://img.milocal.app/4340/f5222bdc-d7ba-3651-b46c-eaabfc9e8149.jpg",
  "https://img.milocal.app/4340/919c98ad-0fee-33e9-9b16-26a8f3c29bf1.jpg"
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
  { id: "7", title: "Pudín de Chía y Frutos Rojos", img: "https://images.unsplash.com/photo-1490474504059-bf2dbf3f9b17?auto=format&fit=crop&w=400&q=80", tag: "Desayuno Sano" },
  { id: "8", title: "Propiedades del Romero", img: "https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&w=400&q=80", tag: "Medicinal" },
  { id: "9", title: "Galletas Keto sin Harina", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80", tag: "Keto" },
  { id: "10", title: "Leche de Almendras Casera", img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80", tag: "Receta" }
];

const WHATSAPP_NUMBER = "542916419224";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  // Local state for login form
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  const { 
    items, isCartOpen, toggleCart, addItem, 
    removeItem, updateQuantity, getCartTotal, getCartCount,
    user, setUser, logout
  } = useCartStore();

  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3500 })]);

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

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen text-gray-900 pb-20 font-sans" style={{ backgroundColor: "#FFDCBF" }}>
      {/* Header */}
      <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm border-b border-orange-100">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(true)} className="text-amber-800 hover:text-amber-600 transition">
            <Menu size={28} />
          </button>
          <img src="/logo.png" alt="NuezApp" className="h-10 object-contain" />
        </div>
        <div className="flex items-center gap-3">
          {!user.isLoggedIn ? (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-amber-800 hover:bg-amber-100 p-2 rounded-full transition hidden sm:flex items-center gap-2"
            >
              <User size={20} />
              <span className="text-sm font-semibold">Ingresar</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full font-semibold text-sm truncate max-w-[120px]"
            >
              Hola, {user.name.split(' ')[0]}
            </button>
          )}

          <button 
            onClick={toggleCart}
            className="relative flex items-center justify-center bg-amber-700 text-white w-10 h-10 rounded-full shadow-md hover:bg-amber-800 transition"
          >
            <ShoppingCart size={18} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border border-white">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero / Búsqueda */}
      <div className="p-4" style={{ backgroundColor: "#FFDCBF" }}>
        <div className="relative max-w-4xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Busca en NuezApp..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3.5 pl-12 rounded-2xl shadow-sm outline-none text-gray-700 focus:ring-2 focus:ring-amber-500 transition border-none bg-white/90 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Banner Publicitario (Alto) */}
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <div className="w-full h-48 sm:h-64 rounded-3xl overflow-hidden shadow-lg relative" ref={emblaRef}>
          <div className="flex h-full">
            {bannerImages.map((src, index) => (
              <div className="flex-[0_0_100%] min-w-0 h-full relative" key={index}>
                <img 
                  src={src} 
                  alt={`Promoción ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-3 px-4 overflow-x-auto whitespace-nowrap sticky top-[73px] z-30 scrollbar-hide shadow-sm" style={{ backgroundColor: "#FFDCBF" }}>
        <div className="max-w-4xl mx-auto flex gap-3">
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition shrink-0 shadow-sm ${
                activeCategory === cat 
                  ? 'bg-amber-800 text-white' 
                  : 'bg-white text-amber-900 hover:bg-amber-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="p-4 max-w-4xl mx-auto mt-2">
        {productsByCategory.length === 0 ? (
          <div className="text-center py-20 text-amber-900/60 bg-white/40 rounded-3xl">
            <p className="text-xl font-semibold mb-2">No encontramos resultados</p>
            <p>Vuelve a probar, ¡tenemos novedades geniales para ofrecerte!</p>
          </div>
        ) : (
          productsByCategory.map((group) => (
            <div key={group.category} className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-900/10">
                <h2 className="text-xl font-extrabold text-amber-900">{group.category}</h2>
                <span className="text-xs bg-amber-900/10 text-amber-900 px-3 py-1 rounded-full font-bold">
                  {group.products.length} {group.products.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {group.products.map((p) => {
                  const cartItem = items.find(i => i.id === p.id);
                  return (
                    <div key={p.id} className="bg-white p-3 rounded-3xl shadow-sm hover:shadow-lg flex flex-row sm:flex-col items-center sm:items-stretch gap-4 sm:gap-0 transition-all group overflow-hidden border border-white/50">
                      <div className="w-24 h-24 sm:w-full sm:h-auto shrink-0">
                        <div className="aspect-square bg-gray-50 rounded-2xl sm:mb-3 overflow-hidden relative">
                          {p.image ? (
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">🌰</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between h-full sm:h-auto py-1 sm:py-0">
                        <h3 className="font-bold text-gray-800 text-[14px] leading-tight mb-2 line-clamp-2" title={p.name}>{p.name}</h3>
                        <div className="flex justify-between items-center mt-auto sm:pt-2">
                          <span className="font-extrabold text-[16px] text-amber-700">${p.price.toLocaleString("es-AR")}</span>
                          {cartItem ? (
                            <div className="flex items-center gap-1.5 bg-amber-50 rounded-xl p-1 shadow-inner shrink-0">
                              <button onClick={() => updateQuantity(p.id, cartItem.quantity - 1)} className="text-amber-700 bg-white shadow-sm p-1.5 hover:bg-gray-50 rounded-lg active:scale-95 transition">
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold w-4 text-center text-amber-900">{cartItem.quantity}</span>
                              <button onClick={() => addItem(p)} className="text-white bg-amber-700 shadow-sm p-1.5 hover:bg-amber-800 rounded-lg active:scale-95 transition">
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => addItem(p)}
                              className="bg-amber-100 text-amber-800 w-10 h-10 rounded-xl font-bold flex items-center justify-center hover:bg-amber-700 hover:text-white transition shadow-sm active:scale-95 shrink-0" 
                              title="Agregar al carrito"
                            >
                              <Plus size={18} />
                            </button>
                          )}
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

      {/* Instagram Feed Section */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-amber-900 flex items-center justify-center gap-2 mb-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="w-8 h-8" />
              Novedades en NuezApp
            </h2>
            <p className="text-gray-600">¡Síguenos y entérate de nuestras ofertas, sorteos y recetas increíbles!</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
            {instagramFeed.map((img, i) => (
              <a 
                key={i} 
                href="https://www.instagram.com/nuezapprio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm block bg-gray-100"
              >
                <img 
                  src={img} 
                  alt={`Instagram Post ${i+1}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Insta" className="w-8 h-8 brightness-0 invert" />
                </div>
              </a>
            ))}
          </div>

          <div className="text-center">
            <a 
              href="https://www.instagram.com/nuezapprio/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              Ver más en @nuezapprio <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Recetas y Salud (Videos) Section */}
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-12">
        <div className="bg-amber-900 rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold flex items-center gap-2 mb-2 text-white">
                <PlayCircle className="text-amber-400" size={28} /> Recetas y Salud
              </h2>
              <p className="text-amber-100/80 max-w-md">Descubre cómo preparar desayunos saludables, alimentación keto y los mejores usos de nuestras semillas.</p>
            </div>
          </div>

          <div className="relative z-10 flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {videoRecetas.map((video) => (
              <a 
                key={video.id} 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-start shrink-0 w-40 sm:w-48 group cursor-pointer"
              >
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-amber-800 shadow-md border border-amber-800/50">
                  <img 
                    src={video.img} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-amber-500 transition-colors border border-white/30">
                      <PlayCircle className="text-white ml-1" size={24} />
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="inline-block bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 uppercase tracking-wide">
                      {video.tag}
                    </span>
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 shadow-black drop-shadow-md">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-[280px] max-w-[80vw] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 bg-[#FFDCBF] flex justify-between items-start">
              <div>
                <img src="/logo.png" alt="NuezApp" className="h-14 object-contain mb-4" />
                {user.isLoggedIn ? (
                  <div>
                    <p className="font-bold text-amber-900 text-lg">{user.name}</p>
                    <p className="text-amber-800/80 text-sm">{user.email}</p>
                  </div>
                ) : (
                  <button onClick={() => {setIsMenuOpen(false); setIsLoginModalOpen(true);}} className="bg-white text-amber-900 px-4 py-2 rounded-full font-bold text-sm shadow-sm">
                    Iniciar Sesión
                  </button>
                )}
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="bg-white/50 text-amber-900 p-2 rounded-full hover:bg-white transition">
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              <button onClick={() => {setIsMenuOpen(false); toggleCart();}} className="w-full flex items-center justify-between p-4 hover:bg-amber-50 rounded-2xl transition group">
                <div className="flex items-center gap-4 text-amber-900 font-bold">
                  <div className="bg-amber-100 p-2 rounded-xl group-hover:bg-amber-200 transition"><ShoppingBag size={22} className="text-amber-800" /></div>
                  Mis Compras
                </div>
                <ChevronRight size={20} className="text-amber-300" />
              </button>
              
              <button onClick={() => {setIsMenuOpen(false); setIsContactOpen(true);}} className="w-full flex items-center justify-between p-4 hover:bg-amber-50 rounded-2xl transition group">
                <div className="flex items-center gap-4 text-amber-900 font-bold">
                  <div className="bg-amber-100 p-2 rounded-xl group-hover:bg-amber-200 transition"><MapPin size={22} className="text-amber-800" /></div>
                  Ubicación y Contacto
                </div>
                <ChevronRight size={20} className="text-amber-300" />
              </button>
            </nav>

            <div className="p-6 border-t border-gray-100 space-y-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Creado con Infinity</p>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition group">
                <div className="flex items-center gap-4 text-gray-700 font-bold">
                  <div className="bg-white p-2 rounded-xl shadow-sm"><Infinity size={22} className="text-amber-700" /></div>
                  <div className="text-left">
                    <p className="text-[15px]">Acerca de Infinity</p>
                    <p className="text-xs font-normal text-gray-500">Digitaliza tu negocio hoy</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
              </button>
              
              {user.isLoggedIn && (
                <button onClick={() => {logout(); setIsMenuOpen(false);}} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition justify-center mt-4">
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={toggleCart} />
          
          <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 rounded-l-3xl overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center bg-[#FFDCBF]">
              <h2 className="text-xl font-extrabold flex items-center gap-3 text-amber-900">
                <div className="bg-white p-2 rounded-xl shadow-sm"><ShoppingCart size={20} className="text-amber-700" /></div> 
                Tu Pedido
              </h2>
              <button onClick={toggleCart} className="bg-white/50 text-amber-900 p-2 rounded-full hover:bg-white transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <ShoppingCart size={40} className="text-gray-300" />
                  </div>
                  <p className="font-semibold text-gray-500">Tu carrito está vacío</p>
                  <button onClick={toggleCart} className="mt-2 bg-amber-700 text-white px-6 py-2 rounded-full font-bold shadow-sm active:scale-95 transition">
                    Explorar catálogo
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map(item => (
                    <li key={item.id} className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[13px] leading-tight line-clamp-2 text-gray-800 mb-1">{item.name}</h4>
                        <div className="text-amber-700 font-extrabold text-[15px]">${(item.price * item.quantity).toLocaleString("es-AR")}</div>
                      </div>
                      <div className="flex flex-col items-end gap-3 justify-between h-full">
                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition p-1">
                          <Trash2 size={16} />
                        </button>
                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 border border-gray-100">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-500 hover:text-black bg-white rounded shadow-sm">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                          <button onClick={() => addItem(item)} className="p-1 text-gray-500 hover:text-black bg-white rounded shadow-sm">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {items.length > 0 && (
              <div className="p-5 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10">
                <div className="flex justify-between items-center mb-4 text-lg">
                  <span className="text-gray-500 font-bold">Total a pagar</span>
                  <span className="font-extrabold text-2xl text-amber-900">${getCartTotal().toLocaleString("es-AR")}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#20b858] transition flex justify-center items-center gap-2 shadow-lg active:scale-[0.98]"
                >
                  Confirmar Pedido <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 brightness-0 invert" />
                </button>
                {!user.isLoggedIn && (
                  <p className="text-center text-xs text-gray-400 mt-3">
                    <button onClick={() => {toggleCart(); setIsLoginModalOpen(true);}} className="text-amber-600 underline font-semibold">Inicia sesión</button> para agilizar tus envíos.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Login / Profile Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsLoginModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 bg-gray-100 text-gray-500 p-2 rounded-full hover:bg-gray-200 transition">
              <X size={18} />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <User size={32} />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800">Mi Perfil</h3>
              <p className="text-gray-500 text-sm mt-1">Ingresa tus datos para agilizar el pedido</p>
            </div>

            {/* Mock SSO Buttons */}
            <div className="space-y-3 mb-6">
              <button 
                type="button"
                onClick={() => setFormData({...formData, name: "Juan Pablo", email: "juan@example.com"})}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition shadow-sm"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5 h-5" alt="Google" />
                Continuar con Google
              </button>
              <button 
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-[#00a4ef] text-white font-bold py-3 rounded-xl hover:bg-[#0092d6] transition shadow-sm"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="w-5 h-5 brightness-0 invert" alt="Microsoft" />
                Continuar con Microsoft
              </button>
            </div>

            <div className="relative flex items-center py-2 mb-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase">O completa tus datos</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Nombre completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition text-sm font-medium" placeholder="Ej: Juan Pérez" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition text-sm font-medium" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Teléfono</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition text-sm font-medium" placeholder="Cod área + Número" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Dirección de entrega</label>
                <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition text-sm font-medium" placeholder="Calle, Número, Piso/Depto" />
              </div>
              <button type="submit" className="w-full bg-amber-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-amber-800 transition active:scale-[0.98] mt-2">
                Guardar Datos
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Info Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsContactOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsContactOpen(false)} className="absolute top-4 right-4 bg-gray-100 text-gray-500 p-2 rounded-full hover:bg-gray-200 transition z-10">
              <X size={18} />
            </button>
            
            <div className="space-y-6 pt-4">
              <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="w-6 h-6" /> Síguenos en Instagram
                </h2>
                <p className="text-gray-700 text-sm mb-4">Entérate de todas nuestras novedades, sorteos y nuevos ingresos.</p>
                <a 
                  href="https://www.instagram.com/nuezapprio/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition"
                >
                  @nuezapprio
                </a>
              </div>

              <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <MapPin className="text-red-500" /> Nuestra Ubicación
                </h2>
                <p className="text-gray-700 text-sm mb-4 font-medium">Hipólito Yrigoyen y Sarmiento, Río Colorado.</p>
                
                <div className="flex flex-wrap gap-3 mb-5">
                  <button 
                    onClick={handleContactWhatsApp}
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full font-bold shadow-sm hover:bg-[#20b858] transition"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 brightness-0 invert" />
                    Escríbenos
                  </button>
                  <a 
                    href="https://maps.google.com/?q=-38.99355688461547,-64.09578943096835" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-full font-bold shadow-sm hover:bg-blue-100 transition border border-blue-200"
                  >
                    <Map size={18} />
                    Abrir en Maps
                  </a>
                </div>

                <div className="w-full h-64 rounded-2xl overflow-hidden shadow-inner border border-blue-200">
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
          </div>
        </div>
      )}
    </div>
  );
}
