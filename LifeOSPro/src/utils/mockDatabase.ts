import AsyncStorage from '@react-native-async-storage/async-storage';

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
  premiumExpiresAt?: string;
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

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'health' | 'finance' | 'learning' | 'productivity' | 'habit';
  completed: boolean;
}

export const generateMockData = () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const lastWeek = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    lastWeek.push(d.toISOString().split('T')[0]);
  }

  const mockUser: User = {
    id: 'user_001',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    level: 5,
    xp: 1250,
    streak: 23,
    joinedAt: '2024-01-15T00:00:00.000Z',
    isPremium: false,
  };

  const mockTasks: Task[] = [
    { id: 'task_001', title: 'Complete project proposal', description: 'Finish the Q1 project outline', priority: 'high', category: 'Work', dueDate: today, completed: false, createdAt: '2025-01-20T10:00:00.000Z', xp: 15 },
    { id: 'task_002', title: 'Review design mockups', description: 'Check new UI designs', priority: 'medium', category: 'Work', dueDate: today, completed: false, createdAt: '2025-01-21T09:00:00.000Z', xp: 10 },
    { id: 'task_003', title: 'Morning meditation', description: '15 min mindfulness', priority: 'low', category: 'Health', dueDate: today, completed: true, completedAt: `${today}T07:30:00.000Z`, createdAt: '2025-01-22T06:00:00.000Z', xp: 10 },
    { id: 'task_004', title: 'Gym workout', priority: 'high', category: 'Health', completed: true, completedAt: `${today}T08:00:00.000Z`, createdAt: '2025-01-22T07:00:00.000Z', xp: 20 },
    { id: 'task_005', title: 'Read 30 pages', description: 'Continue reading the productivity book', priority: 'medium', category: 'Learning', completed: false, createdAt: '2025-01-22T12:00:00.000Z', xp: 10 },
    { id: 'task_006', title: 'Team meeting preparation', priority: 'urgent', category: 'Work', completed: false, createdAt: '2025-01-23T09:00:00.000Z', xp: 20 },
    { id: 'task_007', title: 'Pay rent', priority: 'urgent', category: 'Finance', completed: false, dueDate: today, createdAt: '2025-01-20T10:00:00.000Z', xp: 5 },
    { id: 'task_008', title: 'Code review', description: 'Review PRs from team', priority: 'high', category: 'Work', completed: true, completedAt: `${yesterday}T15:00:00.000Z`, createdAt: '2025-01-21T14:00:00.000Z', xp: 15 },
    { id: 'task_009', title: 'Update portfolio website', priority: 'low', category: 'Creative', completed: false, createdAt: '2025-01-22T11:00:00.000Z', xp: 10 },
    { id: 'task_010', title: 'Weekly planning', priority: 'medium', category: 'Productivity', completed: true, completedAt: `${yesterday}T09:00:00.000Z`, createdAt: '2025-01-20T08:00:00.000Z', xp: 15 },
  ];

  const mockHabits: Habit[] = [
    { id: 'habit_001', name: 'Morning Exercise', icon: '💪', color: '#EF4444', frequency: 'daily', streak: 23, bestStreak: 45, completedDates: lastWeek, createdAt: '2024-06-01T00:00:00.000Z', xpPerCompletion: 10 },
    { id: 'habit_002', name: 'Read 30 min', icon: '📚', color: '#6366F1', frequency: 'daily', streak: 15, bestStreak: 30, completedDates: lastWeek.slice(1), createdAt: '2024-08-15T00:00:00.000Z', xpPerCompletion: 15 },
    { id: 'habit_003', name: 'Meditate', icon: '🧘', color: '#10B981', frequency: 'daily', streak: 8, bestStreak: 12, completedDates: lastWeek.slice(3), createdAt: '2024-10-01T00:00:00.000Z', xpPerCompletion: 10 },
    { id: 'habit_004', name: 'Drink 3L water', icon: '💧', color: '#0EA5E9', frequency: 'daily', streak: 30, bestStreak: 30, completedDates: lastWeek, createdAt: '2024-07-01T00:00:00.000Z', xpPerCompletion: 5 },
    { id: 'habit_005', name: 'No social media', icon: '📵', color: '#8B5CF6', frequency: 'daily', streak: 5, bestStreak: 7, completedDates: lastWeek.slice(5), createdAt: '2024-12-01T00:00:00.000Z', xpPerCompletion: 10 },
  ];

  const mockTransactions: Transaction[] = [
    { id: 'trans_001', type: 'income', amount: 5000, category: 'Salary', description: 'Monthly salary', date: '2025-01-01T00:00:00.000Z' },
    { id: 'trans_002', type: 'income', amount: 1500, category: 'Freelance', description: 'Web project', date: '2025-01-15T00:00:00.000Z' },
    { id: 'trans_003', type: 'expense', amount: 1200, category: 'Rent', description: 'January rent', date: '2025-01-01T00:00:00.000Z' },
    { id: 'trans_004', type: 'expense', amount: 350, category: 'Food', description: 'Groceries', date: '2025-01-05T00:00:00.000Z' },
    { id: 'trans_005', type: 'expense', amount: 150, category: 'Transport', description: 'Gas', date: '2025-01-08T00:00:00.000Z' },
    { id: 'trans_006', type: 'expense', amount: 89, category: 'Entertainment', description: 'Netflix + Spotify', date: '2025-01-10T00:00:00.000Z' },
    { id: 'trans_007', type: 'expense', amount: 200, category: 'Health', description: 'Gym membership', date: '2025-01-12T00:00:00.000Z' },
    { id: 'trans_008', type: 'expense', amount: 45, category: 'Shopping', description: 'New shoes', date: '2025-01-18T00:00:00.000Z' },
    { id: 'trans_009', type: 'expense', amount: 65, category: 'Bills', description: 'Electricity', date: '2025-01-20T00:00:00.000Z' },
    { id: 'trans_010', type: 'income', amount: 500, category: 'Bonus', description: 'Performance bonus', date: '2025-01-22T00:00:00.000Z' },
  ];

  const mockNotes: Note[] = [
    { id: 'note_001', title: 'Project Ideas', content: '- AI-powered habit tracker\n- Focus timer with Spotify integration\n- Finance dashboard with charts\n- Social challenges feature', tags: ['ideas', 'projects'], createdAt: '2025-01-10T00:00:00.000Z' },
    { id: 'note_002', title: 'Meeting Notes', content: 'Discussed Q1 roadmap:\n- Launch premium features\n- Add social challenges\n- Improve analytics dashboard\n- Fix bugs from beta', tags: ['work', 'meeting'], createdAt: '2025-01-15T00:00:00.000Z' },
    { id: 'note_003', title: 'Book Summary: Atomic Habits', content: 'Key takeaways:\n1. Make it obvious\n2. Make it attractive\n3. Make it easy\n4. Make it satisfying\n\nSmall habits compound into big results!', tags: ['learning', 'books'], createdAt: '2025-01-18T00:00:00.000Z' },
  ];

  const mockFocusSessions: FocusSession[] = [
    { id: 'focus_001', duration: 25, type: 'focus', completed: true, date: today },
    { id: 'focus_002', duration: 5, type: 'shortBreak', completed: true, date: today },
    { id: 'focus_003', duration: 25, type: 'focus', completed: true, date: today },
    { id: 'focus_004', duration: 5, type: 'shortBreak', completed: true, date: today },
    { id: 'focus_005', duration: 25, type: 'focus', completed: true, date: today },
    { id: 'focus_006', duration: 15, type: 'longBreak', completed: true, date: today },
    { id: 'focus_007', duration: 50, type: 'focus', completed: true, date: yesterday },
    { id: 'focus_008', duration: 25, type: 'focus', completed: true, date: yesterday },
  ];

  const mockAchievements: Achievement[] = [
    { id: 'ach_001', name: 'First Step', description: 'Complete your first task', icon: '🎯', target: 1, unlockedAt: '2024-06-02T00:00:00.000Z' },
    { id: 'ach_002', name: 'On Fire', description: '7 day streak', icon: '🔥', target: 7, unlockedAt: '2024-06-08T00:00:00.000Z' },
    { id: 'ach_003', name: 'Money Minded', description: 'Track 10 expenses', icon: '💰', target: 10, unlockedAt: '2024-07-15T00:00:00.000Z' },
    { id: 'ach_004', name: 'Focus Master', description: 'Complete 10 focus sessions', icon: '🎯', target: 10, unlockedAt: '2024-08-01T00:00:00.000Z' },
    { id: 'ach_005', name: 'Note Taker', description: 'Create 5 notes', icon: '📝', target: 5, unlockedAt: '2025-01-10T00:00:00.000Z' },
    { id: 'ach_006', name: 'Habit Builder', description: '30 day streak', icon: '🏆', target: 30, progress: 23, target: 30 },
    { id: 'ach_007', name: 'Productivity Pro', description: 'Complete 50 tasks', icon: '⭐', target: 50, progress: 45, target: 50 },
    { id: 'ach_008', name: 'Wealthy', description: 'Save $1000', icon: '💎', target: 1000, progress: 0, target: 1000 },
  ];

  const mockGoals: Goal[] = [
    { id: 'goal_001', title: 'Read 24 books', target: 24, current: 8, unit: 'books', deadline: '2025-12-31', category: 'learning', completed: false },
    { id: 'goal_002', title: 'Save $10,000', target: 10000, current: 4500, unit: '$', deadline: '2025-12-31', category: 'finance', completed: false },
    { id: 'goal_003', title: 'Run 500 km', target: 500, current: 180, unit: 'km', deadline: '2025-12-31', category: 'health', completed: false },
    { id: 'goal_004', title: 'Complete 100 tasks', target: 100, current: 45, unit: 'tasks', deadline: '2025-06-30', category: 'productivity', completed: false },
  ];

  return {
    user: mockUser,
    tasks: mockTasks,
    habits: mockHabits,
    transactions: mockTransactions,
    notes: mockNotes,
    focusSessions: mockFocusSessions,
    achievements: mockAchievements,
    goals: mockGoals,
  };
};

export const loadMockData = async () => {
  const mockData = generateMockData();
  try {
    await AsyncStorage.setItem('@lifeos_mock_user', JSON.stringify(mockData.user));
    await AsyncStorage.setItem('@lifeos_mock_tasks', JSON.stringify(mockData.tasks));
    await AsyncStorage.setItem('@lifeos_mock_habits', JSON.stringify(mockData.habits));
    await AsyncStorage.setItem('@lifeos_mock_transactions', JSON.stringify(mockData.transactions));
    await AsyncStorage.setItem('@lifeos_mock_notes', JSON.stringify(mockData.notes));
    await AsyncStorage.setItem('@lifeos_mock_focus', JSON.stringify(mockData.focusSessions));
    await AsyncStorage.setItem('@lifeos_mock_achievements', JSON.stringify(mockData.achievements));
    await AsyncStorage.setItem('@lifeos_mock_goals', JSON.stringify(mockData.goals));
    await AsyncStorage.setItem('@lifeos_mock_loaded', 'true');
    console.log('✅ Mock data loaded successfully!');
    return true;
  } catch (error) {
    console.error('Error loading mock data:', error);
    return false;
  }
};

export const clearMockData = async () => {
  try {
    await AsyncStorage.removeItem('@lifeos_mock_user');
    await AsyncStorage.removeItem('@lifeos_mock_tasks');
    await AsyncStorage.removeItem('@lifeos_mock_habits');
    await AsyncStorage.removeItem('@lifeos_mock_transactions');
    await AsyncStorage.removeItem('@lifeos_mock_notes');
    await AsyncStorage.removeItem('@lifeos_mock_focus');
    await AsyncStorage.removeItem('@lifeos_mock_achievements');
    await AsyncStorage.removeItem('@lifeos_mock_goals');
    await AsyncStorage.removeItem('@lifeos_mock_loaded');
    console.log('✅ Mock data cleared!');
    return true;
  } catch (error) {
    console.error('Error clearing mock data:', error);
    return false;
  }
};

export const isMockDataLoaded = async (): Promise<boolean> => {
  const loaded = await AsyncStorage.getItem('@lifeos_mock_loaded');
  return loaded === 'true';
};
