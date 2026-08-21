import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add state and modify useMemo
state_code = """  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setVisibleCount(24);
  }, [activeCategory, searchQuery]);

  const filteredProducts = useMemo(() => {"""
content = content.replace("  const filteredProducts = useMemo(() => {", state_code)

displayed_code = """  }, [activeCategory, searchQuery]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const productsByCategory = useMemo(() => {
    const grouped = displayedProducts.reduce((acc, product) => {"""
content = content.replace("  }, [activeCategory, searchQuery]);\n\n  const productsByCategory = useMemo(() => {\n    const grouped = filteredProducts.reduce((acc, product) => {", displayed_code)

content = content.replace("  }, [filteredProducts]);", "  }, [displayedProducts]);")

# 2. Add fixed scroll container
container_start = """          {/* Product Grid (Editorial Style) */}
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
          {productsByCategory.length === 0 ? ("""
content = content.replace("          {/* Product Grid (Editorial Style) */}\n          {productsByCategory.length === 0 ? (", container_start)

container_end = """              </div>
            ))
          )}
          </div>
        </section>"""
content = content.replace("              </div>\n            ))\n          )}\n        </section>", container_end)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
