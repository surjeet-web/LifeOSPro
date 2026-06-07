// ============================================================================
// ADVANCED CONTEXT & STATE MANAGEMENT FOR LifeOS Pro
// 70,000+ Lines Edition - Enterprise Grade State Management
// ============================================================================

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { Platform, Alert, Linking, Share, AsyncStorage, NetInfo, AppState, Dimensions } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================================================
// COMPREHENSIVE APP STATE
// ============================================================================

export interface AppState {
  // User State
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboardingCompleted: boolean;
  
  // Tasks
  tasks: ITask[];
  selectedTask: ITask | null;
  taskFilters: ITaskFilter;
  
  // Habits
  habits: IHabit[];
  selectedHabit: IHabit | null;
  habitFilters: IHabitFilter;
  
  // Finance
  transactions: ITransaction[];
  accounts: IAccount[];
  budgets: IBudget[];
  investments: IInvestment[];
  
  // Focus
  focusSessions: IFocusSession[];
  currentSession: IFocusSession | null;
  focusSettings: IFocusSettings;
  
  // Goals
  goals: IGoal[];
  selectedGoal: IGoal | null;
  
  // Notes
  notes: INote[];
  notebooks: INotebook[];
  selectedNote: INote | null;
  
  // Social
  connections: IConnection[];
  challenges: IChallenge[];
  leaderboards: ILeaderboard[];
  posts: IPost[];
  
  // Health
  healthMetrics: IHealthMetric[];
  sleepEntries: ISleepEntry[];
  exerciseEntries: IExerciseEntry[];
  nutritionEntries: INutritionEntry[];
  
  // Learning
  courses: ICourse[];
  learningPaths: ILearningPath[];
  flashcards: IFlashcard[];
  decks: IDeck[];
  
  // Projects
  projects: IProject[];
  selectedProject: IProject | null;
  
  // AI
  aiConversations: IAIConversation[];
  currentConversation: IAIConversation | null;
  aiCredits: number;
  mlModelLoaded: boolean;
  
  // Notifications
  notifications: INotification[];
  unreadCount: number;
  
  // Settings
  settings: IAppSettings;
  theme: ThemeMode;
  
  // Analytics
  analytics: IAnalytics;
  insights: IInsight[];
  
  // UI State
  sidebarOpen: boolean;
  activeTab: string;
  searchQuery: string;
  isSearchOpen: boolean;
  
  // Data Management
  lastSyncTime: Date | null;
  syncStatus: SyncStatus;
  isOffline: boolean;
  
  // Streaks
  userStreak: IUserStreak;
  achievements: IAchievement[];
  badges: IBadge[];
  
  // Subscription
  subscription: ISubscription | null;
  isPremium: boolean;
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string;
  startDate?: string;
  estimatedMinutes?: number;
  progress: number;
  tags: string[];
  subtasks: ISubtask[];
  assignees: string[];
  owner: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISubtask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'personal' | 'work' | 'health' | 'finance' | 'learning' | 'social' | 'creative' | 'other';

export interface ITaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: TaskCategory[];
  search?: string;
  dateRange?: { start: string; end: string };
}

export interface IHabit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  difficulty: HabitDifficulty;
  targetCount: number;
  currentCount: number;
  icon: string;
  color: string;
  startDate: string;
  streaks: IHabitStreaks;
  completions: IHabitCompletion[];
  createdAt: string;
  updatedAt: string;
}

export type HabitCategory = 'health' | 'fitness' | 'mindset' | 'learning' | 'productivity' | 'social' | 'finance' | 'creativity' | 'self-care' | 'other';
export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';
export type HabitDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface IHabitStreaks {
  current: number;
  longest: number;
  lastCompleted?: string;
}

export interface IHabitCompletion {
  id: string;
  date: string;
  completed: boolean;
  count?: number;
  notes?: string;
}

export interface IHabitFilter {
  category?: HabitCategory[];
  frequency?: HabitFrequency[];
  search?: string;
}

export interface ITransaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: Currency;
  date: string;
  description?: string;
  merchant?: string;
  accountId: string;
  tags: string[];
  createdAt: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer' | 'investment' | 'refund';
export type TransactionCategory = string;
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR' | 'AUD' | 'CAD';

export interface IAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency;
  institution?: string;
  color: string;
  icon: string;
  isActive: boolean;
}

export type AccountType = 'checking' | 'savings' | 'credit-card' | 'investment' | 'cash' | 'crypto';

export interface IBudget {
  id: string;
  name: string;
  category: TransactionCategory;
  amount: number;
  currency: Currency;
  period: BudgetPeriod;
  spent: number;
  isActive: boolean;
}

export type BudgetPeriod = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export interface IInvestment {
  id: string;
  name: string;
  type: InvestmentType;
  symbol?: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  currency: Currency;
}

export type InvestmentType = 'stock' | 'bond' | 'mutual-fund' | 'etf' | 'crypto' | 'real-estate' | 'commodity';

export interface IFocusSession {
  id: string;
  type: FocusSessionType;
  plannedMinutes: number;
  actualMinutes: number;
  startTime: string;
  endTime?: string;
  mood: number;
  productivity: number;
  linkedTasks: string[];
}

export type FocusSessionType = 'pomodoro' | 'deep-work' | 'quick-sprint' | 'custom';

export interface IFocusSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  notificationEnabled: boolean;
}

export interface IGoal {
  id: string;
  title: string;
  description?: string;
  status: GoalStatus;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  targetDate?: string;
  targetValue: number;
  currentValue: number;
  progress: number;
  milestones: IMilestone[];
  linkedTasks: string[];
  createdAt: string;
  updatedAt: string;
}

export type GoalStatus = 'active' | 'completed' | 'cancelled' | 'on-hold' | 'archived';
export type GoalCategory = 'career' | 'finance' | 'health' | 'learning' | 'personal' | 'relationships' | 'spiritual' | 'creative' | 'other';
export type GoalTimeframe = 'short-term' | 'medium-term' | 'long-term' | 'ongoing';

export interface IMilestone {
  id: string;
  title: string;
  targetDate?: string;
  targetValue: number;
  currentValue: number;
  completed: boolean;
}

export interface INote {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  status: NoteStatus;
  visibility: NoteVisibility;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  linkedTasks: string[];
  linkedGoals: string[];
  createdAt: string;
  updatedAt: string;
}

export type NoteType = 'text' | 'checklist' | 'code' | 'markdown' | 'drawing' | 'audio' | 'scanned';
export type NoteStatus = 'draft' | 'published' | 'archived' | 'deleted';
export type NoteVisibility = 'private' | 'connections' | 'public';

export interface INotebook {
  id: string;
  name: string;
  color: string;
  icon: string;
  notes: string[];
}

export interface IConnection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: ConnectionStatus;
  connectionType: ConnectionType;
  establishedAt?: string;
}

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';
export type ConnectionType = 'friend' | 'colleague' | 'mentor' | 'coach' | 'family';

export interface IChallenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  target: number;
  participants: IChallengeParticipant[];
}

export type ChallengeType = 'individual' | 'team' | 'global';
export type ChallengeStatus = 'active' | 'completed' | 'cancelled' | 'expired';

export interface IChallengeParticipant {
  userId: string;
  progress: number;
  rank: number;
  isWinner: boolean;
}

export interface ILeaderboard {
  id: string;
  name: string;
  metric: LeaderboardMetric;
  period: LeaderboardPeriod;
  entries: ILeaderboardEntry[];
}

export type LeaderboardMetric = 'points' | 'streak' | 'tasks' | 'focus' | 'habits' | 'fitness' | 'social';
export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all-time';

export interface ILeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  value: number;
  change: number;
}

export interface IPost {
  id: string;
  userId: string;
  type: PostType;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  isPinned: boolean;
  hashtags: string[];
  createdAt: string;
}

export type PostType = 'achievement' | 'milestone' | 'streak' | 'goal' | 'habit' | 'challenge' | 'general' | 'motivation' | 'tip';

export interface IHealthMetric {
  id: string;
  type: HealthMetricType;
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

export type HealthMetricType = 'weight' | 'height' | 'bmi' | 'blood-pressure' | 'heart-rate' | 'sleep' | 'steps' | 'calories' | 'water' | 'mood' | 'energy' | 'stress' | 'medication' | 'symptom' | 'exercise';

export interface ISleepEntry {
  id: string;
  sleepDuration: number;
  sleepQuality: SleepQuality;
  bedTime: string;
  wakeTime: string;
  date: string;
}

export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';

export interface IExerciseEntry {
  id: string;
  type: string;
  duration: number;
  calories: number;
  intensity: 'low' | 'moderate' | 'high';
  date: string;
}

export interface INutritionEntry {
  id: string;
  mealType: MealType;
  totalCalories: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  date: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface ICourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructorName: string;
  status: CourseStatus;
  progress: number;
  enrolledAt?: string;
  completedAt?: string;
  duration: number;
  modules: IModule[];
  rating: number;
  enrollmentCount: number;
  isFree: boolean;
  difficulty: DifficultyLevel;
}

export type CourseStatus = 'not-started' | 'in-progress' | 'completed' | 'paused' | 'abandoned';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface IModule {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  lessons: ILesson[];
  isLocked: boolean;
}

export interface ILesson {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  duration: number;
  order: number;
  isCompleted: boolean;
}

export type ContentType = 'video' | 'article' | 'quiz' | 'exercise' | 'project' | 'live' | 'podcast';

export interface ILearningPath {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  courses: ICourse[];
  duration: number;
  difficulty: DifficultyLevel;
  skills: string[];
}

export interface IFlashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  nextReview?: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface IDeck {
  id: string;
  name: string;
  description?: string;
  cards: IFlashcard[];
  cardCount: number;
  dueCount: number;
}

export interface IProject {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  type: ProjectType;
  startDate?: string;
  endDate?: string;
  progress: number;
  owner: string;
  members: IProjectMember[];
  tasks: string[];
  color: string;
  icon: string;
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'archived';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';
export type ProjectType = 'personal' | 'work' | 'team' | 'open-source' | 'client';

export interface IProjectMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer' | 'contractor';
  joinedAt: string;
}

export interface IAIConversation {
  id: string;
  title: string;
  messages: IAIConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface IAIConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 'task' | 'habit' | 'focus' | 'social' | 'finance' | 'achievement' | 'goal' | 'challenge' | 'system' | 'reminder' | 'leaderboard' | 'streak' | 'subscription' | 'security';

export type ThemeMode = 'light' | 'dark' | 'auto' | 'oled' | 'sepia' | 'high-contrast';

export interface IAppSettings {
  general: IGeneralSettings;
  appearance: IAppearanceSettings;
  notifications: INotificationSettings;
  privacy: IPrivacySettings;
  security: ISecuritySettings;
}

export interface IGeneralSettings {
  language: string;
  timezone: string;
  firstDayOfWeek: number;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export interface IAppearanceSettings {
  theme: ThemeMode;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  iconStyle: 'filled' | 'outline';
  animationLevel: 'minimal' | 'normal' | 'high';
}

export interface INotificationSettings {
  push: IPushNotificationSettings;
  email: IEmailNotificationSettings;
  inApp: IInAppNotificationSettings;
}

export interface IPushNotificationSettings {
  enabled: boolean;
  tasks: boolean;
  habits: boolean;
  focus: boolean;
  social: boolean;
  finance: boolean;
  achievements: boolean;
  streak: boolean;
}

export interface IEmailNotificationSettings {
  enabled: boolean;
  frequency: 'instant' | 'daily' | 'weekly' | 'monthly';
}

export interface IInAppNotificationSettings {
  enabled: boolean;
  showPreview: boolean;
  sound: boolean;
}

export interface IPrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showActivity: boolean;
  showStats: boolean;
  showAchievements: boolean;
  showOnLeaderboard: boolean;
}

export interface ISecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

export interface IAnalytics {
  productivityScore: number;
  consistencyScore: number;
  engagementScore: number;
  growthScore: number;
  totalTasksCompleted: number;
  totalHabitsTracked: number;
  totalFocusMinutes: number;
  weeklyActivity: IWeeklyActivity[];
}

export interface IWeeklyActivity {
  day: string;
  tasksCompleted: number;
  habitsCompleted: number;
  focusMinutes: number;
}

export interface IInsight {
  id: string;
  type: 'achievement' | 'suggestion' | 'warning' | 'trend' | 'comparison' | 'prediction';
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  subscription?: ISubscription;
}

export type UserRole = 'admin' | 'moderator' | 'premium' | 'free' | 'guest';

export interface ISubscription {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: string;
  endDate?: string;
}

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past-due' | 'trialing' | 'paused';
export type BillingCycle = 'monthly' | 'yearly' | 'lifetime';

export interface IUserStreak {
  current: number;
  longest: number;
  lastActivityDate?: string;
}

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'exclusive';
  earnedAt?: string;
}

export type AchievementCategory = 'tasks' | 'habits' | 'focus' | 'social' | 'finance' | 'learning' | 'streak' | 'milestone' | 'special';

export interface IBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  earnedAt?: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

// ============================================================================
// ACTIONS
// ============================================================================

export interface AppActions {
  // Auth
  login: (user: IUser) => void;
  logout: () => void;
  updateUser: (user: Partial<IUser>) => void;
  
  // Onboarding
  completeOnboarding: () => void;
  
  // Tasks
  addTask: (task: ITask) => void;
  updateTask: (id: string, updates: Partial<ITask>) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: ITask | null) => void;
  setTaskFilters: (filters: Partial<ITaskFilter>) => void;
  toggleTaskStatus: (id: string) => void;
  
  // Habits
  addHabit: (habit: IHabit) => void;
  updateHabit: (id: string, updates: Partial<IHabit>) => void;
  deleteHabit: (id: string) => void;
  setSelectedHabit: (habit: IHabit | null) => void;
  setHabitFilters: (filters: Partial<IHabitFilter>) => void;
  completeHabit: (id: string, date: string) => void;
  
  // Finance
  addTransaction: (transaction: ITransaction) => void;
  updateTransaction: (id: string, updates: Partial<ITransaction>) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: IAccount) => void;
  updateAccount: (id: string, updates: Partial<IAccount>) => void;
  deleteAccount: (id: string) => void;
  addBudget: (budget: IBudget) => void;
  updateBudget: (id: string, updates: Partial<IBudget>) => void;
  deleteBudget: (id: string) => void;
  addInvestment: (investment: IInvestment) => void;
  updateInvestment: (id: string, updates: Partial<IInvestment>) => void;
  deleteInvestment: (id: string) => void;
  
  // Focus
  startFocusSession: (session: IFocusSession) => void;
  updateFocusSession: (id: string, updates: Partial<IFocusSession>) => void;
  endFocusSession: (id: string) => void;
  updateFocusSettings: (settings: Partial<IFocusSettings>) => void;
  
  // Goals
  addGoal: (goal: IGoal) => void;
  updateGoal: (id: string, updates: Partial<IGoal>) => void;
  deleteGoal: (id: string) => void;
  setSelectedGoal: (goal: IGoal | null) => void;
  addMilestone: (goalId: string, milestone: IMilestone) => void;
  updateMilestone: (goalId: string, milestoneId: string, updates: Partial<IMilestone>) => void;
  
  // Notes
  addNote: (note: INote) => void;
  updateNote: (id: string, updates: Partial<INote>) => void;
  deleteNote: (id: string) => void;
  setSelectedNote: (note: INote | null) => void;
  addNotebook: (notebook: INotebook) => void;
  updateNotebook: (id: string, updates: Partial<INotebook>) => void;
  deleteNotebook: (id: string) => void;
  
  // Social
  addConnection: (connection: IConnection) => void;
  updateConnection: (id: string, updates: Partial<IConnection>) => void;
  removeConnection: (id: string) => void;
  joinChallenge: (challenge: IChallenge) => void;
  leaveChallenge: (challengeId: string) => void;
  addPost: (post: IPost) => void;
  likePost: (postId: string) => void;
  
  // Health
  addHealthMetric: (metric: IHealthMetric) => void;
  addSleepEntry: (entry: ISleepEntry) => void;
  addExerciseEntry: (entry: IExerciseEntry) => void;
  addNutritionEntry: (entry: INutritionEntry) => void;
  
  // Learning
  enrollCourse: (course: ICourse) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  addFlashcard: (flashcard: IFlashcard) => void;
  updateFlashcard: (id: string, updates: Partial<IFlashcard>) => void;
  deleteFlashcard: (id: string) => void;
  addDeck: (deck: IDeck) => void;
  updateDeck: (id: string, updates: Partial<IDeck>) => void;
  deleteDeck: (id: string) => void;
  
  // Projects
  addProject: (project: IProject) => void;
  updateProject: (id: string, updates: Partial<IProject>) => void;
  deleteProject: (id: string) => void;
  setSelectedProject: (project: IProject | null) => void;
  addProjectMember: (projectId: string, member: IProjectMember) => void;
  removeProjectMember: (projectId: string, userId: string) => void;
  
  // AI
  addAIConversation: (conversation: IAIConversation) => void;
  addAIMessage: (conversationId: string, message: IAIConversationMessage) => void;
  setCurrentConversation: (conversation: IAIConversation | null) => void;
  useAICredits: (amount: number) => void;
  setMLModelLoaded: (loaded: boolean) => void;
  
  // Notifications
  addNotification: (notification: INotification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Settings
  updateSettings: (settings: Partial<IAppSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
  
  // UI
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  
  // Data Management
  syncData: () => Promise<void>;
  setSyncStatus: (status: SyncStatus) => void;
  setOffline: (offline: boolean) => void;
  loadMockData: () => void;
  clearAllData: () => void;
  
  // Streaks & Achievements
  updateStreak: (streak: Partial<IUserStreak>) => void;
  addAchievement: (achievement: IAchievement) => void;
  addBadge: (badge: IBadge) => void;
  
  // Subscription
  setSubscription: (subscription: ISubscription | null) => void;
  setIsPremium: (isPremium: boolean) => void;
  
  // Bulk Operations
  bulkUpdateTasks: (updates: { id: string; updates: Partial<ITask> }[]) => void;
  bulkDeleteTasks: (ids: string[]) => void;
  bulkCompleteHabits: (habitIds: string[], date: string) => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  onboardingCompleted: false,
  
  tasks: [],
  selectedTask: null,
  taskFilters: {},
  
  habits: [],
  selectedHabit: null,
  habitFilters: {},
  
  transactions: [],
  accounts: [],
  budgets: [],
  investments: [],
  
  focusSessions: [],
  currentSession: null,
  focusSettings: {
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true,
    notificationEnabled: true,
  },
  
  goals: [],
  selectedGoal: null,
  
  notes: [],
  notebooks: [],
  selectedNote: null,
  
  connections: [],
  challenges: [],
  leaderboards: [],
  posts: [],
  
  healthMetrics: [],
  sleepEntries: [],
  exerciseEntries: [],
  nutritionEntries: [],
  
  courses: [],
  learningPaths: [],
  flashcards: [],
  decks: [],
  
  projects: [],
  selectedProject: null,
  
  aiConversations: [],
  currentConversation: null,
  aiCredits: 100,
  mlModelLoaded: false,
  
  notifications: [],
  unreadCount: 0,
  
  settings: {
    general: {
      language: 'en-US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      firstDayOfWeek: 0,
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '24h',
    },
    appearance: {
      theme: 'dark',
      accentColor: '#6366F1',
      fontSize: 'medium',
      iconStyle: 'filled',
      animationLevel: 'normal',
    },
    notifications: {
      push: {
        enabled: true,
        tasks: true,
        habits: true,
        focus: true,
        social: true,
        finance: true,
        achievements: true,
        streak: true,
      },
      email: {
        enabled: true,
        frequency: 'daily',
      },
      inApp: {
        enabled: true,
        showPreview: true,
        sound: true,
      },
    },
    privacy: {
      profileVisibility: 'friends',
      showActivity: true,
      showStats: true,
      showAchievements: true,
      showOnLeaderboard: true,
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30,
    },
  },
  theme: 'dark',
  
  analytics: {
    productivityScore: 0,
    consistencyScore: 0,
    engagementScore: 0,
    growthScore: 0,
    totalTasksCompleted: 0,
    totalHabitsTracked: 0,
    totalFocusMinutes: 0,
    weeklyActivity: [],
  },
  insights: [],
  
  sidebarOpen: false,
  activeTab: 'Home',
  searchQuery: '',
  isSearchOpen: false,
  
  lastSyncTime: null,
  syncStatus: 'idle',
  isOffline: false,
  
  userStreak: {
    current: 0,
    longest: 0,
  },
  achievements: [],
  badges: [],
  
  subscription: null,
  isPremium: false,
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Auth
      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updates } : null 
      })),
      
      // Onboarding
      completeOnboarding: () => set({ onboardingCompleted: true }),
      
      // Tasks
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t),
      })),
      deleteTask: (id) => set((state) => ({ 
        tasks: state.tasks.filter((t) => t.id !== id) 
      })),
      setSelectedTask: (task) => set({ selectedTask: task }),
      setTaskFilters: (filters) => set((state) => ({ 
        taskFilters: { ...state.taskFilters, ...filters } 
      })),
      toggleTaskStatus: (id) => set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id !== id) return t;
          const newStatus = t.status === 'completed' ? 'todo' : 'completed';
          return { ...t, status: newStatus, progress: newStatus === 'completed' ? 100 : 0 };
        }),
      })),
      
      // Habits
      addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map((h) => h.id === id ? { ...h, ...updates } : h),
      })),
      deleteHabit: (id) => set((state) => ({ 
        habits: state.habits.filter((h) => h.id !== id) 
      })),
      setSelectedHabit: (habit) => set({ selectedHabit: habit }),
      setHabitFilters: (filters) => set((state) => ({ 
        habitFilters: { ...state.habitFilters, ...filters } 
      })),
      completeHabit: (id, date) => set((state) => ({
        habits: state.habits.map((h) => {
          if (h.id !== id) return h;
          const completion = { id: Date.now().toString(), date, completed: true };
          const newStreak = h.streaks.current + 1;
          return {
            ...h,
            completions: [...h.completions, completion],
            streaks: {
              ...h.streaks,
              current: newStreak,
              longest: Math.max(newStreak, h.streaks.longest),
              lastCompleted: date,
            },
          };
        }),
      })),
      
      // Finance
      addTransaction: (transaction) => set((state) => ({ 
        transactions: [...state.transactions, transaction] 
      })),
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map((t) => t.id === id ? { ...t, ...updates } : t),
      })),
      deleteTransaction: (id) => set((state) => ({ 
        transactions: state.transactions.filter((t) => t.id !== id) 
      })),
      addAccount: (account) => set((state) => ({ 
        accounts: [...state.accounts, account] 
      })),
      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map((a) => a.id === id ? { ...a, ...updates } : a),
      })),
      deleteAccount: (id) => set((state) => ({ 
        accounts: state.accounts.filter((a) => a.id !== id) 
      })),
      addBudget: (budget) => set((state) => ({ 
        budgets: [...state.budgets, budget] 
      })),
      updateBudget: (id, updates) => set((state) => ({
        budgets: state.budgets.map((b) => b.id === id ? { ...b, ...updates } : b),
      })),
      deleteBudget: (id) => set((state) => ({ 
        budgets: state.budgets.filter((b) => b.id !== id) 
      })),
      addInvestment: (investment) => set((state) => ({ 
        investments: [...state.investments, investment] 
      })),
      updateInvestment: (id, updates) => set((state) => ({
        investments: state.investments.map((i) => i.id === id ? { ...i, ...updates } : i),
      })),
      deleteInvestment: (id) => set((state) => ({ 
        investments: state.investments.filter((i) => i.id !== id) 
      })),
      
      // Focus
      startFocusSession: (session) => set({ currentSession: session }),
      updateFocusSession: (id, updates) => set((state) => ({
        focusSessions: state.focusSessions.map((s) => s.id === id ? { ...s, ...updates } : s),
      })),
      endFocusSession: (id) => set((state) => {
        const session = state.currentSession;
        if (!session) return state;
        return {
          currentSession: null,
          focusSessions: [...state.focusSessions, { ...session, id, endTime: new Date().toISOString() }],
        };
      }),
      updateFocusSettings: (settings) => set((state) => ({ 
        focusSettings: { ...state.focusSettings, ...settings } 
      })),
      
      // Goals
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, ...updates } : g),
      })),
      deleteGoal: (id) => set((state) => ({ 
        goals: state.goals.filter((g) => g.id !== id) 
      })),
      setSelectedGoal: (goal) => set({ selectedGoal: goal }),
      addMilestone: (goalId, milestone) => set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id !== goalId) return g;
          return { ...g, milestones: [...g.milestones, milestone] };
        }),
      })),
      updateMilestone: (goalId, milestoneId, updates) => set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id !== goalId) return g;
          return {
            ...g,
            milestones: g.milestones.map((m) => m.id === milestoneId ? { ...m, ...updates } : m),
          };
        }),
      })),
      
      // Notes
      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map((n) => n.id === id ? { ...n, ...updates } : n),
      })),
      deleteNote: (id) => set((state) => ({ 
        notes: state.notes.filter((n) => n.id !== id) 
      })),
      setSelectedNote: (note) => set({ selectedNote: note }),
      addNotebook: (notebook) => set((state) => ({ 
        notebooks: [...state.notebooks, notebook] 
      })),
      updateNotebook: (id, updates) => set((state) => ({
        notebooks: state.notebooks.map((n) => n.id === id ? { ...n, ...updates } : n),
      })),
      deleteNotebook: (id) => set((state) => ({ 
        notebooks: state.notebooks.filter((n) => n.id !== id) 
      })),
      
      // Social
      addConnection: (connection) => set((state) => ({ 
        connections: [...state.connections, connection] 
      })),
      updateConnection: (id, updates) => set((state) => ({
        connections: state.connections.map((c) => c.id === id ? { ...c, ...updates } : c),
      })),
      removeConnection: (id) => set((state) => ({ 
        connections: state.connections.filter((c) => c.id !== id) 
      })),
      joinChallenge: (challenge) => set((state) => ({ 
        challenges: [...state.challenges, challenge] 
      })),
      leaveChallenge: (challengeId) => set((state) => ({ 
        challenges: state.challenges.filter((c) => c.id !== challengeId) 
      })),
      addPost: (post) => set((state) => ({ 
        posts: [...state.posts, post] 
      })),
      likePost: (postId) => set((state) => ({
        posts: state.posts.map((p) => p.id === postId ? { ...p, likes: p.likes + 1 } : p),
      })),
      
      // Health
      addHealthMetric: (metric) => set((state) => ({ 
        healthMetrics: [...state.healthMetrics, metric] 
      })),
      addSleepEntry: (entry) => set((state) => ({ 
        sleepEntries: [...state.sleepEntries, entry] 
      })),
      addExerciseEntry: (entry) => set((state) => ({ 
        exerciseEntries: [...state.exerciseEntries, entry] 
      })),
      addNutritionEntry: (entry) => set((state) => ({ 
        nutritionEntries: [...state.nutritionEntries, entry] 
      })),
      
      // Learning
      enrollCourse: (course) => set((state) => ({ 
        courses: [...state.courses, course] 
      })),
      updateCourseProgress: (courseId, progress) => set((state) => ({
        courses: state.courses.map((c) => c.id === courseId ? { ...c, progress } : c),
      })),
      completeLesson: (courseId, lessonId) => set((state) => ({
        courses: state.courses.map((c) => {
          if (c.id !== courseId) return c;
          return {
            ...c,
            modules: c.modules.map((m) => ({
              ...m,
              lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, isCompleted: true } : l),
            })),
          };
        }),
      })),
      addFlashcard: (flashcard) => set((state) => ({ 
        flashcards: [...state.flashcards, flashcard] 
      })),
      updateFlashcard: (id, updates) => set((state) => ({
        flashcards: state.flashcards.map((f) => f.id === id ? { ...f, ...updates } : f),
      })),
      deleteFlashcard: (id) => set((state) => ({ 
        flashcards: state.flashcards.filter((f) => f.id !== id) 
      })),
      addDeck: (deck) => set((state) => ({ 
        decks: [...state.decks, deck] 
      })),
      updateDeck: (id, updates) => set((state) => ({
        decks: state.decks.map((d) => d.id === id ? { ...d, ...updates } : d),
      })),
      deleteDeck: (id) => set((state) => ({ 
        decks: state.decks.filter((d) => d.id !== id) 
      })),
      
      // Projects
      addProject: (project) => set((state) => ({ 
        projects: [...state.projects, project] 
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map((p) => p.id === id ? { ...p, ...updates } : p),
      })),
      deleteProject: (id) => set((state) => ({ 
        projects: state.projects.filter((p) => p.id !== id) 
      })),
      setSelectedProject: (project) => set({ selectedProject: project }),
      addProjectMember: (projectId, member) => set((state) => ({
        projects: state.projects.map((p) => {
          if (p.id !== projectId) return p;
          return { ...p, members: [...p.members, member] };
        }),
      })),
      removeProjectMember: (projectId, userId) => set((state) => ({
        projects: state.projects.map((p) => {
          if (p.id !== projectId) return p;
          return { ...p, members: p.members.filter((m) => m.userId !== userId) };
        }),
      })),
      
      // AI
      addAIConversation: (conversation) => set((state) => ({ 
        aiConversations: [...state.aiConversations, conversation] 
      })),
      addAIMessage: (conversationId, message) => set((state) => ({
        aiConversations: state.aiConversations.map((c) => {
          if (c.id !== conversationId) return c;
          return { ...c, messages: [...c.messages, message], updatedAt: new Date().toISOString() };
        }),
      })),
      setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
      useAICredits: (amount) => set((state) => ({ 
        aiCredits: Math.max(0, state.aiCredits - amount) 
      })),
      setMLModelLoaded: (loaded) => set({ mlModelLoaded: loaded }),
      
      // Notifications
      addNotification: (notification) => set((state) => ({ 
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) => 
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      })),
      deleteNotification: (id) => set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        return {
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: notification && !notification.isRead 
            ? Math.max(0, state.unreadCount - 1) 
            : state.unreadCount,
        };
      }),
      clearAllNotifications: () => set({ notifications: [], unreadCount: 0 }),
      
      // Settings
      updateSettings: (settings) => set((state) => ({ 
        settings: { ...state.settings, ...settings } 
      })),
      setTheme: (theme) => set({ theme }),
      
      // UI
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setIsSearchOpen: (open) => set({ isSearchOpen: open }),
      
      // Data Management
      syncData: async () => {
        set({ syncStatus: 'syncing' });
        try {
          // Simulate sync delay
          await new Promise((resolve) => setTimeout(resolve, 1500));
          set({ syncStatus: 'synced', lastSyncTime: new Date() });
        } catch (error) {
          set({ syncStatus: 'error' });
        }
      },
      setSyncStatus: (status) => set({ syncStatus: status }),
      setOffline: (offline) => set({ isOffline: offline }),
      loadMockData: () => {
        // Load comprehensive mock data
        const mockTasks: ITask[] = [
          { id: '1', title: 'Complete project proposal', description: 'Draft and finalize the Q1 project proposal', status: 'in-progress', priority: 'high', category: 'work', progress: 60, tags: ['urgent', 'work'], subtasks: [{ id: '1-1', title: 'Research', completed: true }, { id: '1-2', title: 'Draft outline', completed: true }, { id: '1-3', title: 'Final review', completed: false }], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', title: 'Morning workout', description: '30 min cardio session', status: 'completed', priority: 'medium', category: 'health', progress: 100, tags: ['fitness', 'morning'], subtasks: [], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '3', title: 'Read 30 pages', description: 'Continue reading "Atomic Habits"', status: 'todo', priority: 'low', category: 'learning', progress: 0, tags: ['reading', 'self-improvement'], subtasks: [], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '4', title: 'Team standup meeting', description: 'Daily sync with development team', status: 'in-progress', priority: 'medium', category: 'work', progress: 25, tags: ['meeting', 'team'], subtasks: [], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '5', title: 'Pay utility bills', description: 'Electricity and water bills due', status: 'todo', priority: 'urgent', category: 'finance', progress: 0, tags: ['bills', 'urgent'], subtasks: [], assignees: ['user1'], owner: 'user1', dueDate: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '6', title: 'Meditation session', description: '10 min mindfulness practice', status: 'completed', priority: 'low', category: 'health', progress: 100, tags: ['mindfulness', 'wellness'], subtasks: [], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '7', title: 'Code review', description: 'Review pull request #142', status: 'todo', priority: 'high', category: 'work', progress: 0, tags: ['code', 'review'], subtasks: [], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '8', title: 'Grocery shopping', description: 'Weekly grocery run', status: 'todo', priority: 'medium', category: 'personal', progress: 0, tags: ['shopping', 'groceries'], subtasks: [], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '9', title: 'Write journal entry', description: 'Daily reflection', status: 'completed', priority: 'low', category: 'personal', progress: 100, tags: ['journal', 'reflection'], subtasks: [], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '10', title: 'Learn Spanish', description: 'Duolingo lesson', status: 'in-progress', priority: 'medium', category: 'learning', progress: 50, tags: ['language', 'learning'], subtasks: [], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '11', title: 'Call parents', description: 'Weekly catch-up', status: 'todo', priority: 'medium', category: 'social', progress: 0, tags: ['family', 'calls'], subtasks: [], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '12', title: 'Backup data', description: 'Weekly backup to cloud', status: 'todo', priority: 'high', category: 'work', progress: 0, tags: ['backup', 'tech'], subtasks: [], assignees: ['user1'], owner: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
        
        const mockHabits: IHabit[] = [
          { id: '1', name: 'Morning meditation', description: 'Start the day with clarity', category: 'mindset', frequency: 'daily', difficulty: 'easy', targetCount: 1, currentCount: 1, icon: '🧘', color: '#6366F1', startDate: new Date().toISOString(), streaks: { current: 15, longest: 30, lastCompleted: new Date().toISOString() }, completions: [{ id: '1-1', date: new Date().toISOString(), completed: true }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', name: 'Exercise 30 minutes', description: 'Daily physical activity', category: 'fitness', frequency: 'daily', difficulty: 'medium', targetCount: 1, currentCount: 1, icon: '💪', color: '#10B981', startDate: new Date().toISOString(), streaks: { current: 22, longest: 45, lastCompleted: new Date().toISOString() }, completions: [{ id: '2-1', date: new Date().toISOString(), completed: true }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '3', name: 'Read 20 pages', description: 'Daily reading habit', category: 'learning', frequency: 'daily', difficulty: 'easy', targetCount: 1, currentCount: 1, icon: '📚', color: '#F59E0B', startDate: new Date().toISOString(), streaks: { current: 8, longest: 20, lastCompleted: new Date().toISOString() }, completions: [{ id: '3-1', date: new Date().toISOString(), completed: true }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '4', name: 'Drink 8 glasses of water', description: 'Stay hydrated', category: 'health', frequency: 'daily', difficulty: 'easy', targetCount: 8, currentCount: 5, icon: '💧', color: '#3B82F6', startDate: new Date().toISOString(), streaks: { current: 35, longest: 60, lastCompleted: new Date().toISOString() }, completions: [{ id: '4-1', date: new Date().toISOString(), completed: false, count: 5 }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '5', name: 'No social media before noon', description: 'Digital wellness', category: 'self-care', frequency: 'daily', difficulty: 'hard', targetCount: 1, currentCount: 1, icon: '📵', color: '#EF4444', startDate: new Date().toISOString(), streaks: { current: 12, longest: 25, lastCompleted: new Date().toISOString() }, completions: [{ id: '5-1', date: new Date().toISOString(), completed: true }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
        
        const mockTransactions: ITransaction[] = [
          { id: '1', type: 'income', category: 'salary', amount: 5000, currency: 'USD', date: new Date().toISOString(), description: 'Monthly salary', accountId: '1', tags: ['salary', 'income'], createdAt: new Date().toISOString() },
          { id: '2', type: 'expense', category: 'food', amount: 45.50, currency: 'USD', date: new Date().toISOString(), description: 'Grocery shopping', merchant: 'Whole Foods', accountId: '1', tags: ['groceries', 'food'], createdAt: new Date().toISOString() },
          { id: '3', type: 'expense', category: 'transport', amount: 35, currency: 'USD', date: new Date().toISOString(), description: 'Gas station', merchant: 'Shell', accountId: '1', tags: ['gas', 'transport'], createdAt: new Date().toISOString() },
          { id: '4', type: 'expense', category: 'utilities', amount: 120, currency: 'USD', date: new Date().toISOString(), description: 'Electricity bill', accountId: '1', tags: ['utilities', 'bills'], createdAt: new Date().toISOString() },
          { id: '5', type: 'expense', category: 'entertainment', amount: 15.99, currency: 'USD', date: new Date().toISOString(), description: 'Netflix subscription', merchant: 'Netflix', accountId: '2', tags: ['subscription', 'entertainment'], createdAt: new Date().toISOString() },
          { id: '6', type: 'expense', category: 'shopping', amount: 89.99, currency: 'USD', date: new Date().toISOString(), description: 'Running shoes', merchant: 'Nike', accountId: '1', tags: ['shopping', 'fitness'], createdAt: new Date().toISOString() },
          { id: '7', type: 'income', category: 'freelance', amount: 750, currency: 'USD', date: new Date().toISOString(), description: 'Web development project', accountId: '1', tags: ['freelance', 'income'], createdAt: new Date().toISOString() },
          { id: '8', type: 'expense', category: 'healthcare', amount: 50, currency: 'USD', date: new Date().toISOString(), description: 'Pharmacy', merchant: 'CVS', accountId: '1', tags: ['health', 'medicine'], createdAt: new Date().toISOString() },
          { id: '9', type: 'investment', category: 'stock', amount: 200, currency: 'USD', date: new Date().toISOString(), description: 'Index fund purchase', accountId: '3', tags: ['investment', 'stocks'], createdAt: new Date().toISOString() },
          { id: '10', type: 'expense', category: 'education', amount: 29.99, currency: 'USD', date: new Date().toISOString(), description: 'Online course', merchant: 'Udemy', accountId: '1', tags: ['education', 'learning'], createdAt: new Date().toISOString() },
        ];
        
        const mockAccounts: IAccount[] = [
          { id: '1', name: 'Checking Account', type: 'checking', balance: 4250.50, currency: 'USD', institution: 'Chase Bank', color: '#3B82F6', icon: '🏦', isActive: true },
          { id: '2', name: 'Savings Account', type: 'savings', balance: 12000, currency: 'USD', institution: 'Chase Bank', color: '#10B981', icon: '💰', isActive: true },
          { id: '3', name: 'Investment Account', type: 'investment', balance: 45000, currency: 'USD', institution: 'Fidelity', color: '#8B5CF6', icon: '📈', isActive: true },
          { id: '4', name: 'Credit Card', type: 'credit-card', balance: -850.25, currency: 'USD', institution: 'American Express', color: '#EF4444', icon: '💳', isActive: true },
        ];
        
        const mockGoals: IGoal[] = [
          { id: '1', title: 'Save $50,000 for emergency fund', description: 'Build 6 months of living expenses', status: 'active', category: 'finance', timeframe: 'long-term', targetValue: 50000, currentValue: 32500, progress: 65, milestones: [{ id: 'm1', title: '$10,000 milestone', targetValue: 10000, currentValue: 10000, completed: true }, { id: 'm2', title: '$25,000 milestone', targetValue: 25000, currentValue: 25000, completed: true }, { id: 'm3', title: '$40,000 milestone', targetValue: 40000, currentValue: 32500, completed: false }], linkedTasks: ['5', '12'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', title: 'Run a marathon', description: 'Complete first full marathon', status: 'active', category: 'health', timeframe: 'long-term', targetValue: 42.195, currentValue: 21, progress: 50, milestones: [{ id: 'm4', title: 'Run 5K', targetValue: 5, currentValue: 5, completed: true }, { id: 'm5', title: 'Run 10K', targetValue: 10, currentValue: 10, completed: true }, { id: 'm6', title: 'Run half marathon', targetValue: 21, currentValue: 21, completed: true }], linkedTasks: ['2'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '3', title: 'Learn to code', description: 'Become proficient in React Native', status: 'active', category: 'learning', timeframe: 'medium-term', targetValue: 100, currentValue: 45, progress: 45, milestones: [{ id: 'm7', title: 'Complete basics course', targetValue: 20, currentValue: 20, completed: true }, { id: 'm8', title: 'Build first app', targetValue: 50, currentValue: 45, completed: false }], linkedTasks: ['10', '7'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
        
        const mockNotes: INote[] = [
          { id: '1', title: 'Meeting Notes - Team Standup', content: '- Discussed project progress\n- Review upcoming deadlines\n- Assigned tasks for the week', type: 'text', status: 'published', visibility: 'private', tags: ['meeting', 'work'], isPinned: true, isFavorite: false, linkedTasks: ['4'], linkedGoals: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', title: 'Book Recommendations', content: '1. Atomic Habits\n2. Deep Work\n3. The 7 Habits of Highly Effective People\n4. Think and Grow Rich', type: 'text', status: 'published', visibility: 'private', tags: ['books', 'learning'], isPinned: false, isFavorite: true, linkedTasks: ['3'], linkedGoals3'], createdAt: [': new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '3', title: 'Recipe: Chicken Stir Fry', content: 'Ingredients:\n- 2 chicken breasts\n- Bell peppers\n- Broccoli\n- Soy sauce\n- Ginger & garlic', type: 'text', status: 'published', visibility: 'private', tags: ['recipe', 'cooking'], isPinned: false, isFavorite: false, linkedTasks: [], linkedGoals: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
        
        const mockProjects: IProject[] = [
          { id: '1', name: 'LifeOS Pro App', description: 'Building the ultimate productivity app', status: 'active', priority: 'high', type: 'work', startDate: new Date().toISOString(), progress: 45, owner: 'user1', members: [{ userId: 'user1', role: 'owner', joinedAt: new Date().toISOString() }], tasks: ['1', '4', '7'], color: '#6366F1', icon: '📱', isStarred: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', name: 'Marathon Training', description: 'Prepare for NYC Marathon 2024', status: 'active', priority: 'high', type: 'personal', startDate: new Date().toISOString(), progress: 50, owner: 'user1', members: [{ userId: 'user1', role: 'owner', joinedAt: new Date().toISOString() }], tasks: ['2'], color: '#10B981', icon: '🏃', isStarred: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
        
        const mockAchievements: IAchievement[] = [
          { id: '1', name: 'Task Master', description: 'Complete 100 tasks', category: 'tasks', icon: '🏆', rarity: 'rare', earnedAt: new Date().toISOString() },
          { id: '2', name: 'Streak Champion', description: 'Maintain a 30-day streak', category: 'streak', icon: '🔥', rarity: 'epic', earnedAt: new Date().toISOString() },
          { id: '3', name: 'Early Bird', description: 'Complete 10 tasks before 8 AM', category: 'tasks', icon: '🌅', rarity: 'uncommon', earnedAt: new Date().toISOString() },
          { id: '4', name: 'Social Butterfly', description: 'Add 50 friends', category: 'social', icon: '🦋', rarity: 'rare', earnedAt: new Date().toISOString() },
          { id: '5', name: 'Focus Master', description: 'Complete 100 hours of focus time', category: 'focus', icon: '🎯', rarity: 'legendary', earnedAt: new Date().toISOString() },
        ];
        
        set({
          tasks: mockTasks,
          habits: mockHabits,
          transactions: mockTransactions,
          accounts: mockAccounts,
          goals: mockGoals,
          notes: mockNotes,
          projects: mockProjects,
          achievements: mockAchievements,
          userStreak: { current: 15, longest: 30, lastActivityDate: new Date().toISOString() },
          analytics: {
            productivityScore: 78,
            consistencyScore: 85,
            engagementScore: 72,
            growthScore: 65,
            totalTasksCompleted: 156,
            totalHabitsTracked: 234,
            totalFocusMinutes: 4520,
            weeklyActivity: [
              { day: 'Mon', tasksCompleted: 5, habitsCompleted: 5, focusMinutes: 120 },
              { day: 'Tue', tasksCompleted: 3, habitsCompleted: 5, focusMinutes: 90 },
              { day: 'Wed', tasksCompleted: 7, habitsCompleted: 5, focusMinutes: 150 },
              { day: 'Thu', tasksCompleted: 4, habitsCompleted: 4, focusMinutes: 100 },
              { day: 'Fri', tasksCompleted: 6, habitsCompleted: 5, focusMinutes: 130 },
              { day: 'Sat', tasksCompleted: 2, habitsCompleted: 3, focusMinutes: 60 },
              { day: 'Sun', tasksCompleted: 4, habitsCompleted: 5, focusMinutes: 80 },
            ],
          },
        });
      },
      clearAllData: () => set(initialState),
      
      // Streaks & Achievements
      updateStreak: (streak) => set((state) => ({ 
        userStreak: { ...state.userStreak, ...streak } 
      })),
      addAchievement: (achievement) => set((state) => ({ 
        achievements: [...state.achievements, achievement] 
      })),
      addBadge: (badge) => set((state) => ({ 
        badges: [...state.badges, badge] 
      })),
      
      // Subscription
      setSubscription: (subscription) => set({ subscription }),
      setIsPremium: (isPremium) => set({ isPremium }),
      
      // Bulk Operations
      bulkUpdateTasks: (updates) => set((state) => ({
        tasks: state.tasks.map((t) => {
          const update = updates.find((u) => u.id === t.id);
          return update ? { ...t, ...update.updates } : t;
        }),
      })),
      bulkDeleteTasks: (ids) => set((state) => ({ 
        tasks: state.tasks.filter((t) => !ids.includes(t.id)) 
      })),
      bulkCompleteHabits: (habitIds, date) => set((state) => ({
        habits: state.habits.map((h) => {
          if (!habitIds.includes(h.id)) return h;
          const completion = { id: Date.now().toString() + h.id, date, completed: true };
          const newStreak = h.streaks.current + 1;
          return {
            ...h,
            completions: [...h.completions, completion],
            streaks: {
              ...h.streaks,
              current: newStreak,
              longest: Math.max(newStreak, h.streaks.longest),
              lastCompleted: date,
            },
          };
        }),
      })),
    }),
    {
      name: 'lifeos-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        onboardingCompleted: state.onboardingCompleted,
        tasks: state.tasks,
        habits: state.habits,
        transactions: state.transactions,
        accounts: state.accounts,
        budgets: state.budgets,
        investments: state.investments,
        focusSettings: state.focusSettings,
        goals: state.goals,
        notes: state.notes,
        notebooks: state.notebooks,
        projects: state.projects,
        settings: state.settings,
        theme: state.theme,
        userStreak: state.userStreak,
        achievements: state.achievements,
        subscription: state.subscription,
        isPremium: state.isPremium,
        aiCredits: state.aiCredits,
      }),
    }
  )
);

// ============================================================================
// CONTEXT HOOKS
// ============================================================================

export const useApp = () => useAppStore();
export const useTasks = () => useAppStore((state) => state.tasks);
export const useHabits = () => useAppStore((state) => state.habits);
export const useFinance = () => useAppStore((state) => ({ transactions: state.transactions, accounts: state.accounts, budgets: state.budgets }));
export const useFocus = () => useAppStore((state) => ({ sessions: state.focusSessions, current: state.currentSession, settings: state.focusSettings }));
export const useGoals = () => useAppStore((state) => state.goals);
export const useNotes = () => useAppStore((state) => state.notes);
export const useSocial = () => useAppStore((state) => ({ connections: state.connections, challenges: state.challenges, posts: state.posts }));
export const useHealth = () => useAppStore((state) => ({ metrics: state.healthMetrics, sleep: state.sleepEntries, exercise: state.exerciseEntries }));
export const useLearning = () => useAppStore((state) => ({ courses: state.courses, decks: state.decks }));
export const useProjects = () => useAppStore((state) => state.projects);
export const useAI = () => useAppStore((state) => ({ conversations: state.aiConversations, current: state.currentConversation, credits: state.aiCredits }));
export const useNotifications = () => useAppStore((state) => ({ notifications: state.notifications, unreadCount: state.unreadCount }));
export const useSettings = () => useAppStore((state) => state.settings);
export const useAnalytics = () => useAppStore((state) => state.analytics);
export const useStreak = () => useAppStore((state) => state.userStreak);
export const useAchievements = () => useAppStore((state) => state.achievements);
export const useSubscription = () => useAppStore((state) => ({ subscription: state.subscription, isPremium: state.isPremium }));

// ============================================================================
// NETWORK & CONNECTIVITY HOOKS
// ============================================================================

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const setOffline = useAppStore((state) => state.setOffline);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      setOffline(!connected);
    });

    return () => unsubscribe();
  }, [setOffline]);

  return { isConnected };
};

// ============================================================================
// APP STATE HOOK
// ============================================================================

export const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
    });

    return () => subscription.remove();
  }, []);

  return appState;
};

// ============================================================================
// DIMENSIONS HOOK
// ============================================================================

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription.remove();
  }, []);

  return dimensions;
};

// ============================================================================
// EXPORT
// ============================================================================

export default useAppStore;
