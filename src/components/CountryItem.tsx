import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import type { CountryItemProps } from '../types';

export const CountryItem: React.FC<CountryItemProps> = React.memo(
  ({
    country,
    isSelected,
    onSelect,
    countryItemStyle,
    selectedCountryItemStyle,
    flagStyle,
    countryNameStyle,
    callingCodeStyle,
    selectedIndicatorColor = '#2563EB',
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.row,
          countryItemStyle,
          isSelected && [styles.selectedRow, selectedCountryItemStyle],
        ]}
        onPress={() => onSelect(country)}
        activeOpacity={0.65}
        accessibilityRole="button"
        accessibilityLabel={`${country.name}, ${country.callingCode}`}
        accessibilityState={{ selected: isSelected }}
      >
        <Text style={[styles.flag, flagStyle]}>{country.flag}</Text>

        <View style={styles.nameContainer}>
          <Text
            style={[styles.countryName, countryNameStyle]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {country.name}
          </Text>
          <Text style={styles.countryCodeBadge}>({country.code})</Text>
        </View>

        <Text style={[styles.callingCode, callingCodeStyle]}>
          {country.callingCode}
        </Text>

        {isSelected && (
          <View style={styles.checkContainer}>
            <Text
              style={[
                styles.checkmark,
                { color: selectedIndicatorColor },
              ]}
            >
              ✓
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

CountryItem.displayName = 'CountryItem';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  selectedRow: {
    backgroundColor: '#EFF6FF',
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  countryName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    flexShrink: 1,
  },
  countryCodeBadge: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  callingCode: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
    marginRight: 8,
  },
  checkContainer: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

