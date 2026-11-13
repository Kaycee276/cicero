import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export interface CiceroQRCodeProps {
  value: string;
  size?: number;
  className?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

export const CiceroQRCode: React.FC<CiceroQRCodeProps> = ({
  value,
  size = 200,
  className = '',
  level = 'M',
  includeMargin = true,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center p-3 bg-white rounded-lg border border-[#ededed] shadow-sm ${className}`}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
        imageSettings={{
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23171717'%3E%3Cpath d='M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 4.5l5 2.5v4.5c0 3.3-2.1 6.3-5 7.2-2.9-.9-5-3.9-5-7.2V9l5-2.5z'/%3E%3Cpath d='M10 11h4l-3 4h3' stroke='%233ecf8e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
          height: 28,
          width: 28,
          excavate: true,
        }}
      />
    </div>
  );
};
