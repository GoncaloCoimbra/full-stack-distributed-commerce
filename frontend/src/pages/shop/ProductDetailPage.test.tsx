// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../i18n';
import ProductDetailPage from './ProductDetailPage';
import { apiClient } from '@/services/apiClient';

vi.mock('@/services/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  },
}));

describe('ProductDetailPage language switching', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url === '/shop/products/1') {
        return Promise.resolve({ success: true, data: { product: { id: '1', name: 'Test Product', description: 'A test product', price: 10, inStock: true, rating: 4, reviews: 2, images: ['https://example.com/image.jpg'] }, reviews: [], ratingStats: {} } } as never);
      }
      return Promise.resolve({ success: true, data: { favorites: [] } } as never);
    });
    void i18n.changeLanguage('pt');
  });

  afterEach(() => {
    void i18n.changeLanguage('pt');
  });

  it('switches the loading copy to English when the user changes language', async () => {
    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url === '/shop/products/1') {
        return new Promise(() => undefined);
      }
      return Promise.resolve({ success: true, data: { favorites: [] } } as never);
    });

    await i18n.changeLanguage('en');

    render(
      <MemoryRouter initialEntries={['/shop/product/1']}>
        <Routes>
          <Route path="/shop/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading product/i)).toBeInTheDocument();
  });

  it('renders the FAQ link in English when the locale is switched', async () => {
    await i18n.changeLanguage('en');

    render(
      <MemoryRouter initialEntries={['/shop/product/1']}>
        <Routes>
          <Route path="/shop/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/view faqs/i)).toBeInTheDocument();
  });
});
