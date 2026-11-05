// Components
import { PhoneInput } from './components/PhoneInput';
export { PhoneInput };
export { CountryPicker } from './components/CountryPicker';
export { CountryItem } from './components/CountryItem';
export { SearchInput } from './components/SearchInput';

// Hooks
export { usePhoneInput } from './hooks/usePhoneInput';

// Data & Constants
export {
  COUNTRIES,
  COUNTRY_BY_CODE,
  getCountryByCode,
} from './data/countries';
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
  getCallingCode,
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
  PhoneValidationResult,
  PhoneValidationStatus,
  PhoneInputRef,
  PhoneInputProps,
  CountryPickerProps,
  CountryItemProps,
  SearchInputProps,
} from './types';

export default PhoneInput;

