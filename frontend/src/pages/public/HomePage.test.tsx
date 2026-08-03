// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import i18n from '../../i18n';
import HomePage from './HomePage';

const originalIntersectionObserver = globalThis.IntersectionObserver;
const originalScrollTo = window.scrollTo;

describe('HomePage language switching', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'pt';
    Object.defineProperty(window, 'scrollTo', { value: () => undefined, writable: true });
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      writable: true,
      value: class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    });
    void i18n.changeLanguage('pt');
  });

  afterEach(() => {
    if (originalIntersectionObserver) {
      Object.defineProperty(globalThis, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: originalIntersectionObserver,
      });
    }
    Object.defineProperty(window, 'scrollTo', { value: originalScrollTo, writable: true });
  });

  it('updates the hero CTA and key section copy when the user switches to English', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /ver catálogo completo/i })).toBeInTheDocument();
    expect(screen.getByText(/porquê tranzor/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'en' } });

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /view full catalog/i })).toBeInTheDocument();
      expect(screen.getByText(/why tranzor/i)).toBeInTheDocument();
    });
  });
});
