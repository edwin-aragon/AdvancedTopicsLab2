import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import { formatCurrency, formatDate, getTypeColor } from '../utils/validation';
import { TransactionCardProps } from '../types';

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onPress }) => {
  return (
    <TouchableOpacity style={globalStyles.card} onPress={onPress}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.subtitle}>{transaction.description}</Text>
          <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
            {formatDate(transaction.date)}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {transaction.location} • {transaction.category}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[
            { fontSize: 18, fontWeight: 'bold' },
            { color: getTypeColor(transaction.type) }
          ]}>
            {transaction.type === 'Credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
          <Text style={{ 
            color: getTypeColor(transaction.type), 
            fontSize: 12, 
            fontWeight: '500',
            marginTop: 2 
          }}>
            {transaction.type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
