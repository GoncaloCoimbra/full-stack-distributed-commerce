// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'pt';
    void i18n.changeLanguage('pt');
  });

  it('switches between Portuguese, English and Spanish from a single dropdown', async () => {
    render(<LanguageSwitcher />);

    const select = screen.getByLabelText(/language/i) as HTMLSelectElement;
    expect(select.value).toBe('pt');

    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual(['Português', 'English', 'Español']);

    fireEvent.change(select, { target: { value: 'en' } });
    await waitFor(() => expect(select.value).toBe('en'));

    fireEvent.change(select, { target: { value: 'es' } });
    await waitFor(() => expect(select.value).toBe('es'));

    fireEvent.change(select, { target: { value: 'pt' } });
    await waitFor(() => expect(select.value).toBe('pt'));
  });
});
