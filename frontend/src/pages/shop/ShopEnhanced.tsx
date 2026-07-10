/**
 * Enhanced Shop Page with Filters
 * Exibe produtos com sistema de filtros completo
 */

import React, { useState, useMemo } from 'react';
import AppLayout from '../../layouts/AppLayout';
import ShopFilters from '../../components/ShopFilters';
import ProductGrid from '../../components/ProductGrid';
import { MOCK_PRODUCTS, CATEGORIES_MAP, BRANDS, AVAILABLE_TAGS, ProductData } from '../../data/mockProducts';
import './ShopEnhanced.css';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const ShopEnhanced: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get available subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return CATEGORIES_MAP[selectedCategory as keyof typeof CATEGORIES_MAP] || [];
  }, [selectedCategory]);

  // Get available brands based on filtered products (before sorting)
  const availableBrands = useMemo(() => {
    const filtered = MOCK_PRODUCTS.filter(p => {
      let matches = true;

      if (selectedCategory && p.category !== selectedCategory) matches = false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) matches = false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) matches = false;

      return matches;
    });

    return Array.from(new Set(filtered.map(p => p.brand))).sort();
  }, [selectedCategory, selectedSubcategory, priceRange]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let results = MOCK_PRODUCTS.filter(product => {
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) return false;

      // Subcategory filter
      if (selectedSubcategory && product.subcategory !== selectedSubcategory) return false;

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

      // Tags filter
      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some(tag => product.tags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0));
        break;
      case 'relevance':
      default:
        // Keep original order
        break;
    }

    return results;
  }, [selectedCategory, selectedSubcategory, selectedBrands, priceRange, selectedTags, sortBy]);

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
    setSelectedSubcategory(undefined); // Reset subcategory when category changes
  };

  return (
    <AppLayout>
      <section className="shop-hero">
        <h1>🛍️ Catálogo de Produtos</h1>
        <p>Descubra milhares de produtos de qualidade com filtros avançados</p>
      </section>

      <section className="shop-container">
        <div className="shop-layout">
          {/* Filters Sidebar */}
          <ShopFilters
            categories={Object.keys(CATEGORIES_MAP)}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            subcategories={availableSubcategories}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={setSelectedSubcategory}
            brands={availableBrands}
            selectedBrands={selectedBrands}
            onBrandChange={setSelectedBrands}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            tags={AVAILABLE_TAGS}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalProducts={filteredProducts.length}
          />

          {/* Products Section */}
          <div className="products-section">
            {/* Header */}
            <div className="products-header">
              <div className="results-info">
                <h2>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Produto' : 'Produtos'}
                </h2>
                {selectedCategory && (
                  <span className="breadcrumb">
                    📂 {selectedCategory}
                    {selectedSubcategory && ` > 📁 ${selectedSubcategory}`}
                  </span>
                )}
              </div>

              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Vista em Grid"
                >
                  ⊞ Grid
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Vista em Lista"
                >
                  ≡ Lista
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              loading={false}
              onProductClick={(product) => {
                console.log('Produto clicado:', product.name);
              }}
            />

            {/* Load More / Pagination */}
            {filteredProducts.length > 0 && (
              <div className="pagination">
                <button className="btn-load-more">
                  ⬇️ Carregar Mais ({filteredProducts.length} de {MOCK_PRODUCTS.length})
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="shop-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <h3>Envio Rápido</h3>
              <p>Envios em 24h para Lisboa e arredores</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Seguro e Confidencial</h3>
              <p>Pagamento seguro com SSL 256-bit</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Melhores Preços</h3>
              <p>Garantimos os preços mais competitivos</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📞</div>
              <h3>Suporte 24/7</h3>
              <p>Ajuda disponível sempre que precisar</p>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default ShopEnhanced;
