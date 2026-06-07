// ============================================================================
// AI ASSISTANT SCREEN FOR LifeOS Pro
// 70,000+ Lines Edition - AI-Powered Productivity Assistant
// ============================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../../utils/theme';
import { useAppStore } from '../../../context/AppContext';

const { width, height } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
  category: 'productivity' | 'health' | 'learning' | 'finance' | 'creative' | 'wellness';
}

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// QUICK ACTIONS DATA
// ============================================================================

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    title: 'Summarize My Day',
    description: 'Get an AI summary of your productivity today',
    icon: '📊',
    prompt: 'Summarize my productivity for today including tasks completed, habits tracked, and focus sessions.',
    category: 'productivity',
  },
  {
    id: '2',
    title: 'Task Suggestions',
    description: 'AI recommends what to work on next',
    icon: '💡',
    prompt: 'Based on my current tasks and priorities, what should I work on next?',
    category: 'productivity',
  },
  {
    id: '3',
    title: 'Health Tips',
    description: 'Personalized wellness recommendations',
    icon: '💪',
    prompt: 'Give me personalized health and wellness tips based on my activity and habits.',
    category: 'health',
  },
  {
    id: '4',
    title: 'Study Plan',
    description: 'Create a custom learning schedule',
    icon: '📚',
    prompt: 'Create an effective study plan for learning a new skill. Include daily goals and best practices.',
    category: 'learning',
  },
  {
    id: '5',
    title: 'Budget Advice',
    description: 'Financial insights and recommendations',
    icon: '💰',
    prompt: 'Analyze my spending patterns and provide financial advice to save money.',
    category: 'finance',
  },
  {
    id: '6',
    title: 'Creative Writing',
    description: 'Get help with creative projects',
    icon: '✍️',
    prompt: 'Help me brainstorm ideas for my creative writing project.',
    category: 'creative',
  },
  {
    id: '7',
    title: 'Meditation Guide',
    description: 'Guided mindfulness session',
    icon: '🧘',
    prompt: 'Guide me through a 5-minute mindfulness meditation session.',
    category: 'wellness',
  },
  {
    id: '8',
    title: 'Goal Planning',
    description: 'Break down big goals into steps',
    icon: '🎯',
    prompt: 'Help me break down my main goal into actionable daily steps.',
    category: 'productivity',
  },
];

// ============================================================================
// AI FEATURES DATA
// ============================================================================

const AI_FEATURES: AIFeature[] = [
  { id: '1', name: 'Smart Scheduling', description: 'AI optimizes your calendar', icon: '📅', enabled: true },
  { id: '2', name: 'Auto Categorization', description: 'Automatically categorize tasks', icon: '🏷️', enabled: true },
  { id: '3', name: 'Smart Reminders', description: 'Context-aware notifications', icon: '🔔', enabled: true },
  { id: '4', name: 'Progress Prediction', description: 'Predict goal completion', icon: '📈', enabled: true },
  { id: '5', name: 'Energy Tracking', description: 'Optimize work sessions', icon: '⚡', enabled: false },
  { id: '6', name: 'Habit Coaching', description: 'AI habit formation coach', icon: '🌱', enabled: true },
  { id: '7', name: 'Focus Music', description: 'AI-generated focus playlists', icon: '🎵', enabled: false },
  { id: '8', name: 'Journal Analysis', description: 'AI-powered insights', icon: '📓', enabled: true },
];

// ============================================================================
// LOCAL ML ENGINE (Simulated)
// ============================================================================

const generateLocalResponse = (prompt: string, userData: any): string => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Task-related responses
  if (lowerPrompt.includes('task') || lowerPrompt.includes('todo')) {
    const pendingTasks = userData.tasks?.filter((t: any) => t.status !== 'completed') || [];
    const highPriority = pendingTasks.filter((t: any) => t.priority === 'high' || t.priority === 'urgent');
    
    if (highPriority.length > 0) {
      return `Based on your current tasks, I recommend focusing on "${highPriority[0].title}" which is marked as high priority. You have ${pendingTasks.length} tasks pending, of which ${highPriority.length} are high priority.`;
    }
    return `You have ${pendingTasks.length} pending tasks. Consider breaking down any large tasks into smaller, manageable subtasks for better progress.`;
  }
  
  // Habit-related responses
  if (lowerPrompt.includes('habit') || lowerPrompt.includes('streak')) {
    const habits = userData.habits || [];
    const todayCompleted = habits.filter((h: any) => h.completions?.some((c: any) => c.date === new Date().toISOString().split('T')[0]));
    
    if (todayCompleted.length > 0) {
      return `Great job! You've completed ${todayCompleted.length} habits today. Your current streak is ${userData.userStreak?.current || 0} days. Keep the momentum going!`;
    }
    return `You haven't logged any habits yet today. Consider completing your morning meditation or workout to start your streak.`;
  }
  
  // Focus-related responses
  if (lowerPrompt.includes('focus') || lowerPrompt.includes('pomodoro') || lowerPrompt.includes('concentrate')) {
    const focusMinutes = userData.analytics?.totalFocusMinutes || 0;
    const todaySessions = userData.focusSessions?.length || 0;
    
    return `Your total focus time is ${focusMinutes} minutes. Based on your patterns, you're most productive in the morning. Would you like me to start a focus session?`;
  }
  
  // Finance-related responses
  if (lowerPrompt.includes('money') || lowerPrompt.includes('finance') || lowerPrompt.includes('budget') || lowerPrompt.includes('spend')) {
    const transactions = userData.transactions || [];
    const thisMonth = transactions.filter((t: any) => t.date.startsWith(new Date().toISOString().slice(0, 7)));
    const expenses = thisMonth.filter((t: any) => t.type === 'expense');
    const income = thisMonth.filter((t: any) => t.type === 'income');
    
    const totalExpenses = expenses.reduce((sum: number, t: any) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum: number, t: any) => sum + t.amount, 0);
    
    return `This month's spending: $${totalExpenses.toFixed(2)} vs income: $${totalIncome.toFixed(2)}. Your savings rate is ${((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)}%.`;
  }
  
  // Goal-related responses
  if (lowerPrompt.includes('goal') || lowerPrompt.includes('milestone')) {
    const goals = userData.goals || [];
    const activeGoals = goals.filter((g: any) => g.status === 'active');
    
    if (activeGoals.length > 0) {
      const progress = activeGoals.map((g: any) => `${g.title}: ${g.progress}%`).join(', ');
      return `Your active goals: ${progress}. Keep pushing forward!`;
    }
    return "You don't have any active goals. Setting clear goals is the first step to achievement. Would you like help creating one?";
  }
  
  // Health-related responses
  if (lowerPrompt.includes('health') || lowerPrompt.includes('workout') || lowerPrompt.includes('exercise') || lowerPrompt.includes('sleep')) {
    return `Based on your activity data, aim for at least 30 minutes of moderate exercise daily. Remember to stay hydrated and get 7-9 hours of sleep for optimal performance.`;
  }
  
  // Learning-related responses
  if (lowerPrompt.includes('learn') || lowerPrompt.includes('study') || lowerPrompt.includes('course')) {
    return `Learning new skills is great for brain health! Consider dedicating at least 25 minutes daily to focused learning using techniques like spaced repetition.`;
  }
  
  // Motivational responses
  if (lowerPrompt.includes('motivate') || lowerPrompt.includes('inspire') || lowerPrompt.includes('encourage')) {
    const streak = userData.userStreak?.current || 0;
    return streak > 0 
      ? `You're on a ${streak}-day streak! Consistency is key to success. Keep showing up every day! 🌟`
      : `Every expert was once a beginner. Start small today, and watch yourself grow into who you want to become! 🌱`;
  }
  
  // Default response
  const responses = [
    "I'm here to help you optimize your productivity! Ask me about your tasks, habits, goals, or anything else.",
    "Great question! Let me analyze your data and provide personalized insights.",
    "I'd be happy to help with that! Here's what I recommend based on your patterns.",
    "Based on your recent activity, here's some actionable advice for you.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AIAssistantScreen: React.FC<any> = ({ navigation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hello! I'm your AI Productivity Assistant. I can help you with:\n\n• Analyzing your tasks and suggesting what to work on next\n• Tracking your habits and streaks\n• Providing health and wellness tips\n• Helping with financial planning\n• Creating study plans\n• And much more!\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showFeatures, setShowFeatures] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [credits, setCredits] = useState(100);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  
  const { tasks, habits, transactions, goals, focusSessions, analytics, userStreak, aiCredits, useAICredits } = useAppStore();
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowQuickActions(false);
    setIsLoading(true);
    
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    const userData = { tasks, habits, transactions, goals, focusSessions, analytics, userStreak };
    const response = generateLocalResponse(inputText.trim(), userData);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
    scrollToBottom();
    
    // Use credits
    if (credits > 0) {
      setCredits(prev => Math.max(0, prev - 1));
    }
  }, [inputText, isLoading, tasks, habits, transactions, goals, focusSessions, analytics, userStreak, credits]);
  
  const handleQuickAction = useCallback((action: QuickAction) => {
    setInputText(action.prompt);
    inputRef.current?.focus();
  }, []);
  
  const handleNewChat = useCallback(() => {
    if (messages.length > 1) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: messages[0]?.content?.slice(0, 30) || 'New Chat',
        messages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations(prev => [newConversation, ...prev]);
    }
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hello! I'm your AI Productivity Assistant. What would you like help with today?",
      timestamp: new Date(),
    }]);
    setShowQuickActions(true);
  }, [messages]);
  
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
          { opacity: fadeAnim },
        ]}
      >
        <View style={[styles.avatarContainer, isUser ? styles.userAvatar : styles.assistantAvatar]}>
          <Text style={styles.avatarText}>{isUser ? '👤' : '🤖'}</Text>
        </View>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
            {item.content}
          </Text>
          <Text style={styles.timestamp}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </Animated.View>
    );
  };
  
  const renderQuickAction = ({ item }: { item: QuickAction }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={() => handleQuickAction(item)}>
      <View style={styles.quickActionIcon}>
        <Text style={styles.quickActionEmoji}>{item.icon}</Text>
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{item.title}</Text>
        <Text style={styles.quickActionDesc}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Text style={styles.headerSubtitle}>Your personal productivity coach</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.creditsBadge}>
            <Text style={styles.creditsIcon}>⚡</Text>
            <Text style={styles.creditsText}>{credits}</Text>
          </View>
          <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
            <Text style={styles.newChatIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Quick Actions (Collapsible) */}
      {showQuickActions && messages.length <= 1 && (
        <Animated.View style={[styles.quickActionsContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={QUICK_ACTIONS}
            renderItem={renderQuickAction}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsList}
          />
        </Animated.View>
      )}
      
      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ListFooterComponent={
              isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.dark.primary} />
                  <Text style={styles.loadingText}>Thinking...</Text>
                </View>
              ) : null
            }
          />
        </ScrollView>
        
        {/* Input Area */}
        <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor={colors.dark.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>➤</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.dark.textPrimary,
  },
  headerTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  creditsIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  creditsText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.primary,
  },
  newChatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatIcon: {
    fontSize: 24,
    color: colors.dark.textPrimary,
  },
  quickActionsContainer: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  quickActionsList: {
    paddingHorizontal: spacing.lg,
  },
  quickActionCard: {
    width: 150,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.sm,
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: 2,
  },
  quickActionDesc: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    maxWidth: width - 32,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  userAvatar: {
    backgroundColor: colors.dark.primary,
  },
  assistantAvatar: {
    backgroundColor: colors.dark.secondary,
  },
  avatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: width * 0.7,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userBubble: {
    backgroundColor: colors.dark.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.dark.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: typography.fontSizes.base,
    lineHeight: 22,
  },
  userText: {
    color: colors.dark.white,
  },
  assistantText: {
    color: colors.dark.textPrimary,
  },
  timestamp: {
    fontSize: typography.fontSizes.xs,
    color: colors.dark.textTertiary,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  loadingText: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSizes.sm,
    color: colors.dark.textTertiary,
  },
  inputContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    backgroundColor: colors.dark.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSizes.base,
    color: colors.dark.textPrimary,
    maxHeight: 100,
    paddingVertical: spacing.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.dark.gray600,
  },
  sendButtonText: {
    fontSize: 18,
    color: colors.dark.white,
  },
});

export default AIAssistantScreen;
