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
  onChangeText?: (nationalNumber: string) => void;
  onChangePhoneNumber?: (
    fullNumber: string,
    nationalNumber: string,
    country: Country,
    isValid: boolean
  ) => void;
  onChangeCountry?: (country: Country) => void;
  onValidityChange?: (isValid: boolean, validationResult: PhoneValidationResult) => void;
}

export function usePhoneInput({
  value,
  defaultValue = '',
  defaultCountryCode = DEFAULT_COUNTRY_CODE,
  autoFormat = true,
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

  // Sync if defaultCountryCode changes externally
  useEffect(() => {
    if (defaultCountryCode) {
      const country = getCountryByCode(defaultCountryCode);
      if (country && country.code !== selectedCountry.code) {
        setSelectedCountry(country);
      }
    }
  }, [defaultCountryCode, selectedCountry.code]);

  // Phone number string state (uncontrolled)
  const [internalValue, setInternalValue] = useState<string>(() => {
    const raw = defaultValue || '';
    return autoFormat ? formatAsYouType(raw, initialCountry.code) : raw;
  });

  const displayValue = isControlled ? value : internalValue;

  // Modal open/close state
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

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
      const formatted = autoFormat
        ? formatAsYouType(text, selectedCountry.code)
        : text;

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
        currentValidation.isValid
      );
    },
    [autoFormat, isControlled, selectedCountry]
  );

  // Handle country selection
  const handleSelectCountry = useCallback(
    (newCountry: Country) => {
      setSelectedCountry(newCountry);
      setIsPickerVisible(false);

      const revalidated = validatePhoneNumber(displayValue, newCountry.code);
      const fullNumber = formatToE164(displayValue, newCountry.callingCode);
      const nationalNumber = revalidated.nationalNumber || displayValue.replace(/\D/g, '');

      callbacksRef.current.onChangeCountry?.(newCountry);
      callbacksRef.current.onChangePhoneNumber?.(
        fullNumber,
        nationalNumber,
        newCountry,
        revalidated.isValid
      );
    },
    [displayValue]
  );

  const openPicker = useCallback(() => setIsPickerVisible(true), []);
  const closePicker = useCallback(() => setIsPickerVisible(false), []);

  return {
    phoneNumber: displayValue,
    selectedCountry,
    isPickerVisible,
    validationResult,
    handleTextChange,
    handleSelectCountry,
    openPicker,
    closePicker,
    setPhoneNumber: setInternalValue,
    setSelectedCountry,
  };
}

