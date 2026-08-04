/**
 * Product Grid Component
 * Exibe produtos em grid com informações (preço, rating, badge, etc.)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ProductData } from '@/data/mockProducts';
import './ProductGrid.css';

interface ProductGridProps {
  products: ProductData[];
  loading?: boolean;
  onProductClick?: (product: ProductData) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  onProductClick,
}) => {
  const getBadgeLabel = (badge?: string) => {
    const labels: Record<string, string> = {
      new: '🆕 Novo',
      promo: '🏷️ Promoção',
      bestSeller: '⭐ Bestseller',
      limited: '⏰ Limitado',
    };
    return labels[badge!] || '';
  };

  const getDiscountPercent = (original?: number, current?: number) => {
    if (!original || !current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="product-card skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-price"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <h2>Nenhum produto encontrado</h2>
        <p>Tente ajustar os filtros para encontrar o que procura.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const discount = getDiscountPercent(product.originalPrice, product.price);

        return (
          <Link
            key={product.id}
            to={`/shop/product/${product.id}`}
            className="product-card"
            data-testid="product-card"
            onClick={() => onProductClick?.(product)}
          >
            {/* Badge */}
            {product.badge && (
              <div className={`product-badge badge-${product.badge}`}>
                {getBadgeLabel(product.badge)}
              </div>
            )}

            {/* Stock Status */}
            {!product.inStock && <div className="product-badge badge-outofstock">Sem Stock</div>}

            {/* Desconto */}
            {discount > 0 && (
              <div className="product-discount">-{discount}%</div>
            )}

            {/* Image */}
            <div className="product-image">
              <img src={product.image} alt={product.name} loading="lazy" />
              {product.images && product.images.length > 1 && (
                <div className="image-count">+{product.images.length - 1} imagens</div>
              )}
            </div>

            {/* Info */}
            <div className="product-info">
              {/* Brand */}
              <span className="product-brand">{product.brand}</span>

              {/* Name */}
              <h3 className="product-name">{product.name}</h3>

              {/* Category */}
              <div className="product-category">
                {product.category} {product.subcategory && `> ${product.subcategory}`}
              </div>

              {/* Description */}
              <p className="product-description">{product.description}</p>

              {/* Rating */}
              <div className="product-rating">
                <div className="stars">
                  {'⭐'.repeat(Math.round(product.rating))}
                </div>
                <span className="rating-value">{product.rating.toFixed(1)}</span>
                <span className="reviews-count">({product.reviews})</span>
              </div>

              {/* Stock Info */}
              <div className="product-stock">
                {product.inStock ? (
                  <span className="in-stock">
                    ✓ Em Stock ({product.stockQuantity} unidades)
                  </span>
                ) : (
                  <span className="out-of-stock">✗ Sem Stock</span>
                )}
              </div>

              {/* Price */}
              <div className="product-price">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="original-price">€{product.originalPrice.toFixed(2)}</span>
                )}
                <span className="current-price">€{product.price.toFixed(2)}</span>
              </div>

              {/* CTA Button */}
              <button className="product-cta">
                🛒 Ver Detalhes
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
