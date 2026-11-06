import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
  useColorScheme,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import PhoneInputDefault, {
  PhoneInput as NamedPhoneInput,
  Country,
  PhoneValidationResult,
  PhoneInputRef,
  validatePhoneNumber,
} from 'react-native-phone-input-kit';

const PhoneInput = NamedPhoneInput || PhoneInputDefault;

interface SubmissionState {
  hasSubmitted: boolean;
  isValid: boolean;
  title: string;
  errorMessage?: string;
  e164Number?: string;
  nationalNumber?: string;
  countryName?: string;
  countryFlag?: string;
  isoCode?: string;
  callingCode?: string;
  digitsCount?: number;
  requiredLength?: string;
}

function PhoneInputDemoScreen() {
  // State for Example 1 (Basic)
  const [basicPhone, setBasicPhone] = useState('');
  const [basicCountry, setBasicCountry] = useState<Country | null>(null);

  // State for Example 2 (Advanced with real-time validation & Submit)
  const [advancedPhone, setAdvancedPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [validation, setValidation] = useState<PhoneValidationResult | null>(null);
  const [autoFormat, setAutoFormat] = useState(true);
  const [enforceMaxLength, setEnforceMaxLength] = useState(true);
  const [showLengthIndicator, setShowLengthIndicator] = useState(true);
  const [disabled, setDisabled] = useState(false);

  // Form Submission Result state
  const [submission, setSubmission] = useState<SubmissionState | null>(null);

  // Ref for imperative actions
  const phoneInputRef = useRef<PhoneInputRef>(null);

  // Quick Preset test handler
  const handleQuickPreset = (presetNumber: string) => {
    setAdvancedPhone(presetNumber);
    setSubmission(null);
  };

  // Comprehensive Form Submission & Validation Check
  const handleSubmit = () => {
    // 1. Get latest values from ref and state
    const country = phoneInputRef.current?.getCountry() || selectedCountry;
    const currentNumber = phoneInputRef.current?.getPhoneNumber() || advancedPhone;
    const countryCode = country ? country.code : 'IN';
    const countryName = country ? country.name : 'Selected country';
    const countryFlag = country ? country.flag : '🌐';
    const minLength = country ? country.minLength : 10;
    const maxLength = country ? country.maxLength : 10;

    // 2. Perform deep validation check
    const result = validatePhoneNumber(currentNumber, countryCode);

    // Rule 1: Empty check
    if (!currentNumber.trim() || result.currentLength === 0) {
      const err = `Phone number is required! Please enter a phone number for ${countryName}.`;
      setSubmission({
        hasSubmitted: true,
        isValid: false,
        title: 'Validation Failed: Empty Input',
        errorMessage: err,
        countryName,
        countryFlag,
        isoCode: country?.isoCode || countryCode,
        callingCode: country?.callingCode || '+91',
        digitsCount: 0,
        requiredLength: `${minLength} digits`,
      });
      Alert.alert('Validation Error', err);
      return;
    }

    // Rule 2: Country min length check (e.g. 10 digits required for India, but only 8 entered)
    if (result.currentLength < minLength) {
      const diff = minLength - result.currentLength;
      const err = `${countryName} phone number requires ${minLength} digits, but you entered only ${result.currentLength} digits! (Need ${diff} more digit${diff > 1 ? 's' : ''})`;
      setSubmission({
        hasSubmitted: true,
        isValid: false,
        title: 'Validation Failed: Incomplete Number',
        errorMessage: err,
        countryName,
        countryFlag,
        isoCode: country?.isoCode || countryCode,
        callingCode: country?.callingCode || '+91',
        digitsCount: result.currentLength,
        requiredLength: `${minLength} digits`,
      });
      Alert.alert('Validation Error', err);
      return;
    }

    // Rule 3: Country max length check
    if (result.currentLength > maxLength) {
      const err = `${countryName} phone number cannot exceed ${maxLength} digits. You entered ${result.currentLength} digits.`;
      setSubmission({
        hasSubmitted: true,
        isValid: false,
        title: 'Validation Failed: Number Too Long',
        errorMessage: err,
        countryName,
        countryFlag,
        isoCode: country?.isoCode || countryCode,
        callingCode: country?.callingCode || '+91',
        digitsCount: result.currentLength,
        requiredLength: `${maxLength} digits max`,
      });
      Alert.alert('Validation Error', err);
      return;
    }

    // Rule 4: International / carrier format validity
    if (!result.isValid) {
      const err = result.error || `Invalid phone number format for ${countryName}. Please enter a valid number.`;
      setSubmission({
        hasSubmitted: true,
        isValid: false,
        title: 'Validation Failed: Invalid Format',
        errorMessage: err,
        countryName,
        countryFlag,
        isoCode: country?.isoCode || countryCode,
        callingCode: country?.callingCode || '+91',
        digitsCount: result.currentLength,
        requiredLength: `${minLength} digits`,
      });
      Alert.alert('Validation Error', err);
      return;
    }

    // Rule 5: SUCCESS - All validations passed
    const successData: SubmissionState = {
      hasSubmitted: true,
      isValid: true,
      title: 'Validation Passed! Form Submitted',
      e164Number: result.e164Number,
      nationalNumber: result.nationalNumber,
      countryName,
      countryFlag,
      isoCode: country?.isoCode || countryCode,
      callingCode: country?.callingCode || '+91',
      digitsCount: result.currentLength,
      requiredLength: `${minLength} digits`,
    };

    setSubmission(successData);

    Alert.alert(
      'Success: Phone Number Verified! ✓',
      `All validations passed successfully:\n\n` +
      `• E.164: ${result.e164Number}\n` +
      `• Country: ${countryFlag} ${countryName} (${country?.callingCode})\n` +
      `• ISO Code: ${country?.isoCode}\n` +
      `• Digits: ${result.currentLength}/${maxLength}\n` +
      `• Status: VALID`
    );
  };

  const handleInspectRef = () => {
    if (!phoneInputRef.current) return;
    const country = phoneInputRef.current.getCountry();
    const isoCode = phoneInputRef.current.getIsoCode();
    const callingCode = phoneInputRef.current.getCallingCode();
    const minLen = phoneInputRef.current.getMinLength();
    const maxLen = phoneInputRef.current.getMaxLength();
    const valid = phoneInputRef.current.isValid();
    const fullNumber = phoneInputRef.current.getFullNumber();

    Alert.alert(
      'PhoneInput Ref Inspection',
      `Country: ${country.name} (${country.flag})\n` +
      `ISO Code: ${isoCode}\n` +
      `Calling Code: ${callingCode}\n` +
      `Min Length: ${minLen} digits\n` +
      `Max Length: ${maxLen} digits\n` +
      `Full E.164: ${fullNumber || 'Empty'}\n` +
      `Is Valid: ${valid ? 'YES ✓' : 'NO ✗'}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>React Native Phone Input Kit</Text>
        <Text style={styles.subtitle}>
          Production-grade international phone input with strict country-wise min/max length validation, ISO codes, and form submission.
        </Text>

        {/* --- EXAMPLE 1: Basic Usage with Country Metadata --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Basic Usage & Metadata</Text>
          <Text style={styles.cardDescription}>
            Default country set to India (IN), automatic formatting, and full country metadata callback.
          </Text>

          <PhoneInput
            defaultCountryCode="IN"
            placeholder="Enter mobile number"
            onChangePhoneNumber={(fullNumber, _nationalNumber, country) => {
              setBasicPhone(fullNumber);
              setBasicCountry(country);
            }}
          />

          <View style={styles.outputBox}>
            <Text style={styles.outputLabel}>Full E.164 Number:</Text>
            <Text style={styles.outputValue}>{basicPhone || 'None'}</Text>
            {basicCountry && (
              <View style={styles.metaGrid}>
                <Text style={styles.metaItem}>
                  <Text style={styles.metaBold}>Country: </Text>
                  {basicCountry.flag} {basicCountry.name}
                </Text>
                <Text style={styles.metaItem}>
                  <Text style={styles.metaBold}>ISO Code: </Text>
                  {basicCountry.isoCode}
                </Text>
                <Text style={styles.metaItem}>
                  <Text style={styles.metaBold}>Calling Code: </Text>
                  {basicCountry.callingCode}
                </Text>
                <Text style={styles.metaItem}>
                  <Text style={styles.metaBold}>Length Limits: </Text>
                  Min {basicCountry.minLength} - Max {basicCountry.maxLength} digits
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* --- EXAMPLE 2: Country-Wise Validation with Submit Button --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Validation & Submit Form</Text>
          <Text style={styles.cardDescription}>
            Strict country limits (e.g. India allows max 10 numbers; entering 8 numbers shows an error). Click "Validate & Submit" to verify all rules.
          </Text>

          {/* Quick Test Presets */}
          <Text style={styles.presetSectionTitle}>Quick Test Presets:</Text>
          <View style={styles.presetsRow}>
            <TouchableOpacity
              style={[styles.presetBtn, styles.presetBtnError]}
              onPress={() => handleQuickPreset('98765432')}
            >
              <Text style={styles.presetBtnText}>🇮🇳 India (8 Digits - Error)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.presetBtn, styles.presetBtnValid]}
              onPress={() => handleQuickPreset('9876543210')}
            >
              <Text style={styles.presetBtnText}>🇮🇳 India (10 Digits - Valid)</Text>
            </TouchableOpacity>
          </View>

          {/* Controls */}
          <View style={styles.switchGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Auto Format:</Text>
              <Switch value={autoFormat} onValueChange={setAutoFormat} />
              <Text style={[styles.switchLabel, styles.switchLabelSpacing]}>Enforce Max (10):</Text>
              <Switch value={enforceMaxLength} onValueChange={setEnforceMaxLength} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Show Counter:</Text>
              <Switch value={showLengthIndicator} onValueChange={setShowLengthIndicator} />
              <Text style={[styles.switchLabel, styles.switchLabelSpacing]}>Disabled:</Text>
              <Switch value={disabled} onValueChange={setDisabled} />
            </View>
          </View>

          {/* Phone Input with strict validation & max limits */}
          <PhoneInput
            ref={phoneInputRef}
            value={advancedPhone}
            defaultCountryCode="IN"
            placeholder="Enter phone number"
            disabled={disabled}
            autoFormat={autoFormat}
            enforceMaxLength={enforceMaxLength}
            showLengthIndicator={showLengthIndicator}
            countries={['IN', 'US', 'GB', 'CA', 'AU', 'AE', 'SA', 'DE', 'FR']}
            showErrorMessage
            onChangeText={(text) => {
              setAdvancedPhone(text);
              if (submission) setSubmission(null);
            }}
            onChangeCountry={(c) => {
              setSelectedCountry(c);
              if (submission) setSubmission(null);
            }}
            onValidityChange={(_isValid, res) => setValidation(res)}
            containerStyle={styles.customInputContainer}
          />

          {/* Validation Status & Live Metadata */}
          {validation && (
            <View style={styles.validationDetailsBox}>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badge,
                    validation.isValid
                      ? styles.validBadge
                      : validation.status === 'INCOMPLETE'
                      ? styles.incompleteBadge
                      : styles.invalidBadge,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    Status: {validation.status}
                  </Text>
                </View>
                <Text style={styles.digitsCountText}>
                  Digits: {validation.currentLength} / {validation.maxLength}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>Country: </Text>
                  {validation.isoCode} ({validation.callingCode})
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>Required: </Text>
                  {validation.minLength === validation.maxLength
                    ? `${validation.minLength} digits`
                    : `${validation.minLength}-${validation.maxLength} digits`}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>Min Reached: </Text>
                  {validation.isMinLengthReached ? '✓ Yes' : '✗ No (Too Short)'}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>Max Allowed: </Text>
                  {validation.maxLength} digits
                </Text>
              </View>

              {validation.error && (
                <Text style={styles.validationErrorText}>⚠ {validation.error}</Text>
              )}
            </View>
          )}

          {/* --- PRIMARY SUBMIT BUTTON --- */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>🚀 Validate & Submit Phone Number</Text>
          </TouchableOpacity>

          {/* --- SUBMISSION RESULT BANNER --- */}
          {submission && (
            <View
              style={[
                styles.submissionBox,
                submission.isValid ? styles.submissionSuccessBox : styles.submissionErrorBox,
              ]}
            >
              <Text
                style={[
                  styles.submissionTitle,
                  submission.isValid ? styles.submissionSuccessTitle : styles.submissionErrorTitle,
                ]}
              >
                {submission.isValid ? '✓ All Validations Passed' : '✗ Validation Error'}
              </Text>

              {submission.isValid ? (
                <View style={styles.submissionDetails}>
                  <Text style={styles.submissionDetailLine}>
                    <Text style={styles.submissionDetailBold}>E.164 Number: </Text>
                    {submission.e164Number}
                  </Text>
                  <Text style={styles.submissionDetailLine}>
                    <Text style={styles.submissionDetailBold}>Country: </Text>
                    {submission.countryFlag} {submission.countryName} ({submission.callingCode})
                  </Text>
                  <Text style={styles.submissionDetailLine}>
                    <Text style={styles.submissionDetailBold}>ISO Code: </Text>
                    {submission.isoCode}
                  </Text>
                  <Text style={styles.submissionDetailLine}>
                    <Text style={styles.submissionDetailBold}>Total Digits: </Text>
                    {submission.digitsCount} / {submission.requiredLength}
                  </Text>
                  <Text style={styles.submissionSuccessNote}>
                    ✓ Phone number is valid and ready for backend authentication / OTP submission.
                  </Text>
                </View>
              ) : (
                <View style={styles.submissionDetails}>
                  <Text style={styles.submissionErrorMessage}>
                    {submission.errorMessage}
                  </Text>
                  <Text style={styles.submissionErrorHint}>
                    👉 Tip: In India, mobile numbers must be 10 digits (starting with 6, 7, 8, or 9).
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Secondary Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => phoneInputRef.current?.openCountryPicker()}
            >
              <Text style={styles.actionBtnText}>Open Picker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.inspectBtn]}
              onPress={handleInspectRef}
            >
              <Text style={styles.actionBtnText}>Inspect Ref</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.clearBtn]}
              onPress={() => {
                phoneInputRef.current?.clear();
                setAdvancedPhone('');
                setSubmission(null);
              }}
            >
              <Text style={styles.actionBtnText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- EXAMPLE 3: Custom Themed UI --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>3. Custom Themed UI</Text>
          <Text style={styles.cardDescription}>
            Dark styled theme with pill border radius and custom font styling.
          </Text>

          <PhoneInput
            defaultCountryCode="GB"
            placeholder="Your mobile..."
            placeholderTextColor="#6B7280"
            showLengthIndicator
            containerStyle={styles.darkContainer}
            inputStyle={styles.darkInput}
            callingCodeStyle={styles.darkCallingCode}
            dropdownIconStyle={styles.darkDropdownIcon}
            lengthIndicatorStyle={styles.darkLengthText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <PhoneInputDemoScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
  },
  presetSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  presetBtnError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  presetBtnValid: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  presetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  outputBox: {
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
  },
  outputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  outputValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 2,
  },
  metaGrid: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 4,
  },
  metaItem: {
    fontSize: 12,
    color: '#374151',
  },
  metaBold: {
    fontWeight: '700',
    color: '#111827',
  },
  switchGroup: {
    marginBottom: 12,
    gap: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    marginRight: 6,
  },
  switchLabelSpacing: {
    marginLeft: 16,
  },
  customInputContainer: {
    borderRadius: 14,
    borderColor: '#D1D5DB',
  },
  validationDetailsBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  validBadge: {
    backgroundColor: '#DEF7EC',
  },
  invalidBadge: {
    backgroundColor: '#FDE8E8',
  },
  incompleteBadge: {
    backgroundColor: '#FEF08A',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  digitsCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 12,
    color: '#4B5563',
  },
  detailBold: {
    fontWeight: '600',
    color: '#111827',
  },
  validationErrorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  submissionBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  submissionSuccessBox: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
  },
  submissionErrorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  submissionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  submissionSuccessTitle: {
    color: '#166534',
  },
  submissionErrorTitle: {
    color: '#991B1B',
  },
  submissionDetails: {
    gap: 4,
  },
  submissionDetailLine: {
    fontSize: 13,
    color: '#1E293B',
  },
  submissionDetailBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  submissionSuccessNote: {
    marginTop: 6,
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
  },
  submissionErrorMessage: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '700',
    lineHeight: 18,
  },
  submissionErrorHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#7F1D1D',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  inspectBtn: {
    backgroundColor: '#059669',
  },
  clearBtn: {
    backgroundColor: '#6B7280',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  darkContainer: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    borderRadius: 24,
  },
  darkInput: {
    color: '#F9FAFB',
  },
  darkCallingCode: {
    color: '#E5E7EB',
  },
  darkDropdownIcon: {
    color: '#9CA3AF',
  },
  darkLengthText: {
    color: '#9CA3AF',
  },
});
