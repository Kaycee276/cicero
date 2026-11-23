export function normalizeHexColor(value: string | undefined, fallback: string): string {
  const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(value || '');
  if (!match) return fallback;
  if (match[1].length === 6) return `#${match[1].toLowerCase()}`;
  return `#${match[1]
    .split('')
    .map((digit) => digit + digit)
    .join('')
    .toLowerCase()}`;
}

export function getContrastTextColor(hexColor: string): '#171717' | '#ffffff' {
  const channels = hexColor
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => parseInt(channel, 16) / 255);
  if (!channels || channels.length !== 3) return '#171717';

  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return luminance > 0.179 ? '#171717' : '#ffffff';
}
