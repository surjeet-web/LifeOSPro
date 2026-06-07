import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getGreeting, getRandomQuote, getMotivation, generateDailyInsight } from '../utils/helpers';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { Card, ProgressBar, Badge } from '../components/UI';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const pendingTasks = state.tasks.filter(t => !t.completed);
  const todayCompletedTasks = state.tasks.filter(t => t.completed && t.completedAt?.startsWith(today));
  const todayFocusMinutes = state.focusSessions
    .filter(s => s.completed && s.date === today)
    .reduce((acc, s) => acc + s.duration, 0);

  const insight = generateDailyInsight(state);
  const quote = getRandomQuote();

  const xpToNextLevel = [0, 100, 300, 600, 1000, 1500, 2200, 3000];
  const currentLevelXP = xpToNextLevel[state.user.level - 1] || 0;
  const nextLevelXP = xpToNextLevel[state.user.level] || 3000;
  const levelProgress = ((state.user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const navigateTo = (screen: string, params?: any) => {
    navigation.navigate(screen, params);
  };

  const getInsightIcon = () => {
    switch (insight.type) {
      case 'achievement': return 'trophy';
      case 'progress': return 'trending-up';
      default: return 'bulb';
    }
  };

  const QuickAction = ({ icon, label, gradient, onPress }: { icon: string; label: string; gradient: string[]; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.quickAction}>
        <LinearGradient colors={gradient as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.quickActionIcon}>
          <Ionicons name={icon as any} size={22} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.quickActionLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
        }
      >
        {/* Header */}
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{state.user.name}</Text>
            <Text style={styles.motivation}>{getMotivation()}</Text>
          </View>
          <TouchableOpacity onPress={() => navigateTo('Profile')} activeOpacity={0.8}>
            <LinearGradient colors={colors.dark.gradient.aurora as any} style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{state.user.name.charAt(0).toUpperCase()}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* XP Level Card */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity onPress={() => navigateTo('Profile')} activeOpacity={0.9}>
            <LinearGradient colors={colors.dark.gradient.midnight as any} style={styles.levelCard}>
              <View style={styles.levelCardTop}>
                <View style={styles.levelBadge}>
                  <LinearGradient colors={colors.dark.gradient.accent as any} style={styles.levelBadgeGradient}>
                    <Ionicons name="star" size={14} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.levelNumber}>Level {state.user.level}</Text>
                </View>
                <View style={styles.xpContainer}>
                  <Text style={styles.xpValue}>{state.user.xp}</Text>
                  <Text style={styles.xpLabel}>XP</Text>
                </View>
              </View>
              <Text style={styles.levelName}>{['Beginner', 'Explorer', 'Achiever', 'Champion', 'Master', 'Legend', 'Titan', 'God'][state.user.level - 1]}</Text>
              <View style={styles.progressWrapper}>
                <ProgressBar progress={levelProgress} gradient={colors.dark.gradient.primary} height={8} />
                <Text style={styles.xpToNext}>{nextLevelXP - state.user.xp} XP to next level</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View style={[styles.statsRow, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigateTo('Tasks')} activeOpacity={0.8}>
            <LinearGradient colors={['#7C3AED20', '#7C3AED10']} style={styles.statCardBg}>
              <View style={[styles.statIconWrap, { backgroundColor: colors.dark.primary + '20' }]}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Ionicons name="checkbox" size={22} color={colors.dark.primary} />
                </Animated.View>
              </View>
              <Text style={styles.statNumber}>{todayCompletedTasks.length}/{pendingTasks.length + todayCompletedTasks.length}</Text>
              <Text style={styles.statLabel}>Tasks Done</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} onPress={() => navigateTo('Habits')} activeOpacity={0.8}>
            <LinearGradient colors={['#F59E0B20', '#F59E0B10']} style={styles.statCardBg}>
              <View style={[styles.statIconWrap, { backgroundColor: colors.dark.warning + '20' }]}>
                <Ionicons name="flame" size={22} color={colors.dark.warning} />
              </View>
              <Text style={styles.statNumber}>
                {state.habits.reduce((acc, h) => acc + (h.streak || 0), 0)}
              </Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} onPress={() => navigateTo('Focus')} activeOpacity={0.8}>
            <LinearGradient colors={['#EC489920', '#EC489910']} style={styles.statCardBg}>
              <View style={[styles.statIconWrap, { backgroundColor: colors.dark.accentSecondary + '20' }]}>
                <Ionicons name="timer" size={22} color={colors.dark.accentSecondary} />
              </View>
              <Text style={styles.statNumber}>{todayFocusMinutes}</Text>
              <Text style={styles.statLabel}>Focus Min</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll} contentContainerStyle={styles.quickActionsContent}>
            <QuickAction icon="add" label="New Task" gradient={colors.dark.gradient.primary} onPress={() => navigateTo('AddTask')} />
            <QuickAction icon="leaf" label="New Habit" gradient={colors.dark.gradient.accent} onPress={() => navigateTo('AddHabit')} />
            <QuickAction icon="chatbubbles" label="AI Coach" gradient={colors.dark.gradient.success} onPress={() => navigateTo('AIChat')} />
            <QuickAction icon="radio" label="Focus" gradient={colors.dark.gradient.pink} onPress={() => navigateTo('Focus')} />
            <QuickAction icon="wallet" label="Finance" gradient={colors.dark.gradient.royal} onPress={() => navigateTo('Finance')} />
          </ScrollView>
        </Animated.View>

        {/* Daily Insight */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Card style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <LinearGradient colors={colors.dark.gradient.primary as any} style={styles.insightIconBg}>
                <Ionicons name={getInsightIcon()} size={18} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.insightTitle}>{insight.title}</Text>
            </View>
            <Text style={styles.insightContent}>{insight.content}</Text>
          </Card>
        </Animated.View>

        {/* Today's Habits */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            <TouchableOpacity onPress={() => navigateTo('Habits')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {state.habits.length === 0 ? (
            <TouchableOpacity onPress={() => navigateTo('AddHabit')} activeOpacity={0.9}>
              <LinearGradient colors={colors.dark.gradient.success as any} style={styles.emptyCard}>
                <Ionicons name="leaf" size={32} color="#FFFFFF" />
                <Text style={styles.emptyTitle}>Start Building Habits</Text>
                <Text style={styles.emptySubtitle}>Tap to create your first habit</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.habitScroll} contentContainerStyle={styles.habitContent}>
              {state.habits.slice(0, 5).map(habit => {
                const isCompleted = habit.completedDates?.includes(today);
                return (
                  <TouchableOpacity key={habit.id} onPress={() => navigateTo('Habits')} activeOpacity={0.8}>
                    <View style={[styles.habitCard, isCompleted && styles.habitCardCompleted]}>
                      <View style={[styles.habitIconBg, { backgroundColor: isCompleted ? colors.dark.success + '20' : colors.dark.surfaceLight }]}>
                        <Ionicons name="leaf" size={22} color={isCompleted ? colors.dark.success : colors.dark.textSecondary} />
                      </View>
                      <Text style={styles.habitName} numberOfLines={1}>{habit.name}</Text>
                      <View style={styles.habitStreak}>
                        <Ionicons name="flame" size={12} color={colors.dark.warning} />
                        <Text style={styles.habitStreakText}>{habit.streak || 0}</Text>
                      </View>
                      {isCompleted && (
                        <View style={styles.checkMarkBadge}>
                          <Ionicons name="checkmark-circle" size={18} color={colors.dark.success} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </Animated.View>

        {/* Today's Tasks */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity onPress={() => navigateTo('Tasks')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {pendingTasks.length === 0 ? (
            <LinearGradient colors={colors.dark.gradient.success as any} style={styles.emptyCard}>
              <Ionicons name="checkmark-circle" size={32} color="#FFFFFF" />
              <Text style={styles.emptyTitle}>All Done!</Text>
              <Text style={styles.emptySubtitle}>No pending tasks for today</Text>
            </LinearGradient>
          ) : (
            pendingTasks.slice(0, 3).map(task => (
              <TouchableOpacity key={task.id} onPress={() => navigateTo('Tasks')} activeOpacity={0.8}>
                <View style={styles.taskCard}>
                  <View style={[styles.priorityIndicator, { backgroundColor: 
                    task.priority === 'urgent' ? colors.dark.error :
                    task.priority === 'high' ? colors.dark.warning :
                    task.priority === 'medium' ? colors.dark.primary : colors.dark.success
                  }]} />
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskCategory}>{task.category}</Text>
                  </View>
                  <View style={styles.xpBadge}>
                    <Ionicons name="star" size={12} color={colors.dark.accent} />
                    <Text style={styles.xpBadgeText}>+{task.xp}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Animated.View>

        {/* Quote of the Day */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <LinearGradient colors={['#1E1E28', '#16161D']} style={styles.quoteCard}>
            <View style={styles.quoteIconWrap}>
              <Ionicons name="chatbubble-ellipses" size={20} color={colors.dark.primary} />
            </View>
            <Text style={styles.quoteText}>"{quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {quote.author}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Premium CTA */}
        {!state.user.isPremium && (
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <TouchableOpacity onPress={() => navigateTo('Premium')} activeOpacity={0.9}>
              <LinearGradient
                colors={colors.dark.gradient.aurora as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumCard}
              >
                <View style={styles.premiumLeft}>
                  <View style={styles.premiumIconWrap}>
                    <Ionicons name="diamond" size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.premiumTextWrap}>
                    <Text style={styles.premiumTitle}>Go Premium</Text>
                    <Text style={styles.premiumSubtitle}>Unlock AI Coach & unlimited features</Text>
                  </View>
                </View>
                <View style={styles.premiumButton}>
                  <Text style={styles.premiumButtonText}>$9.99</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: typography.fontSizes.lg,
    color: colors.dark.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: '700',
    color: colors.dark.text,
    marginTop: 2,
  },
  motivation: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
    marginTop: spacing.xs,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  levelCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  levelBadgeGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark.text,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  xpValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: '700',
    color: colors.dark.accent,
  },
  xpLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  levelName: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textSecondary,
    marginBottom: spacing.md,
  },
  progressWrapper: {
    gap: spacing.xs,
  },
  xpToNext: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  statCardBg: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: typography.fontSizes.xl,
    fontWeight: '700',
    color: colors.dark.text,
  },
  statLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textSecondary,
    marginTop: 2,
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
    fontWeight: '700',
    color: colors.dark.text,
  },
  seeAll: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.primary,
    fontWeight: '600',
  },
  quickActionsScroll: {
    marginBottom: spacing.lg,
  },
  quickActionsContent: {
    paddingLeft: spacing.lg,
    gap: spacing.lg,
  },
  quickAction: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  quickActionLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textSecondary,
    fontWeight: '500',
  },
  insightCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  insightIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.text,
  },
  insightContent: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textSecondary,
    lineHeight: 20,
    marginLeft: 48,
  },
  habitScroll: {
    marginBottom: spacing.lg,
  },
  habitContent: {
    paddingLeft: spacing.lg,
  },
  habitCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    width: 110,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  habitCardCompleted: {
    backgroundColor: colors.dark.success + '10',
    borderColor: colors.dark.success + '40',
  },
  habitIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  habitName: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  habitStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: spacing.xs,
  },
  habitStreakText: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.warning,
    fontWeight: '600',
  },
  checkMarkBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  emptyCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  priorityIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.fontSizes.md,
    color: colors.dark.text,
    fontWeight: '500',
  },
  taskCategory: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textSecondary,
    marginTop: 2,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.dark.accent + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  xpBadgeText: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.accent,
    fontWeight: '600',
  },
  quoteCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  quoteIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  quoteText: {
    fontSize: typography.fontSizes.md,
    color: colors.dark.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textSecondary,
    marginTop: spacing.md,
    textAlign: 'right',
  },
  premiumCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  premiumIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTextWrap: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  premiumSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  premiumButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  premiumButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark.primary,
  },
});

export default HomeScreen;
