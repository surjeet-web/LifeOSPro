// ============================================================================
// ADVANCED ANALYTICS ENGINE FOR LifeOS Pro
// 70,000+ Lines Edition - Comprehensive Analytics & Insights
// ============================================================================

import { 
  ITask, IHabit, ITransaction, IAccount, IGoal, IFocusSession, 
  IAnalytics, IInsight, IWeeklyActivity, ITrend, ICategoryBreakdown 
} from '../../types';

// ============================================================================
// ANALYTICS CALCULATIONS
// ============================================================================

export const calculateProductivityScore = (
  tasks: ITask[],
  habits: IHabit[],
  focusSessions: IFocusSession[]
): number => {
  const taskScore = calculateTaskScore(tasks);
  const habitScore = calculateHabitScore(habits);
  const focusScore = calculateFocusScore(focusSessions);
  
  return Math.round((taskScore * 0.4 + habitScore * 0.3 + focusScore * 0.3));
};

const calculateTaskScore = (tasks: ITask[]): number => {
  if (tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = completedTasks / tasks.length;
  
  const highPriorityCompleted = tasks.filter(t => 
    t.priority === 'high' || t.priority === 'urgent'
  ).filter(t => t.status === 'completed').length;
  
  const highPriorityTotal = tasks.filter(t => 
    t.priority === 'high' || t.priority === 'urgent'
  ).length;
  
  const highPriorityScore = highPriorityTotal > 0 
    ? highPriorityCompleted / highPriorityTotal 
    : 0.5;
  
  return Math.round((completionRate * 0.6 + highPriorityScore * 0.4) * 100);
};

const calculateHabitScore = (habits: IHabit[]): number => {
  if (habits.length === 0) return 0;
  
  const averageStreak = habits.reduce((sum, h) => sum + h.streaks.current, 0) / habits.length;
  const maxPossibleStreak = 30;
  
  return Math.min(100, Math.round((averageStreak / maxPossibleStreak) * 100));
};

const calculateFocusScore = (focusSessions: IFocusSession[]): number => {
  if (focusSessions.length === 0) return 0;
  
  const avgProductivity = focusSessions.reduce((sum, s) => sum + s.productivity, 0) / focusSessions.length;
  const avgMood = focusSessions.reduce((sum, s) => sum + s.mood, 0) / focusSessions.length;
  
  return Math.round(((avgProductivity / 10) * 0.6 + (avgMood / 10) * 0.4) * 100);
};

// ============================================================================
// WEEKLY ACTIVITY ANALYSIS
// ============================================================================

export const calculateWeeklyActivity = (
  tasks: ITask[],
  habits: IHabit[],
  focusSessions: IFocusSession[]
): IWeeklyActivity[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  return days.map((day, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - index));
    const dateStr = date.toISOString().split('T')[0];
    
    const tasksCompleted = tasks.filter(t => 
      t.status === 'completed' && 
      t.updatedAt && 
      t.updatedAt.startsWith(dateStr)
    ).length;
    
    const habitsCompleted = habits.filter(h => 
      h.completions.some(c => c.date === dateStr && c.completed)
    ).length;
    
    const focusMinutes = focusSessions
      .filter(s => s.startTime.startsWith(dateStr))
      .reduce((sum, s) => sum + s.actualMinutes, 0);
    
    return {
      day,
      tasksCompleted,
      habitsCompleted,
      focusMinutes,
    };
  });
};

// ============================================================================
// TREND ANALYSIS
// ============================================================================

export const calculateTrends = (
  data: { date: string; value: number }[],
  period: 'week' | 'month' | 'year' = 'week'
): ITrend[] => {
  if (data.length < 2) {
    return [{
      date: new Date().toISOString(),
      value: data[0]?.value || 0,
      change: 0,
      changePercentage: 0,
    }];
  }
  
  const sortedData = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const midpoint = Math.floor(sortedData.length / 2);
  const firstHalf = sortedData.slice(0, midpoint);
  const secondHalf = sortedData.slice(midpoint);
  
  const firstAverage = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length;
  const secondAverage = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length;
  
  const change = secondAverage - firstAverage;
  const changePercentage = firstAverage > 0 ? (change / firstAverage) * 100 : 0;
  
  const trend: ITrend = {
    date: new Date().toISOString(),
    value: secondAverage,
    change,
    changePercentage,
  };
  
  return [trend];
};

// ============================================================================
// CATEGORY BREAKDOWN
// ============================================================================

export const calculateCategoryBreakdown = <T extends { category: string }>(
  items: T[]
): ICategoryBreakdown[] => {
  const categoryMap = new Map<string, number>();
  
  items.forEach(item => {
    const current = categoryMap.get(item.category) || 0;
    categoryMap.set(item.category, current + 1);
  });
  
  const total = items.length;
  
  return Array.from(categoryMap.entries()).map(([category, count]) => ({
    category,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
    trend: 'stable' as const,
  }));
};

// ============================================================================
// FINANCIAL ANALYTICS
// ============================================================================

export const calculateFinancialHealth = (
  transactions: ITransaction[],
  accounts: IAccount[]
): {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  netWorth: number;
  topCategories: ICategoryBreakdown[];
} => {
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalExpenses) / totalIncome) * 100 
    : 0;
  
  const netWorth = accounts.reduce((sum, a) => sum + a.balance, 0);
  
  const topCategories = calculateCategoryBreakdown(expenseTransactions);
  
  return {
    totalIncome,
    totalExpenses,
    savingsRate,
    netWorth,
    topCategories,
  };
};

// ============================================================================
// HABIT ANALYTICS
// ============================================================================

export const analyzeHabits = (habits: IHabit[]): {
  totalHabits: number;
  averageStreak: number;
  bestStreak: number;
  completionRate: number;
  categoryBreakdown: ICategoryBreakdown[];
} => {
  const totalHabits = habits.length;
  const averageStreak = habits.reduce((sum, h) => sum + h.streaks.current, 0) / totalHabits;
  const bestStreak = Math.max(...habits.map(h => h.streaks.longest));
  
  const totalCompletions = habits.reduce((sum, h) => 
    sum + h.completions.filter(c => c.completed).length, 0
  );
  const totalPossible = habits.reduce((sum, h) => sum + h.completions.length, 0);
  
  const completionRate = totalPossible > 0 
    ? (totalCompletions / totalPossible) * 100 
    : 0;
  
  const categoryBreakdown = calculateCategoryBreakdown(habits);
  
  return {
    totalHabits,
    averageStreak: Math.round(averageStreak),
    bestStreak,
    completionRate: Math.round(completionRate),
    categoryBreakdown,
  };
};

// ============================================================================
// TASK ANALYTICS
// ============================================================================

export const analyzeTasks = (tasks: ITask[]): {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  overdueTasks: number;
  upcomingTasks: number;
  priorityBreakdown: ICategoryBreakdown[];
  statusBreakdown: ICategoryBreakdown[];
} => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < today;
  }).length;
  
  const upcomingTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    const dueDate = new Date(t.dueDate);
    return dueDate >= today && dueDate <= nextWeek;
  }).length;
  
  const priorityBreakdown = calculateCategoryBreakdown(tasks);
  const statusBreakdown = calculateCategoryBreakdown(tasks);
  
  return {
    totalTasks,
    completedTasks,
    completionRate: Math.round(completionRate),
    overdueTasks,
    upcomingTasks,
    priorityBreakdown,
    statusBreakdown,
  };
};

// ============================================================================
// GOAL ANALYTICS
// ============================================================================

export const analyzeGoals = (goals: IGoal[]): {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  completionRate: number;
  averageProgress: number;
  goalsNearCompletion: IGoal[];
  overdueGoals: IGoal[];
} => {
  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  
  const averageProgress = goals.length > 0
    ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
    : 0;
  
  const goalsNearCompletion = goals.filter(g => 
    g.status === 'active' && g.progress >= 80
  );
  
  const overdueGoals = goals.filter(g => {
    if (!g.targetDate || g.status !== 'active') return false;
    return new Date(g.targetDate) < new Date();
  });
  
  return {
    totalGoals,
    activeGoals,
    completedGoals,
    completionRate: Math.round(completionRate),
    averageProgress: Math.round(averageProgress),
    goalsNearCompletion,
    overdueGoals,
  };
};

// ============================================================================
// FOCUS ANALYTICS
// ============================================================================

export const analyzeFocus = (focusSessions: IFocusSession[]): {
  totalSessions: number;
  totalMinutes: number;
  averageSessionLength: number;
  averageProductivity: number;
  averageMood: number;
  completionRate: number;
  peakHours: { hour: number; count: number }[];
  weeklyTrend: ITrend[];
} => {
  const totalSessions = focusSessions.length;
  const totalMinutes = focusSessions.reduce((sum, s) => sum + s.actualMinutes, 0);
  const averageSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;
  const averageProductivity = focusSessions.reduce((sum, s) => sum + s.productivity, 0) / totalSessions || 0;
  const averageMood = focusSessions.reduce((sum, s) => sum + s.mood, 0) / totalSessions || 0;
  
  const completedSessions = focusSessions.filter(s => s.actualMinutes >= s.plannedMinutes).length;
  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
  
  const hourCounts = new Map<number, number>();
  focusSessions.forEach(session => {
    const hour = new Date(session.startTime).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });
  
  const peakHours = Array.from(hourCounts.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  const weeklyTrend = calculateTrends(
    focusSessions.map(s => ({
      date: s.startTime,
      value: s.actualMinutes,
    }))
  );
  
  return {
    totalSessions,
    totalMinutes,
    averageSessionLength: Math.round(averageSessionLength),
    averageProductivity: Math.round(averageProductivity),
    averageMood: Math.round(averageMood),
    completionRate: Math.round(completionRate),
    peakHours,
    weeklyTrend,
  };
};

// ============================================================================
// COMPREHENSIVE ANALYTICS
// ============================================================================

export const generateComprehensiveAnalytics = (
  tasks: ITask[],
  habits: IHabit[],
  focusSessions: IFocusSession[],
  transactions: ITransaction[],
  accounts: IAccount[],
  goals: IGoal[]
): IAnalytics => {
  const productivityScore = calculateProductivityScore(tasks, habits, focusSessions);
  const consistencyScore = analyzeHabits(habits).completionRate;
  const engagementScore = Math.round(
    (analyzeTasks(tasks).completionRate + 
    analyzeHabits(habits).completionRate + 
    analyzeFocus(focusSessions).completionRate) / 3
  );
  const growthScore = calculateFinancialHealth(transactions, accounts).savingsRate;
  
  const weeklyActivity = calculateWeeklyActivity(tasks, habits, focusSessions);
  
  return {
    productivityScore,
    consistencyScore,
    engagementScore,
    growthScore,
    totalTasksCompleted: tasks.filter(t => t.status === 'completed').length,
    totalHabitsTracked: habits.length,
    totalFocusMinutes: focusSessions.reduce((sum, s) => sum + s.actualMinutes, 0),
    weeklyActivity,
  };
};

// ============================================================================
// AI INSIGHTS GENERATION
// ============================================================================

export const generateInsights = (
  tasks: ITask[],
  habits: IHabit[],
  focusSessions: IFocusSession[],
  transactions: ITransaction[],
  goals: IGoal[]
): IInsight[] => {
  const insights: IInsight[] = [];
  
  const taskAnalysis = analyzeTasks(tasks);
  const habitAnalysis = analyzeHabits(habits);
  const focusAnalysis = analyzeFocus(focusSessions);
  const financialAnalysis = calculateFinancialHealth(transactions, []);
  const goalAnalysis = analyzeGoals(goals);
  
  if (taskAnalysis.overdueTasks > 5) {
    insights.push({
      id: 'insight-1',
      type: 'warning',
      title: 'Many Overdue Tasks',
      description: `You have ${taskAnalysis.overdueTasks} overdue tasks. Consider prioritizing them or rescheduling.`,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  }
  
  if (habitAnalysis.completionRate < 50) {
    insights.push({
      id: 'insight-2',
      type: 'suggestion',
      title: 'Improve Habit Consistency',
      description: `Your habit completion rate is ${habitAnalysis.completionRate}%. Try starting with just one habit to build consistency.`,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  }
  
  if (financialAnalysis.savingsRate < 20) {
    insights.push({
      id: 'insight-3',
      type: 'warning',
      title: 'Low Savings Rate',
      description: `Your savings rate is ${financialAnalysis.savingsRate.toFixed(1)}%. Try to save at least 20% of your income.`,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  }
  
  if (focusAnalysis.averageProductivity > 8) {
    insights.push({
      id: 'insight-4',
      type: 'achievement',
      title: 'High Focus Productivity',
      description: `You're averaging ${focusAnalysis.averageProductivity}/10 productivity during focus sessions. Great work!`,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  }
  
  if (goalAnalysis.goalsNearCompletion.length > 0) {
    insights.push({
      id: 'insight-5',
      type: 'milestone',
      title: 'Goals Near Completion',
      description: `You have ${goalAnalysis.goalsNearCompletion.length} goals that are almost complete! Keep pushing!`,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  }
  
  if (taskAnalysis.upcomingTasks > 10) {
    insights.push({
      id: 'insight-6',
      type: 'suggestion',
      title: 'Busy Week Ahead',
      description: `You have ${taskAnalysis.upcomingTasks} tasks due this week. Consider breaking them down into smaller steps.`,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  }
  
  if (habitAnalysis.bestStreak > 30) {
    insights.push({
      id: 'insight-7',
      type: 'achievement',
      title: 'Streak Record',
      description: `Your longest streak is ${habitAnalysis.bestStreak} days! That's impressive consistency.`,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  }
  
  return insights;
};

// ============================================================================
// PREDICTIVE ANALYTICS
// ============================================================================

export const predictGoalCompletion = (
  goal: IGoal,
  historicalData: { date: string; value: number }[]
): {
  predictedCompletionDate: Date | null;
  confidence: number;
  onTrack: boolean;
} => {
  if (historicalData.length < 3) {
    return {
      predictedCompletionDate: goal.targetDate ? new Date(goal.targetDate) : null,
      confidence: 0,
      onTrack: true,
    };
  }
  
  const sortedData = [...historicalData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const values = sortedData.map(d => d.value);
  const avgProgressPerDay = values[values.length - 1] - values[0];
  const daysElapsed = (new Date().getTime() - new Date(sortedData[0].date).getTime()) / (1000 * 60 * 60 * 24);
  const progressRate = avgProgressPerDay / daysElapsed;
  
  if (progressRate <= 0) {
    return {
      predictedCompletionDate: null,
      confidence: 0,
      onTrack: false,
    };
  }
  
  const remaining = goal.targetValue - goal.currentValue;
  const daysToComplete = remaining / progressRate;
  const predictedDate = new Date();
  predictedDate.setDate(predictedDate.getDate() + daysToComplete);
  
  const targetDate = goal.targetDate ? new Date(goal.targetDate) : null;
  const onTrack = targetDate ? predictedDate <= targetDate : true;
  
  const confidence = Math.min(95, Math.max(30, 100 - (daysElapsed / 30) * 20));
  
  return {
    predictedCompletionDate: predictedDate,
    confidence: Math.round(confidence),
    onTrack,
  };
};

// ============================================================================
// EXPORT ANALYTICS REPORT
// ============================================================================

export const generateAnalyticsReport = (
  analytics: IAnalytics,
  insights: IInsight[]
): string => {
  let report = '# LifeOS Analytics Report\n\n';
  
  report += '## Overview\n';
  report += `- Productivity Score: ${analytics.productivityScore}/100\n`;
  report += `- Consistency Score: ${analytics.consistencyScore}/100\n`;
  report += `- Engagement Score: ${analytics.engagementScore}/100\n`;
  report += `- Growth Score: ${analytics.growthScore}/100\n\n`;
  
  report += '## Activity Summary\n';
  report += `- Tasks Completed: ${analytics.totalTasksCompleted}\n`;
  report += `- Habits Tracked: ${analytics.totalHabitsTracked}\n`;
  report += `- Focus Minutes: ${analytics.totalFocusMinutes}\n\n`;
  
  report += '## Weekly Activity\n';
  analytics.weeklyActivity.forEach(day => {
    report += `- ${day.day}: ${day.tasksCompleted} tasks, ${day.habitsCompleted} habits, ${day.focusMinutes} min focus\n`;
  });
  report += '\n';
  
  if (insights.length > 0) {
    report += '## AI Insights\n';
    insights.forEach(insight => {
      report += `### ${insight.title}\n`;
      report += `${insight.description}\n\n`;
    });
  }
  
  return report;
};

export default {
  calculateProductivityScore,
  calculateWeeklyActivity,
  calculateTrends,
  calculateCategoryBreakdown,
  calculateFinancialHealth,
  analyzeHabits,
  analyzeTasks,
  analyzeGoals,
  analyzeFocus,
  generateComprehensiveAnalytics,
  generateInsights,
  predictGoalCompletion,
  generateAnalyticsReport,
};
