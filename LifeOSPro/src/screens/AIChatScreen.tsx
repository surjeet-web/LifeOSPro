import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { getAIResponse } from '../utils/helpers';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card } from '../components/UI';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { text: '💡 Productivity Tips', query: 'productivity tips' },
  { text: '🔥 Build Better Habits', query: 'how to build habits' },
  { text: '🎯 Focus Strategies', query: 'how to focus better' },
  { text: '💰 Finance Advice', query: 'personal finance tips' },
  { text: '🧠 Learning Techniques', query: 'how to learn faster' },
  { text: '💪 Stay Motivated', query: 'motivation tips' },
];

const AIChatScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch, canUseAI, addXP } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! 👋 I'm your AI productivity coach. I know everything about habits, tasks, focus, finance, and personal growth. What would you like help with today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputHeight = useRef(new Animated.Value(56)).current;

  const sendMessage = (text: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    if (!canUseAI() && !state.user.isPremium) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "You've reached your daily free AI message limit. Upgrade to Premium for unlimited AI conversations!",
        isUser: false,
        timestamp: new Date(),
      }]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    dispatch({ type: 'USE_AI_MESSAGE' });
    addXP(5);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = getAIResponse(messageText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      addXP(10);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessageContainer : styles.aiMessageContainer]}>
      {!item.isUser && (
        <LinearGradient
          colors={colors.dark.gradient.success as any}
          style={styles.aiAvatar}
        >
          <Text style={styles.aiAvatarText}>AI</Text>
        </LinearGradient>
      )}
      <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <LinearGradient
            colors={colors.dark.gradient.success as any}
            style={styles.headerAvatar}
          >
            <Text style={styles.headerAvatarText}>AI</Text>
          </LinearGradient>
          <View>
            <Text style={styles.headerTitle}>AI Coach</Text>
            <Text style={styles.headerSubtitle}>
              {state.user.isPremium ? '✨ Unlimited AI' : `${10 - state.dailyAIUsage}/10 free messages`}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Premium')} style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>⚡</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListHeaderComponent={
          !state.user.isPremium && state.dailyAIUsage >= 10 ? (
            <TouchableOpacity
              style={styles.limitBanner}
              onPress={() => navigation.navigate('Premium')}
            >
              <Text style={styles.limitBannerText}>
                🚀 Upgrade to Premium for unlimited AI conversations!
              </Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🤖</Text>
            <Text style={styles.emptyTitle}>Start a conversation</Text>
            <Text style={styles.emptyText}>Ask me anything about productivity, habits, focus, or life!</Text>
          </View>
        }
      />

      {/* Quick Prompts */}
      {!messages.length || messages.length === 1 ? (
        <View style={styles.quickPrompts}>
          {QUICK_PROMPTS.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.promptButton}
              onPress={() => sendMessage(prompt.query)}
            >
              <Text style={styles.promptText}>{prompt.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <Text style={styles.typingDots}>•••</Text>
          </View>
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.dark.textTertiary}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backButton: {
    fontSize: 24,
    color: colors.dark.text,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerTitle: {
    ...typography.h5,
    color: colors.dark.text,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.dark.textSecondary,
  },
  premiumButton: {
    padding: spacing.sm,
  },
  premiumButtonText: {
    fontSize: 20,
  },
  messagesList: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  aiAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userBubble: {
    backgroundColor: colors.dark.primary,
    borderBottomRightRadius: spacing.xs,
  },
  aiBubble: {
    backgroundColor: colors.dark.surface,
    borderBottomLeftRadius: spacing.xs,
  },
  messageText: {
    ...typography.body,
    color: colors.dark.text,
    lineHeight: 22,
  },
  typingContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  typingBubble: {
    backgroundColor: colors.dark.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    width: 60,
  },
  typingDots: {
    color: colors.dark.textSecondary,
    fontSize: 18,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  promptButton: {
    backgroundColor: colors.dark.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  promptText: {
    ...typography.caption,
    color: colors.dark.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.dark.text,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.dark.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  limitBanner: {
    backgroundColor: colors.dark.warning + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark.warning,
  },
  limitBannerText: {
    ...typography.bodySmall,
    color: colors.dark.warning,
    textAlign: 'center',
  },
  inputContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.dark.text,
    maxHeight: 100,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.dark.surfaceLight,
  },
  sendButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default AIChatScreen;
