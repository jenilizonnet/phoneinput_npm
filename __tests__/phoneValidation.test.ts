import {
  validatePhoneNumber,
  isPhoneNumberValid,
  validatePhoneNumberLength,
  getCallingCode,
  getCountryCallingCodeNumber,
} from '../src/utils/phoneValidation';
import {
  formatAsYouType,
  formatToE164,
  cleanDigits,
  filterCountries,
} from '../src/utils/phoneFormatting';
import {
  COUNTRIES,
  getCountryByCode,
  getCountryByIsoCode,
  getCountryByCallingCode,
  getCountryIsoCode,
  getCountryLengths,
  getCountryMinLength,
  getCountryMaxLength,
  getAllCountries,
} from '../src/data/countries';

describe('Phone Validation & Country Utilities', () => {
  describe('validatePhoneNumber with country min/max lengths and ISO codes', () => {
    it('should validate a valid US phone number with full metadata', () => {
      const result = validatePhoneNumber('2025550123', 'US');
      expect(result.isValid).toBe(true);
      expect(result.status).toBe('VALID');
      expect(result.e164Number).toBe('+12025550123');
      expect(result.callingCode).toBe('+1');
      expect(result.countryCallingCode).toBe('1');
      expect(result.countryCode).toBe('US');
      expect(result.isoCode).toBe('US');
      expect(result.minLength).toBe(10);
      expect(result.maxLength).toBe(10);
      expect(result.currentLength).toBe(10);
      expect(result.isMinLengthReached).toBe(true);
      expect(result.isMaxLengthExceeded).toBe(false);
    });

    it('should validate a valid Indian phone number correctly', () => {
      const result = validatePhoneNumber('9876543210', 'IN');
      expect(result.isValid).toBe(true);
      expect(result.status).toBe('VALID');
      expect(result.e164Number).toBe('+919876543210');
      expect(result.callingCode).toBe('+91');
      expect(result.countryCallingCode).toBe('91');
      expect(result.countryCode).toBe('IN');
      expect(result.isoCode).toBe('IN');
      expect(result.minLength).toBe(10);
      expect(result.maxLength).toBe(10);
      expect(result.currentLength).toBe(10);
      expect(result.isMinLengthReached).toBe(true);
      expect(result.isMaxLengthExceeded).toBe(false);
    });

    it('should reject Indian number with only 8 digits and report required 10 digits', () => {
      const result = validatePhoneNumber('98765432', 'IN');
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('INCOMPLETE');
      expect(result.currentLength).toBe(8);
      expect(result.minLength).toBe(10);
      expect(result.maxLength).toBe(10);
      expect(result.isMinLengthReached).toBe(false);
      expect(result.error).toContain('India');
      expect(result.error).toContain('10 digits');
    });

    it('should detect an incomplete phone number while user is typing', () => {
      const result = validatePhoneNumber('202', 'US');
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('INCOMPLETE');
      expect(result.currentLength).toBe(3);
      expect(result.isMinLengthReached).toBe(false);
      expect(result.isMaxLengthExceeded).toBe(false);
      expect(result.error).toContain('10 digits');
    });

    it('should detect an overly long number exceeding max length', () => {
      const result = validatePhoneNumber('20255501239999', 'US');
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('TOO_LONG');
      expect(result.currentLength).toBe(14);
      expect(result.isMaxLengthExceeded).toBe(true);
      expect(result.error).toContain('cannot exceed 10 digits');
    });

    it('should detect empty phone number', () => {
      const result = validatePhoneNumber('', 'IN');
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('EMPTY');
      expect(result.currentLength).toBe(0);
      expect(result.countryCode).toBe('IN');
      expect(result.isoCode).toBe('IN');
      expect(result.callingCode).toBe('+91');
      expect(result.error).toBe('Phone number is required');
    });

    it('should handle E.164 string and resolve country metadata', () => {
      const result = validatePhoneNumber('+447400123456');
      expect(result.isValid).toBe(true);
      expect(result.status).toBe('VALID');
      expect(result.countryCode).toBe('GB');
      expect(result.isoCode).toBe('GB');
      expect(result.callingCode).toBe('+44');
    });

    it('should validate UAE 9-digit number and reject 8 digits', () => {
      const valid = validatePhoneNumber('501234567', 'AE');
      expect(valid.isValid).toBe(true);
      expect(valid.minLength).toBe(9);
      expect(valid.maxLength).toBe(9);

      const short = validatePhoneNumber('50123456', 'AE');
      expect(short.isValid).toBe(false);
      expect(short.status).toBe('INCOMPLETE');
      expect(short.error).toContain('9 digits');
    });
  });

  describe('isPhoneNumberValid helper', () => {
    it('should return boolean correctly', () => {
      expect(isPhoneNumberValid('9876543210', 'IN')).toBe(true);
      expect(isPhoneNumberValid('98765432', 'IN')).toBe(false);
      expect(isPhoneNumberValid('123', 'IN')).toBe(false);
      expect(isPhoneNumberValid('2025550123', 'US')).toBe(true);
    });
  });

  describe('validatePhoneNumberLength helper', () => {
    it('should return appropriate length status', () => {
      expect(validatePhoneNumberLength('', 'US')).toBe('EMPTY');
      expect(validatePhoneNumberLength('202', 'US')).toBe('TOO_SHORT');
      expect(validatePhoneNumberLength('2025550123', 'US')).toBe('VALID');
      expect(validatePhoneNumberLength('20255501239999', 'US')).toBe('TOO_LONG');
      expect(validatePhoneNumberLength('98765432', 'IN')).toBe('TOO_SHORT');
      expect(validatePhoneNumberLength('9876543210', 'IN')).toBe('VALID');
    });
  });

  describe('Country lookup and metadata functions', () => {
    it('should retrieve country by ISO code and alias', () => {
      const india = getCountryByCode('IN');
      expect(india).toBeDefined();
      expect(india?.code).toBe('IN');
      expect(india?.isoCode).toBe('IN');
      expect(india?.callingCode).toBe('+91');
      expect(india?.countryCode).toBe('91');
      expect(india?.name).toBe('India');
      expect(india?.minLength).toBe(10);
      expect(india?.maxLength).toBe(10);
      expect(india?.mobileLength).toBe(10);

      const byIso = getCountryByIsoCode('us');
      expect(byIso?.code).toBe('US');
      expect(byIso?.isoCode).toBe('US');
      expect(byIso?.countryCode).toBe('1');
    });

    it('should retrieve country by calling code', () => {
      const usa = getCountryByCallingCode('+1');
      expect(usa).toBeDefined();
      expect(usa?.callingCode).toBe('+1');

      const india = getCountryByCallingCode('91');
      expect(india).toBeDefined();
      expect(india?.code).toBe('IN');
    });

    it('should retrieve country lengths for various countries', () => {
      const usLengths = getCountryLengths('US');
      expect(usLengths.minLength).toBe(10);
      expect(usLengths.maxLength).toBe(10);
      expect(getCountryMinLength('US')).toBe(10);
      expect(getCountryMaxLength('US')).toBe(10);

      const inLengths = getCountryLengths('IN');
      expect(inLengths.minLength).toBe(10);
      expect(inLengths.maxLength).toBe(10);
      expect(inLengths.mobileLength).toBe(10);
    });

    it('should resolve country ISO code from code or calling code', () => {
      expect(getCountryIsoCode('IN')).toBe('IN');
      expect(getCountryIsoCode('+91')).toBe('IN');
    });

    it('should return all 240+ countries with enriched fields', () => {
      const all = getAllCountries();
      expect(all.length).toBeGreaterThan(200);
      all.forEach((c) => {
        expect(c.code).toBeDefined();
        expect(c.isoCode).toBe(c.code);
        expect(c.callingCode.startsWith('+')).toBe(true);
        expect(c.countryCode).toBe(c.callingCode.replace('+', ''));
        expect(c.minLength).toBeGreaterThan(0);
        expect(c.maxLength).toBeGreaterThanOrEqual(c.minLength);
      });
    });

    it('should return calling code and number without plus', () => {
      expect(getCallingCode('IN')).toBe('+91');
      expect(getCountryCallingCodeNumber('IN')).toBe('91');
      expect(getCallingCode('US')).toBe('+1');
      expect(getCountryCallingCodeNumber('US')).toBe('1');
    });
  });

  describe('formatAsYouType and formatToE164', () => {
    it('should format digits as user types', () => {
      expect(formatAsYouType('2025550123', 'US')).toBe('(202) 555-0123');
    });

    it('should format to E.164', () => {
      expect(formatToE164('9876543210', '+91')).toBe('+919876543210');
      expect(formatToE164('(202) 555-0123', '+1')).toBe('+12025550123');
    });

    it('should clean digits', () => {
      expect(cleanDigits('+1 (202) 555-0123')).toBe('12025550123');
    });

    it('should filter countries correctly', () => {
      const results = filterCountries(COUNTRIES, 'India');
      expect(results.some((c) => c.code === 'IN')).toBe(true);
    });
  });
});
