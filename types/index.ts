export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  location: string;
  type: TransactionType;
  category: TransactionCategory;
}

export type TransactionType = 'Credit' | 'Debit' | 'Refund';

export type TransactionCategory = 
  | 'Shopping' 
  | 'Travel' 
  | 'Utility' 
  | 'Food' 
  | 'Entertainment' 
  | 'Income' 
  | 'Other';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  transactions: Transaction[];
  signIn: (username: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Transaction;
  getTransaction: (id: string) => Transaction | undefined;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  multiline?: boolean;
}

export interface TransactionCardProps {
  transaction: Transaction;
  onPress: () => void;
}
