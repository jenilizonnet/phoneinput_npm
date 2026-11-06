#react-native-phone-input-kit 📱✨

[![npm version](https://img.shields.io/npm/v/react-native-phone-input-kit.svg?style=flat-square)](https://www.npmjs.com/package/react-native-phone-input-kit)
[![npm downloads](https://img.shields.io/npm/dm/react-native-phone-input-kit.svg?style=flat-square)](https://www.npmjs.com/package/react-native-phone-input-kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/jenilg/react-native-phone-input-kit/pulls)

A sleek, enterprise-ready, and lightweight React Native phone number input library. Built with **TypeScript**, powered by **`libphonenumber-js`** for precise international validation, and optimized for both **iOS** and **Android**.

---

## 🌟 Features

- 🌍 **240+ Countries & Territories**: Accurate dialing codes, names, ISO-2 codes (`isoCode`), country codes without plus (`countryCode`), and native Unicode flag emojis.
- 📏 **Country-Wise Min & Max Length Validation**: Every country has built-in `minLength`, `maxLength`, `mobileLength`, and `possibleLengths` according to ITU standards.
- 🔒 **Enforce Max Length**: Prevent users from typing or pasting numbers exceeding the selected country's maximum allowed length via `enforceMaxLength`.
- 🔢 **Live Digit Counter / Length Indicator**: Show real-time progress (e.g. `10/10`) with `showLengthIndicator`.
- ⚡ **Zero Native Linking Required**: Pure JavaScript/TypeScript. Works seamlessly out-of-the-box with Expo, React Native CLI, and New Architecture (Fabric).
- 🔍 **Instant Searchable Country Picker**: Modal sheet with lightning-fast search by country name, calling code, or ISO code.
- 🛡️ **Reliable Phone Validation**: Powered by Google's libphonenumber standard (`libphonenumber-js`). Exposes `VALID`, `INVALID`, `INCOMPLETE`, `TOO_SHORT`, `TOO_LONG`, and `EMPTY` states.
- ⌨️ **Real-Time Auto-Formatting**: As-you-type national number formatting tailored to each country.
- 🎨 **100% Customizable**: Tailor containers, inputs, buttons, borders, typography, modal sheets, and error states.
- 🎛️ **Controlled & Uncontrolled Support**: Seamless integration with Formik, React Hook Form, or standalone components.
- 🦾 **Full TypeScript Definitions**: First-class type safety for props, ref methods, validation results, and country datasets.

---

## 📦 Installation

```bash
npm installreact-native-phone-input-kit libphonenumber-js
```

Or with Yarn / PNPM:

```bash
yarn addreact-native-phone-input-kit libphonenumber-js
# or
pnpm addreact-native-phone-input-kit libphonenumber-js
```

> **Note**: No `pod install` or native code modification is needed!

---

## 🚀 Quick Start

### Basic Usage

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PhoneInput } from 'react-native-phone-input-kit';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <View style={styles.container}>
      <PhoneInput
        defaultCountryCode="IN"
        placeholder="Enter mobile number"
        onChangePhoneNumber={(fullNumber, nationalNumber, country, isValid, validationResult) => {
          setPhoneNumber(fullNumber);
          console.log('Country ISO:', country.isoCode);
          console.log('Country Calling Code:', country.callingCode);
          console.log('Min Length:', country.minLength, 'Max Length:', country.maxLength);
          console.log('Is valid:', isValid);
        }}
      />
      <Text style={styles.text}>Stored E.164: {phoneNumber}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  text: {
    marginTop: 15,
    fontSize: 14,
    color: '#374151',
  },
});
```

---

## 🎯 Advanced Usage with Country-Wise Length Enforcement

```tsx
import React, { useState, useRef } from 'react';
import { View, Button, Text } from 'react-native';
import { PhoneInput, PhoneInputRef, PhoneValidationResult } from 'react-native-phone-input-kit';

export default function AdvancedScreen() {
  const [phone, setPhone] = useState('');
  const [validation, setValidation] = useState<PhoneValidationResult | null>(null);
  const phoneInputRef = useRef<PhoneInputRef>(null);

  const handleSubmit = () => {
    if (phoneInputRef.current?.isValid()) {
      alert(`Submitting: ${phoneInputRef.current.getFullNumber()}`);
    } else {
      alert(`Invalid! Digits: ${validation?.currentLength}/${validation?.maxLength}`);
    }
  };

  return (
    <View style={{ padding: 24 }}>
      <PhoneInput
        ref={phoneInputRef}
        value={phone}
        defaultCountryCode="US"
        placeholder="(555) 000-0000"
        autoFormat
        enforceMaxLength
        showLengthIndicator
        countries={['US', 'CA', 'GB', 'IN', 'AU', 'DE', 'FR']}
        showErrorMessage
        onChangeText={setPhone}
        onValidityChange={(isValid, res) => setValidation(res)}
      />

      {validation && (
        <View style={{ marginTop: 10 }}>
          <Text>ISO Code: {validation.isoCode}</Text>
          <Text>Calling Code: {validation.callingCode}</Text>
          <Text>Status: {validation.status}</Text>
          <Text>Digits: {validation.currentLength} / {validation.maxLength}</Text>
        </View>
      )}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
```

---

## 🛠️ Props Reference

### Main Component: `<PhoneInput />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `undefined` | Controlled input value. |
| `defaultValue` | `string` | `''` | Initial uncontrolled phone value. |
| `defaultCountryCode` | `string` | `'US'` | 2-letter ISO country code for default selection (e.g. `'US'`, `'IN'`). |
| `placeholder` | `string` | `'Enter phone number'` | Placeholder text for number input. |
| `placeholderTextColor` | `string` | `'#9CA3AF'` | Placeholder text color. |
| `disabled` | `boolean` | `false` | Disables country selector and input field. |
| `readOnly` | `boolean` | `false` | Sets input to read-only while preserving focusability. |
| `autoFormat` | `boolean` | `true` | Formats phone numbers as the user types based on country rules. |
| `enforceMaxLength` | `boolean` | `false` | When true, prevents typing/pasting beyond the selected country's `maxLength`. |
| `maxLength` | `number` | `undefined` | Custom maximum allowed digits (overrides country default). |
| `minLength` | `number` | `undefined` | Custom minimum allowed digits (overrides country default). |
| `showLengthIndicator`| `boolean` | `false` | Displays digit counter (e.g. `10/10`) below the input. |
| `lengthIndicatorStyle`| `StyleProp<TextStyle>` | `undefined` | Custom style for length indicator text. |
| `enableSearch` | `boolean` | `true` | Enables search bar inside the country picker modal. |
| `showFlag` | `boolean` | `true` | Renders country flag emoji on the selector button. |
| `showCallingCode` | `boolean` | `true` | Renders calling code (e.g. `+1`) on selector button. |
| `showDropdownIcon` | `boolean` | `true` | Renders caret / dropdown indicator on selector button. |
| `countries` | `string[]` | `undefined` | Whitelist array of ISO country codes (e.g. `['US', 'IN']`). |
| `excludeCountries` | `string[]` | `undefined` | Blacklist array of ISO country codes to hide from picker. |
| `searchPlaceholder` | `string` | `'Search country or code...'` | Search input placeholder in picker modal. |
| `emptyResultsMessage`| `string` | `'No countries found'` | Message shown when search yields 0 matches. |
| `countryPickerTitle` | `string` | `'Select Country'` | Title displayed in the country picker modal header. |
| `errorMessage` | `string` | `undefined` | Explicit error message string to display below input. |
| `showErrorMessage` | `boolean` | `false` | Automatically show error message if input is invalid and non-empty. |

### Callbacks

| Callback | Parameters | Description |
|---|---|---|
| `onChangePhoneNumber` | `(fullNumber: string, nationalNumber: string, country: Country, isValid: boolean, validationResult?: PhoneValidationResult) => void` | Fired on any change; provides E.164 number, national digits, country object, validity, and full validation details. |
| `onChangeText` | `(text: string) => void` | Fired when text input changes directly. |
| `onChangeCountry` | `(country: Country) => void` | Fired when user selects a different country from picker. |
| `onValidityChange` | `(isValid: boolean, result: PhoneValidationResult) => void` | Fired when validity state changes (`VALID`, `INVALID`, `INCOMPLETE`, `TOO_SHORT`, `TOO_LONG`, `EMPTY`). |
| `onFocus` | `() => void` | Fired when phone input receives focus. |
| `onBlur` | `() => void` | Fired when phone input loses focus. |

---

## 🎛️ Imperative Ref API

You can access imperative methods using a `ref`:

```tsx
import { PhoneInput, PhoneInputRef } from 'react-native-phone-input-kit';

const phoneRef = useRef<PhoneInputRef>(null);

// Methods:
phoneRef.current?.focus();                 // Focus input
phoneRef.current?.blur();                  // Blur input
phoneRef.current?.openCountryPicker();     // Open picker modal programmatically
phoneRef.current?.closeCountryPicker();    // Close picker modal programmatically
phoneRef.current?.isValid();               // Check if current value is valid (boolean)
phoneRef.current?.getCountry();            // Returns current Country object
phoneRef.current?.getCountryCode();        // Returns current ISO code (e.g. 'IN')
phoneRef.current?.getIsoCode();            // Returns current ISO code alias (e.g. 'IN')
phoneRef.current?.getCallingCode();        // Returns current calling code (e.g. '+91')
phoneRef.current?.getMinLength();          // Returns minimum length for selected country
phoneRef.current?.getMaxLength();          // Returns maximum length for selected country
phoneRef.current?.getValidationResult();   // Returns latest PhoneValidationResult
phoneRef.current?.getPhoneNumber();        // Returns current formatted national number
phoneRef.current?.getFullNumber();         // Returns full E.164 formatted number (+919876543210)
phoneRef.current?.clear();                 // Clears input text
```

---

## 🛡️ Phone Number & Country Validation Utilities

Validation is powered by `libphonenumber-js`. Validation results include granular status tracking, min/max lengths, ISO code, and calling code:

```tsx
import {
  validatePhoneNumber,
  isPhoneNumberValid,
  validatePhoneNumberLength,
  getCountryByCode,
  getCountryLengths,
  getCountryMinLength,
  getCountryMaxLength,
  getCallingCode,
  getCountryCallingCodeNumber,
} from 'react-native-phone-input-kit';

// 1. Comprehensive Validation:
const result = validatePhoneNumber('9876543210', 'IN');
console.log(result.isValid);             // true
console.log(result.status);              // 'VALID' | 'INVALID' | 'INCOMPLETE' | 'TOO_SHORT' | 'TOO_LONG' | 'EMPTY'
console.log(result.isoCode);             // 'IN'
console.log(result.callingCode);         // '+91'
console.log(result.countryCallingCode);  // '91'
console.log(result.minLength);           // 8
console.log(result.maxLength);           // 13
console.log(result.currentLength);       // 10
console.log(result.isMinLengthReached);  // true
console.log(result.isMaxLengthExceeded); // false
console.log(result.e164Number);          // '+919876543210'

// 2. Quick Boolean Check:
const valid = isPhoneNumberValid('9876543210', 'IN'); // true

// 3. Length Only Check:
const lengthStatus = validatePhoneNumberLength('987', 'IN'); // 'TOO_SHORT'

// 4. Country Metadata Lookups:
const india = getCountryByCode('IN');
console.log(india?.isoCode);       // 'IN'
console.log(india?.callingCode);   // '+91'
console.log(india?.countryCode);   // '91'
console.log(india?.minLength);     // 8
console.log(india?.maxLength);     // 13
console.log(india?.mobileLength);  // 10

const lengths = getCountryLengths('US');
console.log(lengths.minLength); // 10
console.log(lengths.maxLength); // 10
```

---

## 🎨 Theming & Styling

### Dark Mode Example

```tsx
<PhoneInput
  defaultCountryCode="US"
  placeholderTextColor="#6B7280"
  showLengthIndicator
  containerStyle={{
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    borderRadius: 14,
  }}
  inputStyle={{
    color: '#F9FAFB',
    fontSize: 16,
  }}
  callingCodeStyle={{
    color: '#E5E7EB',
  }}
  dropdownIconStyle={{
    color: '#9CA3AF',
  }}
  lengthIndicatorStyle={{
    color: '#9CA3AF',
  }}
  modalStyle={{
    backgroundColor: '#111827',
  }}
  searchInputStyle={{
    color: '#F9FAFB',
    backgroundColor: '#1F2937',
  }}
  countryItemStyle={{
    backgroundColor: '#111827',
    borderBottomColor: '#1F2937',
  }}
  countryNameStyle={{
    color: '#F3F4F6',
  }}
/>
```

---

## 📱 Android & iOS Compatibility

- **iOS**: Uses native `KeyboardAvoidingView` with `'padding'` behavior, safe area insets, and fluid modal sheet animations.
- **Android**: Uses virtualized `FlatList` with `removeClippedSubviews` for 60fps scrolling across 240+ countries.
- **Unicode Standard**: Cross-platform flag emojis render with native OS symbols without raster scaling artifacts.

---

## 📄 License

MIT © [Jenil](https://github.com/jenilg)
