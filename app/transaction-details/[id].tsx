import React, { JSX } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { globalStyles, colors } from '../../styles/globalStyles';
import { formatCurrency, formatDate, getTypeColor } from '../../utils/validation';

interface DetailRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

export default function TransactionDetails(): JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTransaction } = useAuth();
  const router = useRouter();
  const transaction = getTransaction(id as string);

  if (!transaction) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: colors.textSecondary }}>
          Transaction not found
        </Text>
        <TouchableOpacity 
          style={[globalStyles.button, { marginTop: 16 }]}
          onPress={() => router.back()}
        >
          <Text style={globalStyles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const DetailRow: React.FC<DetailRowProps> = ({ label, value, valueColor }) => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }}>
      <Text style={{ fontSize: 16, color: colors.textSecondary, fontWeight: '500' }}>
        {label}
      </Text>
      <Text style={{ 
        fontSize: 16, 
        color: valueColor || colors.text, 
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
      }}>
        {value}
      </Text>
    </View>
  );

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
            Transaction Details
          </Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Amount Card */}
        <View style={[globalStyles.card, { alignItems: 'center', marginBottom: 24 }]}>
          <Text style={{ fontSize: 18, color: colors.textSecondary, marginBottom: 8 }}>
            {transaction.type} Amount
          </Text>
          <Text style={{ 
            fontSize: 36, 
            fontWeight: 'bold', 
            color: getTypeColor(transaction.type) 
          }}>
            {transaction.type === 'Credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
          <View style={{
            backgroundColor: getTypeColor(transaction.type),
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
            marginTop: 8,
          }}>
            <Text style={{ color: colors.surface, fontSize: 12, fontWeight: '600' }}>
              {transaction.type}
            </Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={globalStyles.card}>
          <Text style={[globalStyles.subtitle, { marginBottom: 16 }]}>
            Transaction Information
          </Text>
          
          <DetailRow label="Description" value={transaction.description} />
          <DetailRow label="Date" value={formatDate(transaction.date)} />
          <DetailRow label="Location" value={transaction.location} />
          <DetailRow label="Category" value={transaction.category} />
          <DetailRow 
            label="Type" 
            value={transaction.type} 
            valueColor={getTypeColor(transaction.type)}
          />
          <DetailRow label="Transaction ID" value={`#${transaction.id}`} />
        </View>
      </ScrollView>
    </View>
  );
}
