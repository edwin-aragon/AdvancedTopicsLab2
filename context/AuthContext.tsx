import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  AuthContextType, 
  AuthResult, 
  Transaction, 
  TransactionType, 
  TransactionCategory 
} from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-06-25',
      amount: 50.00,
      description: 'Grocery Shopping',
      location: 'Walmart',
      type: 'Debit' as TransactionType,
      category: 'Shopping' as TransactionCategory,
    },
    {
      id: '2',
      date: '2025-06-24',
      amount: 1200.00,
      description: 'Salary Deposit',
      location: 'Bank Transfer',
      type: 'Credit' as TransactionType,
      category: 'Income' as TransactionCategory,
    },
  ]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (username: string, password: string): Promise<AuthResult> => {
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      await AsyncStorage.setItem('isAuthenticated', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signOut = async (): Promise<void> => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('isAuthenticated');
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const getTransaction = (id: string): Transaction | undefined => {
    return transactions.find(transaction => transaction.id === id);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    transactions,
    signIn,
    signOut,
    addTransaction,
    getTransaction,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
