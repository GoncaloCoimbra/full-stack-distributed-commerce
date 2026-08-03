// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import i18n from '../../i18n';
import RecentlyViewedPage from './RecentlyViewedPage';

describe('RecentlyViewedPage language switching', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'pt';
    void i18n.changeLanguage('pt');
  });

  afterEach(() => {
    void i18n.changeLanguage('pt');
  });

  it('switches the page copy to English when the user changes language', async () => {
    render(
      <MemoryRouter>
        <RecentlyViewedPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /vistos recentemente/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'en' } });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /recently viewed/i })).toBeInTheDocument();
    });
  });
});
