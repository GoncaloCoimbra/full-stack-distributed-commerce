/**
 * Shop Filters Component
 * Filtro lateral com categoria, subcategoria, marca, preço, etc.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import './ShopFilters.css';

export interface ShopFiltersProps {
  categories: string[];
  selectedCategory?: string;
  onCategoryChange: (category: string | undefined) => void;

  subcategories: string[];
  selectedSubcategory?: string;
  onSubcategoryChange: (subcategory: string | undefined) => void;

  brands: string[];
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;

  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;

  tags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;

  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  onSortChange: (sort: typeof sortBy) => void;

  totalProducts: number;
}

export const ShopFilters: React.FC<ShopFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  brands,
  selectedBrands,
  onBrandChange,
  priceRange,
  onPriceChange,
  tags,
  selectedTags,
  onTagsChange,
  sortBy,
  onSortChange,
  totalProducts,
}) => {
  const { t } = useTranslation();
  
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const setSelectedBrands = onBrandChange;
  const setSelectedTags = onTagsChange;

  return (
    <aside className="shop-filters">
      <div className="filters-header">
        <h2>{t('shop.shopFilters.filterTitle')}</h2>
        <button
          className="btn-clear-filters"
          onClick={() => {
            onCategoryChange(undefined);
            onSubcategoryChange(undefined);
            onBrandChange([]);
            onPriceChange([0, 500]);
            onTagsChange([]);
            onSortChange('relevance');
          }}
        >
          {t('shop.shopFilters.clearFilters')}
        </button>
      </div>

      {/* ORDENAÇÃO */}
      <div className="filter-section">
        <h3>{t('shop.shopFilters.sortBy')}</h3>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
        >
          <option value="relevance">{t('shop.shopFilters.sortRelevance')}</option>
          <option value="price-asc">{t('shop.shopFilters.sortPriceAsc')}</option>
          <option value="price-desc">{t('shop.shopFilters.sortPriceDesc')}</option>
          <option value="rating">{t('shop.shopFilters.sortRating')}</option>
          <option value="newest">{t('shop.shopFilters.sortNewest')}</option>
        </select>
      </div>

      {/* CATEGORIAS */}
      <div className="filter-section">
        <h3>{t('shop.shopFilters.categories')}</h3>
        <div className="filter-options">
          <label className={`filter-option ${!selectedCategory ? 'active' : ''}`}>
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => onCategoryChange(undefined)}
            />
            <span>{t('shop.shopFilters.allCategories')}</span>
            <span className="count">({categories.length})</span>
          </label>
          {categories.map((cat) => (
            <label key={cat} className={`filter-option ${selectedCategory === cat ? 'active' : ''}`}>
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => onCategoryChange(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* SUBCATEGORIAS (Aparecem se categoria selecionada) */}
      {selectedCategory && subcategories.length > 0 && (
        <div className="filter-section">
          <h3>{t('shop.shopFilters.subcategories')}</h3>
          <div className="filter-options">
            <label className={`filter-option ${!selectedSubcategory ? 'active' : ''}`}>
              <input
                type="radio"
                name="subcategory"
                checked={!selectedSubcategory}
                onChange={() => onSubcategoryChange(undefined)}
              />
              <span>{t('shop.shopFilters.allSubcategories')}</span>
            </label>
            {subcategories.map((subcat) => (
              <label key={subcat} className={`filter-option ${selectedSubcategory === subcat ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="subcategory"
                  checked={selectedSubcategory === subcat}
                  onChange={() => onSubcategoryChange(subcat)}
                />
                <span>{subcat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* FAIXA DE PREÇO */}
      <div className="filter-section">
        <h3>{t('shop.shopFilters.priceRange')}</h3>
        <div className="price-range">
          <label>
            {t('shop.shopFilters.minPrice')}
            <input
              type="number"
              min="0"
              value={priceRange[0]}
              onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
              className="price-input"
            />
          </label>
          <label>
            {t('shop.shopFilters.maxPrice')}
            <input
              type="number"
              min="0"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
              className="price-input"
            />
          </label>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="price-slider"
        />
      </div>

      {/* MARCAS */}
      {brands.length > 0 && (
        <div className="filter-section">
          <h3>{t('shop.shopFilters.brands')}</h3>
          <div className="filter-options">
            {brands.slice(0, 8).map((brand) => (
              <label key={brand} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
            {brands.length > 8 && (
              <details className="more-brands">
                <summary>{t('shop.shopFilters.viewMoreBrands', { count: brands.length - 8 })}</summary>
                <div className="filter-options">
                  {brands.slice(8).map((brand) => (
                    <label key={brand} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      )}

      {/* TAGS */}
      {tags.length > 0 && (
        <div className="filter-section">
          <h3>{t('shop.shopFilters.characteristics')}</h3>
          <div className="filter-tags">
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                className={`filter-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESUMO DE RESULTADOS */}
      <div className="filter-summary">
        <p>{t('shop.shopFilters.filterSummary', { count: totalProducts })}</p>
        {selectedCategory && <p>{t('shop.shopFilters.filterSummaryCategory', { category: selectedCategory })}</p>}
        {selectedSubcategory && <p>{t('shop.shopFilters.filterSummarySubcategory', { subcategory: selectedSubcategory })}</p>}
        {selectedBrands.length > 0 && <p>{t('shop.shopFilters.filterSummaryBrands', { count: selectedBrands.length })}</p>}
      </div>
    </aside>
  );
};

export default ShopFilters;
