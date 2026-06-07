import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { generateId, getToday, formatDate } from '../utils/helpers';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card, Button, ProgressBar } from '../components/UI';
import { FINANCE_CATEGORIES } from '../types';

const FinanceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch, addXP } = useApp();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');

  const today = getToday();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = state.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  const filteredTransactions = state.transactions
    .filter(t => {
      if (filter === 'all') return true;
      return t.type === filter;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const addTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const newTransaction = {
      id: generateId(),
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: today,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    addXP(5);
    setAmount('');
    setDescription('');
    setShowAddModal(false);
  };

  const getCategoryEmoji = (cat: string): string => {
    const emoji = cat.split(' ')[0];
    return emoji;
  };

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: item.type === 'income' ? colors.dark.success + '20' : colors.dark.error + '20' }]}>
        <Text style={styles.transactionEmoji}>{getCategoryEmoji(item.category)}</Text>
      </View>
      <View style={styles.transactionContent}>
        <Text style={styles.transactionTitle}>{item.description || item.category}</Text>
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.type === 'income' ? colors.dark.success : colors.dark.error }]}>
        {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Finance</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <LinearGradient colors={['#10B981', '#34D399'] as any} style={styles.addButtonGradient}>
            <Text style={styles.addButtonText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <LinearGradient colors={['#10B981', '#059669'] as any} style={styles.summaryGradient}>
            <Text style={styles.summaryLabel}>This Month's Balance</Text>
            <Text style={styles.summaryAmount}>${balance.toFixed(2)}</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Income</Text>
                <Text style={styles.summaryItemAmount}>+${income.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Expenses</Text>
                <Text style={styles.summaryItemAmountRed}>-${expense.toFixed(2)}</Text>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* Savings Rate */}
        <Card style={styles.savingsCard}>
          <View style={styles.savingsHeader}>
            <Text style={styles.savingsTitle}>Savings Rate</Text>
            <Text style={[styles.savingsPercent, { color: savingsRate > 20 ? colors.dark.success : savingsRate > 10 ? colors.dark.warning : colors.dark.error }]}>
              {savingsRate.toFixed(1)}%
            </Text>
          </View>
          <ProgressBar 
            progress={Math.min(100, savingsRate)} 
            color={savingsRate > 20 ? colors.dark.success : savingsRate > 10 ? colors.dark.warning : colors.dark.error} 
            height={8} 
          />
          <Text style={styles.savingsHint}>
            {savingsRate > 20 ? '🎉 Great job! Keep it up!' : savingsRate > 10 ? '💪 Good progress! Aim for 20%' : '📈 Try to save more!'}
          </Text>
        </Card>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['all', 'income', 'expense'] as const).map(f => (
            <TouchableOpacity key={f} style={[styles.filterTab, filter === f && styles.filterTabActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {filteredTransactions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>💰</Text>
            <Text style={styles.emptyTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyText}>Track your income & expenses</Text>
          </Card>
        ) : (
          filteredTransactions.slice(0, 10).map(item => (
            <View key={item.id}>{renderTransaction({ item })}</View>
          ))
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Transaction</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Type Toggle */}
            <View style={styles.typeToggle}>
              <TouchableOpacity style={[styles.typeButton, type === 'expense' && styles.typeButtonExpense]} onPress={() => { setType('expense'); setCategory('Food'); }}>
                <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeButton, type === 'income' && styles.typeButtonIncome]} onPress={() => { setType('income'); setCategory('Salary'); }}>
                <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>Income</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Amount</Text>
              <View style={styles.amountInput}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountField}
                  placeholder="0.00"
                  placeholderTextColor={colors.dark.textTertiary}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <Text style={styles.modalLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {(type === 'income' ? FINANCE_CATEGORIES.income : FINANCE_CATEGORIES.expense).map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryButton, category === cat && styles.categoryButtonSelected]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={styles.categoryEmoji}>{getCategoryEmoji(cat)}</Text>
                    <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                      {cat.split(' ')[1] || cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Description (Optional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="What was this for?"
                placeholderTextColor={colors.dark.textTertiary}
                value={description}
                onChangeText={setDescription}
              />

              <Button title="Add Transaction" onPress={addTransaction} style={styles.createButton} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.dark.text },
  addButton: {},
  addButtonGradient: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { fontSize: 24, color: '#FFFFFF', fontWeight: '300' },
  summaryCard: { marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: 0, overflow: 'hidden' },
  summaryGradient: { padding: spacing.lg },
  summaryLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.8)' },
  summaryAmount: { ...typography.h1, color: '#FFFFFF', marginVertical: spacing.sm },
  summaryRow: { flexDirection: 'row', gap: spacing.xxl },
  summaryItem: {},
  summaryItemLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  summaryItemAmount: { ...typography.body, color: '#FFFFFF', fontWeight: '600' },
  summaryItemAmountRed: { ...typography.body, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  savingsCard: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  savingsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  savingsTitle: { ...typography.bodySmall, color: colors.dark.textSecondary },
  savingsPercent: { ...typography.h5, fontWeight: '700' },
  savingsHint: { ...typography.caption, color: colors.dark.textTertiary, marginTop: spacing.sm },
  filterTabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.lg, gap: spacing.sm },
  filterTab: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.dark.surface },
  filterTabActive: { backgroundColor: colors.dark.success },
  filterTabText: { ...typography.bodySmall, color: colors.dark.textSecondary },
  filterTabTextActive: { color: '#FFFFFF' },
  sectionTitle: { ...typography.h5, color: colors.dark.text, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  transactionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, marginBottom: spacing.sm, padding: spacing.md, borderRadius: borderRadius.md },
  transactionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  transactionEmoji: { fontSize: 20 },
  transactionContent: { flex: 1, marginLeft: spacing.md },
  transactionTitle: { ...typography.body, color: colors.dark.text },
  transactionDate: { ...typography.caption, color: colors.dark.textTertiary },
  transactionAmount: { ...typography.body, fontWeight: '600' },
  emptyCard: { marginHorizontal: spacing.lg, alignItems: 'center', paddingVertical: spacing.xxl },
  emptyEmoji: { fontSize: 50, marginBottom: spacing.md },
  emptyTitle: { ...typography.h5, color: colors.dark.text },
  emptyText: { ...typography.bodySmall, color: colors.dark.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.dark.background, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalTitle: { ...typography.h4, color: colors.dark.text },
  modalClose: { fontSize: 20, color: colors.dark.textSecondary },
  typeToggle: { flexDirection: 'row', marginBottom: spacing.lg, gap: spacing.md },
  typeButton: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, backgroundColor: colors.dark.surface, alignItems: 'center' },
  typeButtonExpense: { backgroundColor: colors.dark.error },
  typeButtonIncome: { backgroundColor: colors.dark.success },
  typeButtonText: { ...typography.button, color: colors.dark.textSecondary },
  typeButtonTextActive: { color: '#FFFFFF' },
  modalLabel: { ...typography.bodySmall, color: colors.dark.textSecondary, marginBottom: spacing.sm },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.lg, marginBottom: spacing.lg },
  currencySymbol: { ...typography.h2, color: colors.dark.textSecondary, marginRight: spacing.sm },
  amountField: { flex: 1, ...typography.h2, color: colors.dark.text },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  categoryButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.dark.surface, gap: spacing.xs },
  categoryButtonSelected: { backgroundColor: colors.dark.primary },
  categoryEmoji: { fontSize: 16 },
  categoryText: { ...typography.caption, color: colors.dark.textSecondary },
  categoryTextActive: { color: '#FFFFFF' },
  modalInput: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.lg, ...typography.body, color: colors.dark.text, marginBottom: spacing.lg },
  createButton: { marginTop: spacing.lg, marginBottom: spacing.lg },
});

export default FinanceScreen;
