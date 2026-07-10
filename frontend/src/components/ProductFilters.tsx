/**
 * Advanced Product Filters
 * Filtros específicos por família de produtos
 */

import React, { useState } from 'react';
import './ProductFilters.css';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface ProductFiltersProps {
  onFilterChange?: (filterType: string, value: string[]) => void;
  showTopCategories?: boolean;
}

// 10 Categorias mais procuradas (exemplo com 350 familias)
const TOP_CATEGORIES: FilterOption[] = [
  { id: 'cat-01', label: 'Papel A4 (80gsm)', count: 1250 },
  { id: 'cat-02', label: 'Canetas Esferográficas', count: 980 },
  { id: 'cat-03', label: 'Cadernos e Blocos', count: 875 },
  { id: 'cat-04', label: 'Tinteiros HP/Canon', count: 756 },
  { id: 'cat-05', label: 'Agendas 2025/2026', count: 645 },
  { id: 'cat-06', label: 'Mochilas Escolares', count: 534 },
  { id: 'cat-07', label: 'Marcadores Stabilo', count: 489 },
  { id: 'cat-08', label: 'Tesouras Metálicas', count: 412 },
  { id: 'cat-09', label: 'Adesivos e Fita Washi', count: 387 },
  { id: 'cat-10', label: 'Toner Xerox/Samsung', count: 356 },
];

// Filtros específicos por tipo
const FAMILY_FILTERS = {
  brand: [
    { id: 'brand-01', label: 'BIC', count: 245 },
    { id: 'brand-02', label: 'Faber-Castell', count: 189 },
    { id: 'brand-03', label: 'Pilot', count: 167 },
    { id: 'brand-04', label: 'Stabilo', count: 145 },
    { id: 'brand-05', label: 'Oxford', count: 134 },
  ],
  size: [
    { id: 'size-01', label: 'A4 (210×297mm)', count: 2150 },
    { id: 'size-02', label: 'A5 (148×210mm)', count: 890 },
    { id: 'size-03', label: 'A3 (297×420mm)', count: 456 },
    { id: 'size-04', label: 'Caderno B5', count: 234 },
    { id: 'size-05', label: 'Mini (Bolsinha)', count: 167 },
  ],
  material: [
    { id: 'mat-01', label: 'Papel reciclado', count: 834 },
    { id: 'mat-02', label: 'Papel virgem branqueado', count: 1200 },
    { id: 'mat-03', label: 'Papel isento de ácido', count: 567 },
    { id: 'mat-04', label: 'Cartão', count: 456 },
    { id: 'mat-05', label: 'Tela (Lona)', count: 234 },
  ],
  color: [
    { id: 'col-01', label: 'Branco', count: 3456 },
    { id: 'col-02', label: 'Cores Variadas', count: 2345 },
    { id: 'col-03', label: 'Preto', count: 890 },
    { id: 'col-04', label: 'Pastel', count: 567 },
    { id: 'col-05', label: 'Neon', count: 234 },
  ],
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  showTopCategories = true,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [expandedSection, setExpandedSection] = useState<string>('top-categories');

  const toggleSelection = (
    value: string,
    selected: string[],
    setSelected: (items: string[]) => void,
    filterType: string
  ) => {
    const updated = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    setSelected(updated);
    onFilterChange?.(filterType, updated);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    onFilterChange?.('all', []);
  };

  const totalSelectedFilters =
    selectedCategories.length +
    selectedBrands.length +
    selectedSizes.length +
    selectedMaterials.length +
    selectedColors.length;

  return (
    <div className="product-filters">
      {/* Header */}
      <div className="filters-header">
        <h3>🔍 Filtros Avançados</h3>
        {totalSelectedFilters > 0 && (
          <button className="btn-clear-all" onClick={clearAllFilters}>
            ✕ Limpar ({totalSelectedFilters})
          </button>
        )}
      </div>

      {/* TOP 10 CATEGORIAS */}
      {showTopCategories && (
        <section className="filter-section">
          <button
            className="section-header"
            onClick={() =>
              setExpandedSection(expandedSection === 'top-categories' ? '' : 'top-categories')
            }
          >
            <span>📊 Top 10 Famílias</span>
            <span className={`expand-icon ${expandedSection === 'top-categories' ? 'open' : ''}`}>
              ▶
            </span>
          </button>

          {expandedSection === 'top-categories' && (
            <div className="filter-options">
              {TOP_CATEGORIES.map(cat => (
                <label key={cat.id} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() =>
                      toggleSelection(cat.id, selectedCategories, setSelectedCategories, 'category')
                    }
                  />
                  <span className="label-text">{cat.label}</span>
                  <span className="count">({cat.count})</span>
                </label>
              ))}
            </div>
          )}
        </section>
      )}

      {/* MARCAS */}
      <section className="filter-section">
        <button
          className="section-header"
          onClick={() => setExpandedSection(expandedSection === 'brands' ? '' : 'brands')}
        >
          <span>🏷️ Marcas</span>
          <span className={`expand-icon ${expandedSection === 'brands' ? 'open' : ''}`}>
            ▶
          </span>
        </button>

        {expandedSection === 'brands' && (
          <div className="filter-options">
            {FAMILY_FILTERS.brand.map(brand => (
              <label key={brand.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() =>
                    toggleSelection(brand.id, selectedBrands, setSelectedBrands, 'brand')
                  }
                />
                <span className="label-text">{brand.label}</span>
                <span className="count">({brand.count})</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* TAMANHO */}
      <section className="filter-section">
        <button
          className="section-header"
          onClick={() => setExpandedSection(expandedSection === 'sizes' ? '' : 'sizes')}
        >
          <span>📏 Tamanho</span>
          <span className={`expand-icon ${expandedSection === 'sizes' ? 'open' : ''}`}>
            ▶
          </span>
        </button>

        {expandedSection === 'sizes' && (
          <div className="filter-options">
            {FAMILY_FILTERS.size.map(size => (
              <label key={size.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size.id)}
                  onChange={() =>
                    toggleSelection(size.id, selectedSizes, setSelectedSizes, 'size')
                  }
                />
                <span className="label-text">{size.label}</span>
                <span className="count">({size.count})</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* MATERIAL */}
      <section className="filter-section">
        <button
          className="section-header"
          onClick={() => setExpandedSection(expandedSection === 'materials' ? '' : 'materials')}
        >
          <span>🎨 Material</span>
          <span className={`expand-icon ${expandedSection === 'materials' ? 'open' : ''}`}>
            ▶
          </span>
        </button>

        {expandedSection === 'materials' && (
          <div className="filter-options">
            {FAMILY_FILTERS.material.map(mat => (
              <label key={mat.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(mat.id)}
                  onChange={() =>
                    toggleSelection(mat.id, selectedMaterials, setSelectedMaterials, 'material')
                  }
                />
                <span className="label-text">{mat.label}</span>
                <span className="count">({mat.count})</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* COR */}
      <section className="filter-section">
        <button
          className="section-header"
          onClick={() => setExpandedSection(expandedSection === 'colors' ? '' : 'colors')}
        >
          <span>🎭 Cor</span>
          <span className={`expand-icon ${expandedSection === 'colors' ? 'open' : ''}`}>
            ▶
          </span>
        </button>

        {expandedSection === 'colors' && (
          <div className="filter-options">
            {FAMILY_FILTERS.color.map(color => (
              <label key={color.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color.id)}
                  onChange={() =>
                    toggleSelection(color.id, selectedColors, setSelectedColors, 'color')
                  }
                />
                <span className="label-text">{color.label}</span>
                <span className="count">({color.count})</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* RESUMO */}
      {totalSelectedFilters > 0 && (
        <div className="filters-summary">
          <p>📌 {totalSelectedFilters} filtro(s) ativo(s)</p>
          <button className="btn-apply-filters">✓ Aplicar Filtros</button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
export type { FilterOption };
