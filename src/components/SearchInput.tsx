import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import type { SearchInputProps } from '../types';

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search country or code...',
  placeholderTextColor = '#9CA3AF',
  containerStyle,
  inputStyle,
  onClear,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearButton}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  clearButton: {
    padding: 2,
    marginLeft: 6,
  },
  clearIcon: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'bold',
  },
});

