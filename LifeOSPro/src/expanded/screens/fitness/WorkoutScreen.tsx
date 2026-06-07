// ============================================================================
// WORKOUT & FITNESS SCREEN FOR LifeOS Pro
// 70,000+ Lines Edition - Comprehensive Workout Tracking
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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../../utils/theme';

const { width, height } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'hiit';
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  caloriesPerMinute: number;
}

interface WorkoutSession {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  duration: number;
  caloriesBurned: number;
  date: string;
  completed: boolean;
}

interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  duration?: number;
  weight?: number;
  restSeconds: number;
  completed: boolean;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  weeks: number;
  daysPerWeek: number;
  workouts: WorkoutTemplate[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal: 'strength' | 'muscle' | 'fat-loss' | 'endurance' | 'general';
}

interface WorkoutTemplate {
  day: number;
  name: string;
  exercises: Exercise[];
  duration: number;
  restDays: number[];
}

interface PersonalRecord {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  date: string;
}

interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  currentStreak: number;
  longestStreak: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const EXERCISES: Exercise[] = [
  { id: '1', name: 'Bench Press', category: 'strength', muscleGroups: ['chest', 'triceps', 'shoulders'], difficulty: 'intermediate', equipment: ['barbell', 'bench'], caloriesPerMinute: 6, instructions: ['Lie on bench', 'Grip bar', 'Lower to chest', 'Press up'] },
  { id: '2', name: 'Squat', category: 'strength', muscleGroups: ['quadriceps', 'glutes', 'hamstrings'], difficulty: 'intermediate', equipment: ['barbell', 'rack'], caloriesPerMinute: 7, instructions: ['Position bar on shoulders', 'Feet shoulder-width', 'Lower down', 'Stand up'] },
  { id: '3', name: 'Deadlift', category: 'strength', muscleGroups: ['back', 'glutes', 'hamstrings'], difficulty: 'advanced', equipment: ['barbell'], caloriesPerMinute: 8, instructions: ['Stand with feet hip-width', 'Grip bar', 'Keep back straight', 'Lift with legs'] },
  { id: '4', name: 'Pull-ups', category: 'strength', muscleGroups: ['back', 'biceps'], difficulty: 'intermediate', equipment: ['pull-up bar'], caloriesPerMinute: 5, instructions: ['Hang from bar', 'Pull up', 'Lower slowly'] },
  { id: '5', name: 'Push-ups', category: 'strength', muscleGroups: ['chest', 'triceps', 'shoulders'], difficulty: 'beginner', equipment: ['none'], caloriesPerMinute: 4, instructions: ['Start in plank', 'Lower chest', 'Push up'] },
  { id: '6', name: 'Lunges', category: 'strength', muscleGroups: ['quadriceps', 'glutes'], difficulty: 'beginner', equipment: ['none'], caloriesPerMinute: 5, instructions: ['Stand tall', 'Step forward', 'Lower back knee', 'Push back'] },
  { id: '7', name: 'Plank', category: 'strength', muscleGroups: ['core', 'shoulders'], difficulty: 'beginner', equipment: ['none'], caloriesPerMinute: 3, instructions: ['Forearms on ground', 'Body straight', 'Hold position'] },
  { id: '8', name: 'Burpees', category: 'hiit', muscleGroups: ['full-body'], difficulty: 'advanced', equipment: ['none'], caloriesPerMinute: 10, instructions: ['Squat down', 'Jump to plank', 'Push-up', 'Jump back', 'Jump up'] },
  { id: '9', name: 'Mountain Climbers', category: 'hiit', muscleGroups: ['core', 'legs'], difficulty: 'intermediate', equipment: ['none'], caloriesPerMinute: 9, instructions: ['Start in plank', 'Drive knee to chest', 'Alternate legs'] },
  { id: '10', name: 'Running', category: 'cardio', muscleGroups: ['legs', 'cardiovascular'], difficulty: 'beginner', equipment: ['none'], caloriesPerMinute: 8, instructions: ['Start jogging', 'Maintain pace', 'Cool down'] },
  { id: '11', name: 'Cycling', category: 'cardio', muscleGroups: ['legs', 'cardiovascular'], difficulty: 'beginner', equipment: ['bike'], caloriesPerMinute: 7, instructions: ['Mount bike', 'Pedal steadily', 'Adjust resistance'] },
  { id: '12', name: 'Jump Rope', category: 'cardio', muscleGroups: ['full-body'], difficulty: 'intermediate', equipment: ['rope'], caloriesPerMinute: 10, instructions: ['Hold rope', 'Jump and swing', 'Land softly'] },
  { id: '13', name: 'Yoga Flow', category: 'flexibility', muscleGroups: ['full-body'], difficulty: 'beginner', equipment: ['mat'], caloriesPerMinute: 3, instructions: ['Start in mountain', 'Flow through poses', 'Breathe deeply'] },
  { id: '14', name: 'Stretching', category: 'flexibility', muscleGroups: ['full-body'], difficulty: 'beginner', equipment: ['mat'], caloriesPerMinute: 2, instructions: ['Hold stretches', 'Breathe deeply', 'Don\'t bounce'] },
  { id: '15', name: 'Single-leg Balance', category: 'balance', muscleGroups: ['legs', 'core'], difficulty: 'beginner', equipment: ['none'], caloriesPerMinute: 2, instructions: ['Stand on one leg', 'Hold balance', 'Arms out'] },
];

const WORKOUT_SESSIONS: WorkoutSession[] = [
  { id: '1', name: 'Upper Body Strength', exercises: [], duration: 45, caloriesBurned: 320, date: '2024-01-15', completed: true },
  { id: '2', name: 'Leg Day', exercises: [], duration: 55, caloriesBurned: 450, date: '2024-01-14', completed: true },
  { id: '3', name: 'HIIT Cardio', exercises: [], duration: 30, caloriesBurned: 380, date: '2024-01-13', completed: true },
  { id: '4', name: 'Core & Flexibility', exercises: [], duration: 40, caloriesBurned: 180, date: '2024-01-12', completed: true },
  { id: '5', name: 'Full Body', exercises: [], duration: 60, caloriesBurned: 520, date: '2024-01-11', completed: true },
];

const WORKOUT_PLANS: WorkoutPlan[] = [
  { id: '1', name: 'Beginner Strength', description: 'Perfect for starting your fitness journey', weeks: 8, daysPerWeek: 3, difficulty: 'beginner', goal: 'strength', workouts: [] },
  { id: '2', name: 'Muscle Building', description: 'Hypertrophy-focused program', weeks: 12, daysPerWeek: 4, difficulty: 'intermediate', goal: 'muscle', workouts: [] },
  { id: '3', name: 'Fat Loss HIIT', description: 'High intensity for maximum fat burn', weeks: 8, daysPerWeek: 5, difficulty: 'advanced', goal: 'fat-loss', workouts: [] },
  { id: '4', name: 'Endurance Builder', description: 'Build stamina and endurance', weeks: 10, daysPerWeek: 4, difficulty: 'intermediate', goal: 'endurance', workouts: [] },
];

const PERSONAL_RECORDS: PersonalRecord[] = [
  { id: '1', exerciseId: '1', weight: 185, reps: 8, date: '2024-01-10' },
  { id: '2', exerciseId: '2', weight: 225, reps: 10, date: '2024-01-12' },
  { id: '3', exerciseId: '3', weight: 315, reps: 5, date: '2024-01-08' },
  { id: '4', exerciseId: '4', weight: 0, reps: 12, date: '2024-01-14' },
];

const MOCK_STATS: WorkoutStats = {
  totalWorkouts: 156,
  totalDuration: 7800,
  totalCalories: 45000,
  currentStreak: 12,
  longestStreak: 28,
  workoutsThisWeek: 4,
  workoutsThisMonth: 18,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WorkoutScreen: React.FC<any> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'exercises' | 'workouts' | 'plans' | 'progress'>('home');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);
  
  const filteredExercises = selectedCategory === 'all' 
    ? EXERCISES 
    : EXERCISES.filter(e => e.category === selectedCategory);
  
  const categories = [
    { id: 'all', name: 'All', icon: 'barbell' },
    { id: 'strength', name: 'Strength', icon: 'fitness' },
    { id: 'cardio', name: 'Cardio', icon: 'heart' },
    { id: 'hiit', name: 'HIIT', icon: 'flame' },
    { id: 'flexibility', name: 'Flexibility', icon: 'body' },
    { id: 'balance', name: 'Balance', icon: 'analytics' },
  ];
  
  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <TouchableOpacity style={styles.exerciseCard}>
      <View style={styles.exerciseIcon}>
        <Ionicons 
          name={(item.category === 'strength' ? 'barbell' : item.category === 'cardio' ? 'heart' : item.category === 'hiit' ? 'flame' : item.category === 'flexibility' ? 'body' : 'analytics') as any} 
          size={24} 
          color={colors.dark.primary} 
        />
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseMuscles}>{item.muscleGroups.join(', ')}</Text>
        <View style={styles.exerciseMeta}>
          <View style={[styles.difficultyBadge, { backgroundColor: item.difficulty === 'beginner' ? colors.dark.success + '20' : item.difficulty === 'intermediate' ? colors.dark.warning + '20' : colors.dark.error + '20' }]}>
            <Text style={[styles.difficultyText, { color: item.difficulty === 'beginner' ? colors.dark.success : item.difficulty === 'intermediate' ? colors.dark.warning : colors.dark.error }]}>{item.difficulty}</Text>
          </View>
          <Text style={styles.caloriesText}>{item.caloriesPerMinute} cal/min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderWorkoutCard = ({ item }: { item: WorkoutSession }) => (
    <TouchableOpacity style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <Text style={styles.workoutDate}>{item.date}</Text>
      </View>
      <View style={styles.workoutStats}>
        <View style={styles.workoutStat}>
          <Ionicons name="time-outline" size={16} color={colors.dark.textSecondary} />
          <Text style={styles.workoutStatValue}> {item.duration} min</Text>
        </View>
        <View style={styles.workoutStat}>
          <Ionicons name="flame" size={16} color={colors.dark.error} />
          <Text style={styles.workoutStatValue}> {item.caloriesBurned} cal</Text>
        </View>
        <View style={styles.workoutStat}>
          <Ionicons name={item.completed ? "checkmark-circle" : "time-outline"} size={16} color={item.completed ? colors.dark.success : colors.dark.warning} />
          <Text style={[styles.workoutStatValue, { color: item.completed ? colors.dark.success : colors.dark.warning }]}> {item.completed ? 'Completed' : 'In Progress'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderPlanCard = ({ item }: { item: WorkoutPlan }) => (
    <TouchableOpacity style={styles.planCard}>
      <View style={styles.planHeader}>
        <View style={[styles.planIcon, { backgroundColor: item.difficulty === 'beginner' ? colors.dark.success + '20' : item.difficulty === 'intermediate' ? colors.dark.warning + '20' : colors.dark.error + '20' }]}>
          <Ionicons name={(item.goal === 'strength' ? 'barbell' : item.goal === 'muscle' ? 'fitness' : item.goal === 'fat-loss' ? 'flame' : item.goal === 'endurance' ? 'walk' : 'flash') as any} size={20} color={colors.dark.primary} />
        </View>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{item.name}</Text>
          <Text style={styles.planDescription}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.planMeta}>
        <View style={styles.planMetaItem}>
          <Text style={styles.planMetaLabel}>Duration</Text>
          <Text style={styles.planMetaValue}>{item.weeks} weeks</Text>
        </View>
        <View style={styles.planMetaItem}>
          <Text style={styles.planMetaLabel}>Frequency</Text>
          <Text style={styles.planMetaValue}>{item.daysPerWeek}x/week</Text>
        </View>
        <View style={styles.planMetaItem}>
          <Text style={styles.planMetaLabel}>Difficulty</Text>
          <Text style={[styles.planMetaValue, { color: item.difficulty === 'beginner' ? colors.dark.success : item.difficulty === 'intermediate' ? colors.dark.warning : colors.dark.error }]}>{item.difficulty}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.startPlanButton}>
        <Text style={styles.startPlanButtonText}>Start Plan</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  const renderProgressCard = () => (
    <View style={styles.progressContainer}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{MOCK_STATS.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round(MOCK_STATS.totalDuration / 60)}h</Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{(MOCK_STATS.totalCalories / 1000).toFixed(1)}k</Text>
          <Text style={styles.statLabel}>Calories Burned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.dark.primary }]}>{MOCK_STATS.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Personal Records</Text>
      {PERSONAL_RECORDS.map(record => {
        const exercise = EXERCISES.find(e => e.id === record.exerciseId);
        return (
          <View key={record.id} style={styles.prCard}>
            <Text style={styles.prExercise}>{exercise?.name}</Text>
            <View style={styles.prDetails}>
              <Text style={styles.prValue}>{record.weight > 0 ? `${record.weight} lbs` : `${record.reps} reps`}</Text>
              <Text style={styles.prDate}>{record.date}</Text>
            </View>
          </View>
        );
      })}
      
      <View style={styles.weeklyStats}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weeklyStatRow}>
          <Text style={styles.weeklyLabel}>Workouts</Text>
          <Text style={styles.weeklyValue}>{MOCK_STATS.workoutsThisWeek} / 5</Text>
        </View>
        <View style={styles.weeklyBar}>
          <View style={[styles.weeklyBarFill, { width: `${(MOCK_STATS.workoutsThisWeek / 5) * 100}%` }]} />
        </View>
      </View>
    </View>
  );
  
  const renderHome = () => (
    <ScrollView 
      style={styles.content}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />}
    >
      {/* Quick Start */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Start</Text>
        <View style={styles.quickStartGrid}>
          <TouchableOpacity style={[styles.quickStartCard, { backgroundColor: colors.dark.primary + '20' }]}>
            <Ionicons name="barbell" size={28} color={colors.dark.primary} />
            <Text style={styles.quickStartLabel}>Strength</Text>
            <Text style={styles.quickStartDuration}>45 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickStartCard, { backgroundColor: colors.dark.error + '20' }]}>
            <Ionicons name="flame" size={28} color={colors.dark.error} />
            <Text style={styles.quickStartLabel}>HIIT</Text>
            <Text style={styles.quickStartDuration}>20 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickStartCard, { backgroundColor: colors.dark.success + '20' }]}>
            <Ionicons name="body" size={28} color={colors.dark.success} />
            <Text style={styles.quickStartLabel}>Yoga</Text>
            <Text style={styles.quickStartDuration}>30 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickStartCard, { backgroundColor: colors.dark.warning + '20' }]}>
            <Ionicons name="walk" size={28} color={colors.dark.warning} />
            <Text style={styles.quickStartLabel}>Cardio</Text>
            <Text style={styles.quickStartDuration}>30 min</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsMiniCard}>
            <Text style={styles.statsMiniValue}>{MOCK_STATS.workoutsThisWeek}</Text>
            <Text style={styles.statsMiniLabel}>Workouts</Text>
          </View>
          <View style={styles.statsMiniCard}>
            <Text style={styles.statsMiniValue}>{MOCK_STATS.currentStreak}</Text>
            <Text style={styles.statsMiniLabel}>Streak</Text>
          </View>
          <View style={styles.statsMiniCard}>
            <Text style={styles.statsMiniValue}>{MOCK_STATS.workoutsThisWeek * 350}</Text>
            <Text style={styles.statsMiniLabel}>Calories</Text>
          </View>
        </View>
      </View>
      
      {/* Recent Workouts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>
        {WORKOUT_SESSIONS.slice(0, 3).map(workout => (
          <View key={workout.id} style={styles.recentWorkoutCard}>
            <View style={styles.recentWorkoutIcon}>
              <Ionicons name="barbell" size={20} color={colors.dark.primary} />
            </View>
            <View style={styles.recentWorkoutInfo}>
              <Text style={styles.recentWorkoutName}>{workout.name}</Text>
              <Text style={styles.recentWorkoutMeta}>{workout.date} • {workout.duration} min</Text>
            </View>
            <Text style={styles.recentWorkoutCalories}>{workout.caloriesBurned} cal</Text>
          </View>
        ))}
      </View>
      
      {/* Plans Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Workout Plans</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Browse →</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={WORKOUT_PLANS.slice(0, 2)}
          renderItem={renderPlanCard}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.plansList}
        />
      </View>
    </ScrollView>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View>
          <Text style={styles.headerTitle}>Workout</Text>
          <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
        </View>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="stats-chart" size={20} color={colors.dark.text} />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['home', 'exercises', 'workouts', 'plans', 'progress'].map((tab) => (
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
      {activeTab === 'home' && renderHome()}
      
      {activeTab === 'exercises' && (
        <>
          <View style={styles.categoryFilter}>
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.categoryChip, selectedCategory === item.id && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(item.id)}
                >
                  <Ionicons name={item.icon as any} size={16} color={selectedCategory === item.id ? colors.dark.background : colors.dark.text} />
                  <Text style={[styles.categoryChipText, selectedCategory === item.id && styles.categoryChipTextActive]}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            />
          </View>
          <FlatList
            data={filteredExercises}
            renderItem={renderExerciseCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />}
          />
        </>
      )}
      
      {activeTab === 'workouts' && (
        <FlatList
          data={WORKOUT_SESSIONS}
          renderItem={renderWorkoutCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />}
        />
      )}
      
      {activeTab === 'plans' && (
        <FlatList
          data={WORKOUT_PLANS}
          renderItem={renderPlanCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />}
        />
      )}
      
      {activeTab === 'progress' && renderProgressCard()}
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerTitle: { fontSize: typography.fontSizes['2xl'], fontWeight: '700', color: colors.dark.textPrimary },
  headerSubtitle: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary, marginTop: 2 },
  historyButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.dark.surface, alignItems: 'center', justifyContent: 'center' },
  historyButtonText: { fontSize: 20 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.base, marginHorizontal: 2 },
  tabActive: { backgroundColor: colors.dark.primary },
  tabText: { fontSize: typography.fontSizes.xs, fontWeight: '600', color: colors.dark.textTertiary },
  tabTextActive: { color: colors.dark.white },
  content: { flex: 1 },
  contentContainer: { paddingBottom: 100 },
  section: { marginBottom: spacing.xl, paddingHorizontal: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: typography.fontSizes.lg, fontWeight: '600', color: colors.dark.textPrimary, marginBottom: spacing.md },
  seeAllText: { fontSize: typography.fontSizes.sm, color: colors.dark.primary },
  quickStartGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quickStartCard: { width: '48%', padding: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center' },
  quickStartIcon: { fontSize: 28, marginBottom: spacing.xs },
  quickStartLabel: { fontSize: typography.fontSizes.md, fontWeight: '600', color: colors.dark.textPrimary },
  quickStartDuration: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statsMiniCard: { flex: 1, backgroundColor: colors.dark.surface, padding: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center' },
  statsMiniValue: { fontSize: typography.fontSizes.xl, fontWeight: '700', color: colors.dark.textPrimary },
  statsMiniLabel: { fontSize: typography.fontSizes.xs, color: colors.dark.textTertiary, marginTop: 2 },
  recentWorkoutCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  recentWorkoutIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.dark.primary + '20', alignItems: 'center', justifyContent: 'center' },
  recentWorkoutEmoji: { fontSize: 24 },
  recentWorkoutInfo: { flex: 1, marginLeft: spacing.md },
  recentWorkoutName: { fontSize: typography.fontSizes.md, fontWeight: '600', color: colors.dark.textPrimary },
  recentWorkoutMeta: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary, marginTop: 2 },
  recentWorkoutCalories: { fontSize: typography.fontSizes.md, fontWeight: '600', color: colors.dark.primary },
  categoryFilter: { marginBottom: spacing.md },
  categoryList: { paddingHorizontal: spacing.lg },
  categoryChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, marginRight: spacing.sm },
  categoryChipActive: { backgroundColor: colors.dark.primary },
  categoryChipIcon: { fontSize: 16, marginRight: 4 },
  categoryChipText: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary },
  categoryChipTextActive: { color: colors.dark.white },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  exerciseCard: { flexDirection: 'row', backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  exerciseIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.dark.gray700, alignItems: 'center', justifyContent: 'center' },
  exerciseEmoji: { fontSize: 28 },
  exerciseInfo: { flex: 1, marginLeft: spacing.md },
  exerciseName: { fontSize: typography.fontSizes.md, fontWeight: '600', color: colors.dark.textPrimary },
  exerciseMuscles: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary, marginTop: 2 },
  exerciseMeta: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.sm },
  difficultyBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  difficultyText: { fontSize: typography.fontSizes.xs, fontWeight: '600', textTransform: 'capitalize' },
  caloriesText: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary },
  workoutCard: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  workoutHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  workoutName: { fontSize: typography.fontSizes.md, fontWeight: '600', color: colors.dark.textPrimary },
  workoutDate: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary },
  workoutStats: { flexDirection: 'row', gap: spacing.lg },
  workoutStat: {},
  workoutStatValue: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary },
  planCard: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  planHeader: { flexDirection: 'row', marginBottom: spacing.md },
  planIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  planEmoji: { fontSize: 28 },
  planInfo: { flex: 1, marginLeft: spacing.md },
  planName: { fontSize: typography.fontSizes.lg, fontWeight: '700', color: colors.dark.textPrimary },
  planDescription: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary, marginTop: 2 },
  planMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  planMetaItem: { alignItems: 'center' },
  planMetaLabel: { fontSize: typography.fontSizes.xs, color: colors.dark.textTertiary },
  planMetaValue: { fontSize: typography.fontSizes.sm, fontWeight: '600', color: colors.dark.textPrimary, marginTop: 2 },
  startPlanButton: { backgroundColor: colors.dark.primary, paddingVertical: spacing.sm, borderRadius: borderRadius.base, alignItems: 'center' },
  startPlanButtonText: { fontSize: typography.fontSizes.md, fontWeight: '600', color: colors.dark.white },
  plansList: { paddingRight: spacing.lg },
  progressContainer: { paddingHorizontal: spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  statCard: { width: '48%', backgroundColor: colors.dark.surface, padding: spacing.lg, borderRadius: borderRadius.lg, alignItems: 'center', marginBottom: spacing.sm },
  statValue: { fontSize: typography.fontSizes['2xl'], fontWeight: '700', color: colors.dark.textPrimary },
  statLabel: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary, marginTop: 4 },
  prCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.dark.surface, padding: spacing.md, borderRadius: borderRadius.base, marginBottom: spacing.sm },
  prExercise: { fontSize: typography.fontSizes.md, fontWeight: '600', color: colors.dark.textPrimary },
  prDetails: { alignItems: 'flex-end' },
  prValue: { fontSize: typography.fontSizes.md, fontWeight: '700', color: colors.dark.primary },
  prDate: { fontSize: typography.fontSizes.xs, color: colors.dark.textTertiary },
  weeklyStats: { backgroundColor: colors.dark.surface, padding: spacing.lg, borderRadius: borderRadius.lg, marginTop: spacing.md },
  weeklyStatRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  weeklyLabel: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary },
  weeklyValue: { fontSize: typography.fontSizes.sm, fontWeight: '600', color: colors.dark.textPrimary },
  weeklyBar: { height: 8, backgroundColor: colors.dark.gray700, borderRadius: 4, overflow: 'hidden' },
  weeklyBarFill: { height: '100%', backgroundColor: colors.dark.primary, borderRadius: 4 },
});

export default WorkoutScreen;
