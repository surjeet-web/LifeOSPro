import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card, ProgressBar } from '../components/UI';

const { width } = Dimensions.get('window');

const AnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state } = useApp();

  const analytics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      thisWeek.push(d.toISOString().split('T')[0]);
    }

    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.completed);
    const pendingTasks = state.tasks.filter(t => !t.completed);
    
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

    // Task completion by day (last 7 days)
    const tasksByDay = thisWeek.map(day => ({
      date: day,
      completed: state.tasks.filter(t => t.completedAt?.startsWith(day)).length,
      created: state.tasks.filter(t => t.createdAt?.startsWith(day)).length,
    }));

    // Habit completion rate
    const habitCheckins = state.habits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);
    const totalPossibleCheckins = state.habits.length * 30; // Last 30 days
    const habitRate = totalPossibleCheckins > 0 ? (habitCheckins / totalPossibleCheckins) * 100 : 0;

    // Focus stats
    const focusSessions = state.focusSessions.filter(s => s.completed);
    const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.duration, 0);
    const avgSessionLength = focusSessions.length > 0 ? totalFocusMinutes / focusSessions.length : 0;

    // Finance stats
    const income = state.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = state.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    // XP stats
    const xpNeeded = [0, 100, 300, 600, 1000, 1500, 2200, 3000];
    const currentLevelXP = xpNeeded[state.user.level - 1] || 0;
    const nextLevelXP = xpNeeded[state.user.level] || 3000;
    const xpProgress = ((state.user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    // Category breakdown
    const taskCategories: { [key: string]: number } = {};
    state.tasks.forEach(t => {
      taskCategories[t.category] = (taskCategories[t.category] || 0) + 1;
    });

    const expenseCategories: { [key: string]: number } = {};
    state.transactions.filter(t => t.type === 'expense').forEach(t => {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    });

    // Streak data
    const maxStreak = state.habits.reduce((acc, h) => Math.max(acc, h.streak || 0), 0);
    const totalStreak = state.habits.reduce((acc, h) => acc + (h.streak || 0), 0);

    return {
      totalTasks,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      completionRate,
      tasksByDay,
      habitCheckins,
      habitRate,
      focusSessions: focusSessions.length,
      totalFocusMinutes,
      avgSessionLength,
      income,
      expenses,
      savings,
      savingsRate,
      xpProgress,
      taskCategories,
      expenseCategories,
      maxStreak,
      totalStreak,
    };
  }, [state]);

  const maxDayTasks = Math.max(...analytics.tasksByDay.map(d => d.completed), 1);

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Analytics</Text>
        <Text style={styles.subtitle}>Your productivity insights</Text>
      </View>

      {/* Overview Cards */}
      <View style={styles.overviewRow}>
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewEmoji}>✅</Text>
          <Text style={styles.overviewNumber}>{analytics.completedTasks}</Text>
          <Text style={styles.overviewLabel}>Tasks Done</Text>
        </Card>
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewEmoji}>🔥</Text>
          <Text style={styles.overviewNumber}>{analytics.totalStreak}</Text>
          <Text style={styles.overviewLabel}>Total Streak</Text>
        </Card>
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewEmoji}>⏱️</Text>
          <Text style={styles.overviewNumber}>{analytics.totalFocusMinutes}</Text>
          <Text style={styles.overviewLabel}>Focus Min</Text>
        </Card>
      </View>

      {/* Task Completion Rate */}
      <Card style={styles.mainCard}>
        <Text style={styles.cardTitle}>📋 Task Completion Rate</Text>
        <View style={styles.rateCircle}>
          <Text style={styles.rateNumber}>{Math.round(analytics.completionRate)}%</Text>
          <Text style={styles.rateLabel}>completed</Text>
        </View>
        <View style={styles.rateBar}>
          <View style={[styles.rateFill, { width: `${analytics.completionRate}%` }]} />
        </View>
        <View style={styles.rateStats}>
          <Text style={styles.rateStat}>✓ {analytics.completedTasks} completed</Text>
          <Text style={styles.rateStat}>○ {analytics.pendingTasks} pending</Text>
        </View>
      </Card>

      {/* Weekly Activity */}
      <Card style={styles.mainCard}>
        <Text style={styles.cardTitle}>📈 Weekly Activity</Text>
        <View style={styles.chart}>
          {analytics.tasksByDay.map((day, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { height: `${(day.completed / maxDayTasks) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(day.date).getDay()]}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Habits Performance */}
      <Card style={styles.mainCard}>
        <Text style={styles.cardTitle}>✨ Habits Performance</Text>
        <View style={styles.habitStats}>
          <View style={styles.habitStat}>
            <Text style={styles.habitNumber}>{analytics.habitRate.toFixed(0)}%</Text>
            <Text style={styles.habitLabel}>Check-in Rate</Text>
          </View>
          <View style={styles.habitStat}>
            <Text style={styles.habitNumber}>{analytics.maxStreak}</Text>
            <Text style={styles.habitLabel}>Best Streak</Text>
          </View>
          <View style={styles.habitStat}>
            <Text style={styles.habitNumber}>{analytics.habitCheckins}</Text>
            <Text style={styles.habitLabel}>Total Check-ins</Text>
          </View>
        </View>
        <ProgressBar progress={analytics.habitRate} color={colors.dark.warning} height={8} />
      </Card>

      {/* Focus Stats */}
      <Card style={styles.mainCard}>
        <Text style={styles.cardTitle}>🎯 Focus Sessions</Text>
        <View style={styles.focusStats}>
          <View style={styles.focusStat}>
            <Text style={styles.focusNumber}>{analytics.focusSessions}</Text>
            <Text style={styles.focusLabel}>Sessions</Text>
          </View>
          <View style={styles.focusStat}>
            <Text style={styles.focusNumber}>{analytics.totalFocusMinutes}</Text>
            <Text style={styles.focusLabel}>Total Min</Text>
          </View>
          <View style={styles.focusStat}>
            <Text style={styles.focusNumber}>{analytics.avgSessionLength.toFixed(0)}</Text>
            <Text style={styles.focusLabel}>Avg Min/Session</Text>
          </View>
        </View>
      </Card>

      {/* Finance Overview */}
      <Card style={styles.mainCard}>
        <Text style={styles.cardTitle}>💰 Finance Overview</Text>
        <View style={styles.financeGrid}>
          <View style={styles.financeItem}>
            <Text style={styles.financeLabel}>Income</Text>
            <Text style={[styles.financeValue, { color: colors.dark.success }]}>
              +${analytics.income.toFixed(2)}
            </Text>
          </View>
          <View style={styles.financeItem}>
            <Text style={styles.financeLabel}>Expenses</Text>
            <Text style={[styles.financeValue, { color: colors.dark.error }]}>
              -${analytics.expenses.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.savingsSection}>
          <Text style={styles.savingsLabel}>Savings Rate</Text>
          <Text style={[styles.savingsValue, { color: analytics.savingsRate > 20 ? colors.dark.success : analytics.savingsRate > 10 ? colors.dark.warning : colors.dark.error }]}>
            {analytics.savingsRate.toFixed(1)}%
          </Text>
        </View>
        <ProgressBar 
          progress={Math.min(100, analytics.savingsRate)} 
          color={analytics.savingsRate > 20 ? colors.dark.success : analytics.savingsRate > 10 ? colors.dark.warning : colors.dark.error} 
          height={8} 
        />
      </Card>

      {/* XP Progress */}
      <Card style={styles.mainCard}>
        <Text style={styles.cardTitle}>⭐ XP Progress</Text>
        <View style={styles.xpHeader}>
          <View style={styles.xpLevel}>
            <Text style={styles.xpLevelNumber}>Level {state.user.level}</Text>
            <Text style={styles.xpLevelName}>
              {['Beginner', 'Explorer', 'Achiever', 'Champion', 'Master', 'Legend', 'Titan', 'God'][state.user.level - 1]}
            </Text>
          </View>
          <Text style={styles.xpTotal}>{state.user.xp} XP</Text>
        </View>
        <ProgressBar progress={analytics.xpProgress} color={colors.dark.accent} height={12} />
        <Text style={styles.xpHint}>
          {3000 - state.user.xp} XP to next level
        </Text>
      </Card>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.dark.text },
  subtitle: { ...typography.bodySmall, color: colors.dark.textSecondary, marginTop: spacing.xs },
  overviewRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm },
  overviewCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  overviewEmoji: { fontSize: 24, marginBottom: spacing.xs },
  overviewNumber: { ...typography.h4, color: colors.dark.text },
  overviewLabel: { ...typography.caption, color: colors.dark.textSecondary },
  mainCard: { marginHorizontal: spacing.lg, marginTop: spacing.md },
  cardTitle: { ...typography.h5, color: colors.dark.text, marginBottom: spacing.lg },
  rateCircle: { alignItems: 'center', marginBottom: spacing.lg },
  rateNumber: { fontSize: 48, fontWeight: '800', color: colors.dark.primary },
  rateLabel: { ...typography.bodySmall, color: colors.dark.textSecondary },
  rateBar: { height: 8, backgroundColor: colors.dark.surfaceLight, borderRadius: 4, overflow: 'hidden', marginBottom: spacing.md },
  rateFill: { height: '100%', backgroundColor: colors.dark.primary, borderRadius: 4 },
  rateStats: { flexDirection: 'row', justifyContent: 'space-between' },
  rateStat: { ...typography.caption, color: colors.dark.textSecondary },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  chartBar: { flex: 1, alignItems: 'center' },
  barContainer: { height: 80, width: 24, backgroundColor: colors.dark.surfaceLight, borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', backgroundColor: colors.dark.primary, borderRadius: 4 },
  barLabel: { ...typography.caption, color: colors.dark.textSecondary, marginTop: spacing.xs },
  habitStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.lg },
  habitStat: { alignItems: 'center' },
  habitNumber: { ...typography.h4, color: colors.dark.warning },
  habitLabel: { ...typography.caption, color: colors.dark.textSecondary },
  focusStats: { flexDirection: 'row', justifyContent: 'space-around' },
  focusStat: { alignItems: 'center' },
  focusNumber: { ...typography.h4, color: colors.dark.primary },
  focusLabel: { ...typography.caption, color: colors.dark.textSecondary },
  financeGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  financeItem: {},
  financeLabel: { ...typography.caption, color: colors.dark.textSecondary },
  financeValue: { ...typography.h5, fontWeight: '700' },
  savingsSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  savingsLabel: { ...typography.bodySmall, color: colors.dark.textSecondary },
  savingsValue: { ...typography.h5, fontWeight: '700' },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  xpLevel: {},
  xpLevelNumber: { ...typography.h5, color: colors.dark.text },
  xpLevelName: { ...typography.caption, color: colors.dark.accent },
  xpTotal: { ...typography.h5, color: colors.dark.accent },
  xpHint: { ...typography.caption, color: colors.dark.textSecondary, textAlign: 'right', marginTop: spacing.sm },
});

export default AnalyticsScreen;
