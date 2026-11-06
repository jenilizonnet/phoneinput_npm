import {
  parsePhoneNumberFromString,
  CountryCode as LpnCountryCode,
  getCountryCallingCode,
} from 'libphonenumber-js';
import type { PhoneValidationResult, PhoneValidationStatus } from '../types';
import { getCountryByCode, getCountryLengths } from '../data/countries';

/**
 * Validates a phone number using libphonenumber-js and country-wise ITU rules.
 * Provides detailed minLength, maxLength, ISO code, calling code, and granular status.
 */
export function validatePhoneNumber(
  rawPhone: string,
  countryCode: string = 'US'
): PhoneValidationResult {
  const cleanPhone = (rawPhone || '').trim();
  let normalizedCountryCode = (countryCode || 'US').toUpperCase();
  let country = getCountryByCode(normalizedCountryCode);
  let callingCode = country ? country.callingCode : '+1';
  let countryCallingCode = country ? country.countryCode : '1';

  let lengths = getCountryLengths(normalizedCountryCode);
  let minLength = lengths.minLength;
  let maxLength = lengths.maxLength;
  let mobileLength = lengths.mobileLength;

  // Handle empty input
  if (!cleanPhone) {
    return {
      isValid: false,
      isPossible: false,
      status: 'EMPTY',
      countryCode: normalizedCountryCode,
      isoCode: normalizedCountryCode,
      callingCode,
      countryCallingCode,
      minLength,
      maxLength,
      mobileLength,
      currentLength: 0,
      isMinLengthReached: false,
      isMaxLengthExceeded: false,
      error: 'Phone number is required',
    };
  }

  // Extract pure digits
  const isE164Format = cleanPhone.startsWith('+');
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  let currentLength = digitsOnly.length;

  try {
    const lpnCode = normalizedCountryCode as LpnCountryCode;
    const parsed = isE164Format
      ? parsePhoneNumberFromString(cleanPhone)
      : parsePhoneNumberFromString(cleanPhone, lpnCode);

    // If E.164 formatted and country detected from prefix, update metadata
    if (parsed && parsed.country) {
      normalizedCountryCode = parsed.country;
      const detectedCountry = getCountryByCode(normalizedCountryCode);
      if (detectedCountry) {
        country = detectedCountry;
        callingCode = detectedCountry.callingCode;
        countryCallingCode = detectedCountry.countryCode;
        lengths = getCountryLengths(normalizedCountryCode);
        minLength = lengths.minLength;
        maxLength = lengths.maxLength;
        mobileLength = lengths.mobileLength;
      }
    }

    // Determine national digits length (excluding country calling code if international)
    const nationalDigits = parsed?.nationalNumber
      ? String(parsed.nationalNumber)
      : (isE164Format && digitsOnly.startsWith(countryCallingCode)
          ? digitsOnly.slice(countryCallingCode.length)
          : digitsOnly);

    currentLength = nationalDigits.length;
    const isMinLengthReached = currentLength >= minLength;
    const isMaxLengthExceeded = currentLength > maxLength;
    const countryName = country?.name || normalizedCountryCode;

    if (!parsed) {
      let status: PhoneValidationStatus = 'INVALID';
      let error: string | undefined = `Invalid phone number format for ${countryName}`;

      if (currentLength === 0) {
        status = 'EMPTY';
        error = 'Phone number is required';
      } else if (currentLength < minLength) {
        status = 'INCOMPLETE';
        error = minLength === maxLength
          ? `${countryName} phone number requires ${minLength} digits (entered: ${currentLength})`
          : `${countryName} phone number requires ${minLength}-${maxLength} digits (entered: ${currentLength})`;
      } else if (currentLength > maxLength) {
        status = 'TOO_LONG';
        error = `${countryName} phone number cannot exceed ${maxLength} digits (entered: ${currentLength})`;
      }

      return {
        isValid: false,
        isPossible: false,
        status,
        nationalNumber: nationalDigits,
        countryCode: normalizedCountryCode,
        isoCode: normalizedCountryCode,
        callingCode,
        countryCallingCode,
        minLength,
        maxLength,
        mobileLength,
        currentLength,
        isMinLengthReached,
        isMaxLengthExceeded,
        error,
      };
    }

    const rawIsValid = parsed.isValid();
    const isPossible = parsed.isPossible();

    let status: PhoneValidationStatus = 'INVALID';
    let error: string | undefined;
    let isValid = false;

    if (currentLength === 0) {
      status = 'EMPTY';
      error = 'Phone number is required';
    } else if (currentLength < minLength) {
      status = 'INCOMPLETE';
      error = minLength === maxLength
        ? `${countryName} phone number requires ${minLength} digits (entered: ${currentLength})`
        : `${countryName} phone number requires ${minLength}-${maxLength} digits (entered: ${currentLength})`;
    } else if (currentLength > maxLength) {
      status = 'TOO_LONG';
      error = `${countryName} phone number cannot exceed ${maxLength} digits (entered: ${currentLength})`;
    } else if (rawIsValid) {
      isValid = true;
      status = 'VALID';
      error = undefined;
    } else if (isPossible) {
      status = 'INVALID';
      error = normalizedCountryCode === 'IN'
        ? 'Invalid Indian mobile number (must start with 6, 7, 8, or 9)'
        : `Invalid phone number format for ${countryName}`;
    } else {
      status = 'INVALID';
      error = `Invalid phone number for ${countryName}`;
    }

    const e164Number = isValid
      ? parsed.format('E.164')
      : `${callingCode}${nationalDigits || digitsOnly}`;

    return {
      isValid,
      isPossible,
      status,
      e164Number,
      nationalNumber: nationalDigits,
      internationalNumber: parsed.formatInternational(),
      countryCode: normalizedCountryCode,
      isoCode: normalizedCountryCode,
      callingCode: parsed.countryCallingCode ? `+${parsed.countryCallingCode}` : callingCode,
      countryCallingCode: parsed.countryCallingCode || countryCallingCode,
      minLength,
      maxLength,
      mobileLength,
      currentLength,
      isMinLengthReached,
      isMaxLengthExceeded,
      error,
    };
  } catch {
    const isMinLengthReached = currentLength >= minLength;
    const isMaxLengthExceeded = currentLength > maxLength;

    return {
      isValid: false,
      isPossible: false,
      status: 'INVALID',
      countryCode: normalizedCountryCode,
      isoCode: normalizedCountryCode,
      callingCode,
      countryCallingCode,
      minLength,
      maxLength,
      mobileLength,
      currentLength,
      isMinLengthReached,
      isMaxLengthExceeded,
      error: 'Unable to parse phone number',
    };
  }
}

/**
 * Returns true if the phone number is valid for the given country.
 */
export function isPhoneNumberValid(rawPhone: string, countryCode?: string): boolean {
  return validatePhoneNumber(rawPhone, countryCode).isValid;
}

/**
 * Validates only the length of the phone number against country min/max limits.
 */
export function validatePhoneNumberLength(
  rawPhone: string,
  countryCode?: string
): 'EMPTY' | 'TOO_SHORT' | 'TOO_LONG' | 'VALID' {
  const result = validatePhoneNumber(rawPhone, countryCode);
  if (result.status === 'EMPTY') return 'EMPTY';
  if (result.currentLength < result.minLength) return 'TOO_SHORT';
  if (result.currentLength > result.maxLength) return 'TOO_LONG';
  return 'VALID';
}

/**
 * Safely retrieves calling code with '+' prefix for a country ISO code.
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

/**
 * Safely retrieves calling code digits without '+' prefix for a country ISO code.
 */
export function getCountryCallingCodeNumber(countryCode: string): string {
  const code = getCallingCode(countryCode);
  return code.replace(/\D/g, '');
}
