const React = require('react');

const mockComponent = (name) => {
  const Component = React.forwardRef((props, ref) => {
    return React.createElement(name, { ...props, ref }, props.children);
  });
  Component.displayName = name;
  return Component;
};

module.exports = {
  View: mockComponent('View'),
  Text: mockComponent('Text'),
  TextInput: mockComponent('TextInput'),
  TouchableOpacity: mockComponent('TouchableOpacity'),
  Pressable: mockComponent('Pressable'),
  Modal: mockComponent('Modal'),
  FlatList: mockComponent('FlatList'),
  SafeAreaView: mockComponent('SafeAreaView'),
  KeyboardAvoidingView: mockComponent('KeyboardAvoidingView'),
  StyleSheet: {
    create: (styles) => styles,
    hairlineWidth: 1,
    flatten: (styles) => (Array.isArray(styles) ? Object.assign({}, ...styles.filter(Boolean)) : styles || {}),
  },
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios || obj.default,
  },
};

