export const DEFAULT_COUNTRY_CODE = 'US';
export const DEFAULT_PLACEHOLDER = 'Enter phone number';
export const DEFAULT_SEARCH_PLACEHOLDER = 'Search country or code...';
export const DEFAULT_EMPTY_MESSAGE = 'No countries found';
export const DEFAULT_MODAL_TITLE = 'Select Country';

/**
 * Converts a 2-letter ISO 3166-1 alpha-2 country code into its Unicode flag emoji.
 * e.g., 'US' -> '🇺🇸', 'IN' -> '🇮🇳'
 */
export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return '🌐';
  }
  const upper = countryCode.toUpperCase();
  const codePoint1 = 0x1f1e6 + (upper.charCodeAt(0) - 65);
  const codePoint2 = 0x1f1e6 + (upper.charCodeAt(1) - 65);
  return String.fromCodePoint(codePoint1, codePoint2);
}

