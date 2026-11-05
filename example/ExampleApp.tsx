import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {
  PhoneInput,
  Country,
  PhoneValidationResult,
  PhoneInputRef,
} from '../src';

export default function ExampleApp() {
  // State for Example 1 (Basic)
  const [basicPhone, setBasicPhone] = useState('');
  const [basicCountry, setBasicCountry] = useState<Country | null>(null);

  // State for Example 2 (Advanced with real-time validation)
  const [advancedPhone, setAdvancedPhone] = useState('');
  const [validation, setValidation] = useState<PhoneValidationResult | null>(null);
  const [autoFormat, setAutoFormat] = useState(true);
  const [disabled, setDisabled] = useState(false);

  // Ref for imperative actions
  const phoneInputRef = useRef<PhoneInputRef>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>React Native Phone Input Kit</Text>
        <Text style={styles.subtitle}>
          Production-grade, fully customizable phone input with real-time international validation.
        </Text>

        {/* --- EXAMPLE 1: Basic Uncontrolled Usage --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Basic Usage</Text>
          <Text style={styles.cardDescription}>
            Default country set to India (IN), automatic formatting, and full international callback.
          </Text>

          <PhoneInput
            defaultCountryCode="IN"
            placeholder="Enter mobile number"
            onChangePhoneNumber={(fullNumber, nationalNumber, country, isValid) => {
              setBasicPhone(fullNumber);
              setBasicCountry(country);
            }}
          />

          <View style={styles.outputBox}>
            <Text style={styles.outputLabel}>Full E.164 Number:</Text>
            <Text style={styles.outputValue}>{basicPhone || 'None'}</Text>
            {basicCountry && (
              <Text style={styles.outputSub}>
                Selected Country: {basicCountry.flag} {basicCountry.name} ({basicCountry.callingCode})
              </Text>
            )}
          </View>
        </View>

        {/* --- EXAMPLE 2: Advanced Controlled Usage with Validation --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Advanced Controlled & Validated</Text>
          <Text style={styles.cardDescription}>
            With whitelist (US, IN, GB, CA, AU), error messages, and dynamic controls.
          </Text>

          {/* Controls */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Auto Format:</Text>
            <Switch value={autoFormat} onValueChange={setAutoFormat} />
            <Text style={[styles.switchLabel, { marginLeft: 20 }]}>Disabled:</Text>
            <Switch value={disabled} onValueChange={setDisabled} />
          </View>

          <PhoneInput
            ref={phoneInputRef}
            value={advancedPhone}
            defaultCountryCode="US"
            placeholder="Enter phone number"
            disabled={disabled}
            autoFormat={autoFormat}
            countries={['US', 'IN', 'GB', 'CA', 'AU']}
            showErrorMessage
            onChangeText={setAdvancedPhone}
            onValidityChange={(_isValid, res) => setValidation(res)}
            containerStyle={styles.customInputContainer}
          />

          {/* Validation Status Badge */}
          {validation && (
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
                Status: {validation.status} | Possible: {String(validation.isPossible)}
              </Text>
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
              style={[styles.actionBtn, styles.clearBtn]}
              onPress={() => {
                phoneInputRef.current?.clear();
                setAdvancedPhone('');
              }}
            >
              <Text style={styles.actionBtnText}>Clear Input</Text>
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
            containerStyle={styles.darkContainer}
            inputStyle={styles.darkInput}
            callingCodeStyle={styles.darkCallingCode}
            dropdownIconStyle={styles.darkDropdownIcon}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  outputSub: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    marginRight: 6,
  },
  customInputContainer: {
    borderRadius: 14,
    borderColor: '#D1D5DB',
  },
  badge: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
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
    fontWeight: '600',
    color: '#1F2937',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  actionBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
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
});

