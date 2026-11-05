import React, { useState, useMemo, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import type { CountryPickerProps, Country } from '../types';
import { COUNTRIES } from '../data/countries';
import { filterCountries } from '../utils/phoneFormatting';
import { CountryItem } from './CountryItem';
import { SearchInput } from './SearchInput';
import {
  DEFAULT_MODAL_TITLE,
  DEFAULT_SEARCH_PLACEHOLDER,
  DEFAULT_EMPTY_MESSAGE,
} from '../constants';

export const CountryPicker: React.FC<CountryPickerProps> = ({
  visible,
  selectedCountry,
  onSelectCountry,
  onClose,
  countries: whitelist,
  excludeCountries: blacklist,
  enableSearch = true,
  searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  emptyResultsMessage = DEFAULT_EMPTY_MESSAGE,
  modalStyle,
  overlayStyle,
  searchContainerStyle,
  searchInputStyle,
  searchPlaceholderTextColor,
  countryItemStyle,
  selectedCountryItemStyle,
  flagStyle,
  countryNameStyle,
  callingCodeStyle,
  selectedIndicatorColor,
  title = DEFAULT_MODAL_TITLE,
  titleStyle,
  closeButtonText = '✕',
  closeButtonStyle,
  animationType = 'slide',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter countries using memoization
  const filteredCountries = useMemo(() => {
    return filterCountries(COUNTRIES, searchQuery, whitelist, blacklist);
  }, [searchQuery, whitelist, blacklist]);

  const handleSelect = useCallback(
    (country: Country) => {
      setSearchQuery('');
      onSelectCountry(country);
    },
    [onSelectCountry]
  );

  const handleClose = useCallback(() => {
    setSearchQuery('');
    onClose();
  }, [onClose]);

  const renderItem = useCallback(
    ({ item }: { item: Country }) => (
      <CountryItem
        country={item}
        isSelected={item.code === selectedCountry.code}
        onSelect={handleSelect}
        countryItemStyle={countryItemStyle}
        selectedCountryItemStyle={selectedCountryItemStyle}
        flagStyle={flagStyle}
        countryNameStyle={countryNameStyle}
        callingCodeStyle={callingCodeStyle}
        selectedIndicatorColor={selectedIndicatorColor}
      />
    ),
    [
      selectedCountry.code,
      handleSelect,
      countryItemStyle,
      selectedCountryItemStyle,
      flagStyle,
      countryNameStyle,
      callingCodeStyle,
      selectedIndicatorColor,
    ]
  );

  const keyExtractor = useCallback((item: Country) => item.code, []);

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, overlayStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <SafeAreaView style={[styles.modalCard, modalStyle]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, titleStyle]}>{title}</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Close country picker"
              >
                <Text style={[styles.closeIcon, closeButtonStyle]}>
                  {closeButtonText}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            {enableSearch && (
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={searchPlaceholderTextColor}
                containerStyle={searchContainerStyle}
                inputStyle={searchInputStyle}
              />
            )}

            {/* Country List */}
            <FlatList
              data={filteredCountries}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={20}
              maxToRenderPerBatch={25}
              windowSize={10}
              removeClippedSubviews={Platform.OS === 'android'}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🌍</Text>
                  <Text style={styles.emptyText}>{emptyResultsMessage}</Text>
                </View>
              }
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '55%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
});

