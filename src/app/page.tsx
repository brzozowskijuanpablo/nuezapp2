import Image from "next/image";

const categories = [
  "FRUTOS SECOS", "MEDICINAL", "ALMACEN", "ACEITES", "VINOS/CERVEZAS/ALCOHOL",
  "CONFIT/GOLOS/BARRAS CEREAL", "CONDIMENTOS", "COSMETICA"
];

const mockProducts = [
  { id: 1, name: "Almendras peladas GUARA CHIQUITA 0.075g", price: 2100, category: "FRUTOS SECOS" },
  { id: 2, name: "Almendras peladas GUARA CHIQUITA 0.125g", price: 3200, category: "FRUTOS SECOS" },
  { id: 3, name: "Avellanas con cascara 0.125g", price: 1900, category: "FRUTOS SECOS" },
  { id: 4, name: "Mix Energético 0.250g", price: 4500, category: "FRUTOS SECOS" },
  { id: 5, name: "Crema de Almendras", price: 5000, category: "COSMETICA" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="text-xl font-bold">NuezApp</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-1 bg-orange-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-orange-700 transition">
            <span>🛒</span> Mis Compras
          </button>
        </div>
      </header>

      {/* Hero / Búsqueda */}
      <div className="p-4 bg-orange-500">
        <input 
          type="text" 
          placeholder="Busca en NuezApp..." 
          className="w-full p-3 rounded-lg shadow-sm outline-none text-gray-700"
        />
      </div>

      {/* Categories */}
      <div className="p-4 overflow-x-auto whitespace-nowrap bg-white shadow-sm border-b sticky top-[72px] z-40 scrollbar-hide">
        {categories.map((cat, idx) => (
          <button key={idx} className="inline-block mr-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200">
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="p-4 max-w-4xl mx-auto mt-4">
        <h2 className="text-xl font-bold mb-4 text-orange-600 border-b pb-2">Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mockProducts.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border flex flex-col justify-between transition-transform hover:-translate-y-1">
              <div>
                <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-5xl">
                  🌰
                </div>
                <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2">{p.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{p.category}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-lg text-gray-900">${p.price.toLocaleString()}</span>
                <button className="bg-orange-500 text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 flex items-center gap-1 shadow-sm">
                  + Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-white border-t p-3 text-center text-sm text-gray-500 flex justify-center items-center gap-2 z-50">
        📍 Hipólito Yrigoyen y Sarmiento, Río Colorado.
      </footer>
    </div>
  );
}
