import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import { FormInputProps } from '../types';

export const FormInput: React.FC<FormInputProps & TextInputProps> = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  error, 
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  ...props 
}) => {
  return (
    <View style={{ marginVertical: 8 }}>
      {label && (
        <Text style={{ 
          fontSize: 16, 
          fontWeight: '500', 
          color: colors.text, 
          marginBottom: 4 
        }}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          globalStyles.input,
          error && { borderColor: colors.error },
          multiline && { height: 80, textAlignVertical: 'top' }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        {...props}
      />
      {error && <Text style={globalStyles.errorText}>{error}</Text>}
    </View>
  );
};
