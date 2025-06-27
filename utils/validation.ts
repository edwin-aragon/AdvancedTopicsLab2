import { Transaction, ValidationResult, TransactionType } from '../types';

export const validateTransaction = (transaction: Partial<Transaction>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!transaction.date || transaction.toString().trim() === '') {
    errors.date = 'Date is required';
  }

  if (!transaction.amount || isNaN(Number(transaction.amount)) || Number(transaction.amount) <= 0) {
    errors.amount = 'Amount must be a valid positive number';
  }

  if (!transaction.description || transaction.description.trim() === '') {
    errors.description = 'Description is required';
  }

  if (!transaction.location || transaction.location.trim() === '') {
    errors.location = 'Location is required';
  }

  if (!transaction.type || transaction.type.trim() === '') {
    errors.type = 'Transaction type is required';
  }

  if (!transaction.category || transaction.category.trim() === '') {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: any): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getTypeColor = (type: TransactionType): string => {
  const colors = {
    Credit: '#4CAF50',
    Debit: '#F44336',
    Refund: '#FF9800',
  };
  return colors[type];
};
