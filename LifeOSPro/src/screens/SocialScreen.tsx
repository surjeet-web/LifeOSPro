import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const CHALLENGES = [
  { id: '1', title: '30-Day Focus Challenge', emoji: '🎯', participants: 12453, duration: 30, xp: 500, difficulty: 'Hard', joined: false },
  { id: '2', title: '7-Day Habit Builder', emoji: '✨', participants: 28765, duration: 7, xp: 200, difficulty: 'Easy', joined: false },
  { id: '3', title: 'Save $100 Challenge', emoji: '💰', participants: 8234, duration: 30, xp: 300, difficulty: 'Medium', joined: false },
  { id: '4', title: 'No Procrastination Week', emoji: '🔥', participants: 15678, duration: 7, xp: 250, difficulty: 'Hard', joined: false },
  { id: '5', title: 'Morning Routine 14 Days', emoji: '🌅', participants: 19876, duration: 14, xp: 350, difficulty: 'Medium', joined: false },
];

const SocialScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch, addXP } = useApp();
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const totalStreak = state.habits.reduce((acc, h) => acc + (h.streak || 0), 0);
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const focusHours = Math.floor(state.focusSessions.filter(s => s.completed).reduce((acc, s) => acc + s.duration, 0) / 60);

  const shareProgress = async () => {
    try {
      const message = `🔥 Check out my LifeOS stats!\n\n📋 ${completedTasks} tasks completed\n✨ ${totalStreak} day streak\n⏱️ ${focusHours} hours focused\n💪 Level ${state.user.level}\n\nJoin me at: lifeos.app`;
      
      await Share.share({
        message,
        title: 'My LifeOS Progress',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const shareStreak = async () => {
    try {
      const message = `🔥 I'm on fire! 🔥\n\nI've maintained a ${totalStreak}-day streak on LifeOS!\n\nJoin me: lifeos.app\n\n#LifeOS #Productivity #Streak`;
      
      await Share.share({
        message,
        title: 'My Streak',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const joinChallenge = (challenge: any) => {
    setJoinedChallenges([...joinedChallenges, challenge.id]);
    addXP(challenge.xp);
    Alert.alert(
      `🎉 Challenge Joined!`,
      `You've joined "${challenge.title}"! Complete it to earn ${challenge.xp} XP!`,
      [{ text: 'Let\'s Go! 🎯' }]
    );
  };

  const leaderboard = [
    { rank: 1, name: 'Sarah M.', streak: 127, avatar: '👩', xp: 15420 },
    { rank: 2, name: 'Mike T.', streak: 98, avatar: '👨', xp: 12350 },
    { rank: 3, name: 'You', streak: totalStreak, avatar: '👤', xp: state.user.xp, isYou: true },
    { rank: 4, name: 'Emma K.', streak: 45, avatar: '👩‍💼', xp: 8920 },
    { rank: 5, name: 'John D.', streak: 38, avatar: '👨‍💻', xp: 7650 },
  ].sort((a, b) => b.streak - a.streak).map((item, i) => ({ ...item, rank: i + 1 }));

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Social 🔥</Text>
        <TouchableOpacity style={styles.inviteButton} onPress={shareProgress}>
          <LinearGradient colors={['#10B981', '#34D399']} style={styles.inviteGradient}>
            <Text style={styles.inviteText}>+ Invite</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Share Stats Card */}
      <TouchableOpacity onPress={shareStreak}>
        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Viral Stats 🚀</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedTasks}</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{focusHours}h</Text>
              <Text style={styles.statLabel}>Focused</Text>
            </View>
          </View>
          <View style={styles.shareHint}>
            <Text style={styles.shareHintText}>Tap to share your streak! 📢</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Leaderboard */}
      <Text style={styles.sectionTitle}>🏆 Leaderboard</Text>
      <View style={styles.leaderboard}>
        {leaderboard.map((user, index) => (
          <View key={index} style={[styles.leaderboardItem, user.isYou && styles.leaderboardItemYou]}>
            <View style={styles.rankContainer}>
              {index === 0 && <Text style={styles.rankEmoji}>🥇</Text>}
              {index === 1 && <Text style={styles.rankEmoji}>🥈</Text>}
              {index === 2 && <Text style={styles.rankEmoji}>🥉</Text>}
              {index > 2 && <Text style={styles.rankNumber}>#{user.rank}</Text>}
            </View>
            <Text style={styles.avatar}>{user.avatar}</Text>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, user.isYou && styles.userNameYou]}>{user.name}</Text>
              <Text style={styles.userStreak}>🔥 {user.streak} days</Text>
            </View>
            <View style={styles.userXP}>
              <Text style={styles.xpValue}>{user.xp.toLocaleString()}</Text>
              <Text style={styles.xpLabel}>XP</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Challenges */}
      <Text style={styles.sectionTitle}>⚡ Active Challenges</Text>
      <Text style={styles.sectionSubtitle}>Join challenges with friends</Text>
      
      {CHALLENGES.map((challenge) => (
        <View key={challenge.id} style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <View style={styles.challengeMeta}>
                <Text style={styles.challengeParticipants}>👥 {challenge.participants.toLocaleString()} joined</Text>
                <Text style={styles.challengeDuration}>⏱️ {challenge.duration} days</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.challengeFooter}>
            <View style={styles.challengeReward}>
              <Text style={styles.rewardXP}>+{challenge.xp} XP</Text>
              <View style={[styles.difficultyBadge, { 
                backgroundColor: challenge.difficulty === 'Easy' ? '#10B981' + '30' : challenge.difficulty === 'Medium' ? '#F59E0B' + '30' : '#EF4444' + '30'
              }]}>
                <Text style={[styles.difficultyText, { 
                  color: challenge.difficulty === 'Easy' ? '#10B981' : challenge.difficulty === 'Medium' ? '#F59E0B' : '#EF4444'
                }]}>{challenge.difficulty}</Text>
              </View>
            </View>
            
            {joinedChallenges.includes(challenge.id) ? (
              <View style={styles.joinedBadge}>
                <Text style={styles.joinedText}>✓ Joined</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.joinButton} onPress={() => joinChallenge(challenge)}>
                <Text style={styles.joinText}>Join Challenge</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      {/* Referral */}
      <View style={styles.referralCard}>
        <Text style={styles.referralTitle}>🎁 Invite Friends, Get Rewards!</Text>
        <Text style={styles.referralText}>Give your friend 7 days of Premium free, and YOU get 30 days free too!</Text>
        
        <TouchableOpacity style={styles.referralButton} onPress={shareProgress}>
          <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.referralGradient}>
            <Text style={styles.referralButtonText}>🔗 Copy Referral Link</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.referralHint}>Or share directly to social media</Text>
        
        <View style={styles.socialShare}>
          <TouchableOpacity style={styles.socialButton} onPress={shareProgress}>
            <Text style={styles.socialIcon}>🐦</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={shareProgress}>
            <Text style={styles.socialIcon}>📘</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={shareProgress}>
            <Text style={styles.socialIcon}>📸</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={shareProgress}>
            <Text style={styles.socialIcon}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.dark.text },
  inviteButton: {},
  inviteGradient: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md },
  inviteText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  statsCard: { margin: spacing.lg, borderRadius: borderRadius.xl, padding: spacing.xl },
  statsTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', textAlign: 'center', marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 32, fontWeight: '800', color: '#FFF' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  shareHint: { marginTop: spacing.lg, alignItems: 'center' },
  shareHintText: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.dark.text, paddingHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.xs },
  sectionSubtitle: { fontSize: 14, color: colors.dark.textSecondary, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  leaderboard: { backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, overflow: 'hidden' },
  leaderboardItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark.border },
  leaderboardItemYou: { backgroundColor: colors.dark.primary + '20' },
  rankContainer: { width: 40, alignItems: 'center' },
  rankEmoji: { fontSize: 20 },
  rankNumber: { fontSize: 14, color: colors.dark.textSecondary, fontWeight: '600' },
  avatar: { fontSize: 28, marginRight: spacing.sm },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '600', color: colors.dark.text },
  userNameYou: { color: colors.dark.primary },
  userStreak: { fontSize: 12, color: colors.dark.warning },
  userXP: { alignItems: 'flex-end' },
  xpValue: { fontSize: 16, fontWeight: '700', color: colors.dark.accent },
  xpLabel: { fontSize: 10, color: colors.dark.textSecondary },
  challengeCard: { backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, marginBottom: spacing.md, borderRadius: borderRadius.lg, padding: spacing.lg },
  challengeHeader: { flexDirection: 'row', alignItems: 'center' },
  challengeEmoji: { fontSize: 40 },
  challengeInfo: { flex: 1, marginLeft: spacing.md },
  challengeTitle: { fontSize: 16, fontWeight: '600', color: colors.dark.text },
  challengeMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  challengeParticipants: { fontSize: 12, color: colors.dark.textSecondary },
  challengeDuration: { fontSize: 12, color: colors.dark.textSecondary },
  challengeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg },
  challengeReward: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rewardXP: { fontSize: 16, fontWeight: '700', color: colors.dark.accent },
  difficultyBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  difficultyText: { fontSize: 10, fontWeight: '600' },
  joinButton: { backgroundColor: colors.dark.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.md },
  joinText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  joinedBadge: { backgroundColor: colors.dark.success + '30', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.md },
  joinedText: { color: colors.dark.success, fontWeight: '600', fontSize: 14 },
  referralCard: { backgroundColor: colors.dark.surface, margin: spacing.lg, borderRadius: borderRadius.xl, padding: spacing.xl, borderWidth: 1, borderColor: colors.dark.accent },
  referralTitle: { fontSize: 20, fontWeight: '700', color: colors.dark.text, textAlign: 'center', marginBottom: spacing.sm },
  referralText: { fontSize: 14, color: colors.dark.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  referralButton: { marginBottom: spacing.sm },
  referralGradient: { padding: spacing.md, borderRadius: borderRadius.md, alignItems: 'center' },
  referralButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  referralHint: { fontSize: 12, color: colors.dark.textTertiary, textAlign: 'center', marginBottom: spacing.md },
  socialShare: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
  socialButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.dark.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  socialIcon: { fontSize: 20 },
});

export default SocialScreen;
