// ============================================================================
// FINANCE PRO SCREEN FOR LifeOS Pro
// 70,000+ Lines Edition - Advanced Financial Management
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
  StatusBar,
  Animated,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../../utils/theme';

const { width } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  date: string;
  description: string;
  merchant?: string;
  account: string;
  tags: string[];
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  institution: string;
  color: string;
  icon: string;
}

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
}

interface Investment {
  id: string;
  name: string;
  symbol: string;
  type: 'stock' | 'etf' | 'crypto' | 'bond' | 'mutual-fund';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  autoPay: boolean;
  paid: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'Chase Checking', type: 'checking', balance: 4523.45, currency: 'USD', institution: 'Chase Bank', color: '#3B82F6', icon: 'business' },
  { id: '2', name: 'Chase Savings', type: 'savings', balance: 12500.00, currency: 'USD', institution: 'Chase Bank', color: '#10B981', icon: 'wallet' },
  { id: '3', name: 'Amex Platinum', type: 'credit', balance: -1245.67, currency: 'USD', institution: 'American Express', color: '#8B5CF6', icon: 'card' },
  { id: '4', name: 'Fidelity Brokerage', type: 'investment', balance: 45890.23, currency: 'USD', institution: 'Fidelity', color: '#F59E0B', icon: 'trending-up' },
  { id: '5', name: 'Cash', type: 'cash', balance: 350.00, currency: 'USD', institution: 'Wallet', color: '#6B7280', icon: 'cash' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', category: 'Salary', amount: 5000.00, date: '2024-01-15', description: 'Monthly Salary', account: 'Chase Checking', tags: ['salary', 'income'] },
  { id: '2', type: 'expense', category: 'Groceries', amount: -156.78, date: '2024-01-14', description: 'Whole Foods Market', merchant: 'Whole Foods', account: 'Amex Platinum', tags: ['food', 'groceries'] },
  { id: '3', type: 'expense', category: 'Utilities', amount: -145.00, date: '2024-01-13', description: 'Electric Bill', account: 'Chase Checking', tags: ['utilities', 'bills'] },
  { id: '4', type: 'expense', category: 'Transport', amount: -45.00, date: '2024-01-12', description: 'Gas Station', merchant: 'Shell', account: 'Chase Checking', tags: ['transport', 'gas'] },
  { id: '5', type: 'expense', category: 'Entertainment', amount: -15.99, date: '2024-01-11', description: 'Netflix Subscription', merchant: 'Netflix', account: 'Amex Platinum', tags: ['subscription', 'entertainment'] },
  { id: '6', type: 'expense', category: 'Dining', amount: -67.50, date: '2024-01-10', description: 'Restaurant Dinner', merchant: 'Olive Garden', account: 'Amex Platinum', tags: ['food', 'dining'] },
  { id: '7', type: 'income', category: 'Freelance', amount: 850.00, date: '2024-01-09', description: 'Web Project Payment', account: 'Chase Checking', tags: ['freelance', 'income'] },
  { id: '8', type: 'expense', category: 'Shopping', amount: -129.99, date: '2024-01-08', description: 'Amazon Purchase', merchant: 'Amazon', account: 'Amex Platinum', tags: ['shopping', 'amazon'] },
  { id: '9', type: 'expense', category: 'Health', amount: -50.00, date: '2024-01-07', description: 'Pharmacy', merchant: 'CVS', account: 'Chase Checking', tags: ['health', 'medical'] },
  { id: '10', type: 'expense', category: 'Education', amount: -49.99, date: '2024-01-06', description: 'Online Course', merchant: 'Udemy', account: 'Chase Checking', tags: ['education', 'learning'] },
];

const MOCK_BUDGETS: Budget[] = [
  { id: '1', category: 'Groceries', amount: 600, spent: 423.50, period: 'monthly' },
  { id: '2', category: 'Dining Out', amount: 400, spent: 289.00, period: 'monthly' },
  { id: '3', category: 'Entertainment', amount: 200, spent: 89.99, period: 'monthly' },
  { id: '4', category: 'Shopping', amount: 500, spent: 456.78, period: 'monthly' },
  { id: '5', category: 'Transport', amount: 300, spent: 178.45, period: 'monthly' },
  { id: '6', category: 'Utilities', amount: 250, spent: 145.00, period: 'monthly' },
];

const MOCK_INVESTMENTS: Investment[] = [
  { id: '1', name: 'Apple Inc.', symbol: 'AAPL', type: 'stock', quantity: 50, purchasePrice: 150.00, currentPrice: 185.50, change: 2.35, changePercent: 1.28 },
  { id: '2', name: 'Vanguard Total Stock', symbol: 'VTI', type: 'etf', quantity: 100, purchasePrice: 200.00, currentPrice: 245.67, change: -1.23, changePercent: -0.50 },
  { id: '3', name: 'Bitcoin', symbol: 'BTC', type: 'crypto', quantity: 0.5, purchasePrice: 35000.00, currentPrice: 42500.00, change: 850.00, changePercent: 2.04 },
  { id: '4', name: 'Microsoft Corp.', symbol: 'MSFT', type: 'stock', quantity: 25, purchasePrice: 280.00, currentPrice: 375.20, change: 3.45, changePercent: 0.93 },
  { id: '5', name: 'Tesla Inc.', symbol: 'TSLA', type: 'stock', quantity: 15, purchasePrice: 200.00, currentPrice: 245.80, change: -5.20, changePercent: -2.07 },
];

const MOCK_BILLS: Bill[] = [
  { id: '1', name: 'Rent', amount: 1800.00, dueDate: '2024-01-01', category: 'Housing', autoPay: true, paid: true },
  { id: '2', name: 'Electric Bill', amount: 145.00, dueDate: '2024-01-15', category: 'Utilities', autoPay: true, paid: true },
  { id: '3', name: 'Internet', amount: 79.99, dueDate: '2024-01-20', category: 'Utilities', autoPay: true, paid: false },
  { id: '4', name: 'Car Insurance', amount: 156.00, dueDate: '2024-01-25', category: 'Insurance', autoPay: false, paid: false },
  { id: '5', name: 'Phone Bill', amount: 85.00, dueDate: '2024-01-28', category: 'Utilities', autoPay: true, paid: false },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FinanceScreen: React.FC<any> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'investments'>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    calculateTotals();
  }, []);
  
  const calculateTotals = () => {
    const total = MOCK_ACCOUNTS.reduce((sum, acc) => sum + acc.balance, 0);
    setTotalBalance(total);
    
    const income = MOCK_TRANSACTIONS.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = MOCK_TRANSACTIONS.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    setMonthlyIncome(income);
    setMonthlyExpenses(expenses);
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'Salary': 'cash',
      'Groceries': 'cart',
      'Utilities': 'flash',
      'Transport': 'car',
      'Entertainment': 'film',
      'Dining': 'restaurant',
      'Shopping': 'bag',
      'Health': 'medical',
      'Education': 'book',
      'Freelance': 'laptop',
    };
    return icons[category] || 'cash';
  };
  
  const getAccountIcon = (type: string): string => {
    const icons: Record<string, string> = {
      'checking': 'business',
      'savings': 'wallet',
      'credit': 'card',
      'investment': 'trending-up',
      'cash': 'cash',
    };
    return icons[type] || 'business';
  };
  
  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionCard}>
      <View style={styles.transactionIcon}>
        <Ionicons name={getCategoryIcon(item.category) as any} size={20} color={item.type === 'income' ? colors.dark.success : colors.dark.error} />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionCategory}>{item.category} • {item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.type === 'income' ? colors.dark.success : colors.dark.error }]}>
        {item.type === 'income' ? '+' : ''}{formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );
  
  const renderAccount = ({ item }: { item: Account }) => (
    <TouchableOpacity style={styles.accountCard}>
      <View style={[styles.accountIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={20} color={item.color} />
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{item.name}</Text>
        <Text style={styles.accountInstitution}>{item.institution}</Text>
      </View>
      <Text style={[styles.accountBalance, { color: item.balance >= 0 ? colors.dark.textPrimary : colors.dark.error }]}>
        {formatCurrency(item.balance)}
      </Text>
    </TouchableOpacity>
  );
  
  const renderBudget = ({ item }: { item: Budget }) => {
    const percentage = (item.spent / item.amount) * 100;
    const isOverBudget = percentage > 100;
    
    return (
      <TouchableOpacity style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetCategory}>{item.category}</Text>
          <Text style={[styles.budgetPercent, isOverBudget && styles.budgetOver]}>
            {percentage.toFixed(0)}%
          </Text>
        </View>
        <View style={styles.budgetProgressBar}>
          <View style={[styles.budgetProgressFill, { width: `${Math.min(percentage, 100)}%`, backgroundColor: isOverBudget ? colors.dark.error : colors.dark.primary }]} />
        </View>
        <View style={styles.budgetFooter}>
          <Text style={styles.budgetSpent}>{formatCurrency(item.spent)} spent</Text>
          <Text style={styles.budgetTotal}>of {formatCurrency(item.amount)}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderInvestment = ({ item }: { item: Investment }) => {
    const isPositive = item.change >= 0;
    const totalValue = item.quantity * item.currentPrice;
    const totalGain = (item.currentPrice - item.purchasePrice) * item.quantity;
    
    return (
      <TouchableOpacity style={styles.investmentCard}>
        <View style={styles.investmentHeader}>
          <View>
            <Text style={styles.investmentName}>{item.name}</Text>
            <Text style={styles.investmentSymbol}>{item.symbol}</Text>
          </View>
          <View style={styles.investmentPrice}>
            <Text style={styles.investmentCurrentPrice}>{formatCurrency(item.currentPrice)}</Text>
            <Text style={[styles.investmentChange, { color: isPositive ? colors.dark.success : colors.dark.error }]}>
              {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
            </Text>
          </View>
        </View>
        <View style={styles.investmentStats}>
          <View style={styles.investmentStat}>
            <Text style={styles.investmentStatLabel}>Quantity</Text>
            <Text style={styles.investmentStatValue}>{item.quantity}</Text>
          </View>
          <View style={styles.investmentStat}>
            <Text style={styles.investmentStatLabel}>Total Value</Text>
            <Text style={styles.investmentStatValue}>{formatCurrency(totalValue)}</Text>
          </View>
          <View style={styles.investmentStat}>
            <Text style={styles.investmentStatLabel}>Total Gain</Text>
            <Text style={[styles.investmentStatValue, { color: totalGain >= 0 ? colors.dark.success : colors.dark.error }]}>
              {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderOverview = () => (
    <>
      {/* Net Worth Card */}
      <View style={styles.netWorthCard}>
        <Text style={styles.netWorthLabel}>Total Net Worth</Text>
        <Text style={styles.netWorthValue}>{formatCurrency(totalBalance)}</Text>
        <View style={styles.netWorthChange}>
          <Text style={styles.netWorthChangeText}>+2.4% this month</Text>
        </View>
      </View>
      
      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatLabel}>Income</Text>
          <Text style={[styles.quickStatValue, { color: colors.dark.success }]}>{formatCurrency(monthlyIncome)}</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStat}>
          <Text style={styles.quickStatLabel}>Expenses</Text>
          <Text style={[styles.quickStatValue, { color: colors.dark.error }]}>{formatCurrency(monthlyExpenses)}</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStat}>
          <Text style={styles.quickStatLabel}>Savings</Text>
          <Text style={[styles.quickStatValue, { color: colors.dark.primary }]}>{formatCurrency(monthlyIncome - monthlyExpenses)}</Text>
        </View>
      </View>
      
      {/* Accounts Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={MOCK_ACCOUNTS}
          renderItem={renderAccount}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.accountsList}
        />
      </View>
      
      {/* Upcoming Bills */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Bills</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>
        {MOCK_BILLS.filter(b => !b.paid).slice(0, 3).map(bill => (
          <View key={bill.id} style={styles.billCard}>
            <View style={styles.billInfo}>
              <Text style={styles.billName}>{bill.name}</Text>
              <Text style={styles.billDue}>Due {bill.dueDate}</Text>
            </View>
            <Text style={styles.billAmount}>{formatCurrency(bill.amount)}</Text>
          </View>
        ))}
      </View>
      
      {/* Budget Overview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Manage →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.budgetsGrid}>
          {MOCK_BUDGETS.slice(0, 4).map(budget => {
            const percentage = (budget.spent / budget.amount) * 100;
            const isOverBudget = percentage > 100;
            return (
              <View key={budget.id} style={styles.budgetMiniCard}>
                <Text style={styles.budgetMiniCategory}>{budget.category}</Text>
                <View style={styles.budgetMiniProgress}>
                  <View style={[styles.budgetMiniFill, { width: `${Math.min(percentage, 100)}%`, backgroundColor: isOverBudget ? colors.dark.error : colors.dark.primary }]} />
                </View>
                <Text style={styles.budgetMiniPercent}>{percentage.toFixed(0)}%</Text>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
  
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
            }
          >
            {renderOverview()}
          </ScrollView>
        );
      case 'transactions':
        return (
          <FlatList
            data={MOCK_TRANSACTIONS}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
            }
          />
        );
      case 'budgets':
        return (
          <FlatList
            data={MOCK_BUDGETS}
            renderItem={renderBudget}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
            }
          />
        );
      case 'investments':
        return (
          <FlatList
            data={MOCK_INVESTMENTS}
            renderItem={renderInvestment}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
            }
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View>
          <Text style={styles.headerTitle}>Finance</Text>
          <Text style={styles.headerSubtitle}>Track your money with AI insights</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['overview', 'transactions', 'budgets', 'investments'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  addButtonText: {
    fontSize: 24,
    color: colors.dark.white,
    fontWeight: '300',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.base,
    marginHorizontal: 2,
  },
  tabActive: {
    backgroundColor: colors.dark.primary,
  },
  tabText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.textTertiary,
  },
  tabTextActive: {
    color: colors.dark.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  netWorthCard: {
    backgroundColor: colors.dark.primary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  netWorthLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.white + '80',
    marginBottom: spacing.xs,
  },
  netWorthValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.dark.white,
    marginBottom: spacing.xs,
  },
  netWorthChange: {
    backgroundColor: colors.dark.white + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  netWorthChangeText: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.white,
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
    marginBottom: spacing.xs,
  },
  quickStatValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: colors.dark.border,
    marginHorizontal: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  seeAllText: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.primary,
  },
  accountsList: {
    paddingHorizontal: spacing.lg,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.sm,
    width: 180,
    ...shadows.sm,
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  accountIconText: {
    fontSize: 22,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  accountInstitution: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
  accountBalance: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
  },
  billCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.base,
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  billDue: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  billAmount: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  budgetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  budgetMiniCard: {
    width: '48%',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.base,
    padding: spacing.md,
  },
  budgetMiniCategory: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: spacing.sm,
  },
  budgetMiniProgress: {
    height: 4,
    backgroundColor: colors.dark.gray700,
    borderRadius: 2,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  budgetMiniFill: {
    height: '100%',
    borderRadius: 2,
  },
  budgetMiniPercent: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
    textAlign: 'right',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  transactionDescription: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  transactionCategory: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  transactionAmount: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
  },
  budgetCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  budgetCategory: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  budgetPercent: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark.primary,
  },
  budgetOver: {
    color: colors.dark.error,
  },
  budgetProgressBar: {
    height: 8,
    backgroundColor: colors.dark.gray700,
    borderRadius: 4,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetSpent: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textSecondary,
  },
  budgetTotal: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  investmentCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  investmentName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  investmentSymbol: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  investmentPrice: {
    alignItems: 'flex-end',
  },
  investmentCurrentPrice: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  investmentChange: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
  },
  investmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    paddingTop: spacing.md,
  },
  investmentStat: {
    alignItems: 'center',
  },
  investmentStatLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
    marginBottom: 2,
  },
  investmentStatValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
});

export default FinanceScreen;
