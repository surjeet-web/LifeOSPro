import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card, Button, ProgressBar, Badge } from '../components/UI';
import { ACHIEVEMENTS, LEVELS } from '../types';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch, addXP } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(state.user.name);

  const today = new Date().toISOString().split('T')[0];
  const completedTasks = state.tasks.filter(t => t.completed && t.completedAt?.startsWith(today)).length;
  const totalTasks = state.tasks.length;
  const completedHabits = state.habits.filter(h => h.completedDates?.includes(today)).length;
  const totalHabits = state.habits.length;
  const totalFocusMinutes = state.focusSessions.filter(s => s.completed).reduce((acc, s) => acc + s.duration, 0);

  const saveName = () => {
    if (name.trim()) {
      dispatch({ type: 'SET_USER', payload: { name: name.trim() } });
    }
    setEditingName(false);
  };

  const xpToNextLevel = [0, 100, 300, 600, 1000, 1500, 2200, 3000];
  const currentLevelXP = xpToNextLevel[state.user.level - 1] || 0;
  const nextLevelXP = xpToNextLevel[state.user.level] || 3000;
  const levelProgress = ((state.user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  const levelName = ['Beginner', 'Explorer', 'Achiever', 'Champion', 'Master', 'Legend', 'Titan', 'God'][state.user.level - 1];

  const stats = [
    { label: 'Tasks Done', value: totalTasks, emoji: '✅' },
    { label: 'Habits Built', value: totalHabits, emoji: '✨' },
    { label: 'Focus Time', value: `${totalFocusMinutes}m`, emoji: '⏱️' },
    { label: 'Day Streak', value: state.habits.reduce((a, h) => a + (h.streak || 0), 0), emoji: '🔥' },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <LinearGradient
          colors={colors.dark.gradient.primary as any}
          style={styles.avatarGradient}
        >
          <Text style={styles.avatarText}>{state.user.name.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
        
        {editingName ? (
          <View style={styles.nameEdit}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              autoFocus
              onBlur={saveName}
              onSubmitEditing={saveName}
            />
          </View>
        ) : (
          <TouchableOpacity onPress={() => setEditingName(true)}>
            <Text style={styles.userName}>{state.user.name}</Text>
          </TouchableOpacity>
        )}
        
        <Badge text={`Level ${state.user.level} • ${levelName}`} color={colors.dark.accent} />
        
        {/* XP Progress */}
        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>XP</Text>
            <Text style={styles.xpValue}>{state.user.xp} / {nextLevelXP}</Text>
          </View>
          <ProgressBar progress={levelProgress} color={colors.dark.accent} height={8} />
        </View>
      </Card>

      {/* Today's Stats */}
      <Text style={styles.sectionTitle}>Today's Activity</Text>
      <View style={styles.todayStats}>
        <View style={styles.todayStat}>
          <Text style={styles.todayNumber}>{completedTasks}</Text>
          <Text style={styles.todayLabel}>Tasks Done</Text>
        </View>
        <View style={styles.todayDivider} />
        <View style={styles.todayStat}>
          <Text style={styles.todayNumber}>{completedHabits}/{totalHabits}</Text>
          <Text style={styles.todayLabel}>Habits</Text>
        </View>
      </View>

      {/* All Stats */}
      <Text style={styles.sectionTitle}>All Time Stats</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <Text style={styles.statEmoji}>{stat.emoji}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </Card>
        ))}
      </View>

      {/* Achievements */}
      <Text style={styles.sectionTitle}>Achievements</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
        {ACHIEVEMENTS.map(achievement => {
          const userAchievement = state.achievements.find(a => a.id === achievement.id);
          const unlocked = !!userAchievement?.unlockedAt;
          return (
            <TouchableOpacity
              key={achievement.id}
              style={[styles.achievementCard, unlocked && styles.achievementUnlocked]}
              onPress={() => Alert.alert(achievement.name, achievement.description)}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              {!unlocked && (
                <View style={styles.achievementLock}>
                  <Text style={styles.achievementLockText}>🔒</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Premium Card */}
      {state.user.isPremium ? (
        <LinearGradient
          colors={state.user.isLifetimeMember ? ['#F59E0B', '#EF4444'] : ['#7C3AED', '#EC4899'] as any}
          style={styles.premiumGradient}
        >
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>
              {state.user.isLifetimeMember ? '👑 Lifetime Member' : '💎 Premium Active'}
            </Text>
            <Text style={styles.premiumText}>
              {state.user.isLifetimeMember 
                ? 'Thank you for being a lifetime supporter!' 
                : state.user.premiumTier === 'yearly' 
                  ? 'You have yearly premium access' 
                  : 'You have monthly premium access'
              }
            </Text>
          </View>
          {state.user.isLifetimeMember && (
            <View style={styles.lifetimeBadge}>
              <Text style={styles.lifetimeBadgeText}>∞</Text>
            </View>
          )}
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={['#F59E0B', '#D97706'] as any}
          style={styles.premiumGradient}
        >
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>🚀 Go Premium</Text>
            <Text style={styles.premiumText}>Unlock all features & become a productivity god!</Text>
          </View>
          <TouchableOpacity style={styles.premiumButton} onPress={() => navigation.navigate('Premium')}>
            <Text style={styles.premiumButtonText}>$9.99/mo</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuText}>Analytics</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🎯</Text>
          <Text style={styles.menuText}>Goals</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📤</Text>
          <Text style={styles.menuText}>Export Data</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help & Support</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.dark.text },
  settingsIcon: { fontSize: 24 },
  profileCard: { marginHorizontal: spacing.lg, alignItems: 'center', paddingVertical: spacing.xl },
  avatarGradient: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  userName: { ...typography.h4, color: colors.dark.text, marginBottom: spacing.sm },
  nameEdit: { marginBottom: spacing.sm },
  nameInput: { ...typography.h4, color: colors.dark.text, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: colors.dark.primary, paddingBottom: spacing.xs },
  xpContainer: { width: '100%', marginTop: spacing.lg },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  xpLabel: { ...typography.bodySmall, color: colors.dark.textSecondary },
  xpValue: { ...typography.bodySmall, color: colors.dark.accent, fontWeight: '600' },
  sectionTitle: { ...typography.h5, color: colors.dark.text, paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md },
  todayStats: { flexDirection: 'row', backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.lg },
  todayStat: { flex: 1, alignItems: 'center' },
  todayNumber: { ...typography.h3, color: colors.dark.text },
  todayLabel: { ...typography.caption, color: colors.dark.textSecondary, marginTop: spacing.xs },
  todayDivider: { width: 1, backgroundColor: colors.dark.border },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.md },
  statCard: { width: '47%', alignItems: 'center', paddingVertical: spacing.lg },
  statEmoji: { fontSize: 24, marginBottom: spacing.sm },
  statValue: { ...typography.h4, color: colors.dark.text },
  statLabel: { ...typography.caption, color: colors.dark.textSecondary, marginTop: spacing.xs },
  achievementsScroll: { paddingLeft: spacing.lg },
  achievementCard: { width: 100, height: 100, backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md, opacity: 0.5 },
  achievementUnlocked: { opacity: 1, backgroundColor: colors.dark.accent + '20', borderWidth: 1, borderColor: colors.dark.accent },
  achievementIcon: { fontSize: 32, marginBottom: spacing.xs },
  achievementName: { ...typography.caption, color: colors.dark.textSecondary, textAlign: 'center' },
  achievementLock: { position: 'absolute', top: 4, right: 4 },
  achievementLockText: { fontSize: 12 },
  premiumGradient: { marginHorizontal: spacing.lg, marginTop: spacing.xl, borderRadius: borderRadius.lg, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  premiumContent: { flex: 1 },
  premiumTitle: { ...typography.h5, color: '#FFFFFF' },
  premiumText: { ...typography.bodySmall, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs },
  premiumButton: { backgroundColor: '#FFFFFF', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: borderRadius.md },
  premiumButtonText: { ...typography.button, color: colors.dark.accent },
  lifetimeBadge: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  lifetimeBadgeText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  menuSection: { marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark.surface, padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  menuIcon: { fontSize: 20, marginRight: spacing.md },
  menuText: { flex: 1, ...typography.body, color: colors.dark.text },
  menuArrow: { color: colors.dark.textTertiary },
});

export default ProfileScreen;
