import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
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
  getCountryByCode,
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
  // Main Phone Number & Country State
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<Country>(() => {
    return getCountryByCode('IN') || {
      code: 'IN',
      isoCode: 'IN',
      name: 'India',
      callingCode: '+91',
      countryCode: '91',
      flag: '🇮🇳',
      example: '98765 43210',
      minLength: 10,
      maxLength: 10,
      mobileLength: 10,
      possibleLengths: [10],
    };
  });

  const [validation, setValidation] = useState<PhoneValidationResult | null>(null);

  // Form Submission Result
  const [submission, setSubmission] = useState<SubmissionState | null>(null);

  // Ref for imperative methods
  const phoneInputRef = useRef<PhoneInputRef>(null);

  // Switch to a specific country programmatically (e.g., India or Canada)
  const handleSwitchCountry = (targetCode: string) => {
    const targetCountry = getCountryByCode(targetCode);
    if (!targetCountry) return;

    setCountry(targetCountry);
    phoneInputRef.current?.selectCountry(targetCode);
    setSubmission(null);
  };

  // Quick preset phone number
  const handleQuickPreset = (countryCode: string, digits: string) => {
    handleSwitchCountry(countryCode);
    setPhone(digits);
    setSubmission(null);
  };

  // Comprehensive Form Submission & Validation Check
  const handleSubmit = () => {
    const activeCountry = phoneInputRef.current?.getCountry() || country;
    const currentNumber = phoneInputRef.current?.getPhoneNumber() || phone;
    const countryCode = activeCountry.code;
    const countryName = activeCountry.name;
    const countryFlag = activeCountry.flag;
    const minLength = activeCountry.minLength;
    const maxLength = activeCountry.maxLength;

    // Validate phone number against active country
    const result = validatePhoneNumber(currentNumber, countryCode);

    // 1. Check if empty
    if (!currentNumber.trim() || result.currentLength === 0) {
      const err = `Phone number is required! Please enter a valid phone number for ${countryName}.`;
      setSubmission({
        hasSubmitted: true,
        isValid: false,
        title: 'Validation Failed: Empty Input',
        errorMessage: err,
        countryName,
        countryFlag,
        isoCode: activeCountry.isoCode,
        callingCode: activeCountry.callingCode,
        digitsCount: 0,
        requiredLength: `${minLength} digits`,
      });
      Alert.alert('Validation Error', err);
      return;
    }

    // 2. Check minimum length (e.g., India requires 10, entered only 8)
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
        isoCode: activeCountry.isoCode,
        callingCode: activeCountry.callingCode,
        digitsCount: result.currentLength,
        requiredLength: `${minLength} digits`,
      });
      Alert.alert('Validation Error', err);
      return;
    }

    // 3. Check maximum length
    if (result.currentLength > maxLength) {
      const err = `${countryName} phone number cannot exceed ${maxLength} digits. You entered ${result.currentLength} digits.`;
      setSubmission({
        hasSubmitted: true,
        isValid: false,
        title: 'Validation Failed: Number Too Long',
        errorMessage: err,
        countryName,
        countryFlag,
        isoCode: activeCountry.isoCode,
        callingCode: activeCountry.callingCode,
        digitsCount: result.currentLength,
        requiredLength: `${maxLength} digits max`,
      });
      Alert.alert('Validation Error', err);
      return;
    }

    // 4. Check carrier/format validity
    if (!result.isValid) {
      const err =
        result.error ||
        `Invalid phone number format for ${countryName}. Please check and try again.`;
      setSubmission({
        hasSubmitted: true,
        isValid: false,
        title: 'Validation Failed: Invalid Format',
        errorMessage: err,
        countryName,
        countryFlag,
        isoCode: activeCountry.isoCode,
        callingCode: activeCountry.callingCode,
        digitsCount: result.currentLength,
        requiredLength: `${minLength} digits`,
      });
      Alert.alert('Validation Error', err);
      return;
    }

    // 5. SUCCESS: All validations passed
    const successData: SubmissionState = {
      hasSubmitted: true,
      isValid: true,
      title: 'Validation Passed! Form Submitted',
      e164Number: result.e164Number,
      nationalNumber: result.nationalNumber,
      countryName,
      countryFlag,
      isoCode: activeCountry.isoCode,
      callingCode: activeCountry.callingCode,
      digitsCount: result.currentLength,
      requiredLength: `${minLength} digits`,
    };

    setSubmission(successData);

    Alert.alert(
      'Success: Phone Number Verified! ✓',
      `All validations passed successfully:\n\n` +
        `• Number: ${result.e164Number}\n` +
        `• Country: ${countryFlag} ${countryName} (${activeCountry.callingCode})\n` +
        `• ISO Code: ${activeCountry.isoCode}\n` +
        `• Digits: ${result.currentLength}/${maxLength}\n` +
        `• Status: VALID ✓`
    );
  };

  const handleInspectRef = () => {
    if (!phoneInputRef.current) return;
    const c = phoneInputRef.current.getCountry();
    const isoCode = phoneInputRef.current.getIsoCode();
    const callingCode = phoneInputRef.current.getCallingCode();
    const minLen = phoneInputRef.current.getMinLength();
    const maxLen = phoneInputRef.current.getMaxLength();
    const valid = phoneInputRef.current.isValid();
    const fullNumber = phoneInputRef.current.getFullNumber();

    Alert.alert(
      'PhoneInput Ref Inspection',
      `Selected Country: ${c.name} (${c.flag})\n` +
        `ISO Code: ${isoCode}\n` +
        `Calling Code: ${callingCode}\n` +
        `Country Code: ${c.countryCode}\n` +
        `Min Length: ${minLen} digits\n` +
        `Max Length: ${maxLen} digits\n` +
        `Full E.164: ${fullNumber || 'Empty'}\n` +
        `Is Valid: ${valid ? 'YES ✓' : 'NO ✗'}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.headerTitle}>React Native Phone Input Kit</Text>
        <Text style={styles.subtitle}>
          International Phone Input with real-time country-wise min/max length validation, ISO code, and submission verification.
        </Text>

        {/* MAIN CARD: ONLY ONE PHONE INPUT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phone Number Input & Validation</Text>
          <Text style={styles.cardDescription}>
            Defaults to India 🇮🇳 (+91). Select Canada 🇨🇦 (+1) or any other country from the picker to view country-wise flags, calling codes, and limits.
          </Text>

          {/* Quick Country Switcher: India vs Canada */}
          <View style={styles.switcherSection}>
            <Text style={styles.sectionLabel}>Quick Country Selection:</Text>
            <View style={styles.switcherRow}>
              <TouchableOpacity
                style={[
                  styles.switcherBtn,
                  country.code === 'IN' && styles.switcherBtnActive,
                ]}
                onPress={() => handleSwitchCountry('IN')}
              >
                <Text style={styles.switcherBtnText}>
                  🇮🇳 India (+91) {country.code === 'IN' ? '● Active' : ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.switcherBtn,
                  country.code === 'CA' && styles.switcherBtnActive,
                ]}
                onPress={() => handleSwitchCountry('CA')}
              >
                <Text style={styles.switcherBtnText}>
                  🇨🇦 Canada (+1) {country.code === 'CA' ? '● Active' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Test Presets: 8 digits error vs 10 digits valid */}
          <View style={styles.switcherSection}>
            <Text style={styles.sectionLabel}>Quick Test Presets:</Text>
            <View style={styles.presetsRow}>
              <TouchableOpacity
                style={[styles.presetBtn, styles.presetBtnError]}
                onPress={() => handleQuickPreset('IN', '98765432')}
              >
                <Text style={styles.presetBtnText}>🇮🇳 India (8 Digits - Test Error)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.presetBtn, styles.presetBtnValid]}
                onPress={() => handleQuickPreset('IN', '9876543210')}
              >
                <Text style={styles.presetBtnText}>🇮🇳 India (10 Digits - Valid)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.presetsRow}>
              <TouchableOpacity
                style={[styles.presetBtn, styles.presetBtnValid]}
                onPress={() => handleQuickPreset('CA', '2042345678')}
              >
                <Text style={styles.presetBtnText}>🇨🇦 Canada (10 Digits - Valid)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.presetBtn, styles.presetBtnError]}
                onPress={() => handleQuickPreset('CA', '204234')}
              >
                <Text style={styles.presetBtnText}>🇨🇦 Canada (6 Digits - Error)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* --- THE ONLY ONE PHONE INPUT COMPONENT --- */}
          <PhoneInput
            ref={phoneInputRef}
            value={phone}
            defaultCountryCode="IN"
            autoFormat={true}
            enforceMaxLength={true}
            showLengthIndicator={true}
            showErrorMessage={true}
            onChangeText={(text) => {
              setPhone(text);
              if (submission) setSubmission(null);
            }}
            onChangeCountry={(c) => {
              setCountry(c);
              if (submission) setSubmission(null);
            }}
            onValidityChange={(_isValid, res) => setValidation(res)}
            containerStyle={styles.mainInputContainer}
          />

          {/* Selected Country Live Metadata Card */}
          <View style={styles.metadataCard}>
            <View style={styles.metadataHeader}>
              <Text style={styles.metadataTitle}>
                {country.flag} {country.name}
              </Text>
              <View
                style={[
                  styles.badge,
                  validation?.isValid
                    ? styles.validBadge
                    : validation?.status === 'INCOMPLETE'
                    ? styles.incompleteBadge
                    : styles.invalidBadge,
                ]}
              >
                <Text style={styles.badgeText}>
                  {validation ? validation.status : 'READY'}
                </Text>
              </View>
            </View>

            <View style={styles.metaGrid}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>ISO Code:</Text>
                <Text style={styles.metaValue}>{country.isoCode}</Text>
                <Text style={styles.metaLabel}>Calling Code:</Text>
                <Text style={styles.metaValue}>{country.callingCode}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Min Digits:</Text>
                <Text style={styles.metaValue}>{country.minLength}</Text>
                <Text style={styles.metaLabel}>Max Digits:</Text>
                <Text style={styles.metaValue}>{country.maxLength}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Current Digits:</Text>
                <Text
                  style={[
                    styles.metaValue,
                    validation && validation.currentLength < country.minLength
                      ? styles.metaValueWarning
                      : styles.metaValueSuccess,
                  ]}
                >
                  {validation ? validation.currentLength : 0} / {country.maxLength}
                </Text>
                <Text style={styles.metaLabel}>Length OK:</Text>
                <Text style={styles.metaValue}>
                  {validation?.isMinLengthReached ? '✓ Yes' : '✗ No (Too Short)'}
                </Text>
              </View>
            </View>

            {validation?.error && (
              <Text style={styles.validationErrorText}>⚠ {validation.error}</Text>
            )}
          </View>

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
                submission.isValid
                  ? styles.submissionSuccessBox
                  : styles.submissionErrorBox,
              ]}
            >
              <Text
                style={[
                  styles.submissionTitle,
                  submission.isValid
                    ? styles.submissionSuccessTitle
                    : styles.submissionErrorTitle,
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
                    ✓ Phone number is valid and verified for production use.
                  </Text>
                </View>
              ) : (
                <View style={styles.submissionDetails}>
                  <Text style={styles.submissionErrorMessage}>
                    {submission.errorMessage}
                  </Text>
                  <Text style={styles.submissionErrorHint}>
                    👉 Tip: Make sure to enter all {country.minLength} digits for{' '}
                    {country.name}.
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
              <Text style={styles.actionBtnText}>🌍 All 240+ Countries</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.inspectBtn]}
              onPress={handleInspectRef}
            >
              <Text style={styles.actionBtnText}>🔍 Inspect Ref</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.clearBtn]}
              onPress={() => {
                phoneInputRef.current?.clear();
                setPhone('');
                setSubmission(null);
              }}
            >
              <Text style={styles.actionBtnText}>✕ Clear</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#F3F4F6',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    marginBottom: 16,
    lineHeight: 18,
  },
  switcherSection: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  switcherRow: {
    flexDirection: 'row',
    gap: 10,
  },
  switcherBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  switcherBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  switcherBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 8,
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
  mainInputContainer: {
    borderRadius: 12,
    borderColor: '#D1D5DB',
    height: 54,
  },
  metadataCard: {
    marginTop: 14,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metadataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  metadataTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  badge: {
    paddingVertical: 3,
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
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  metaGrid: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '700',
  },
  metaValueWarning: {
    color: '#DC2626',
  },
  metaValueSuccess: {
    color: '#16A34A',
  },
  validationErrorText: {
    marginTop: 8,
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
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
    marginTop: 14,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
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
    fontSize: 12,
    fontWeight: '700',
  },
});
