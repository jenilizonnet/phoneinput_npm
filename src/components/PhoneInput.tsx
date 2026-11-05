import { forwardRef, useImperativeHandle, useRef, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import type { PhoneInputProps, PhoneInputRef } from '../types';
import { usePhoneInput } from '../hooks/usePhoneInput';
import { CountryPicker } from './CountryPicker';
import { DEFAULT_PLACEHOLDER } from '../constants';
import { formatToE164 } from '../utils/phoneFormatting';

export const PhoneInput = forwardRef<PhoneInputRef, PhoneInputProps>(
  (
    {
      value,
      defaultValue,
      defaultCountryCode,
      placeholder = DEFAULT_PLACEHOLDER,
      placeholderTextColor = '#9CA3AF',
      disabled = false,
      readOnly = false,
      autoFormat = true,
      enableSearch = true,
      showFlag = true,
      showCallingCode = true,
      showDropdownIcon = true,
      enforceMaxLength = false,
      maxLength: customMaxLength,
      minLength: customMinLength,
      showLengthIndicator = false,
      lengthIndicatorStyle,
      lengthIndicatorContainerStyle,
      countries,
      excludeCountries,
      searchPlaceholder,
      emptyResultsMessage,
      countryPickerTitle,
      onChangeText,
      onChangePhoneNumber,
      onChangeCountry,
      onValidityChange,
      onFocus,
      onBlur,
      containerStyle,
      inputStyle,
      countryPickerButtonStyle,
      flagStyle,
      callingCodeStyle,
      dropdownIconStyle,
      errorTextStyle,
      errorMessage,
      showErrorMessage = false,
      modalStyle,
      overlayStyle,
      searchContainerStyle,
      searchInputStyle,
      countryItemStyle,
      selectedCountryItemStyle,
      countryNameStyle,
      pickerCallingCodeStyle,
      selectedIndicatorColor,
      modalAnimationType = 'slide',
      ...restProps
    },
    ref
  ) => {
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    const {
      phoneNumber,
      selectedCountry,
      isPickerVisible,
      validationResult,
      minLength,
      maxLength,
      handleTextChange,
      handleSelectCountry,
      openPicker,
      closePicker,
      setPhoneNumber,
    } = usePhoneInput({
      value,
      defaultValue,
      defaultCountryCode,
      autoFormat,
      enforceMaxLength,
      maxLength: customMaxLength,
      minLength: customMinLength,
      onChangeText,
      onChangePhoneNumber,
      onChangeCountry,
      onValidityChange,
    });

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          inputRef.current?.focus();
        },
        blur: () => {
          inputRef.current?.blur();
        },
        openCountryPicker: () => {
          if (!disabled && !readOnly) {
            openPicker();
          }
        },
        closeCountryPicker: () => {
          closePicker();
        },
        isValid: () => validationResult.isValid,
        getCountry: () => selectedCountry,
        getCountryCode: () => selectedCountry.code,
        getIsoCode: () => selectedCountry.code,
        getCallingCode: () => selectedCountry.callingCode,
        getMinLength: () => minLength,
        getMaxLength: () => maxLength,
        getValidationResult: () => validationResult,
        getPhoneNumber: () => phoneNumber,
        getFullNumber: () => formatToE164(phoneNumber, selectedCountry.callingCode),
        clear: () => {
          setPhoneNumber('');
          handleTextChange('');
        },
      }),
      [
        disabled,
        readOnly,
        openPicker,
        closePicker,
        validationResult,
        selectedCountry,
        minLength,
        maxLength,
        phoneNumber,
        setPhoneNumber,
        handleTextChange,
      ]
    );

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    const isInteractive = !disabled && !readOnly;
    const hasError = Boolean(
      errorMessage ||
        (showErrorMessage && !validationResult.isValid && phoneNumber.length > 0)
    );

    return (
      <View style={styles.wrapper}>
        <View
          style={[
            styles.container,
            isFocused && styles.focusedContainer,
            hasError && styles.errorContainer,
            disabled && styles.disabledContainer,
            containerStyle,
          ]}
        >
          {/* Country Selector Trigger */}
          <TouchableOpacity
            style={[styles.countryButton, countryPickerButtonStyle]}
            onPress={openPicker}
            disabled={!isInteractive}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Selected country: ${selectedCountry.name}, ${selectedCountry.callingCode}`}
          >
            {showFlag && (
              <Text style={[styles.flag, flagStyle]}>{selectedCountry.flag}</Text>
            )}
            {showCallingCode && (
              <Text style={[styles.callingCode, callingCodeStyle]}>
                {selectedCountry.callingCode}
              </Text>
            )}
            {showDropdownIcon && (
              <Text style={[styles.dropdownIcon, dropdownIconStyle]}>▼</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Phone Number Input */}
          <TextInput
            ref={inputRef}
            style={[styles.input, disabled && styles.disabledInput, inputStyle]}
            value={phoneNumber}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            editable={!disabled && !readOnly}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...restProps}
          />
        </View>

        {/* Bottom Details Row: Error Message & Length Indicator */}
        <View style={styles.bottomRow}>
          <View style={styles.errorContainerBottom}>
            {hasError && (
              <Text style={[styles.errorText, errorTextStyle]}>
                {errorMessage || validationResult.error || 'Invalid phone number'}
              </Text>
            )}
          </View>
          {showLengthIndicator && (
            <View style={[styles.lengthIndicatorContainer, lengthIndicatorContainerStyle]}>
              <Text style={[styles.lengthIndicatorText, lengthIndicatorStyle]}>
                {validationResult.currentLength}/{maxLength}
              </Text>
            </View>
          )}
        </View>

        {/* Modal Country Picker */}
        <CountryPicker
          visible={isPickerVisible}
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          onClose={closePicker}
          countries={countries}
          excludeCountries={excludeCountries}
          enableSearch={enableSearch}
          searchPlaceholder={searchPlaceholder}
          emptyResultsMessage={emptyResultsMessage}
          title={countryPickerTitle}
          modalStyle={modalStyle}
          overlayStyle={overlayStyle}
          searchContainerStyle={searchContainerStyle}
          searchInputStyle={searchInputStyle}
          countryItemStyle={countryItemStyle}
          selectedCountryItemStyle={selectedCountryItemStyle}
          countryNameStyle={countryNameStyle}
          callingCodeStyle={pickerCallingCodeStyle}
          selectedIndicatorColor={selectedIndicatorColor}
          animationType={modalAnimationType}
        />
      </View>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 52,
  },
  focusedContainer: {
    borderColor: '#3B82F6',
  },
  errorContainer: {
    borderColor: '#EF4444',
  },
  disabledContainer: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    opacity: 0.7,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 8,
  },
  flag: {
    fontSize: 22,
    marginRight: 6,
  },
  callingCode: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 0,
    height: '100%',
  },
  disabledInput: {
    color: '#9CA3AF',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorContainerBottom: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  lengthIndicatorContainer: {
    marginLeft: 8,
  },
  lengthIndicatorText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
