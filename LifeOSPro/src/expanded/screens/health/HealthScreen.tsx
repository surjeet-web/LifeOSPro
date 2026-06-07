// ============================================================================
// HEALTH & WELLNESS SCREEN FOR LifeOS Pro
// 70,000+ Lines Edition - Comprehensive Health Tracking
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../../utils/theme';

const { width } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface HealthMetric {
  id: string;
  type: 'weight' | 'sleep' | 'exercise' | 'mood' | 'water' | 'heartRate' | 'steps' | 'calories';
  value: number;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
}

interface SleepEntry {
  id: string;
  date: string;
  duration: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
  interruptions: number;
}

interface ExerciseEntry {
  id: string;
  type: 'running' | 'walking' | 'cycling' | 'swimming' | 'strength' | 'yoga' | 'other';
  duration: number;
  calories: number;
  distance?: number;
  intensity: 'low' | 'moderate' | 'high';
  date: string;
}

interface MealEntry {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

interface HealthGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_METRICS: HealthMetric[] = [
  { id: '1', type: 'weight', value: 165, unit: 'lbs', date: '2024-01-15', trend: 'down' },
  { id: '2', type: 'sleep', value: 7.5, unit: 'hrs', date: '2024-01-15', trend: 'stable' },
  { id: '3', type: 'heartRate', value: 68, unit: 'bpm', date: '2024-01-15', trend: 'down' },
  { id: '4', type: 'steps', value: 8547, unit: 'steps', date: '2024-01-15', trend: 'up' },
  { id: '5', type: 'water', value: 6, unit: 'glasses', date: '2024-01-15', trend: 'stable' },
  { id: '6', type: 'calories', value: 1850, unit: 'kcal', date: '2024-01-15', trend: 'down' },
];

const MOCK_SLEEP_ENTRIES: SleepEntry[] = [
  { id: '1', date: '2024-01-15', duration: 7.5, quality: 'good', deepSleep: 2.1, lightSleep: 3.8, remSleep: 1.6, interruptions: 1 },
  { id: '2', date: '2024-01-14', duration: 8.0, quality: 'excellent', deepSleep: 2.3, lightSleep: 4.0, remSleep: 1.7, interruptions: 0 },
  { id: '3', date: '2024-01-13', duration: 6.5, quality: 'fair', deepSleep: 1.8, lightSleep: 3.2, remSleep: 1.5, interruptions: 2 },
  { id: '4', date: '2024-01-12', duration: 7.2, quality: 'good', deepSleep: 2.0, lightSleep: 3.6, remSleep: 1.6, interruptions: 1 },
  { id: '5', date: '2024-01-11', duration: 7.8, quality: 'good', deepSleep: 2.2, lightSleep: 3.9, remSleep: 1.7, interruptions: 0 },
];

const MOCK_EXERCISE_ENTRIES: ExerciseEntry[] = [
  { id: '1', type: 'running', duration: 35, calories: 420, distance: 5.2, intensity: 'moderate', date: '2024-01-15' },
  { id: '2', type: 'strength', duration: 45, calories: 320, intensity: 'high', date: '2024-01-14' },
  { id: '3', type: 'yoga', duration: 30, calories: 150, intensity: 'low', date: '2024-01-13' },
  { id: '4', type: 'cycling', duration: 50, calories: 380, distance: 12.5, intensity: 'moderate', date: '2024-01-12' },
  { id: '5', type: 'walking', duration: 25, calories: 120, distance: 2.1, intensity: 'low', date: '2024-01-11' },
];

const MOCK_MEAL_ENTRIES: MealEntry[] = [
  { id: '1', type: 'breakfast', calories: 450, protein: 25, carbs: 45, fat: 18, date: '2024-01-15' },
  { id: '2', type: 'lunch', calories: 650, protein: 35, carbs: 60, fat: 25, date: '2024-01-15' },
  { id: '3', type: 'dinner', calories: 550, protein: 30, carbs: 50, fat: 20, date: '2024-01-15' },
  { id: '4', type: 'snack', calories: 200, protein: 8, carbs: 25, fat: 8, date: '2024-01-15' },
];

const MOCK_GOALS: HealthGoal[] = [
  { id: '1', title: 'Lose 15 lbs', target: 150, current: 165, unit: 'lbs', deadline: '2024-03-31' },
  { id: '2', title: 'Run 500 miles', target: 500, current: 342, unit: 'miles', deadline: '2024-12-31' },
  { id: '3', title: 'Sleep 8 hours', target: 8, current: 7.5, unit: 'hrs', deadline: '2024-02-28' },
  { id: '4', title: 'Drink 8 glasses/day', target: 8, current: 6, unit: 'glasses', deadline: '2024-01-31' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const HealthScreen: React.FC<any> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sleep' | 'exercise' | 'nutrition' | 'goals'>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [waterIntake, setWaterIntake] = useState(6);
  const [moodLevel, setMoodLevel] = useState(7);
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);
  
  const getMetricIcon = (type: string): string => {
    const icons: Record<string, string> = {
      weight: '⚖️',
      sleep: '😴',
      exercise: '🏃',
      mood: '😊',
      water: '💧',
      heartRate: '❤️',
      steps: '👟',
      calories: '🔥',
    };
    return icons[type] || '📊';
  };
  
  const getTrendIcon = (trend: string): string => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };
  
  const getTrendColor = (trend: string): string => {
    if (trend === 'up') return colors.dark.success;
    if (trend === 'down') return colors.dark.error;
    return colors.dark.textTertiary;
  };
  
  const renderMetricCard = ({ item }: { item: HealthMetric }) => (
    <TouchableOpacity style={styles.metricCard}>
      <View style={styles.metricIconContainer}>
        <Text style={styles.metricIcon}>{getMetricIcon(item.type)}</Text>
      </View>
      <Text style={styles.metricValue}>{item.value} <Text style={styles.metricUnit}>{item.unit}</Text></Text>
      <Text style={styles.metricType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
      <View style={styles.trendContainer}>
        <Text style={[styles.trendIcon, { color: getTrendColor(item.trend) }]}>{getTrendIcon(item.trend)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderSleepEntry = ({ item }: { item: SleepEntry }) => (
    <TouchableOpacity style={styles.sleepCard}>
      <View style={styles.sleepHeader}>
        <Text style={styles.sleepDate}>{item.date}</Text>
        <View style={[styles.qualityBadge, { backgroundColor: item.quality === 'excellent' ? colors.dark.success : item.quality === 'good' ? colors.dark.primary : colors.dark.warning }]}>
          <Text style={styles.qualityText}>{item.quality}</Text>
        </View>
      </View>
      <View style={styles.sleepStats}>
        <View style={styles.sleepStat}>
          <Text style={styles.sleepStatValue}>{item.duration}</Text>
          <Text style={styles.sleepStatLabel}>Hours</Text>
        </View>
        <View style={styles.sleepStat}>
          <Text style={styles.sleepStatValue}>{item.deepSleep}h</Text>
          <Text style={styles.sleepStatLabel}>Deep</Text>
        </View>
        <View style={styles.sleepStat}>
          <Text style={styles.sleepStatValue}>{item.remSleep}h</Text>
          <Text style={styles.sleepStatLabel}>REM</Text>
        </View>
        <View style={styles.sleepStat}>
          <Text style={styles.sleepStatValue}>{item.interruptions}</Text>
          <Text style={styles.sleepStatLabel}>Interruptions</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderExerciseEntry = ({ item }: { item: ExerciseEntry }) => {
    const exerciseIcons: Record<string, string> = {
      running: '🏃',
      walking: '🚶',
      cycling: '🚴',
      swimming: '🏊',
      strength: '💪',
      yoga: '🧘',
      other: '🏋️',
    };
    
    return (
      <TouchableOpacity style={styles.exerciseCard}>
        <View style={styles.exerciseIcon}>
          <Text style={styles.exerciseEmoji}>{exerciseIcons[item.type]}</Text>
        </View>
        <View style={styles.exerciseContent}>
          <Text style={styles.exerciseType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
          <Text style={styles.exerciseDate}>{item.date}</Text>
        </View>
        <View style={styles.exerciseStats}>
          <View style={styles.exerciseStat}>
            <Text style={styles.exerciseStatValue}>{item.duration}</Text>
            <Text style={styles.exerciseStatLabel}>min</Text>
          </View>
          <View style={styles.exerciseStat}>
            <Text style={styles.exerciseStatValue}>{item.calories}</Text>
            <Text style={styles.exerciseStatLabel}>cal</Text>
          </View>
          {item.distance && (
            <View style={styles.exerciseStat}>
              <Text style={styles.exerciseStatValue}>{item.distance}</Text>
              <Text style={styles.exerciseStatLabel}>mi</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderMealEntry = ({ item }: { item: MealEntry }) => {
    const mealIcons: Record<string, string> = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎',
    };
    
    return (
      <TouchableOpacity style={styles.mealCard}>
        <View style={styles.mealIcon}>
          <Text style={styles.mealEmoji}>{mealIcons[item.type]}</Text>
        </View>
        <View style={styles.mealContent}>
          <Text style={styles.mealType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
          <Text style={styles.mealCalories}>{item.calories} cal</Text>
        </View>
        <View style={styles.macroContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{item.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{item.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{item.fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderGoal = ({ item }: { item: HealthGoal }) => {
    const progress = (item.current / item.target) * 100;
    
    return (
      <TouchableOpacity style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>{item.title}</Text>
          <Text style={styles.goalDeadline}>{item.deadline}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.current} / {item.target} {item.unit}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const addWater = () => {
    if (waterIntake < 12) setWaterIntake(waterIntake + 1);
  };
  
  const removeWater = () => {
    if (waterIntake > 0) setWaterIntake(waterIntake - 1);
  };
  
  const renderOverview = () => (
    <>
      {/* Quick Stats Grid */}
      <View style={styles.metricsGrid}>
        <FlatList
          data={MOCK_METRICS}
          renderItem={renderMetricCard}
          keyExtractor={item => item.id}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>
      
      {/* Water Intake */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Water Intake</Text>
        <View style={styles.waterContainer}>
          <View style={styles.waterGlass}>
            <Text style={styles.waterValue}>{waterIntake}</Text>
            <Text style={styles.waterUnit}>of 8 glasses</Text>
          </View>
          <View style={styles.waterControls}>
            <TouchableOpacity style={styles.waterButton} onPress={removeWater}>
              <Text style={styles.waterButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.waterButton} onPress={addWater}>
              <Text style={styles.waterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.waterProgress}>
            {[...Array(8)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waterDrop,
                  i < waterIntake ? styles.waterDropFilled : styles.waterDropEmpty,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
      
      {/* Mood Tracker */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling?</Text>
        <View style={styles.moodContainer}>
          <View style={styles.moodEmojis}>
            {['😔', '😐', '🙂', '😊', '😄'].map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.moodButton, moodLevel === index + 1 && styles.moodButtonActive]}
                onPress={() => setMoodLevel(index + 1)}
              >
                <Text style={styles.moodEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.moodLabel}>
            {moodLevel <= 1 ? 'Not Great' : moodLevel <= 2 ? 'Okay' : moodLevel <= 3 ? 'Good' : moodLevel <= 4 ? 'Great' : 'Excellent!'}
          </Text>
        </View>
      </View>
      
      {/* Active Goals Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Health Goals</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>
        {MOCK_GOALS.slice(0, 2).map(goal => (
          <View key={goal.id} style={styles.goalPreviewCard}>
            <Text style={styles.goalPreviewTitle}>{goal.title}</Text>
            <View style={styles.goalPreviewProgress}>
              <View style={styles.progressBarSmall}>
                <View style={[styles.progressFillSmall, { width: `${(goal.current / goal.target) * 100}%` }]} />
              </View>
              <Text style={styles.goalPreviewPercent}>{Math.round((goal.current / goal.target) * 100)}%</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'sleep':
        return (
          <FlatList
            data={MOCK_SLEEP_ENTRIES}
            renderItem={renderSleepEntry}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        );
      case 'exercise':
        return (
          <FlatList
            data={MOCK_EXERCISE_ENTRIES}
            renderItem={renderExerciseEntry}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        );
      case 'nutrition':
        return (
          <FlatList
            data={MOCK_MEAL_ENTRIES}
            renderItem={renderMealEntry}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        );
      case 'goals':
        return (
          <FlatList
            data={MOCK_GOALS}
            renderItem={renderGoal}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
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
          <Text style={styles.headerTitle}>Health & Wellness</Text>
          <Text style={styles.headerSubtitle}>Track your physical and mental health</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['overview', 'sleep', 'exercise', 'nutrition', 'goals'].map((tab) => (
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
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.dark.primary}
          />
        }
      >
        {renderTabContent()}
      </ScrollView>
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
  metricsGrid: {
    paddingHorizontal: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.xs,
    alignItems: 'center',
    ...shadows.sm,
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  metricIcon: {
    fontSize: 24,
  },
  metricValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  metricUnit: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '400',
    color: colors.dark.textTertiary,
  },
  metricType: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
    marginTop: 2,
  },
  trendContainer: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  trendIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.primary,
  },
  waterContainer: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  waterGlass: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  waterValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.dark.primary,
  },
  waterUnit: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  waterControls: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  waterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterButtonText: {
    fontSize: 24,
    color: colors.dark.white,
    fontWeight: '600',
  },
  waterProgress: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  waterDrop: {
    width: 24,
    height: 32,
    borderRadius: 12,
  },
  waterDropEmpty: {
    backgroundColor: colors.dark.gray700,
  },
  waterDropFilled: {
    backgroundColor: colors.dark.info,
  },
  moodContainer: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  moodEmojis: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  moodButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.dark.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodButtonActive: {
    backgroundColor: colors.dark.primary,
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  goalPreviewCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  goalPreviewTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: spacing.sm,
  },
  goalPreviewProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarSmall: {
    flex: 1,
    height: 6,
    backgroundColor: colors.dark.gray700,
    borderRadius: 3,
    marginRight: spacing.sm,
  },
  progressFillSmall: {
    height: '100%',
    backgroundColor: colors.dark.primary,
    borderRadius: 3,
  },
  goalPreviewPercent: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.primary,
    width: 45,
    textAlign: 'right',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  sleepCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sleepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sleepDate: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  qualityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  qualityText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '600',
    color: colors.dark.white,
    textTransform: 'capitalize',
  },
  sleepStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sleepStat: {
    alignItems: 'center',
  },
  sleepStatValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  sleepStatLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  exerciseIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dark.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseEmoji: {
    fontSize: 28,
  },
  exerciseContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  exerciseType: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  exerciseDate: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  exerciseStat: {
    alignItems: 'center',
  },
  exerciseStatValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  exerciseStatLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
  mealCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  mealIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  mealEmoji: {
    fontSize: 24,
  },
  mealContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mealType: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  mealCalories: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark.accent,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  macroLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
  goalCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  goalDeadline: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  progressContainer: {
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.dark.gray700,
    borderRadius: 4,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.dark.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
    textAlign: 'right',
  },
});

export default HealthScreen;
