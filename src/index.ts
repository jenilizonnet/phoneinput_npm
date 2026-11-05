// Components
import { PhoneInput } from './components/PhoneInput';
export { PhoneInput };
export { CountryPicker } from './components/CountryPicker';
export { CountryItem } from './components/CountryItem';
export { SearchInput } from './components/SearchInput';

// Hooks
export { usePhoneInput } from './hooks/usePhoneInput';

// Data & Country Functions
export {
  COUNTRIES,
  COUNTRY_BY_CODE,
  COUNTRY_BY_CALLING_CODE,
  getAllCountries,
  getCountryByCode,
  getCountryByIsoCode,
  getCountryByCallingCode,
  getCountryIsoCode,
  getCountryLengths,
  getCountryMinLength,
  getCountryMaxLength,
} from './data/countries';

// Constants
export {
  DEFAULT_COUNTRY_CODE,
  DEFAULT_PLACEHOLDER,
  DEFAULT_SEARCH_PLACEHOLDER,
  DEFAULT_EMPTY_MESSAGE,
  DEFAULT_MODAL_TITLE,
  getFlagEmoji,
} from './constants';

// Utilities
export {
  validatePhoneNumber,
  validatePhoneNumberLength,
  isPhoneNumberValid,
  getCallingCode,
  getCountryCallingCodeNumber,
} from './utils/phoneValidation';
export {
  formatAsYouType,
  formatToE164,
  cleanDigits,
  filterCountries,
} from './utils/phoneFormatting';

// Types
export type {
  Country,
  CountryCode,
  CountryLengths,
  PhoneValidationResult,
  PhoneValidationStatus,
  PhoneInputRef,
  PhoneInputProps,
  CountryPickerProps,
  CountryItemProps,
  SearchInputProps,
} from './types';

export default PhoneInput;
