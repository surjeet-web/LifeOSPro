// ============================================================================
// LEARNING & KNOWLEDGE SCREEN FOR LifeOS Pro
// 70,000+ Lines Edition - Learning Management System
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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../../utils/theme';

const { width } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: number;
  lessons: number;
  enrolled: number;
  rating: number;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'exercise';
  duration: number;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  completed: boolean;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  deck: string;
  nextReview?: string;
  ease: number;
  interval: number;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  dueCount: number;
  newCount: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: number;
  duration: number;
  level: string;
  skills: string[];
}

interface Certificate {
  id: string;
  courseName: string;
  date: string;
  credentialId: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_COURSES: Course[] = [
  { id: '1', title: 'React Native Masterclass', description: 'Build cross-platform mobile apps with React Native', thumbnail: '📱', instructor: 'John Smith', duration: 1200, lessons: 45, enrolled: 12500, rating: 4.8, progress: 65, status: 'in-progress', difficulty: 'intermediate', category: 'Development', tags: ['react', 'mobile', 'javascript'] },
  { id: '2', title: 'Machine Learning Fundamentals', description: 'Introduction to ML algorithms and concepts', thumbnail: '🤖', instructor: 'Dr. Sarah Johnson', duration: 1800, lessons: 60, enrolled: 8900, rating: 4.9, progress: 0, status: 'not-started', difficulty: 'advanced', category: 'Data Science', tags: ['ml', 'ai', 'python'] },
  { id: '3', title: 'UI/UX Design Principles', description: 'Learn professional design fundamentals', thumbnail: '🎨', instructor: 'Emily Chen', duration: 900, lessons: 35, enrolled: 15600, rating: 4.7, progress: 100, status: 'completed', difficulty: 'beginner', category: 'Design', tags: ['design', 'ui', 'ux'] },
  { id: '4', title: 'Python for Data Analysis', description: 'Master Python for data science', thumbnail: '🐍', instructor: 'Michael Brown', duration: 1500, lessons: 52, enrolled: 22400, rating: 4.8, progress: 30, status: 'in-progress', difficulty: 'intermediate', category: 'Data Science', tags: ['python', 'pandas', 'numpy'] },
  { id: '5', title: 'Product Management 101', description: 'Become an effective product manager', thumbnail: '📦', instructor: 'Lisa Wang', duration: 720, lessons: 28, enrolled: 6700, rating: 4.6, progress: 0, status: 'not-started', difficulty: 'beginner', category: 'Business', tags: ['pm', 'product', 'strategy'] },
  { id: '6', title: 'Advanced TypeScript', description: 'Master TypeScript for large-scale apps', thumbnail: '💎', instructor: 'David Kim', duration: 960, lessons: 40, enrolled: 9800, rating: 4.9, progress: 85, status: 'in-progress', difficulty: 'advanced', category: 'Development', tags: ['typescript', 'javascript', 'coding'] },
];

const MOCK_MODULES: Module[] = [
  { id: '1', title: 'Getting Started', completed: true, lessons: [{ id: '1-1', title: 'Introduction to React Native', type: 'video', duration: 15, completed: true }, { id: '1-2', title: 'Setting Up Environment', type: 'article', duration: 10, completed: true }, { id: '1-3', title: 'Your First App', type: 'exercise', duration: 20, completed: true }] },
  { id: '2', title: 'Core Components', completed: true, lessons: [{ id: '2-1', title: 'Understanding Components', type: 'video', duration: 18, completed: true }, { id: '2-2', title: 'Props and State', type: 'video', duration: 22, completed: true }, { id: '2-3', title: 'Component Quiz', type: 'quiz', duration: 10, completed: false }] },
  { id: '3', title: 'Navigation', completed: false, lessons: [{ id: '3-1', title: 'Stack Navigation', type: 'video', duration: 20, completed: false }, { id: '3-2', title: 'Tab Navigation', type: 'video', duration: 18, completed: false }, { id: '3-3', title: 'Navigation Exercise', type: 'exercise', duration: 25, completed: false }] },
];

const MOCK_DECKS: Deck[] = [
  { id: '1', name: 'React Native Basics', description: 'Core concepts of React Native', cardCount: 150, dueCount: 25, newCount: 10 },
  { id: '2', name: 'JavaScript Patterns', description: 'Common JS design patterns', cardCount: 80, dueCount: 15, newCount: 5 },
  { id: '3', name: 'Technical Interview', description: 'Common interview questions', cardCount: 200, dueCount: 40, newCount: 20 },
  { id: '4', name: 'UX Principles', description: 'Design fundamentals', cardCount: 120, dueCount: 10, newCount: 8 },
];

const MOCK_FLASHCARDS: Flashcard[] = [
  { id: '1', front: 'What is a Component?', back: 'A reusable UI element that can accept inputs (props) and return React elements', deck: 'React Native Basics', ease: 2.5, interval: 4 },
  { id: '2', front: 'What is State?', back: 'An object that holds data that can change over time in a component', deck: 'React Native Basics', ease: 2.6, interval: 6 },
  { id: '3', front: 'What are Props?', back: 'Read-only properties passed from parent to child components', deck: 'React Native Basics', ease: 2.4, interval: 3 },
  { id: '4', front: 'What is useEffect?', back: 'A hook for performing side effects in function components', deck: 'React Native Basics', ease: 2.5, interval: 5 },
  { id: '5', front: 'What is Virtual DOM?', back: 'A lightweight copy of the actual DOM that React uses for efficient updates', deck: 'React Native Basics', ease: 2.3, interval: 2 },
];

const MOCK_LEARNING_PATHS: LearningPath[] = [
  { id: '1', title: 'Full-Stack Developer', description: 'Become a complete developer', courses: 8, duration: 120, level: 'Intermediate', skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'] },
  { id: '2', title: 'Data Scientist', description: 'Master data analysis and ML', courses: 6, duration: 100, level: 'Advanced', skills: ['Python', 'Statistics', 'Machine Learning', 'Visualization'] },
  { id: '3', title: 'UX Designer', description: 'Learn professional design', courses: 5, duration: 60, level: 'Beginner', skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'] },
];

const MOCK_CERTIFICATES: Certificate[] = [
  { id: '1', courseName: 'UI/UX Design Principles', date: '2024-01-10', credentialId: 'CERT-2024-001' },
  { id: '2', courseName: 'JavaScript Fundamentals', date: '2023-12-15', credentialId: 'CERT-2023-156' },
  { id: '3', courseName: 'Introduction to Python', date: '2023-11-20', credentialId: 'CERT-2023-089' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const LearningScreen: React.FC<any> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'decks' | 'paths' | 'certificates'>('courses');
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
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
  
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.dark.success;
      case 'intermediate': return colors.dark.warning;
      case 'advanced': return colors.dark.error;
      default: return colors.dark.textTertiary;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.dark.success;
      case 'in-progress': return colors.dark.primary;
      default: return colors.dark.textTertiary;
    }
  };
  
  const renderCourse = ({ item }: { item: Course }) => (
    <TouchableOpacity style={styles.courseCard}>
      <View style={styles.courseThumbnail}>
        <Text style={styles.courseThumbnailEmoji}>{item.thumbnail}</Text>
      </View>
      <View style={styles.courseInfo}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>{item.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.courseInstructor}>by {item.instructor}</Text>
        <Text style={styles.courseDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.courseMeta}>
          <View style={styles.courseStat}>
            <Ionicons name="time-outline" size={16} color={colors.dark.textSecondary} />
            <Text style={styles.courseStatText}>{formatDuration(item.duration)}</Text>
          </View>
          <View style={styles.courseStat}>
            <Ionicons name="book-outline" size={16} color={colors.dark.textSecondary} />
            <Text style={styles.courseStatText}>{item.lessons} lessons</Text>
          </View>
          <View style={styles.courseStat}>
            <Ionicons name="star" size={16} color={colors.dark.warning} />
            <Text style={styles.courseStatText}>{item.rating}</Text>
          </View>
        </View>
        {item.progress > 0 && (
          <View style={styles.courseProgress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        )}
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderDeck = ({ item }: { item: Deck }) => (
    <TouchableOpacity style={styles.deckCard}>
      <View style={styles.deckIcon}>
        <Ionicons name="albums-outline" size={24} color={colors.dark.primary} />
      </View>
      <View style={styles.deckInfo}>
        <Text style={styles.deckName}>{item.name}</Text>
        <Text style={styles.deckDescription}>{item.description}</Text>
        <View style={styles.deckStats}>
          <View style={styles.deckStat}>
            <Text style={styles.deckStatValue}>{item.cardCount}</Text>
            <Text style={styles.deckStatLabel}>cards</Text>
          </View>
          {item.dueCount > 0 && (
            <View style={[styles.deckStat, styles.deckStatDue]}>
              <Text style={styles.deckStatValue}>{item.dueCount}</Text>
              <Text style={styles.deckStatLabel}>due</Text>
            </View>
          )}
          {item.newCount > 0 && (
            <View style={[styles.deckStat, styles.deckStatNew]}>
              <Text style={styles.deckStatValue}>+{item.newCount}</Text>
              <Text style={styles.deckStatLabel}>new</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderLearningPath = ({ item }: { item: LearningPath }) => (
    <TouchableOpacity style={styles.pathCard}>
      <View style={styles.pathHeader}>
        <Text style={styles.pathTitle}>{item.title}</Text>
        <View style={styles.pathLevelBadge}>
          <Text style={styles.pathLevelText}>{item.level}</Text>
        </View>
      </View>
      <Text style={styles.pathDescription}>{item.description}</Text>
      <View style={styles.pathMeta}>
        <View style={styles.pathMetaItem}>
          <Ionicons name="book-outline" size={14} color={colors.dark.textSecondary} />
          <Text style={styles.pathMetaText}> {item.courses} courses</Text>
        </View>
        <View style={styles.pathMetaItem}>
          <Ionicons name="time-outline" size={14} color={colors.dark.textSecondary} />
          <Text style={styles.pathMetaText}> {item.duration}h</Text>
        </View>
      </View>
      <View style={styles.pathSkills}>
        {item.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillTagText}>{skill}</Text>
          </View>
        ))}
        {item.skills.length > 3 && (
          <View style={styles.skillTag}>
            <Text style={styles.skillTagText}>+{item.skills.length - 3}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  
  const renderCertificate = ({ item }: { item: Certificate }) => (
    <TouchableOpacity style={styles.certificateCard}>
      <View style={styles.certificateIcon}>
        <Ionicons name="trophy" size={24} color={colors.dark.warning} />
      </View>
      <View style={styles.certificateInfo}>
        <Text style={styles.certificateTitle}>{item.courseName}</Text>
        <Text style={styles.certificateDate}>Completed {item.date}</Text>
        <Text style={styles.certificateId}>ID: {item.credentialId}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  const renderFlashcardStudy = () => {
    const card = MOCK_FLASHCARDS[currentCard];
    
    return (
      <View style={styles.flashcardContainer}>
        <View style={styles.flashcardProgress}>
          <Text style={styles.flashcardProgressText}>
            {currentCard + 1} / {MOCK_FLASHCARDS.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentCard + 1) / MOCK_FLASHCARDS.length) * 100}%` }]} />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.flashcard}
          onPress={() => setShowAnswer(!showAnswer)}
          activeOpacity={0.9}
        >
          <Text style={styles.flashcardLabel}>Question</Text>
          <Text style={styles.flashcardText}>{card?.front}</Text>
          
          {showAnswer && (
            <View style={styles.answerContainer}>
              <Text style={styles.answerLabel}>Answer</Text>
              <Text style={styles.answerText}>{card?.back}</Text>
            </View>
          )}
          
          <Text style={styles.tapHint}>
            {showAnswer ? 'Tap to hide' : 'Tap to reveal answer'}
          </Text>
        </TouchableOpacity>
        
        {showAnswer && (
          <View style={styles.flashcardButtons}>
            <TouchableOpacity 
              style={[styles.flashcardButton, styles.flashcardButtonHard]}
              onPress={() => {
                setShowAnswer(false);
                setCurrentCard((currentCard + 1) % MOCK_FLASHCARDS.length);
              }}
            >
              <Text style={styles.flashcardButtonText}>Hard</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.flashcardButton, styles.flashcardButtonGood]}
              onPress={() => {
                setShowAnswer(false);
                setCurrentCard((currentCard + 1) % MOCK_FLASHCARDS.length);
              }}
            >
              <Text style={styles.flashcardButtonText}>Good</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.flashcardButton, styles.flashcardButtonEasy]}
              onPress={() => {
                setShowAnswer(false);
                setCurrentCard((currentCard + 1) % MOCK_FLASHCARDS.length);
              }}
            >
              <Text style={styles.flashcardButtonText}>Easy</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search courses..."
                placeholderTextColor={colors.dark.textTertiary}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <FlatList
              data={MOCK_COURSES}
              renderItem={renderCourse}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
              }
            />
          </>
        );
      case 'decks':
        return (
          <>
            {renderFlashcardStudy()}
            <View style={styles.decksSection}>
              <Text style={styles.sectionTitle}>Your Decks</Text>
              <FlatList
                data={MOCK_DECKS}
                renderItem={renderDeck}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
              />
            </View>
          </>
        );
      case 'paths':
        return (
          <FlatList
            data={MOCK_LEARNING_PATHS}
            renderItem={renderLearningPath}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />
            }
          />
        );
      case 'certificates':
        return (
          <FlatList
            data={MOCK_CERTIFICATES}
            renderItem={renderCertificate}
            keyExtractor={item => item.id}
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
          <Text style={styles.headerTitle}>Learning</Text>
          <Text style={styles.headerSubtitle}>Expand your knowledge</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['courses', 'decks', 'paths', 'certificates'].map((tab) => (
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
      {renderContent()}
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
  courseCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  courseThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: colors.dark.primary + '20',
    borderRadius: borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  courseThumbnailEmoji: {
    fontSize: 48,
  },
  courseInfo: {},
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  courseTitle: {
    flex: 1,
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginRight: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  difficultyText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  courseInstructor: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.primary,
    marginBottom: spacing.xs,
  },
  courseDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textSecondary,
    marginBottom: spacing.md,
  },
  courseMeta: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  courseStatIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  courseStatText: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  courseProgress: {
    flexDirection: 'row',
    alignItems: 'center',
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
  statusBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  flashcardContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  flashcardProgress: {
    marginBottom: spacing.md,
  },
  flashcardProgressText: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  flashcard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    minHeight: 200,
    ...shadows.lg,
  },
  flashcardLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
    marginBottom: spacing.sm,
  },
  flashcardText: {
    fontSize: typography.fontSizes.xl,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    textAlign: 'center',
  },
  tapHint: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  answerContainer: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  answerLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.primary,
    marginBottom: spacing.sm,
  },
  answerText: {
    fontSize: typography.fontSizes.lg,
    color: colors.dark.textPrimary,
    lineHeight: 24,
  },
  flashcardButtons: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  flashcardButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.base,
    alignItems: 'center',
  },
  flashcardButtonHard: {
    backgroundColor: colors.dark.error + '20',
  },
  flashcardButtonGood: {
    backgroundColor: colors.dark.primary + '20',
  },
  flashcardButtonEasy: {
    backgroundColor: colors.dark.success + '20',
  },
  flashcardButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  decksSection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: spacing.md,
  },
  deckCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  deckIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dark.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  deckIconText: {
    fontSize: 28,
  },
  deckInfo: {
    flex: 1,
  },
  deckName: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: 2,
  },
  deckDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
    marginBottom: spacing.sm,
  },
  deckStats: {
    flexDirection: 'row',
  },
  deckStat: {
    marginRight: spacing.md,
  },
  deckStatDue: {
    backgroundColor: colors.dark.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  deckStatNew: {
    backgroundColor: colors.dark.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  deckStatValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  deckStatLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
  pathCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  pathTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  pathLevelBadge: {
    backgroundColor: colors.dark.secondary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  pathLevelText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '600',
    color: colors.dark.secondary,
  },
  pathDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textSecondary,
    marginBottom: spacing.md,
  },
  pathMeta: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  pathMetaText: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
    marginRight: spacing.md,
  },
  pathSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  skillTag: {
    backgroundColor: colors.dark.gray700,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  skillTagText: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textSecondary,
  },
  certificateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  certificateIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dark.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  certificateIconText: {
    fontSize: 28,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: 2,
  },
  certificateDate: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
    marginBottom: 2,
  },
  certificateId: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  viewButton: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.base,
  },
  viewButtonText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.white,
  },
});

export default LearningScreen;
