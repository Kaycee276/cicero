import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CiceroLogo } from '../components/CiceroLogo';

describe('CiceroLogo', () => {
  it('renders uppercase brand name with font-inscription style', () => {
    render(<CiceroLogo />);
    const logo = screen.getByText('CICERO');
    expect(logo).toBeTruthy();
    expect(logo.className).toContain('font-inscription');
    expect(logo.className).toContain('uppercase');
  });
});
