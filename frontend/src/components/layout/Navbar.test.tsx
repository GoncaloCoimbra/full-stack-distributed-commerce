// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../../i18n';
import Navbar from './Navbar';

describe('Navbar translation', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'pt';
    void i18n.changeLanguage('pt');
  });

  it('updates the search dropdown copy when the language is switched to English', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/pesquisar/i);
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText(/pesquisas populares/i)).toBeInTheDocument();
    });

    await i18n.changeLanguage('en');

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
      expect(screen.getByText(/popular searches/i)).toBeInTheDocument();
    });
  });
});
