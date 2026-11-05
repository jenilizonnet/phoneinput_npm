import { AsYouType, CountryCode as LpnCountryCode } from 'libphonenumber-js';
import type { Country } from '../types';

/**
 * Formats a phone number dynamically as the user types using AsYouType formatter.
 */
export function formatAsYouType(rawInput: string, countryCode: string): string {
  if (!rawInput) return '';

  const cleanCountryCode = (countryCode || 'US').toUpperCase() as LpnCountryCode;
  
  // Strip non-digit characters except leading plus if any
  const hasPlus = rawInput.startsWith('+');
  const digits = rawInput.replace(/\D/g, '');

  if (!digits) {
    return hasPlus ? '+' : '';
  }

  try {
    const formatter = new AsYouType(cleanCountryCode);
    // If the input doesn't have a plus, format as national number for the country
    return formatter.input(hasPlus ? `+${digits}` : digits);
  } catch {
    return rawInput;
  }
}

/**
 * Normalizes input to E.164 formatted string (+<callingCode><digits>)
 */
export function formatToE164(nationalNumber: string, callingCode: string): string {
  const digits = nationalNumber.replace(/\D/g, '');
  if (!digits) return '';

  const cleanCallingCode = callingCode.startsWith('+')
    ? callingCode
    : `+${callingCode.replace(/\D/g, '')}`;

  return `${cleanCallingCode}${digits}`;
}

/**
 * Strips non-digit characters from string
 */
export function cleanDigits(input: string): string {
  return (input || '').replace(/\D/g, '');
}

/**
 * Filters the country list based on search term, whitelist, and blacklist
 */
export function filterCountries(
  allCountries: Country[],
  searchQuery: string,
  whitelist?: string[],
  blacklist?: string[]
): Country[] {
  let list = allCountries;

  // Apply whitelist if provided
  if (whitelist && whitelist.length > 0) {
    const allowed = new Set(whitelist.map((c) => c.toUpperCase()));
    list = list.filter((c) => allowed.has(c.code.toUpperCase()));
  }

  // Apply blacklist if provided
  if (blacklist && blacklist.length > 0) {
    const excluded = new Set(blacklist.map((c) => c.toUpperCase()));
    list = list.filter((c) => !excluded.has(c.code.toUpperCase()));
  }

  // Apply search query
  const query = (searchQuery || '').trim().toLowerCase();
  if (!query) {
    return list;
  }

  const queryCallingCode = query.startsWith('+') ? query : `+${query}`;

  return list.filter((country) => {
    const nameMatch = country.name.toLowerCase().includes(query);
    const codeMatch = country.code.toLowerCase().includes(query);
    const callingCodeMatch =
      country.callingCode.includes(query) ||
      country.callingCode.includes(queryCallingCode);

    return nameMatch || codeMatch || callingCodeMatch;
  });
}

