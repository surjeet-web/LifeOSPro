// ============================================================================
// SOCIAL & COMMUNITY SCREEN FOR LifeOS Pro
// 70,000+ Lines Edition - Social Features & Community
// ============================================================================

import React, { useState, useEffect } from 'react';
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

const { width } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  streak: number;
  points: number;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'individual' | 'team' | 'global';
  category: string;
  startDate: string;
  endDate: string;
  participants: number;
  prize: string;
  progress: number;
  joined: boolean;
}

interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  name: string;
  username: string;
  avatar: string;
  points: number;
  streak: number;
  trend: 'up' | 'down' | 'stable';
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'achievement' | 'streak' | 'milestone' | 'goal' | 'general';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_FRIENDS: Friend[] = [
  { id: '1', name: 'Alex Johnson', username: '@alexj', avatar: '👨‍💻', status: 'online', streak: 45, points: 12500 },
  { id: '2', name: 'Sarah Miller', username: '@sarahm', avatar: '👩‍🎨', status: 'online', streak: 32, points: 9800 },
  { id: '3', name: 'Mike Chen', username: '@mikec', avatar: '👨‍🔬', status: 'away', streak: 28, points: 8700 },
  { id: '4', name: 'Emma Wilson', username: '@emmaw', avatar: '👩‍🏫', status: 'offline', streak: 56, points: 15200 },
  { id: '5', name: 'James Brown', username: '@jamesb', avatar: '👨‍🎤', status: 'online', streak: 21, points: 6500 },
];

const MOCK_CHALLENGES: Challenge[] = [
  { id: '1', name: '30-Day Fitness Challenge', description: 'Complete 30 days of exercise', type: 'individual', category: 'fitness', startDate: '2024-01-01', endDate: '2024-01-31', participants: 1234, prize: '500 points', progress: 65, joined: true },
  { id: '2', name: 'Productivity Week', description: 'Complete most tasks this week', type: 'global', category: 'productivity', startDate: '2024-01-15', endDate: '2024-01-21', participants: 5678, prize: 'Gold Badge', progress: 0, joined: false },
  { id: '3', name: 'Habit Builders', description: 'Build 3 new habits', type: 'team', category: 'habits', startDate: '2024-01-10', endDate: '2024-02-10', participants: 890, prize: 'Premium Month', progress: 40, joined: true },
  { id: '4', name: 'Focus Master', description: '100 hours of deep work', type: 'individual', category: 'focus', startDate: '2024-01-01', endDate: '2024-03-31', participants: 456, prize: '1000 Points', progress: 28, joined: false },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, previousRank: 2, name: 'Emma Wilson', username: '@emmaw', avatar: '👩‍🏫', points: 15200, streak: 56, trend: 'up' },
  { rank: 2, previousRank: 1, name: 'Alex Johnson', username: '@alexj', avatar: '👨‍💻', points: 12500, streak: 45, trend: 'down' },
  { rank: 3, previousRank: 3, name: 'Sarah Miller', username: '@sarahm', avatar: '👩‍🎨', points: 9800, streak: 32, trend: 'stable' },
  { rank: 4, previousRank: 5, name: 'Mike Chen', username: '@mikec', avatar: '👨‍🔬', points: 8700, streak: 28, trend: 'up' },
  { rank: 5, previousRank: 4, name: 'James Brown', username: '@jamesb', avatar: '👨‍🎤', points: 6500, streak: 21, trend: 'down' },
  { rank: 6, previousRank: 6, name: 'Lisa Park', username: '@lisap', avatar: '👩‍💼', points: 5400, streak: 18, trend: 'stable' },
  { rank: 7, previousRank: 8, name: 'David Lee', username: '@davidl', avatar: '👨‍🚀', points: 4200, streak: 15, trend: 'up' },
];

const MOCK_POSTS: Post[] = [
  { id: '1', userId: '1', userName: 'Alex Johnson', userAvatar: '👨‍💻', type: 'achievement', content: 'Just completed 100 tasks this month! 🎉', likes: 45, comments: 12, timestamp: '2 hours ago', liked: false },
  { id: '2', userId: '2', userName: 'Sarah Miller', userAvatar: '👩‍🎨', type: 'streak', content: '30-day streak! Never thought I could do it. Keep going everyone! 💪', likes: 89, comments: 24, timestamp: '5 hours ago', liked: true },
  { id: '3', userId: '3', userName: 'Mike Chen', userAvatar: '👨‍🔬', type: 'milestone', content: 'Hit $10,000 savings goal! Thanks for all the support! 🎊', likes: 156, comments: 42, timestamp: '1 day ago', liked: false },
  { id: '4', userId: '4', userName: 'Emma Wilson', userAvatar: '👩‍🏫', type: 'goal', content: 'Just finished reading my 12th book this year! Reading is the best investment. 📚', likes: 67, comments: 18, timestamp: '2 days ago', liked: true },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SocialScreen: React.FC<any> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'challenges' | 'leaderboard'>('feed');
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return colors.dark.success;
      case 'away': return colors.dark.warning;
      default: return colors.dark.gray500;
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };
  
  const getPostIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'streak': return '🔥';
      case 'milestone': return '🎉';
      case 'goal': return '🎯';
      default: return '💬';
    }
  };
  
  const renderFriend = ({ item }: { item: Friend }) => (
    <TouchableOpacity style={styles.friendCard}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarEmoji}>{item.avatar}</Text>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendUsername}>{item.username}</Text>
      </View>
      <View style={styles.friendStats}>
        <View style={styles.friendStat}>
          <Text style={styles.friendStatValue}>🔥 {item.streak}</Text>
        </View>
        <View style={styles.friendStat}>
          <Text style={styles.friendStatValue}>⭐ {item.points}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderChallenge = ({ item }: { item: Challenge }) => (
    <TouchableOpacity style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeTypeBadge}>
          <Text style={styles.challengeTypeText}>{item.type}</Text>
        </View>
        <Text style={styles.challengePrize}>🏆 {item.prize}</Text>
      </View>
      <Text style={styles.challengeName}>{item.name}</Text>
      <Text style={styles.challengeDescription}>{item.description}</Text>
      <View style={styles.challengeMeta}>
        <Text style={styles.challengeDates}>{item.startDate} - {item.endDate}</Text>
        <Text style={styles.challengeParticipants}>👥 {item.participants} joined</Text>
      </View>
      {item.joined && (
        <View style={styles.challengeProgress}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      )}
      <TouchableOpacity style={[styles.joinButton, item.joined && styles.joinedButton]}>
        <Text style={[styles.joinButtonText, item.joined && styles.joinedButtonText]}>
          {item.joined ? 'Joined' : 'Join Challenge'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  const renderLeaderboardEntry = ({ item }: { item: LeaderboardEntry }) => (
    <TouchableOpacity style={[styles.leaderboardCard, item.rank <= 3 && styles.topThreeCard]}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, item.rank === 1 && styles.rank1Text, item.rank === 2 && styles.rank2Text, item.rank === 3 && styles.rank3Text]}>
          {item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : item.rank}
        </Text>
      </View>
      <View style={styles.leaderboardAvatar}>
        <Text style={styles.avatarEmoji}>{item.avatar}</Text>
      </View>
      <View style={styles.leaderboardInfo}>
        <Text style={styles.leaderboardName}>{item.name}</Text>
        <Text style={styles.leaderboardUsername}>{item.username}</Text>
      </View>
      <View style={styles.leaderboardStats}>
        <View style={styles.leaderboardStat}>
          <Text style={styles.statValue}>⭐ {item.points.toLocaleString()}</Text>
        </View>
        <View style={styles.leaderboardStat}>
          <Text style={styles.statValue}>🔥 {item.streak}</Text>
          <Text style={[styles.trendIcon, { color: item.trend === 'up' ? colors.dark.success : item.trend === 'down' ? colors.dark.error : colors.dark.textTertiary }]}>
            {getTrendIcon(item.trend)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAvatar}>
          <Text style={styles.avatarEmoji}>{item.userAvatar}</Text>
        </View>
        <View style={styles.postUserInfo}>
          <Text style={styles.postUserName}>{item.userName}</Text>
          <Text style={styles.postTimestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.postTypeIcon}>{getPostIcon(item.type)}</Text>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.postAction}>
          <Text style={[styles.postActionIcon, item.liked && styles.postActionIconLiked]}>{item.liked ? '❤️' : '🤍'}</Text>
          <Text style={styles.postActionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postAction}>
          <Text style={styles.postActionIcon}>💬</Text>
          <Text style={styles.postActionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postAction}>
          <Text style={styles.postActionIcon}>🔄</Text>
          <Text style={styles.postActionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <FlatList
            data={MOCK_POSTS}
            renderItem={renderPost}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
            }
          />
        );
      case 'friends':
        return (
          <>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends..."
                placeholderTextColor={colors.dark.textTertiary}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <FlatList
              data={MOCK_FRIENDS}
              renderItem={renderFriend}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
              }
            />
          </>
        );
      case 'challenges':
        return (
          <FlatList
            data={MOCK_CHALLENGES}
            renderItem={renderChallenge}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
            }
          />
        );
      case 'leaderboard':
        return (
          <FlatList
            data={MOCK_LEADERBOARD}
            renderItem={renderLeaderboardEntry}
            keyExtractor={item => item.rank.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
            }
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
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerSubtitle}>Connect, compete, and grow together</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['feed', 'friends', 'challenges', 'leaderboard'].map((tab) => (
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
      <View style={styles.content}>
        {renderContent()}
      </View>
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
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.dark.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.dark.white,
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSizes.base,
    color: colors.dark.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 36,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.dark.surface,
  },
  friendInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  friendName: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  friendUsername: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  friendStats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  friendStat: {
    backgroundColor: colors.dark.gray700,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  friendStatValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  challengeCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  challengeTypeBadge: {
    backgroundColor: colors.dark.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  challengeTypeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '600',
    color: colors.dark.primary,
    textTransform: 'capitalize',
  },
  challengePrize: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.accent,
  },
  challengeName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
  },
  challengeDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textSecondary,
    marginBottom: spacing.md,
  },
  challengeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  challengeDates: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  challengeParticipants: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  challengeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.dark.gray700,
    borderRadius: 3,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.dark.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.primary,
    width: 40,
    textAlign: 'right',
  },
  joinButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.base,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: colors.dark.gray700,
  },
  joinButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.white,
  },
  joinedButtonText: {
    color: colors.dark.textSecondary,
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  topThreeCard: {
    backgroundColor: colors.dark.primary + '10',
    borderWidth: 1,
    borderColor: colors.dark.primary + '30',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark.textSecondary,
  },
  rank1Text: {
    fontSize: 24,
  },
  rank2Text: {
    fontSize: 22,
  },
  rank3Text: {
    fontSize: 20,
  },
  leaderboardAvatar: {
    marginLeft: spacing.sm,
  },
  leaderboardInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  leaderboardName: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  leaderboardUsername: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  leaderboardStats: {
    alignItems: 'flex-end',
  },
  leaderboardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  trendIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  postCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postUserInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  postUserName: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  postTimestamp: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
  postTypeIcon: {
    fontSize: 24,
  },
  postContent: {
    fontSize: typography.fontSizes.base,
    color: colors.dark.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    paddingTop: spacing.md,
  },
  postAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  postActionIcon: {
    fontSize: 18,
  },
  postActionIconLiked: {
    color: colors.dark.error,
  },
  postActionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
});

export default SocialScreen;
