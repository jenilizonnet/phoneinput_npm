# react-native-phone-input-kit 📱✨

[![npm version](https://img.shields.io/npm/v/react-native-phone-input-kit.svg?style=flat-square)](https://www.npmjs.com/package/react-native-phone-input-kit)
[![npm downloads](https://img.shields.io/npm/dm/react-native-phone-input-kit.svg?style=flat-square)](https://www.npmjs.com/package/react-native-phone-input-kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/jenilg/react-native-phone-input-kit/pulls)

A sleek, enterprise-ready, and lightweight React Native phone number input library. Built with **TypeScript**, powered by **`libphonenumber-js`** for precise international validation, and optimized for both **iOS** and **Android**.

---

## 🌟 Features

- 🌍 **240+ Countries & Territories**: Accurate dialing codes, names, ISO-2 codes, and native Unicode flag emojis without heavy image assets.
- ⚡ **Zero Native Linking Required**: Pure JavaScript/TypeScript. Works seamlessly out-of-the-box with Expo, React Native CLI, and New Architecture (Fabric).
- 🔍 **Instant Searchable Country Picker**: Modal sheet with lightning-fast search by country name, calling code, or ISO code.
- 🛡️ **Reliable Phone Validation**: Powered by Google's libphonenumber standard (`libphonenumber-js`). Exposes `VALID`, `INVALID`, `INCOMPLETE`, and `EMPTY` states.
- ⌨️ **Real-Time Auto-Formatting**: As-you-type national number formatting tailored to each country.
- 🎨 **100% Customizable**: Tailor containers, inputs, buttons, borders, typography, modal sheets, and error states.
- 🎛️ **Controlled & Uncontrolled Support**: Seamless integration with Formik, React Hook Form, or standalone components.
- 🦾 **Full TypeScript Definitions**: First-class type safety for props, ref methods, validation results, and country datasets.

---

## 📦 Installation

```bash
npm install react-native-phone-input-kit libphonenumber-js
```

Or with Yarn / PNPM:

```bash
yarn add react-native-phone-input-kit libphonenumber-js
# or
pnpm add react-native-phone-input-kit libphonenumber-js
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
        onChangePhoneNumber={(fullNumber, nationalNumber, country, isValid) => {
          setPhoneNumber(fullNumber);
          console.log('Selected country:', country.name);
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

## 🎯 Advanced Usage

### Formik / React Hook Form / Controlled State

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
      alert('Please enter a valid phone number');
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
        countries={['US', 'CA', 'GB', 'IN', 'AU', 'DE', 'FR']}
        showErrorMessage
        onChangeText={setPhone}
        onValidityChange={(isValid, res) => setValidation(res)}
        containerStyle={{
          borderColor: validation?.isValid ? '#10B981' : '#E5E7EB',
          borderRadius: 12,
        }}
      />

      <Button title="Validate & Submit" onPress={handleSubmit} />
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

### Styling Props

| Prop | Type | Description |
|---|---|---|
| `containerStyle` | `StyleProp<ViewStyle>` | Styles for the root input container. |
| `inputStyle` | `StyleProp<TextStyle>` | Styles for the `TextInput` element. |
| `countryPickerButtonStyle` | `StyleProp<ViewStyle>` | Styles for the country trigger button on the left. |
| `flagStyle` | `StyleProp<TextStyle>` | Typography style for flag emojis. |
| `callingCodeStyle` | `StyleProp<TextStyle>` | Typography style for calling code text. |
| `dropdownIconStyle` | `StyleProp<TextStyle>` | Typography style for dropdown arrow. |
| `errorTextStyle` | `StyleProp<TextStyle>` | Style for validation error text below container. |
| `modalStyle` | `StyleProp<ViewStyle>` | Styles for the modal sheet body. |
| `overlayStyle` | `StyleProp<ViewStyle>` | Styles for the dark backdrop overlay of modal. |
| `searchContainerStyle` | `StyleProp<ViewStyle>` | Search input wrapper container style in modal. |
| `searchInputStyle` | `StyleProp<TextStyle>` | Search `TextInput` style in modal. |
| `countryItemStyle` | `StyleProp<ViewStyle>` | Style applied to each country row in picker. |
| `selectedCountryItemStyle` | `StyleProp<ViewStyle>` | Style applied to the selected country row. |
| `selectedIndicatorColor` | `string` | Color for selected country checkmark icon. |

### Callbacks

| Callback | Parameters | Description |
|---|---|---|
| `onChangePhoneNumber` | `(fullNumber: string, nationalNumber: string, country: Country, isValid: boolean) => void` | Fired on any change; provides E.164 number, national digits, country object, and validity. |
| `onChangeText` | `(text: string) => void` | Fired when text input changes directly. |
| `onChangeCountry` | `(country: Country) => void` | Fired when user selects a different country from picker. |
| `onValidityChange` | `(isValid: boolean, result: PhoneValidationResult) => void` | Fired when validity state changes (`VALID`, `INVALID`, `INCOMPLETE`, `EMPTY`). |
| `onFocus` | `() => void` | Fired when phone input receives focus. |
| `onBlur` | `() => void` | Fired when phone input loses focus. |

---

## 🎛️ Imperative Ref API

You can access imperative methods using a `ref`:

```tsx
import { PhoneInput, PhoneInputRef } from 'react-native-phone-input-kit';

const phoneRef = useRef<PhoneInputRef>(null);

// Methods:
phoneRef.current?.focus();              // Focus input
phoneRef.current?.blur();               // Blur input
phoneRef.current?.openCountryPicker();  // Open picker modal programmatically
phoneRef.current?.closeCountryPicker(); // Close picker modal programmatically
phoneRef.current?.isValid();            // Check if current value is valid (boolean)
phoneRef.current?.getCountry();          // Returns current Country object
phoneRef.current?.getPhoneNumber();     // Returns current formatted national number
phoneRef.current?.getFullNumber();      // Returns full E.164 formatted number (+12025550123)
phoneRef.current?.clear();              // Clears input text
```

---

## 🌍 Country Selection & Filtering

### Whitelist Specific Countries
Only allow users to pick from a select set of supported markets:

```tsx
<PhoneInput
  defaultCountryCode="US"
  countries={['US', 'CA', 'GB', 'AU', 'IN']}
/>
```

### Blacklist Countries
Exclude specific countries or territories:

```tsx
<PhoneInput
  defaultCountryCode="GB"
  excludeCountries={['RU', 'KP']}
/>
```

---

## 🛡️ Phone Number Validation

Validation is powered by `libphonenumber-js`. Validation results include granular status tracking:

```tsx
import { validatePhoneNumber, PhoneValidationResult } from 'react-native-phone-input-kit';

const result: PhoneValidationResult = validatePhoneNumber('9876543210', 'IN');

console.log(result.isValid);             // true
console.log(result.status);              // 'VALID' | 'INVALID' | 'INCOMPLETE' | 'EMPTY'
console.log(result.e164Number);          // '+919876543210'
console.log(result.nationalNumber);      // '9876543210'
console.log(result.internationalNumber); // '+91 98765 43210'
```

---

## 🎨 Theming & Styling

### Dark Mode Example

```tsx
<PhoneInput
  defaultCountryCode="US"
  placeholderTextColor="#6B7280"
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

## ❓ Troubleshooting

### Flag emojis appear as letters on older Android emulators
Some minimal Android emulator system images omit country flag color fonts. This does not affect physical Android devices running Android 7.0+ (Nougat) or higher, where flags render crisply.

### How do I use this inside a BottomSheet or ScrollView?
The country picker is a standard React Native `<Modal>`. When used inside custom bottom sheets, it opens in a native modal window above the parent container without clipping issues.

---

## 📄 License

MIT © [Jenil](https://github.com/jenilg)

