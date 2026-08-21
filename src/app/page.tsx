import Image from "next/image";

const categories = [
  "FRUTOS SECOS", "MEDICINAL", "ALMACEN", "ACEITES", "VINOS/CERVEZAS/ALCOHOL",
  "CONFIT/GOLOS/BARRAS CEREAL", "CONDIMENTOS", "COSMETICA"
];

const mockProducts = [
  {
    "id": 1,
    "name": "Almendras peladas GUARA CHIQUITA 0.075g",
    "price": 2100,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/a21985cf-3e50-3f26-adc4-f20aafb2000a.jpg"
  },
  {
    "id": 2,
    "name": "Almendras peladas GUARA CHIQUITA 0.125g",
    "price": 3200,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/a21985cf-3e50-3f26-adc4-f20aafb2000a.jpg"
  },
  {
    "id": 3,
    "name": "Almendras peladas GUARA CHIQUITA 0.250g",
    "price": 6250,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/a21985cf-3e50-3f26-adc4-f20aafb2000a.jpg"
  },
  {
    "id": 4,
    "name": "Almendras peladas GUARA CHIQUITA 0.500g",
    "price": 12350,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/a21985cf-3e50-3f26-adc4-f20aafb2000a.jpg"
  },
  {
    "id": 5,
    "name": "Almendras peladas GUARA CHIQUITA 1kg",
    "price": 24500,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/a21985cf-3e50-3f26-adc4-f20aafb2000a.jpg"
  },
  {
    "id": 6,
    "name": "Almendras peladas NONPAREIL 25/27 0.075g",
    "price": 2800,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/e7862f6c-c508-3744-8ce4-cd314fcd7839.jpg"
  },
  {
    "id": 7,
    "name": "Almendras peladas NONPAREIL 25/27 0.125g",
    "price": 4500,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/aade86d6-19a2-3bef-89b0-884428da2623.jpg"
  },
  {
    "id": 8,
    "name": "Almendras peladas NONPAREIL 25/27 0.250g",
    "price": 8850,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/83e4e4f2-b51f-3e4e-be81-0df56532b242.jpg"
  },
  {
    "id": 9,
    "name": "Almendras peladas NONPAREIL 25/27 0.500g",
    "price": 17500,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/83e4e4f2-b51f-3e4e-be81-0df56532b242.jpg"
  },
  {
    "id": 10,
    "name": "Almendras peladas NONPAREIL 25/27 1kg",
    "price": 34800,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/83e4e4f2-b51f-3e4e-be81-0df56532b242.jpg"
  },
  {
    "id": 11,
    "name": "Avellanas con cascara 0.125g",
    "price": 1900,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/419d3e74-1829-35f2-b8f4-31bdea6a0fb9.jpg"
  },
  {
    "id": 12,
    "name": "Avellanas con cascara 0.250g",
    "price": 3700,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/23d0dbc6-3bff-3464-a360-8647145083ca.jpg"
  },
  {
    "id": 13,
    "name": "Avellanas peladas 0.075g",
    "price": 3600,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/1e94ac29-d7ff-3129-8143-0bdcaf13a6b9.jpg"
  },
  {
    "id": 14,
    "name": "Avellanas peladas 0.125g",
    "price": 5900,
    "category": "FRUTOS SECOS",
    "image": "https://img.milocal.app/4340/6266b361-240a-38b0-b3f6-4ebd72513698.jpg"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="text-xl font-bold tracking-tight">NuezApp</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-1 bg-orange-600 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-orange-700 transition">
            <span className="text-lg leading-none">🛒</span> Mis Compras
          </button>
        </div>
      </header>

      {/* Hero / Búsqueda */}
      <div className="p-4 bg-orange-500">
        <div className="relative max-w-4xl mx-auto">
          <input 
            type="text" 
            placeholder="Busca en NuezApp..." 
            className="w-full p-3 pl-4 rounded-xl shadow-inner outline-none text-gray-700 focus:ring-2 focus:ring-orange-300 transition"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 overflow-x-auto whitespace-nowrap bg-white shadow-sm border-b sticky top-[68px] z-40 scrollbar-hide">
        <div className="max-w-4xl mx-auto flex gap-3">
          {categories.map((cat, idx) => (
            <button key={idx} className={`px-4 py-2 rounded-full text-sm font-medium transition shrink-0 ${idx === 0 ? 'bg-orange-500 text-white shadow-md' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="p-4 max-w-4xl mx-auto mt-4">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-orange-600">FRUTOS SECOS</h2>
          <span className="text-sm text-gray-400">{mockProducts.length} productos</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {mockProducts.map((p) => (
            <div key={p.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1 group">
              <div>
                <div className="aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden relative">
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
                <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-2" title={p.name}>{p.name}</h3>
                <p className="text-xs text-orange-500 font-medium mb-3">{p.category}</p>
              </div>
              <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                <span className="font-bold text-base text-gray-900">${p.price.toLocaleString("es-AR")}</span>
                <button className="bg-orange-500 text-white w-8 h-8 rounded-full font-medium flex items-center justify-center hover:bg-orange-600 transition shadow-sm active:scale-95" title="Agregar al carrito">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t p-3 text-center text-xs text-gray-500 flex justify-center items-center gap-2 z-50">
        <span className="text-lg">📍</span> Hipólito Yrigoyen y Sarmiento, Río Colorado.
      </footer>
    </div>
  );
}
