import type { StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import type { CountryCode as LpnCountryCode } from 'libphonenumber-js';

export type CountryCode = LpnCountryCode | string;

export interface CountryLengths {
  /** Minimum valid national phone number length in digits */
  minLength: number;
  /** Maximum valid national phone number length in digits */
  maxLength: number;
  /** Typical national mobile number length in digits */
  mobileLength: number;
  /** All possible valid national number lengths */
  possibleLengths: number[];
}

export interface Country {
  /** ISO 3166-1 alpha-2 two-letter code (e.g., 'US', 'IN', 'GB') */
  code: string;
  /** ISO 3166-1 alpha-2 two-letter code alias (e.g., 'US', 'IN', 'GB') */
  isoCode: string;
  /** Full english country name (e.g., 'United States', 'India') */
  name: string;
  /** International calling code with '+' prefix (e.g., '+1', '+91') */
  callingCode: string;
  /** Calling code digits without '+' prefix (e.g., '1', '91') */
  countryCode: string;
  /** Unicode emoji flag */
  flag: string;
  /** Example national phone number format */
  example?: string;
  /** Minimum national phone number length in digits */
  minLength: number;
  /** Maximum national phone number length in digits */
  maxLength: number;
  /** Typical national mobile phone number length in digits */
  mobileLength?: number;
  /** All possible valid national number lengths */
  possibleLengths?: number[];
}

export type PhoneValidationStatus =
  | 'VALID'
  | 'INVALID'
  | 'INCOMPLETE'
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'EMPTY';

export interface PhoneValidationResult {
  /** Whether the current phone number is valid according to E.164 / country rules */
  isValid: boolean;
  /** Whether the phone number length is possible for the given country */
  isPossible: boolean;
  /** Granular status for UI feedback */
  status: PhoneValidationStatus;
  /** Standardized E.164 formatted number (e.g., '+12025550123') */
  e164Number?: string;
  /** National formatted phone number without calling code (e.g., '2025550123') */
  nationalNumber?: string;
  /** International formatted phone number (e.g., '+1 202-555-0123') */
  internationalNumber?: string;
  /** Selected country ISO code (e.g., 'US', 'IN') */
  countryCode: string;
  /** Selected country ISO code alias (e.g., 'US', 'IN') */
  isoCode: string;
  /** Selected country calling code with '+' prefix (e.g., '+1', '+91') */
  callingCode: string;
  /** Selected country calling code digits without '+' prefix (e.g., '1', '91') */
  countryCallingCode: string;
  /** Minimum valid length for selected country */
  minLength: number;
  /** Maximum valid length for selected country */
  maxLength: number;
  /** Typical mobile length for selected country */
  mobileLength?: number;
  /** Number of national digits entered so far */
  currentLength: number;
  /** Whether current digits count meets or exceeds minimum length */
  isMinLengthReached: boolean;
  /** Whether current digits count exceeds maximum allowed length */
  isMaxLengthExceeded: boolean;
  /** Human-readable error message if invalid */
  error?: string;
}

export interface PhoneInputRef {
  /** Focus the phone number TextInput */
  focus: () => void;
  /** Blur the phone number TextInput */
  blur: () => void;
  /** Programmatically open country picker */
  openCountryPicker: () => void;
  /** Programmatically close country picker */
  closeCountryPicker: () => void;
  /** Check if current value is valid */
  isValid: () => boolean;
  /** Get current selected country object */
  getCountry: () => Country;
  /** Get current country ISO code (e.g., 'IN', 'US') */
  getCountryCode: () => string;
  /** Get current country ISO code alias (e.g., 'IN', 'US') */
  getIsoCode: () => string;
  /** Get current country calling code with '+' (e.g., '+91', '+1') */
  getCallingCode: () => string;
  /** Get minimum allowed national number length for selected country */
  getMinLength: () => number;
  /** Get maximum allowed national number length for selected country */
  getMaxLength: () => number;
  /** Get latest full validation result */
  getValidationResult: () => PhoneValidationResult;
  /** Get current phone number value */
  getPhoneNumber: () => string;
  /** Get full E.164 phone number */
  getFullNumber: () => string;
  /** Clear input */
  clear: () => void;
}

export interface CountryPickerProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Currently selected country */
  selectedCountry: Country;
  /** Callback fired when a country is selected */
  onSelectCountry: (country: Country) => void;
  /** Callback fired to close the modal */
  onClose: () => void;
  /** Whitelist of country ISO codes to include */
  countries?: string[];
  /** Blacklist of country ISO codes to exclude */
  excludeCountries?: string[];
  /** Whether search functionality is enabled */
  enableSearch?: boolean;
  /** Custom search placeholder */
  searchPlaceholder?: string;
  /** Custom empty results message */
  emptyResultsMessage?: string;
  /** Modal style */
  modalStyle?: StyleProp<ViewStyle>;
  /** Modal overlay background style */
  overlayStyle?: StyleProp<ViewStyle>;
  /** Search input container style */
  searchContainerStyle?: StyleProp<ViewStyle>;
  /** Search text input style */
  searchInputStyle?: StyleProp<TextStyle>;
  /** Search text input placeholder text color */
  searchPlaceholderTextColor?: string;
  /** Country row item style */
  countryItemStyle?: StyleProp<ViewStyle>;
  /** Selected country row style */
  selectedCountryItemStyle?: StyleProp<ViewStyle>;
  /** Country flag text style */
  flagStyle?: StyleProp<TextStyle>;
  /** Country name text style */
  countryNameStyle?: StyleProp<TextStyle>;
  /** Calling code text style */
  callingCodeStyle?: StyleProp<TextStyle>;
  /** Checkmark or selected indicator color */
  selectedIndicatorColor?: string;
  /** Title at top of modal */
  title?: string;
  /** Title text style */
  titleStyle?: StyleProp<TextStyle>;
  /** Close button text or label */
  closeButtonText?: string;
  /** Close button text style */
  closeButtonStyle?: StyleProp<TextStyle>;
  /** Animation type for the modal */
  animationType?: 'none' | 'slide' | 'fade';
}

export interface CountryItemProps {
  country: Country;
  isSelected: boolean;
  onSelect: (country: Country) => void;
  countryItemStyle?: StyleProp<ViewStyle>;
  selectedCountryItemStyle?: StyleProp<ViewStyle>;
  flagStyle?: StyleProp<TextStyle>;
  countryNameStyle?: StyleProp<TextStyle>;
  callingCodeStyle?: StyleProp<TextStyle>;
  selectedIndicatorColor?: string;
}

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onClear?: () => void;
}

export interface PhoneInputProps extends Omit<TextInputProps, 'value' | 'defaultValue' | 'onChangeText'> {
  // Value & Defaults
  value?: string;
  defaultValue?: string;
  defaultCountryCode?: string;

  // Configuration
  disabled?: boolean;
  readOnly?: boolean;
  autoFormat?: boolean;
  enableSearch?: boolean;
  showFlag?: boolean;
  showCallingCode?: boolean;
  showDropdownIcon?: boolean;

  // Length & Input Limits
  enforceMaxLength?: boolean;
  maxLength?: number;
  minLength?: number;
  showLengthIndicator?: boolean;
  lengthIndicatorStyle?: StyleProp<TextStyle>;
  lengthIndicatorContainerStyle?: StyleProp<ViewStyle>;

  // Filter Country List
  countries?: string[];
  excludeCountries?: string[];

  // Text & Placeholders
  placeholder?: string;
  placeholderTextColor?: string;
  searchPlaceholder?: string;
  emptyResultsMessage?: string;
  countryPickerTitle?: string;

  // Callbacks
  onChangeText?: (nationalNumber: string) => void;
  onChangePhoneNumber?: (
    fullNumber: string,
    nationalNumber: string,
    country: Country,
    isValid: boolean,
    validationResult?: PhoneValidationResult
  ) => void;
  onChangeCountry?: (country: Country) => void;
  onValidityChange?: (isValid: boolean, validationResult: PhoneValidationResult) => void;
  onFocus?: () => void;
  onBlur?: () => void;

  // Styles
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  countryPickerButtonStyle?: StyleProp<ViewStyle>;
  flagStyle?: StyleProp<TextStyle>;
  callingCodeStyle?: StyleProp<TextStyle>;
  dropdownIconStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
  errorMessage?: string;
  showErrorMessage?: boolean;

  // Modal / Picker Styles
  modalStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  searchContainerStyle?: StyleProp<ViewStyle>;
  searchInputStyle?: StyleProp<TextStyle>;
  countryItemStyle?: StyleProp<ViewStyle>;
  selectedCountryItemStyle?: StyleProp<ViewStyle>;
  countryNameStyle?: StyleProp<TextStyle>;
  pickerCallingCodeStyle?: StyleProp<TextStyle>;
  selectedIndicatorColor?: string;
  modalAnimationType?: 'none' | 'slide' | 'fade';
}
