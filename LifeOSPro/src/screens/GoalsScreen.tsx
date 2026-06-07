import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils/helpers';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card, ProgressBar } from '../components/UI';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'health' | 'finance' | 'learning' | 'productivity' | 'habit';
  completed: boolean;
}

const GoalsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch, addXP } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', current: '0', unit: '', deadline: '', category: 'habit' });

  // Sample goals if none exist
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Read 24 books', target: 24, current: 8, unit: 'books', deadline: '2025-12-31', category: 'learning', completed: false },
    { id: '2', title: 'Save $10,000', target: 10000, current: 4500, unit: '$', deadline: '2025-12-31', category: 'finance', completed: false },
    { id: '3', title: 'Run 500 km', target: 500, current: 180, unit: 'km', deadline: '2025-12-31', category: 'health', completed: false },
    { id: '4', title: 'Complete 100 tasks', target: 100, current: 45, unit: 'tasks', deadline: '2025-06-30', category: 'productivity', completed: false },
  ]);

  const addGoal = () => {
    if (!newGoal.title.trim() || !newGoal.target) return;

    const goal: Goal = {
      id: generateId(),
      title: newGoal.title,
      target: parseFloat(newGoal.target),
      current: parseFloat(newGoal.current) || 0,
      unit: newGoal.unit || 'items',
      deadline: newGoal.deadline || '2025-12-31',
      category: newGoal.category as any,
      completed: false,
    };

    setGoals([...goals, goal]);
    addXP(20);
    setNewGoal({ title: '', target: '', current: '0', unit: '', deadline: '', category: 'habit' });
    setShowModal(false);
  };

  const updateProgress = (goalId: string, amount: number) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        const newCurrent = Math.min(g.current + amount, g.target);
        if (newCurrent >= g.target && !g.completed) {
          addXP(50);
          Alert.alert('Goal Achieved!', `You completed "${g.title}"! +50 XP`);
        }
        return { ...g, current: newCurrent, completed: newCurrent >= g.target };
      }
      return g;
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return colors.dark.error;
      case 'finance': return colors.dark.warning;
      case 'learning': return colors.dark.primary;
      case 'productivity': return colors.dark.secondary;
      default: return colors.dark.accent;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return 'heart';
      case 'finance': return 'cash';
      case 'learning': return 'book';
      case 'productivity': return 'flash';
      default: return 'flag';
    }
  };

  const totalProgress = goals.length > 0 
    ? goals.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) / goals.length 
    : 0;

  const completedGoals = goals.filter(g => g.completed).length;

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🎯 Goals</Text>
          <Text style={styles.subtitle}>{completedGoals}/{goals.length} completed</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.addButtonGradient}>
            <Text style={styles.addButtonText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Overall Progress */}
      <Card style={styles.overallCard}>
        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.overallGradient}>
          <Text style={styles.overallTitle}>Overall Progress</Text>
          <Text style={styles.overallPercent}>{Math.round(totalProgress)}%</Text>
          <ProgressBar progress={totalProgress} color="#FFF" height={10} />
          <Text style={styles.overallHint}>Keep going! You're crushing it! 💪</Text>
        </LinearGradient>
      </Card>

      {/* Goals List */}
      {goals.map((goal) => (
        <Card key={goal.id} style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(goal.category) + '20' }]}>
              <Ionicons name={getCategoryIcon(goal.category) as any} size={16} color={getCategoryColor(goal.category)} />
              <Text style={[styles.categoryText, { color: getCategoryColor(goal.category) }]}>
                {goal.category}
              </Text>
            </View>
            {goal.completed && <Text style={styles.completedBadge}>✓ Complete</Text>}
          </View>

          <Text style={styles.goalTitle}>{goal.title}</Text>
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
              </Text>
              <Text style={styles.progressPercent}>
                {Math.round((goal.current / goal.target) * 100)}%
              </Text>
            </View>
            <ProgressBar 
              progress={(goal.current / goal.target) * 100} 
              color={getCategoryColor(goal.category)} 
              height={12} 
            />
          </View>

          <View style={styles.goalFooter}>
            <Text style={styles.deadline}>📅 Due: {goal.deadline}</Text>
            {!goal.completed && (
              <TouchableOpacity 
                style={styles.addProgressBtn}
                onPress={() => {
                  const amount = Math.ceil(goal.target * 0.1);
                  Alert.alert('Add Progress', `Add ${amount} ${goal.unit}?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: `+${amount}`, onPress: () => updateProgress(goal.id, amount) },
                  ]);
                }}
              >
                <Text style={styles.addProgressText}>+ Add Progress</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      ))}

      {/* Suggestions */}
      <Text style={styles.sectionTitle}>💡 Suggested Goals</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestions}>
        {[
          { title: 'Morning Routine', emoji: '🌅', category: 'habit' },
          { title: 'Save $1K', emoji: '💵', category: 'finance' },
          { title: 'Read 30 min/day', emoji: '📖', category: 'learning' },
          { title: 'Exercise 3x/week', emoji: '💪', category: 'health' },
          { title: 'Complete Projects', emoji: '📁', category: 'productivity' },
        ].map((s, i) => (
          <TouchableOpacity 
            key={i} 
            style={styles.suggestionCard}
            onPress={() => {
              setNewGoal({ ...newGoal, title: s.title, category: s.category });
              setShowModal(true);
            }}
          >
            <Text style={styles.suggestionEmoji}>{s.emoji}</Text>
            <Text style={styles.suggestionTitle}>{s.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Goal</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Goal title..."
              placeholderTextColor={colors.dark.textTertiary}
              value={newGoal.title}
              onChangeText={(t) => setNewGoal({ ...newGoal, title: t })}
            />

            <View style={styles.modalRow}>
              <TextInput
                style={[styles.modalInput, { flex: 1 }]}
                placeholder="Target number..."
                placeholderTextColor={colors.dark.textTertiary}
                keyboardType="numeric"
                value={newGoal.target}
                onChangeText={(t) => setNewGoal({ ...newGoal, target: t })}
              />
              <TextInput
                style={[styles.modalInput, { flex: 1 }]}
                placeholder="Unit (km, $, books)"
                placeholderTextColor={colors.dark.textTertiary}
                value={newGoal.unit}
                onChangeText={(t) => setNewGoal({ ...newGoal, unit: t })}
              />
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Deadline (YYYY-MM-DD)"
              placeholderTextColor={colors.dark.textTertiary}
              value={newGoal.deadline}
              onChangeText={(t) => setNewGoal({ ...newGoal, deadline: t })}
            />

            <TouchableOpacity style={styles.createButton} onPress={addGoal}>
              <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.createGradient}>
                <Text style={styles.createButtonText}>Create Goal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.dark.text },
  subtitle: { ...typography.bodySmall, color: colors.dark.textSecondary, marginTop: spacing.xs },
  addButton: {},
  addButtonGradient: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { fontSize: 24, color: '#FFF', fontWeight: '300' },
  overallCard: { marginHorizontal: spacing.lg, padding: 0, overflow: 'hidden' },
  overallGradient: { padding: spacing.xl },
  overallTitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  overallPercent: { fontSize: 36, fontWeight: '800', color: '#FFF', marginVertical: spacing.sm },
  overallHint: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: spacing.sm },
  goalCard: { marginHorizontal: spacing.lg, marginTop: spacing.md },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full, gap: 4 },
  categoryEmoji: { fontSize: 12 },
  categoryText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  completedBadge: { fontSize: 12, color: colors.dark.success, fontWeight: '600' },
  goalTitle: { ...typography.h5, color: colors.dark.text, marginBottom: spacing.md },
  progressSection: { marginBottom: spacing.md },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  progressText: { ...typography.bodySmall, color: colors.dark.textSecondary },
  progressPercent: { ...typography.bodySmall, color: colors.dark.text, fontWeight: '600' },
  goalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deadline: { ...typography.caption, color: colors.dark.textTertiary },
  addProgressBtn: { backgroundColor: colors.dark.primary + '20', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md },
  addProgressText: { ...typography.caption, color: colors.dark.primary, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.dark.text, paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md },
  suggestions: { paddingLeft: spacing.lg },
  suggestionCard: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginRight: spacing.sm, width: 130, alignItems: 'center' },
  suggestionEmoji: { fontSize: 28, marginBottom: spacing.xs },
  suggestionTitle: { ...typography.caption, color: colors.dark.text, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.dark.background, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalTitle: { ...typography.h4, color: colors.dark.text },
  modalClose: { fontSize: 20, color: colors.dark.textSecondary },
  modalInput: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.md, color: colors.dark.text, fontSize: 16, marginBottom: spacing.md },
  modalRow: { flexDirection: 'row', gap: spacing.md },
  createButton: { marginTop: spacing.md },
  createGradient: { padding: spacing.lg, borderRadius: borderRadius.md, alignItems: 'center' },
  createButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default GoalsScreen;
