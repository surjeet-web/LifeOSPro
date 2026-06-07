import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../utils/theme';

const AchievementsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const achievements = [
    { icon: 'flag', name: 'First Step', desc: 'Complete your first task', progress: 1, target: 1, unlocked: true },
    { icon: 'flame', name: 'On Fire', desc: '7 day streak', progress: 7, target: 7, unlocked: true },
    { icon: 'cash', name: 'Money Minded', desc: 'Track 10 expenses', progress: 10, target: 10, unlocked: true },
    { icon: 'flag', name: 'Focus Master', desc: 'Complete 10 focus sessions', progress: 5, target: 10, unlocked: false },
    { icon: 'document-text', name: 'Note Taker', desc: 'Create 5 notes', progress: 3, target: 5, unlocked: false },
    { icon: 'trophy', name: 'Habit Builder', desc: '30 day streak', progress: 12, target: 30, unlocked: false },
    { icon: 'star', name: 'Productivity Pro', desc: 'Complete 50 tasks', progress: 25, target: 50, unlocked: false },
    { icon: 'diamond', name: 'Wealthy', desc: 'Save $1000', progress: 0, target: 1000, unlocked: false },
    { icon: 'rocket', name: 'Speed Demon', desc: 'Complete 5 tasks in a day', progress: 3, target: 5, unlocked: false },
    { icon: 'crown', name: 'Consistency King', desc: 'Use app 30 days in a row', progress: 15, target: 30, unlocked: false },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.count}>{unlockedCount}/{achievements.length}</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsText}>{unlockedCount} achievements unlocked</Text>
      </View>

      <View style={styles.grid}>
        {achievements.map((achievement, index) => (
          <View key={index} style={[styles.achievementCard, !achievement.unlocked && styles.locked]}>
            <View style={[styles.achievementIcon, achievement.unlocked && styles.unlockedIcon]}>
              <Ionicons name={achievement.icon as any} size={24} color={achievement.unlocked ? colors.dark.warning : colors.dark.textTertiary} />
            </View>
            <Text style={styles.name}>{achievement.name}</Text>
            <Text style={styles.desc}>{achievement.desc}</Text>
            {!achievement.unlocked && (
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${(achievement.progress / achievement.target) * 100}%` }]} />
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  backButton: { fontSize: 24, color: colors.dark.text },
  title: { fontSize: 18, fontWeight: '600', color: colors.dark.text },
  count: { fontSize: 14, color: colors.dark.accent, fontWeight: '600' },
  stats: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  statsText: { fontSize: 14, color: colors.dark.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.md },
  achievementCard: { width: '47%', backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.md },
  locked: { opacity: 0.5 },
  unlockedIcon: {},
  achievementIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.dark.surfaceLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  icon: { fontSize: 30 },
  name: { fontSize: 14, fontWeight: '600', color: colors.dark.text, textAlign: 'center' },
  desc: { fontSize: 12, color: colors.dark.textSecondary, textAlign: 'center', marginTop: 4 },
  progressBar: { width: '100%', height: 4, backgroundColor: colors.dark.surfaceLight, borderRadius: 2, marginTop: spacing.sm, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: colors.dark.primary, borderRadius: 2 },
});

export default AchievementsScreen;
