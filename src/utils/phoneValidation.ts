import {
  parsePhoneNumberFromString,
  CountryCode as LpnCountryCode,
  getCountryCallingCode,
} from 'libphonenumber-js';
import type { PhoneValidationResult, PhoneValidationStatus } from '../types';
import { getCountryByCode } from '../data/countries';

/**
 * Validates a phone number using libphonenumber-js for a specific country or E.164 number.
 */
export function validatePhoneNumber(
  rawPhone: string,
  countryCode: string
): PhoneValidationResult {
  const cleanPhone = (rawPhone || '').trim();
  const normalizedCountryCode = (countryCode || 'US').toUpperCase();
  const country = getCountryByCode(normalizedCountryCode);
  const callingCode = country ? country.callingCode : '+1';

  // Handle empty input
  if (!cleanPhone) {
    return {
      isValid: false,
      isPossible: false,
      status: 'EMPTY',
      countryCode: normalizedCountryCode,
      callingCode,
    };
  }

  try {
    const lpnCode = normalizedCountryCode as LpnCountryCode;
    // Check if rawPhone starts with '+' or contains only national digits
    const isE164Format = cleanPhone.startsWith('+');
    const parsed = isE164Format
      ? parsePhoneNumberFromString(cleanPhone)
      : parsePhoneNumberFromString(cleanPhone, lpnCode);

    if (!parsed) {
      // Numbers with fewer digits than standard are often INCOMPLETE while user is typing
      const digitsOnly = cleanPhone.replace(/\D/g, '');
      const isShort = digitsOnly.length < 5;

      return {
        isValid: false,
        isPossible: false,
        status: isShort ? 'INCOMPLETE' : 'INVALID',
        nationalNumber: digitsOnly,
        countryCode: normalizedCountryCode,
        callingCode,
        error: isShort ? 'Phone number is too short' : 'Invalid phone number format',
      };
    }

    const isValid = parsed.isValid();
    const isPossible = parsed.isPossible();

    let status: PhoneValidationStatus = 'INVALID';
    let error: string | undefined;

    if (isValid) {
      status = 'VALID';
    } else if (isPossible) {
      // Possible length but invalid format
      status = 'INVALID';
      error = 'Invalid phone number format for selected country';
    } else {
      // Number not possible (either too short or too long)
      const digits = cleanPhone.replace(/\D/g, '');
      if (digits.length <= 6) {
        status = 'INCOMPLETE';
        error = 'Phone number is incomplete';
      } else {
        status = 'INVALID';
        error = 'Phone number is too long or contains invalid characters';
      }
    }

    return {
      isValid,
      isPossible,
      status,
      e164Number: isValid ? parsed.format('E.164') : `${callingCode}${parsed.nationalNumber || cleanPhone}`,
      nationalNumber: parsed.nationalNumber ? String(parsed.nationalNumber) : cleanPhone.replace(/\D/g, ''),
      internationalNumber: parsed.formatInternational(),
      countryCode: parsed.country || normalizedCountryCode,
      callingCode: parsed.countryCallingCode ? `+${parsed.countryCallingCode}` : callingCode,
      error,
    };
  } catch (err) {
    return {
      isValid: false,
      isPossible: false,
      status: 'INVALID',
      countryCode: normalizedCountryCode,
      callingCode,
      error: 'Unable to parse phone number',
    };
  }
}

/**
 * Safely retrieves calling code for a country ISO code
 */
export function getCallingCode(countryCode: string): string {
  try {
    const code = countryCode.toUpperCase() as LpnCountryCode;
    const callingCode = getCountryCallingCode(code);
    return `+${callingCode}`;
  } catch {
    const match = getCountryByCode(countryCode);
    return match ? match.callingCode : '+1';
  }
}

