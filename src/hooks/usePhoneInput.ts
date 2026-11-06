import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { Country, PhoneValidationResult } from '../types';
import { COUNTRIES, getCountryByCode } from '../data/countries';
import { validatePhoneNumber } from '../utils/phoneValidation';
import { formatAsYouType, formatToE164 } from '../utils/phoneFormatting';
import { DEFAULT_COUNTRY_CODE } from '../constants';

interface UsePhoneInputOptions {
  value?: string;
  defaultValue?: string;
  defaultCountryCode?: string;
  autoFormat?: boolean;
  enforceMaxLength?: boolean;
  maxLength?: number;
  minLength?: number;
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
}

export function usePhoneInput({
  value,
  defaultValue = '',
  defaultCountryCode = DEFAULT_COUNTRY_CODE,
  autoFormat = true,
  enforceMaxLength = true,
  maxLength,
  minLength,
  onChangeText,
  onChangePhoneNumber,
  onChangeCountry,
  onValidityChange,
}: UsePhoneInputOptions) {
  // Determine if component is controlled
  const isControlled = value !== undefined;

  // Selected country state
  const initialCountry = useMemo(() => {
    return (
      getCountryByCode(defaultCountryCode) ||
      COUNTRIES.find((c) => c.code === DEFAULT_COUNTRY_CODE) ||
      COUNTRIES[0]
    );
  }, [defaultCountryCode]);

  const [selectedCountry, setSelectedCountry] = useState<Country>(initialCountry);

  // Sync only if defaultCountryCode prop itself changes externally
  const prevDefaultCountryRef = useRef(defaultCountryCode);
  useEffect(() => {
    if (defaultCountryCode && defaultCountryCode !== prevDefaultCountryRef.current) {
      prevDefaultCountryRef.current = defaultCountryCode;
      const country = getCountryByCode(defaultCountryCode);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [defaultCountryCode]);

  // Phone number string state (uncontrolled)
  const [internalValue, setInternalValue] = useState<string>(() => {
    const raw = defaultValue || '';
    return autoFormat ? formatAsYouType(raw, initialCountry.code) : raw;
  });

  const displayValue = isControlled ? value : internalValue;

  // Modal open/close state
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  // Effective min & max length
  const effectiveMinLength = minLength ?? selectedCountry.minLength;
  const effectiveMaxLength = maxLength ?? selectedCountry.maxLength;

  // Validation cache
  const validationResult = useMemo(() => {
    return validatePhoneNumber(displayValue, selectedCountry.code);
  }, [displayValue, selectedCountry.code]);

  // Keep callback refs stable to avoid unnecessary re-triggers
  const callbacksRef = useRef({
    onChangeText,
    onChangePhoneNumber,
    onChangeCountry,
    onValidityChange,
  });

  callbacksRef.current = {
    onChangeText,
    onChangePhoneNumber,
    onChangeCountry,
    onValidityChange,
  };

  // Notify validity change when validationResult changes
  const prevValidRef = useRef<{ isValid: boolean; status: string }>({
    isValid: validationResult.isValid,
    status: validationResult.status,
  });

  useEffect(() => {
    if (
      prevValidRef.current.isValid !== validationResult.isValid ||
      prevValidRef.current.status !== validationResult.status
    ) {
      prevValidRef.current = {
        isValid: validationResult.isValid,
        status: validationResult.status,
      };
      callbacksRef.current.onValidityChange?.(
        validationResult.isValid,
        validationResult
      );
    }
  }, [validationResult]);

  // Handle text input changes
  const handleTextChange = useCallback(
    (text: string) => {
      let processedText = text;

      // Enforce max length if configured
      if (enforceMaxLength) {
        const rawDigits = text.replace(/\D/g, '');
        if (rawDigits.length > effectiveMaxLength) {
          const truncatedDigits = rawDigits.slice(0, effectiveMaxLength);
          processedText = autoFormat
            ? formatAsYouType(truncatedDigits, selectedCountry.code)
            : truncatedDigits;
        }
      }

      const formatted = autoFormat
        ? formatAsYouType(processedText, selectedCountry.code)
        : processedText;

      if (!isControlled) {
        setInternalValue(formatted);
      }

      const currentValidation = validatePhoneNumber(formatted, selectedCountry.code);
      const fullNumber = formatToE164(formatted, selectedCountry.callingCode);
      const nationalNumber = currentValidation.nationalNumber || formatted.replace(/\D/g, '');

      callbacksRef.current.onChangeText?.(formatted);
      callbacksRef.current.onChangePhoneNumber?.(
        fullNumber,
        nationalNumber,
        selectedCountry,
        currentValidation.isValid,
        currentValidation
      );
    },
    [autoFormat, effectiveMaxLength, enforceMaxLength, isControlled, selectedCountry]
  );

  // Handle country selection
  const handleSelectCountry = useCallback(
    (newCountry: Country) => {
      setSelectedCountry(newCountry);
      setIsPickerVisible(false);

      // Reformat existing number for new country if autoFormat is enabled
      const rawDigits = displayValue.replace(/\D/g, '');
      const reformatted = autoFormat
        ? formatAsYouType(rawDigits, newCountry.code)
        : displayValue;

      if (!isControlled) {
        setInternalValue(reformatted);
      }

      const revalidated = validatePhoneNumber(reformatted, newCountry.code);
      const fullNumber = formatToE164(reformatted, newCountry.callingCode);
      const nationalNumber = revalidated.nationalNumber || reformatted.replace(/\D/g, '');

      callbacksRef.current.onChangeText?.(reformatted);
      callbacksRef.current.onChangeCountry?.(newCountry);
      callbacksRef.current.onChangePhoneNumber?.(
        fullNumber,
        nationalNumber,
        newCountry,
        revalidated.isValid,
        revalidated
      );
    },
    [autoFormat, displayValue, isControlled]
  );

  const selectCountry = useCallback(
    (countryOrCode: string | Country) => {
      const country =
        typeof countryOrCode === 'string'
          ? getCountryByCode(countryOrCode)
          : countryOrCode;
      if (country) {
        handleSelectCountry(country);
      }
    },
    [handleSelectCountry]
  );

  const openPicker = useCallback(() => setIsPickerVisible(true), []);
  const closePicker = useCallback(() => setIsPickerVisible(false), []);

  return {
    phoneNumber: displayValue,
    selectedCountry,
    isPickerVisible,
    validationResult,
    minLength: effectiveMinLength,
    maxLength: effectiveMaxLength,
    handleTextChange,
    handleSelectCountry,
    selectCountry,
    openPicker,
    closePicker,
    setPhoneNumber: setInternalValue,
    setSelectedCountry,
  };
}
