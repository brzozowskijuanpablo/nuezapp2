"use client";

import { useState, useMemo } from "react";
import { useCartStore, Product } from "@/store/cartStore";
import { X, Plus, Minus, Trash2, ShoppingCart, Search, MapPin } from "lucide-react";

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

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { 
    items, isCartOpen, toggleCart, addItem, 
    removeItem, updateQuantity, getCartTotal, getCartCount 
  } = useCartStore();

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(p => {
      const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Agrupar productos filtrados por categoría para mantener la estructura visual
  const productsByCategory = useMemo(() => {
    const grouped = filteredProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
    
    // Ordenar las claves para que aparezcan en el orden definido en `categories`
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
    message += `\n*Total:* $${getCartTotal().toLocaleString("es-AR")}`;
    
    // Updated WhatsApp Number
    const whatsappUrl = `https://wa.me/542916419224?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm border-b">
        <div className="flex items-center">
          <img src="/logo.png" alt="NuezApp" className="h-12 object-contain" />
        </div>
        <button 
          onClick={toggleCart}
          className="relative flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-200 transition"
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Mis Compras</span>
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow">
              {getCartCount()}
            </span>
          )}
        </button>
      </header>

      {/* Hero / Búsqueda */}
      <div className="p-4 bg-white border-b shadow-sm">
        <div className="relative max-w-4xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Busca en NuezApp..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-xl bg-gray-100 border-none outline-none text-gray-700 focus:ring-2 focus:ring-orange-300 transition"
          />
        </div>
      </div>

      {/* Banner Publicitario (Menos invasivo) */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="w-full h-24 sm:h-32 rounded-2xl overflow-hidden shadow-sm relative">
          <img 
            src="https://img.milocal.app/4340/8acc2f16-02be-3122-93bd-15064be00e02.jpg" 
            alt="Promoción NuezApp" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 overflow-x-auto whitespace-nowrap bg-gray-50 sticky top-[72px] sm:top-[76px] z-30 scrollbar-hide">
        <div className="max-w-4xl mx-auto flex gap-3">
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition shrink-0 border ${
                activeCategory === cat 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
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
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-semibold mb-2">No encontramos resultados</p>
            <p>Vuelve a probar, ¡tenemos novedades geniales para ofrecerte!</p>
          </div>
        ) : (
          productsByCategory.map((group) => (
            <div key={group.category} className="mb-8">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <h2 className="text-xl font-bold text-gray-800">{group.category}</h2>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">
                  {group.products.length} {group.products.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.products.map((p) => {
                  const cartItem = items.find(i => i.id === p.id);
                  return (
                    <div key={p.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1 group">
                      <div>
                        <div className="aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden relative border border-gray-50">
                          {p.image ? (
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">🌰</div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-3 line-clamp-2" title={p.name}>{p.name}</h3>
                      </div>
                      <div className="flex justify-between items-center mt-auto pt-2">
                        <span className="font-bold text-base text-orange-600">${p.price.toLocaleString("es-AR")}</span>
                        {cartItem ? (
                          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg p-1">
                            <button onClick={() => updateQuantity(p.id, cartItem.quantity - 1)} className="text-orange-600 p-1 hover:bg-orange-100 rounded">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{cartItem.quantity}</span>
                            <button onClick={() => addItem(p)} className="text-orange-600 p-1 hover:bg-orange-100 rounded">
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addItem(p)}
                            className="bg-gray-900 text-white w-8 h-8 rounded-full font-medium flex items-center justify-center hover:bg-gray-800 transition shadow-sm active:scale-95" 
                            title="Agregar al carrito"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t p-3 text-center text-xs text-gray-500 flex justify-center items-center gap-2 z-30">
        <MapPin size={16} className="text-orange-500" /> Hipólito Yrigoyen y Sarmiento, Río Colorado.
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={toggleCart} />
          
          <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="text-orange-500" /> Tu Pedido
              </h2>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-200 rounded-full transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                  <ShoppingCart size={48} className="opacity-20" />
                  <p>Tu carrito está vacío</p>
                  <button onClick={toggleCart} className="mt-4 text-orange-500 font-medium hover:underline">
                    Explorar catálogo
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(item => (
                    <li key={item.id} className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 text-gray-800">{item.name}</h4>
                        <div className="text-orange-500 font-bold mt-1">${(item.price * item.quantity).toLocaleString("es-AR")}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition">
                          <Trash2 size={16} />
                        </button>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-600 hover:text-black">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => addItem(item)} className="p-1 text-gray-600 hover:text-black">
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
              <div className="p-4 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4 text-lg">
                  <span className="text-gray-600 font-medium">Total a pagar:</span>
                  <span className="font-bold text-2xl">${getCartTotal().toLocaleString("es-AR")}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition flex justify-center items-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  Confirmar Pedido <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
