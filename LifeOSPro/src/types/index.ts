export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  joinedAt: string;
  isPremium: boolean;
  premiumTier?: 'monthly' | 'yearly' | 'lifetime';
  premiumExpiresAt?: string;
  premiumStartedAt?: string;
  isLifetimeMember?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  xp: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'custom';
  streak: number;
  bestStreak: number;
  completedDates: string[];
  createdAt: string;
  xpPerCompletion: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface FocusSession {
  id: string;
  duration: number;
  type: 'focus' | 'shortBreak' | 'longBreak';
  completed: boolean;
  date: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  duration: number;
  xp: number;
  joined: boolean;
  progress: number;
}

export interface AIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface DailyInsight {
  id: string;
  type: 'tip' | 'achievement' | 'progress' | 'motivation';
  title: string;
  content: string;
  date: string;
}

export const LEVELS = [
  { level: 1, name: 'Beginner', xpRequired: 0 },
  { level: 2, name: 'Explorer', xpRequired: 100 },
  { level: 3, name: 'Achiever', xpRequired: 300 },
  { level: 4, name: 'Champion', xpRequired: 600 },
  { level: 5, name: 'Master', xpRequired: 1000 },
  { level: 6, name: 'Legend', xpRequired: 1500 },
  { level: 7, name: 'Titan', xpRequired: 2200 },
  { level: 8, name: 'God', xpRequired: 3000 },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'First Step', description: 'Complete your first task', icon: '🎯', target: 1 },
  { id: '2', name: 'On Fire', description: '7 day streak', icon: '🔥', target: 7 },
  { id: '3', name: 'Money Minded', description: 'Track 10 expenses', icon: '💰', target: 10 },
  { id: '4', name: 'Focus Master', description: 'Complete 10 focus sessions', icon: '🎯', target: 10 },
  { id: '5', name: 'Note Taker', description: 'Create 5 notes', icon: '📝', target: 5 },
  { id: '6', name: 'Habit Builder', description: 'Maintain a 30 day streak', icon: '🏆', target: 30 },
  { id: '7', name: 'Productivity Pro', description: 'Complete 50 tasks', icon: '⭐', target: 50 },
  { id: '8', name: 'Wealthy', description: 'Save $1000', icon: '💎', target: 1000 },
];

export const TASK_CATEGORIES = [
  { id: 'work', name: 'Work', icon: 'briefcase', color: '#6366F1' },
  { id: 'personal', name: 'Personal', icon: 'person', color: '#EC4899' },
  { id: 'health', name: 'Health', icon: 'heart', color: '#EF4444' },
  { id: 'learning', name: 'Learning', icon: 'book', color: '#10B981' },
  { id: 'finance', name: 'Finance', icon: 'wallet', color: '#F59E0B' },
  { id: 'social', name: 'Social', icon: 'people', color: '#8B5CF6' },
  { id: 'creative', name: 'Creative', icon: 'color-palette', color: '#06B6D4' },
];

export const HABIT_ICONS = [
  '🏃', '💪', '🧘', '📚', '💤', '💧', '🥗', '🧹', '💰', '🎯',
  '✍️', '🎸', '🎨', '📝', '🧠', '💼', '🌅', '😴', '🚶', '🧹'
];

export const FINANCE_CATEGORIES = {
  income: ['💼 Salary', '💻 Freelance', '📈 Investment', '🎁 Gift', '🏆 Bonus', '💵 Other'],
  expense: ['🍔 Food', '🚗 Transport', '🎬 Entertainment', '🛒 Shopping', '🏠 Bills', '💊 Health', '📚 Education', '✈️ Travel', '🎮 Games', '💝 Other']
};
