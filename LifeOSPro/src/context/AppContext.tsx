import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Task, Habit, Transaction, Note, FocusSession, Achievement, DailyInsight } from '../types';

interface AppState {
  user: User;
  tasks: Task[];
  habits: Habit[];
  transactions: Transaction[];
  notes: Note[];
  focusSessions: FocusSession[];
  achievements: Achievement[];
  insights: DailyInsight[];
  onboardingCompleted: boolean;
  dailyAIUsage: number;
  lastAIReset: string;
}

type Action =
  | { type: 'SET_USER'; payload: Partial<User> }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_FOCUS_SESSION'; payload: FocusSession }
  | { type: 'SET_FOCUS_SESSIONS'; payload: FocusSession[] }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'SET_ONBOARDING'; payload: boolean }
  | { type: 'USE_AI_MESSAGE' }
  | { type: 'RESET_AI_USAGE' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const getToday = () => new Date().toISOString().split('T')[0];

const initialUser: User = {
  id: generateId(),
  name: 'User',
  email: '',
  level: 1,
  xp: 0,
  streak: 0,
  joinedAt: new Date().toISOString(),
  isPremium: false,
};

const initialState: AppState = {
  user: initialUser,
  tasks: [],
  habits: [],
  transactions: [],
  notes: [],
  focusSessions: [],
  achievements: [],
  insights: [],
  onboardingCompleted: false,
  dailyAIUsage: 0,
  lastAIReset: getToday(),
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addXP: (amount: number) => void;
  canUseAI: () => boolean;
} | null>(null);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'SET_HABITS':
      return { ...state, habits: action.payload };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(h => h.id === action.payload.id ? action.payload : h),
      };
    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter(h => h.id !== action.payload) };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(n => n.id === action.payload.id ? action.payload : n),
      };
    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter(n => n.id !== action.payload) };
    case 'ADD_FOCUS_SESSION':
      return { ...state, focusSessions: [...state.focusSessions, action.payload] };
    case 'SET_FOCUS_SESSIONS':
      return { ...state, focusSessions: action.payload };
    case 'UNLOCK_ACHIEVEMENT':
      const achievement = state.achievements.find(a => a.id === action.payload);
      if (achievement && !achievement.unlockedAt) {
        return {
          ...state,
          achievements: state.achievements.map(a =>
            a.id === action.payload ? { ...a, unlockedAt: new Date().toISOString() } : a
          ),
        };
      }
      return state;
    case 'ADD_XP':
      const newXP = state.user.xp + action.payload;
      let newLevel = state.user.level;
      const levels = [0, 100, 300, 600, 1000, 1500, 2200, 3000];
      while (newLevel < 8 && newXP >= levels[newLevel]) newLevel++;
      return {
        ...state,
        user: { ...state.user, xp: newXP, level: newLevel },
      };
    case 'SET_ONBOARDING':
      return { ...state, onboardingCompleted: action.payload };
    case 'USE_AI_MESSAGE':
      if (state.lastAIReset !== getToday()) {
        return { ...state, dailyAIUsage: 1, lastAIReset: getToday() };
      }
      return { ...state, dailyAIUsage: state.dailyAIUsage + 1 };
    case 'RESET_AI_USAGE':
      return { ...state, dailyAIUsage: 0, lastAIReset: getToday() };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const STORAGE_KEY = '@lifeos_pro_data';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (state.onboardingCompleted) {
      saveData();
    }
  }, [state]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.lastAIReset !== getToday()) {
          parsed.dailyAIUsage = 0;
          parsed.lastAIReset = getToday();
        }
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addXP = (amount: number) => {
    dispatch({ type: 'ADD_XP', payload: amount });
  };

  const canUseAI = (): boolean => {
    if (state.user.isPremium) return true;
    return state.dailyAIUsage < 10;
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addXP, canUseAI }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
