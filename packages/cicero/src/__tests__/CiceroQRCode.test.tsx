import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { CiceroQRCode } from '../components/CiceroQRCode';

describe('CiceroQRCode', () => {
  it('renders SVG QR code with value', () => {
    const { container } = render(
      <CiceroQRCode value="zcash:u1testrecipientaddress?amount=1.5" size={180} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('180');
    expect(svg?.getAttribute('height')).toBe('180');
  });

  it('applies custom className and default size', () => {
    const { container } = render(
      <CiceroQRCode value="u1testaddress123" className="custom-qr-class" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-qr-class');

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('200');
  });
});
