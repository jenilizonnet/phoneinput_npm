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
  getCountryLengths,
} from 'react-native-phone-input-kit';

const PhoneInput = NamedPhoneInput || PhoneInputDefault;

function PhoneInputDemoScreen() {
  // State for Example 1 (Basic)
  const [basicPhone, setBasicPhone] = useState('');
  const [basicCountry, setBasicCountry] = useState<Country | null>(null);

  // State for Example 2 (Advanced with real-time validation)
  const [advancedPhone, setAdvancedPhone] = useState('');
  const [validation, setValidation] = useState<PhoneValidationResult | null>(null);
  const [autoFormat, setAutoFormat] = useState(true);
  const [enforceMaxLength, setEnforceMaxLength] = useState(true);
  const [showLengthIndicator, setShowLengthIndicator] = useState(true);
  const [disabled, setDisabled] = useState(false);

  // Ref for imperative actions
  const phoneInputRef = useRef<PhoneInputRef>(null);

  const handleInspectRef = () => {
    if (!phoneInputRef.current) return;
    const country = phoneInputRef.current.getCountry();
    const isoCode = phoneInputRef.current.getIsoCode();
    const callingCode = phoneInputRef.current.getCallingCode();
    const minLen = phoneInputRef.current.getMinLength();
    const maxLen = phoneInputRef.current.getMaxLength();
    const valid = phoneInputRef.current.isValid();

    Alert.alert(
      'PhoneInput Ref Inspection',
      `Country: ${country.name} (${country.flag})\n` +
      `ISO Code: ${isoCode}\n` +
      `Calling Code: ${callingCode}\n` +
      `Min Length: ${minLen} digits\n` +
      `Max Length: ${maxLen} digits\n` +
      `Valid: ${valid ? 'YES' : 'NO'}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>React Native Phone Input Kit</Text>
        <Text style={styles.subtitle}>
          Production-grade international phone input with country-wise min/max length validation, ISO & calling codes.
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

        {/* --- EXAMPLE 2: Country-Wise Validation with Min/Max Limits --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Country-Wise Validation & Length Control</Text>
          <Text style={styles.cardDescription}>
            Enforces country max length, shows real-time digit counter, and exposes ISO code & calling code.
          </Text>

          {/* Controls */}
          <View style={styles.switchGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Auto Format:</Text>
              <Switch value={autoFormat} onValueChange={setAutoFormat} />
              <Text style={[styles.switchLabel, styles.switchLabelSpacing]}>Enforce Max:</Text>
              <Switch value={enforceMaxLength} onValueChange={setEnforceMaxLength} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Show Counter:</Text>
              <Switch value={showLengthIndicator} onValueChange={setShowLengthIndicator} />
              <Text style={[styles.switchLabel, styles.switchLabelSpacing]}>Disabled:</Text>
              <Switch value={disabled} onValueChange={setDisabled} />
            </View>
          </View>

          <PhoneInput
            ref={phoneInputRef}
            value={advancedPhone}
            defaultCountryCode="US"
            placeholder="Enter phone number"
            disabled={disabled}
            autoFormat={autoFormat}
            enforceMaxLength={enforceMaxLength}
            showLengthIndicator={showLengthIndicator}
            countries={['US', 'IN', 'GB', 'CA', 'AU', 'DE', 'FR', 'AE']}
            showErrorMessage
            onChangeText={setAdvancedPhone}
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
                  <Text style={styles.detailBold}>ISO Code: </Text>
                  {validation.isoCode}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>Calling Code: </Text>
                  {validation.callingCode}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>Min Length: </Text>
                  {validation.minLength} digits ({validation.isMinLengthReached ? '✓ Reached' : '✗ Incomplete'})
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>Max Length: </Text>
                  {validation.maxLength} digits ({validation.isMaxLengthExceeded ? '✗ Exceeded' : '✓ OK'})
                </Text>
              </View>

              {validation.error && (
                <Text style={styles.validationErrorText}>⚠ {validation.error}</Text>
              )}
            </View>
          )}

          {/* Imperative Action Buttons */}
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
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
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
