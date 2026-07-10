// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../../i18n';
import AboutPage from './AboutPage';

describe('AboutPage translation', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'pt';
    void i18n.changeLanguage('pt');
  });

  it('renders the English hero copy when the language is switched to English', async () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    await i18n.changeLanguage('en');

    await waitFor(() => {
      expect(screen.getByText(/a portuguese brand with more than 30 years of reliable delivery/i)).toBeInTheDocument();
    });
  });
});
