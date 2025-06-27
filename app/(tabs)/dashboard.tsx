import React, { JSX } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { TransactionCard } from '../../components/TransactionCard';
import { globalStyles, colors } from '../../styles/globalStyles';
import { formatCurrency } from '../../utils/validation';
import { Transaction } from '../../types';

export default function Dashboard(): JSX.Element {
  const { transactions, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = (): void => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/signin');
          }
        },
      ]
    );
  };

  const handleTransactionPress = (transaction: Transaction): void => {
    router.push(`/transaction-details/${transaction.id}`);
  };

  const calculateBalance = (): number => {
    return transactions.reduce((total, transaction) => {
      if (transaction.type === 'Credit') {
        return total + transaction.amount;
      } else {
        return total - transaction.amount;
      }
    }, 0);
  };

  const renderTransaction: ListRenderItem<Transaction> = ({ item }) => (
    <TransactionCard
      transaction={item}
      onPress={() => handleTransactionPress(item)}
    />
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
          <Text style={{ color: colors.surface, fontSize: 24, fontWeight: 'bold' }}>
            Dashboard
          </Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ color: colors.surface, fontSize: 16, fontWeight: '500' }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Balance Card */}
        <View style={[globalStyles.card, { marginTop: 16, backgroundColor: colors.surface }]}>
          <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: 'center' }}>
            Current Balance
          </Text>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: 'bold', 
            textAlign: 'center',
            color: calculateBalance() >= 0 ? colors.success : colors.error,
            marginTop: 8 
          }}>
            {formatCurrency(Math.abs(calculateBalance()))}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={globalStyles.subtitle}>Recent Transactions</Text>
          <TouchableOpacity 
            style={[globalStyles.button, { paddingVertical: 8, paddingHorizontal: 16 }]}
            onPress={() => router.push('/(tabs)/add-transaction')}
          >
            <Text style={[globalStyles.buttonText, { fontSize: 14 }]}>Add Transaction</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                No transactions yet
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
