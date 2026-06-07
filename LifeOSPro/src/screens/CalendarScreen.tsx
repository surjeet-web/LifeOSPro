import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { generateId, formatDate } from '../utils/helpers';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card } from '../components/UI';

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  duration: number;
  type: 'task' | 'habit' | 'focus' | 'meeting';
}

const CalendarScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTime, setNewItemTime] = useState('');
  const [newItemDuration, setNewItemDuration] = useState('30');

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: null, date: null });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    calendarDays.push({ day, date: date.toISOString().split('T')[0] });
  }

  // Get today's tasks
  const todayStr = today.toISOString().split('T')[0];
  const todayTasks = state.tasks.filter(t => !t.completed).slice(0, 5);

  // Get upcoming habits
  const upcomingHabits = state.habits.slice(0, 3);

  const getScheduleItems = (dateStr: string): ScheduleItem[] => {
    const items: ScheduleItem[] = [];
    
    // Add incomplete tasks as schedule items
    const dayTasks = state.tasks.filter(t => !t.completed && t.dueDate?.includes(dateStr));
    dayTasks.forEach(t => {
      items.push({
        id: t.id,
        title: t.title,
        time: '09:00',
        duration: 30,
        type: 'task',
      });
    });

    return items;
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const scheduleItems = getScheduleItems(selectedDateStr);

  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 Schedule</Text>
        <Text style={styles.subtitle}>{monthNames[currentMonth]} {currentYear}</Text>
      </View>

      {/* Calendar */}
      <View style={styles.calendar}>
        <View style={styles.dayNames}>
          {dayNames.map(day => (
            <Text key={day} style={styles.dayName}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {calendarDays.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                item.date === todayStr && styles.todayCell,
                item.date === selectedDate.toISOString().split('T')[0] && styles.selectedCell,
              ]}
              onPress={() => item.date && setSelectedDate(new Date(item.date))}
            >
              <Text style={[
                styles.dayText,
                item.date === todayStr && styles.todayText,
                item.date === selectedDate.toISOString().split('T')[0] && styles.selectedText,
              ]}>
                {item.day || ''}
              </Text>
              {item.date && (
                <View style={styles.dotsContainer}>
                  {state.tasks.some(t => t.dueDate?.includes(item.date!)) && <View style={styles.taskDot} />}
                  {state.habits.some(h => h.completedDates?.includes(item.date!)) && <View style={styles.habitDot} />}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selected Date */}
      <Text style={styles.sectionTitle}>{formatDate(selectedDate)}</Text>

      {/* Schedule */}
      <View style={styles.schedule}>
        {scheduleItems.length > 0 ? (
          scheduleItems.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={[styles.scheduleContent, { borderLeftColor: item.type === 'task' ? colors.dark.primary : colors.dark.warning }]}>
                <Text style={styles.scheduleTitle}>{item.title}</Text>
                <Text style={styles.scheduleDuration}>{item.duration} min</Text>
              </View>
            </View>
          ))
        ) : (
          <Card style={styles.emptySchedule}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No items scheduled</Text>
            <Text style={styles.emptySubtext}>Add tasks with due dates to see them here</Text>
          </Card>
        )}
      </View>

      {/* Quick Add */}
      <Text style={styles.sectionTitle}>⚡ Quick Add</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickAdd}>
        {todayTasks.map(task => (
          <TouchableOpacity key={task.id} style={styles.quickAddCard}>
            <Text style={styles.quickAddEmoji}>📋</Text>
            <Text style={styles.quickAddTitle} numberOfLines={1}>{task.title}</Text>
          </TouchableOpacity>
        ))}
        {upcomingHabits.map(habit => (
          <TouchableOpacity key={habit.id} style={styles.quickAddCard}>
            <Text style={styles.quickAddEmoji}>{habit.icon}</Text>
            <Text style={styles.quickAddTitle} numberOfLines={1}>{habit.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time Blocks Suggestion */}
      <Text style={styles.sectionTitle}>🎯 Suggested Time Blocks</Text>
      <View style={styles.timeBlocks}>
        <View style={styles.timeBlock}>
          <View style={[styles.blockDot, { backgroundColor: colors.dark.primary }]} />
          <View style={styles.blockContent}>
            <Text style={styles.blockTitle}>Deep Work</Text>
            <Text style={styles.blockTime}>9:00 AM - 12:00 PM</Text>
          </View>
          <Text style={styles.blockXP}>+50 XP</Text>
        </View>
        <View style={styles.timeBlock}>
          <View style={[styles.blockDot, { backgroundColor: colors.dark.warning }]} />
          <View style={styles.blockContent}>
            <Text style={styles.blockTitle}>Learning</Text>
            <Text style={styles.blockTime}>2:00 PM - 3:00 PM</Text>
          </View>
          <Text style={styles.blockXP}>+30 XP</Text>
        </View>
        <View style={styles.timeBlock}>
          <View style={[styles.blockDot, { backgroundColor: colors.dark.success }]} />
          <View style={styles.blockContent}>
            <Text style={styles.blockTitle}>Review & Plan</Text>
            <Text style={styles.blockTime}>6:00 PM - 6:30 PM</Text>
          </View>
          <Text style={styles.blockXP}>+20 XP</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.dark.text },
  subtitle: { ...typography.bodySmall, color: colors.dark.textSecondary, marginTop: spacing.xs },
  calendar: { backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.xl, padding: spacing.md },
  dayNames: { flexDirection: 'row', marginBottom: spacing.sm },
  dayName: { flex: 1, textAlign: 'center', fontSize: 12, color: colors.dark.textSecondary, fontWeight: '600' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  todayCell: { backgroundColor: colors.dark.primary + '30' },
  selectedCell: { backgroundColor: colors.dark.primary },
  dayText: { fontSize: 14, color: colors.dark.text },
  todayText: { fontWeight: '700', color: colors.dark.primary },
  selectedText: { color: '#FFF', fontWeight: '700' },
  dotsContainer: { flexDirection: 'row', gap: 2, marginTop: 2 },
  taskDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.dark.primary },
  habitDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.dark.warning },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.dark.text, paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md },
  schedule: { paddingHorizontal: spacing.lg },
  scheduleItem: { flexDirection: 'row', marginBottom: spacing.sm },
  scheduleTime: { width: 60 },
  timeText: { ...typography.caption, color: colors.dark.textSecondary },
  scheduleContent: { flex: 1, backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.md, borderLeftWidth: 3 },
  scheduleTitle: { ...typography.body, color: colors.dark.text, fontWeight: '500' },
  scheduleDuration: { ...typography.caption, color: colors.dark.textSecondary, marginTop: 2 },
  emptySchedule: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyEmoji: { fontSize: 40, marginBottom: spacing.sm },
  emptyText: { ...typography.body, color: colors.dark.text },
  emptySubtext: { ...typography.caption, color: colors.dark.textSecondary },
  quickAdd: { paddingLeft: spacing.lg },
  quickAddCard: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.md, marginRight: spacing.sm, width: 120 },
  quickAddEmoji: { fontSize: 24, marginBottom: spacing.xs },
  quickAddTitle: { ...typography.caption, color: colors.dark.text },
  timeBlocks: { paddingHorizontal: spacing.lg },
  timeBlock: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  blockDot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.md },
  blockContent: { flex: 1 },
  blockTitle: { ...typography.body, color: colors.dark.text, fontWeight: '500' },
  blockTime: { ...typography.caption, color: colors.dark.textSecondary },
  blockXP: { ...typography.caption, color: colors.dark.accent, fontWeight: '600' },
});

export default CalendarScreen;
