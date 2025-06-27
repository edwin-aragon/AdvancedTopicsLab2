import React, { JSX, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/FormInput';
import { globalStyles, colors } from '../../styles/globalStyles';
import { validateTransaction } from '../../utils/validation';
import { TransactionType, TransactionCategory } from '../../types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface FormData {
  date: Date;
  amount: string;
  description: string;
  location: string;
  type: TransactionType | '';
  category: TransactionCategory | '';
}

export default function AddTransaction(): JSX.Element {
  const initialFormData: FormData = {
    date: new Date(),
    amount: '',
    description: '',
    location: '',
    type: '',
    category: '',
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const { addTransaction } = useAuth();
  const router = useRouter();

  const transactionTypes: TransactionType[] = ['Credit', 'Debit', 'Refund'];
  const categories: TransactionCategory[] = ['Shopping', 'Travel', 'Utility', 'Food', 'Entertainment', 'Income', 'Other'];

  const handleInputChange = (field: keyof FormData, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // When confirming the date, store as a Date object
  const handleConfirm = (date: Date) => {
    setFormData(prev => ({ ...prev, date }));;
    hideDatePicker();
  };

  const handleSubmit = (): void => {
    // Prepare the transaction data for validation and saving
    const transactionData = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      description: formData.description,
      location: formData.location,
      type: formData.type || undefined,
      category: formData.category || undefined,
    };

    const validation = validateTransaction(transactionData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      Alert.alert('Validation Error', 'Please correct the highlighted fields');
      return;
    }

    try {
      addTransaction({
        date: transactionData.date,
        amount: parseFloat(formData.amount),
        description: formData.description,
        location: formData.location,
        type: formData.type as TransactionType,
        category: formData.category as TransactionCategory,
      });

      setFormData(initialFormData); // Reset form
      setErrors({});
      Alert.alert(
        'Success',
        'Transaction added successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction');
    }
  };

  const handleAmountChange = (value: string) => {
    // Allow only digits and a single decimal point
    let filtered = value.replace(/[^0-9.]/g, '');

    // Only allow one decimal point
    const firstDot = filtered.indexOf('.');
    if (firstDot !== -1) {
      filtered =
        filtered.slice(0, firstDot + 1) +
        filtered.slice(firstDot + 1).replace(/\./g, '');
    }

    // Optional: Prevent leading "."
    if (filtered.startsWith('.')) filtered = '0' + filtered;

    setFormData(prev => ({ ...prev, amount: filtered }));
    if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
  };

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={{
        backgroundColor: colors.primary,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 16,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.surface, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.surface, fontSize: 20, fontWeight: 'bold' }}>
            Add Transaction
          </Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Date Picker */}
        <View style={{ marginVertical: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text, marginBottom: 4 }}>
            Date
          </Text>
          <TouchableOpacity
            style={[
              globalStyles.input,
              { justifyContent: 'center', minHeight: 50 }
            ]}
            onPress={showDatePicker}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, color: colors.text }}>
              {formData.date.toLocaleDateString('en-CA')}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={formData.date}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={new Date()}
            themeVariant="light"
            textColor="#000"
          />
          {errors.date && <Text style={globalStyles.errorText}>{errors.date}</Text>}
        </View>

        <FormInput
          label="Amount"
          value={formData.amount}
          onChangeText={(value) => handleAmountChange(value)}
          placeholder="0.00"
          keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
          error={errors.amount}
        />

        <FormInput
          label="Description"
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          placeholder="Enter description"
          error={errors.description}
        />

        <FormInput
          label="Location"
          value={formData.location}
          onChangeText={(value) => handleInputChange('location', value)}
          placeholder="Enter location"
          error={errors.location}
        />

        {/* Transaction Type Picker */}
        <View style={{ marginVertical: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text, marginBottom: 4 }}>
            Transaction Type
          </Text>
          <View style={[
            globalStyles.input, 
            { 
              paddingVertical: 0,
              justifyContent: 'center',
              minHeight: 50,
            }
          ]}>
            <Picker
              selectedValue={formData.type as TransactionType}
              onValueChange={(value: TransactionType) => handleInputChange('type', value)}
              style={{ 
                height: 50,
                width: '100%',
              }}
              itemStyle={{
                height: 50,
                fontSize: 16,
              }}
            >
              <Picker.Item label="Select transaction type" value={undefined} />
              {transactionTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
          {errors.type && <Text style={globalStyles.errorText}>{errors.type}</Text>}
        </View>

        {/* Category Picker */}
        <View style={{ marginVertical: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text, marginBottom: 4 }}>
            Category
          </Text>
          <View style={[
            globalStyles.input, 
            { 
              paddingVertical: 0,
              justifyContent: 'center',
              minHeight: 50,
            }
          ]}>
            <Picker
              selectedValue={formData.category as TransactionCategory}
              onValueChange={(value: TransactionCategory) => handleInputChange('category', value)}
              style={{ 
                height: 50,
                width: '100%',
              }}
              itemStyle={{
                height: 50,
                fontSize: 16,
              }}
            >
              <Picker.Item label="Select category" value={undefined} />
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
          {errors.category && <Text style={globalStyles.errorText}>{errors.category}</Text>}
        </View>

        <TouchableOpacity 
          style={[globalStyles.button, { marginTop: 24, marginBottom: 40 }]}
          onPress={handleSubmit}
        >
          <Text style={globalStyles.buttonText}>Add Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
