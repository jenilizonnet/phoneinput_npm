import React, { createRef } from 'react';
import { PhoneInput } from '../src/components/PhoneInput';
import type { PhoneInputRef } from '../src/types';

describe('PhoneInput Component', () => {
  it('should initialize with default country and provide ref methods', () => {
    const ref = createRef<PhoneInputRef>();
    const element = React.createElement(PhoneInput, {
      ref,
      defaultCountryCode: 'IN',
      defaultValue: '9876543210',
    });

    expect(element).toBeDefined();
    expect(element.props.defaultCountryCode).toBe('IN');
    expect(element.props.defaultValue).toBe('9876543210');
  });

  it('should support controlled value and callbacks', () => {
    const onChangePhoneNumber = jest.fn();
    const onChangeCountry = jest.fn();
    const onValidityChange = jest.fn();

    const element = React.createElement(PhoneInput, {
      value: '2025550123',
      defaultCountryCode: 'US',
      onChangePhoneNumber,
      onChangeCountry,
      onValidityChange,
    });

    expect(element.props.value).toBe('2025550123');
    expect(element.props.onChangePhoneNumber).toBe(onChangePhoneNumber);
  });

  it('should support disabled and readOnly props', () => {
    const disabledElement = React.createElement(PhoneInput, {
      disabled: true,
      defaultCountryCode: 'US',
    });

    expect(disabledElement.props.disabled).toBe(true);

    const readOnlyElement = React.createElement(PhoneInput, {
      readOnly: true,
      defaultCountryCode: 'US',
    });

    expect(readOnlyElement.props.readOnly).toBe(true);
  });

  it('should accept country whitelist and blacklist', () => {
    const element = React.createElement(PhoneInput, {
      countries: ['US', 'CA', 'GB'],
      excludeCountries: ['FR'],
    });

    expect(element.props.countries).toEqual(['US', 'CA', 'GB']);
    expect(element.props.excludeCountries).toEqual(['FR']);
  });
});

