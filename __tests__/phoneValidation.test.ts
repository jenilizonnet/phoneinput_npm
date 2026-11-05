import { validatePhoneNumber, getCallingCode } from '../src/utils/phoneValidation';
import {
  formatAsYouType,
  formatToE164,
  cleanDigits,
  filterCountries,
} from '../src/utils/phoneFormatting';
import { COUNTRIES } from '../src/data/countries';

describe('Phone Validation & Formatting Utilities', () => {
  describe('validatePhoneNumber', () => {
    it('should validate a valid US phone number correctly', () => {
      const result = validatePhoneNumber('2025550123', 'US');
      expect(result.isValid).toBe(true);
      expect(result.status).toBe('VALID');
      expect(result.e164Number).toBe('+12025550123');
      expect(result.callingCode).toBe('+1');
      expect(result.countryCode).toBe('US');
    });

    it('should validate a valid Indian phone number correctly', () => {
      const result = validatePhoneNumber('9876543210', 'IN');
      expect(result.isValid).toBe(true);
      expect(result.status).toBe('VALID');
      expect(result.e164Number).toBe('+919876543210');
      expect(result.callingCode).toBe('+91');
    });

    it('should validate a valid UK phone number correctly', () => {
      const result = validatePhoneNumber('7400123456', 'GB');
      expect(result.isValid).toBe(true);
      expect(result.status).toBe('VALID');
      expect(result.callingCode).toBe('+44');
    });

    it('should detect an empty phone number', () => {
      const result = validatePhoneNumber('', 'US');
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('EMPTY');
    });

    it('should detect an incomplete phone number while user is typing', () => {
      const result = validatePhoneNumber('202', 'US');
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('INCOMPLETE');
      expect(result.error).toBeDefined();
    });

    it('should detect an invalid phone number', () => {
      // 0000000000 is not a valid US mobile or landline
      const result = validatePhoneNumber('0000000000', 'US');
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('INVALID');
    });

    it('should handle E.164 formatted string directly', () => {
      const result = validatePhoneNumber('+447400123456', 'GB');
      expect(result.isValid).toBe(true);
      expect(result.status).toBe('VALID');
      expect(result.countryCode).toBe('GB');
    });
  });

  describe('getCallingCode', () => {
    it('should return correct calling codes', () => {
      expect(getCallingCode('US')).toBe('+1');
      expect(getCallingCode('IN')).toBe('+91');
      expect(getCallingCode('GB')).toBe('+44');
      expect(getCallingCode('DE')).toBe('+49');
      expect(getCallingCode('JP')).toBe('+81');
    });
  });

  describe('formatAsYouType', () => {
    it('should format digits as user types', () => {
      const formatted = formatAsYouType('2025550123', 'US');
      expect(formatted).toBe('(202) 555-0123');
    });

    it('should handle empty string safely', () => {
      expect(formatAsYouType('', 'US')).toBe('');
    });
  });

  describe('formatToE164', () => {
    it('should format national digits into E.164 string', () => {
      expect(formatToE164('9876543210', '+91')).toBe('+919876543210');
      expect(formatToE164('(202) 555-0123', '+1')).toBe('+12025550123');
    });
  });

  describe('cleanDigits', () => {
    it('should strip non-digits', () => {
      expect(cleanDigits('+1 (202) 555-0123')).toBe('12025550123');
      expect(cleanDigits('abc123xyz')).toBe('123');
    });
  });

  describe('filterCountries', () => {
    it('should filter countries by name', () => {
      const results = filterCountries(COUNTRIES, 'India');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((c) => c.code === 'IN')).toBe(true);
    });

    it('should filter countries by ISO code', () => {
      const results = filterCountries(COUNTRIES, 'US');
      expect(results.some((c) => c.code === 'US')).toBe(true);
    });

    it('should filter countries by calling code with or without plus', () => {
      const resultsWithPlus = filterCountries(COUNTRIES, '+91');
      expect(resultsWithPlus.some((c) => c.code === 'IN')).toBe(true);

      const resultsWithoutPlus = filterCountries(COUNTRIES, '91');
      expect(resultsWithoutPlus.some((c) => c.code === 'IN')).toBe(true);
    });

    it('should respect whitelist', () => {
      const whitelist = ['US', 'CA', 'MX'];
      const results = filterCountries(COUNTRIES, '', whitelist);
      expect(results.length).toBe(3);
      expect(results.every((c) => whitelist.includes(c.code))).toBe(true);
    });

    it('should respect blacklist', () => {
      const blacklist = ['US'];
      const results = filterCountries(COUNTRIES, '', undefined, blacklist);
      expect(results.some((c) => c.code === 'US')).toBe(false);
    });

    it('should return empty list when no countries match', () => {
      const results = filterCountries(COUNTRIES, 'NonExistentCountryName123');
      expect(results.length).toBe(0);
    });
  });
});

