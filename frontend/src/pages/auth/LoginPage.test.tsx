// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../../i18n';
import LoginPage from './LoginPage';

describe('LoginPage translations', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'pt';
    void i18n.changeLanguage('pt');
  });

  it('updates the visible auth copy when the language is switched to English', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByRole('heading', { name: /entrar na conta/i })).toBeInTheDocument();

    await i18n.changeLanguage('en');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    });
  });
});
