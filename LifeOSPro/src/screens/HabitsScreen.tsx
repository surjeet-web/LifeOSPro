import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { generateId, getToday } from '../utils/helpers';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card, Button, ProgressBar } from '../components/UI';
import { HABIT_ICONS } from '../types';

const HabitsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch, addXP } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('✨');
  const [newHabitColor, setNewHabitColor] = useState('#6366F1');

  const today = getToday();
  
  const habitColors = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#EF4444', '#8B5CF6', '#06B6D4'];

  const completedToday = state.habits.filter(h => h.completedDates?.includes(today)).length;
  const totalHabits = state.habits.length;
  const completionRate = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  const calculateStreak = (dates: string[]): number => {
    if (!dates || dates.length === 0) return 0;
    const sorted = [...dates].sort().reverse();
    let streak = 0;
    let current = new Date();
    
    for (let i = 0; i < 365; i++) {
      const dateStr = current.toISOString().split('T')[0];
      if (sorted.includes(dateStr)) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else if (i > 0) {
        break;
      } else {
        current.setDate(current.getDate() - 1);
      }
    }
    return streak;
  };

  const toggleHabit = (habit: any) => {
    const isCompleted = habit.completedDates?.includes(today);
    let newDates: string[];
    
    if (isCompleted) {
      newDates = (habit.completedDates || []).filter((d: string) => d !== today);
    } else {
      newDates = [...(habit.completedDates || []), today];
    }

    const newStreak = calculateStreak(newDates);
    
    dispatch({
      type: 'UPDATE_HABIT',
      payload: { ...habit, completedDates: newDates, streak: newStreak },
    });

    if (!isCompleted) {
      addXP(habit.xpPerCompletion || 10);
    }
  };

  const deleteHabit = (id: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: id });
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: generateId(),
      name: newHabitName.trim(),
      icon: newHabitIcon,
      color: newHabitColor,
      frequency: 'daily' as const,
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
      xpPerCompletion: 10,
    };

    dispatch({ type: 'ADD_HABIT', payload: newHabit });
    setNewHabitName('');
    setShowAddModal(false);
  };

  const renderHabit = ({ item }: { item: any }) => {
    const isCompleted = item.completedDates?.includes(today);
    return (
      <TouchableOpacity
        style={[styles.habitItem, isCompleted && styles.habitItemCompleted]}
        onPress={() => toggleHabit(item)}
        onLongPress={() => deleteHabit(item.id)}
      >
        <View style={[styles.habitIconContainer, { backgroundColor: item.color + '20' }]}>
          <Text style={styles.habitIcon}>{item.icon}</Text>
        </View>
        <View style={styles.habitContent}>
          <Text style={styles.habitName}>{item.name}</Text>
          <View style={styles.habitStats}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>{item.streak || 0} day streak</Text>
            </View>
          </View>
        </View>
        <View style={[styles.checkCircle, isCompleted && styles.checkCircleCompleted, { borderColor: item.color }]}>
          {isCompleted && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Habits</Text>
          <Text style={styles.subtitle}>{completedToday} of {totalHabits} completed today</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <LinearGradient colors={['#F59E0B', '#FBBF24'] as any} style={styles.addButtonGradient}>
            <Text style={styles.addButtonText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Card style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Habits</Text>
          <Text style={styles.progressPercent}>{Math.round(completionRate)}%</Text>
        </View>
        <ProgressBar progress={completionRate} color={colors.dark.warning} height={8} />
        <View style={styles.streakInfo}>
          <Text style={styles.streakLabel}>
            🔥 Total streak: {state.habits.reduce((acc, h) => acc + (h.streak || 0), 0)} days
          </Text>
        </View>
      </Card>

      <FlatList
        data={state.habits}
        keyExtractor={item => item.id}
        renderItem={renderHabit}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>No Habits Yet</Text>
            <Text style={styles.emptyText}>Start building positive habits!</Text>
            <Button title="Create First Habit" onPress={() => setShowAddModal(true)} style={styles.emptyButton} />
          </View>
        }
      />

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Habit</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.modalInput}
                placeholder="Habit name (e.g., Exercise, Read)"
                placeholderTextColor={colors.dark.textTertiary}
                value={newHabitName}
                onChangeText={setNewHabitName}
                autoFocus
              />

              <Text style={styles.modalLabel}>Icon</Text>
              <View style={styles.iconGrid}>
                {HABIT_ICONS.slice(0, 20).map(icon => (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.iconButton, newHabitIcon === icon && styles.iconButtonSelected]}
                    onPress={() => setNewHabitIcon(icon)}
                  >
                    <Text style={styles.iconText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Color</Text>
              <View style={styles.colorRow}>
                {habitColors.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorButton, { backgroundColor: color }, newHabitColor === color && styles.colorButtonSelected]}
                    onPress={() => setNewHabitColor(color)}
                  />
                ))}
              </View>

              <Button title="Create Habit" onPress={addHabit} style={styles.createButton} />
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
  subtitle: { ...typography.bodySmall, color: colors.dark.textSecondary, marginTop: spacing.xs },
  addButton: {},
  addButtonGradient: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { fontSize: 24, color: '#0A0A0F', fontWeight: '300' },
  progressCard: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  progressTitle: { ...typography.bodySmall, color: colors.dark.textSecondary },
  progressPercent: { ...typography.bodySmall, color: colors.dark.warning, fontWeight: '600' },
  streakInfo: { marginTop: spacing.sm },
  streakLabel: { ...typography.bodySmall, color: colors.dark.warning },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  habitItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  habitItemCompleted: { backgroundColor: colors.dark.success + '10', borderWidth: 1, borderColor: colors.dark.success + '30' },
  habitIconContainer: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  habitIcon: { fontSize: 24 },
  habitContent: { flex: 1, marginLeft: spacing.md },
  habitName: { ...typography.body, color: colors.dark.text, fontWeight: '600' },
  habitStats: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  streakEmoji: { fontSize: 12 },
  streakText: { ...typography.caption, color: colors.dark.warning },
  checkCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkCircleCompleted: { backgroundColor: colors.dark.success, borderColor: colors.dark.success },
  checkMark: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyEmoji: { fontSize: 60, marginBottom: spacing.md },
  emptyTitle: { ...typography.h4, color: colors.dark.text },
  emptyText: { ...typography.bodySmall, color: colors.dark.textSecondary, marginTop: spacing.sm },
  emptyButton: { marginTop: spacing.lg },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.dark.background, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalTitle: { ...typography.h4, color: colors.dark.text },
  modalClose: { fontSize: 20, color: colors.dark.textSecondary },
  modalInput: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.lg, ...typography.body, color: colors.dark.text, marginBottom: spacing.lg },
  modalLabel: { ...typography.bodySmall, color: colors.dark.textSecondary, marginBottom: spacing.sm },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.dark.surface, alignItems: 'center', justifyContent: 'center' },
  iconButtonSelected: { backgroundColor: colors.dark.primary },
  iconText: { fontSize: 20 },
  colorRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  colorButton: { width: 36, height: 36, borderRadius: 18 },
  colorButtonSelected: { borderWidth: 3, borderColor: '#FFFFFF' },
  createButton: { marginTop: spacing.lg, marginBottom: spacing.lg },
});

export default HabitsScreen;
