import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { generateId, getToday } from '../utils/helpers';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card, Button, ProgressBar } from '../components/UI';
import { TASK_CATEGORIES } from '../types';

const TasksScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch, addXP } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('Personal');

  const today = getToday();
  const filteredTasks = state.tasks
    .filter(t => {
      if (filter === 'pending') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const completedCount = state.tasks.filter(t => t.completed).length;
  const totalCount = state.tasks.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const toggleTask = (task: any) => {
    const updatedTask = { ...task, completed: !task.completed };
    if (updatedTask.completed) {
      updatedTask.completedAt = new Date().toISOString();
      addXP(task.xp);
    }
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const xpValues = { urgent: 20, high: 15, medium: 10, low: 5 };
    
    const newTask = {
      id: generateId(),
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      category: newTaskCategory,
      completed: false,
      createdAt: new Date().toISOString(),
      xp: xpValues[newTaskPriority],
    };
    
    dispatch({ type: 'ADD_TASK', payload: newTask });
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return colors.dark.error;
      case 'high': return colors.dark.warning;
      case 'medium': return colors.dark.primary;
      case 'low': return colors.dark.success;
      default: return colors.dark.textSecondary;
    }
  };

  const renderTask = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.taskItem, item.completed && styles.taskItemCompleted]}
      onPress={() => toggleTask(item)}
      onLongPress={() => deleteTask(item.id)}
    >
      <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
        {item.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </View>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>{item.title}</Text>
        <View style={styles.taskMeta}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {item.priority}
            </Text>
          </View>
          <Text style={styles.taskCategory}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.taskXP}>
        <Text style={styles.taskXPText}>+{item.xp}</Text>
        <Text style={styles.taskXPLabel}>XP</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tasks</Text>
          <Text style={styles.subtitle}>{completedCount} of {totalCount} completed</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <LinearGradient colors={colors.dark.gradient.primary as any} style={styles.addButtonGradient}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <Card style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <Text style={styles.progressPercent}>{Math.round(completionRate)}%</Text>
        </View>
        <ProgressBar progress={completionRate} color={colors.dark.success} height={8} />
      </Card>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {(['pending', 'completed', 'all'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="checkbox-outline" size={48} color={colors.dark.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>No Tasks Yet</Text>
            <Text style={styles.emptyText}>Tap + to create your first task</Text>
          </View>
        }
      />

      {/* Add Task Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Task</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.modalInput}
                placeholder="What needs to be done?"
                placeholderTextColor={colors.dark.textTertiary}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                autoFocus
              />

              <Text style={styles.modalLabel}>Priority</Text>
              <View style={styles.optionsRow}>
                {(['urgent', 'high', 'medium', 'low'] as const).map(p => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.optionButton, newTaskPriority === p && { backgroundColor: getPriorityColor(p) }]}
                    onPress={() => setNewTaskPriority(p)}
                  >
                    <Text style={[styles.optionButtonText, newTaskPriority === p && styles.optionButtonTextActive]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Category</Text>
              <View style={styles.optionsRow}>
                {TASK_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryButton, newTaskCategory === cat.name && { backgroundColor: cat.color }]}
                    onPress={() => setNewTaskCategory(cat.name)}
                  >
                    <Ionicons 
                      name={cat.icon as any} 
                      size={16} 
                      color={newTaskCategory === cat.name ? '#FFFFFF' : colors.dark.textSecondary} 
                    />
                    <Text style={[styles.categoryButtonText, newTaskCategory === cat.name && styles.categoryButtonTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button title="Create Task" onPress={addTask} style={styles.createButton} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  title: { ...typography.h2, color: colors.dark.text },
  subtitle: { ...typography.bodySmall, color: colors.dark.textSecondary, marginTop: spacing.xs },
  addButton: {},
  addButtonGradient: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  progressCard: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  progressTitle: { ...typography.bodySmall, color: colors.dark.textSecondary },
  progressPercent: { ...typography.bodySmall, color: colors.dark.success, fontWeight: '600' },
  filterTabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.lg, gap: spacing.sm },
  filterTab: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.dark.surface },
  filterTabActive: { backgroundColor: colors.dark.primary },
  filterTabText: { ...typography.bodySmall, color: colors.dark.textSecondary },
  filterTabTextActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  taskItemCompleted: { opacity: 0.6 },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: { backgroundColor: colors.dark.success, borderColor: colors.dark.success },
  taskContent: { flex: 1 },
  taskTitle: { ...typography.body, color: colors.dark.text, marginBottom: spacing.xs },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: colors.dark.textSecondary },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  priorityBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  priorityText: { ...typography.caption, fontWeight: '600', textTransform: 'capitalize' },
  taskCategory: { ...typography.caption, color: colors.dark.textSecondary },
  taskXP: { alignItems: 'center', marginLeft: spacing.md },
  taskXPText: { ...typography.body, color: colors.dark.accent, fontWeight: '700' },
  taskXPLabel: { ...typography.caption, color: colors.dark.textTertiary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: { ...typography.h4, color: colors.dark.text },
  emptyText: { ...typography.bodySmall, color: colors.dark.textSecondary, marginTop: spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.dark.background, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalTitle: { ...typography.h4, color: colors.dark.text },
  modalInput: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.lg, ...typography.body, color: colors.dark.text, marginBottom: spacing.lg },
  modalLabel: { ...typography.bodySmall, color: colors.dark.textSecondary, marginBottom: spacing.sm },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  optionButton: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.dark.surface },
  optionButtonText: { ...typography.bodySmall, color: colors.dark.textSecondary },
  optionButtonTextActive: { color: '#FFFFFF' },
  categoryButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.dark.surface, gap: spacing.xs },
  categoryButtonIcon: { fontSize: 16 },
  categoryButtonText: { ...typography.caption, color: colors.dark.textSecondary },
  categoryButtonTextActive: { color: '#FFFFFF' },
  createButton: { marginTop: spacing.lg, marginBottom: spacing.lg },
});

export default TasksScreen;
