export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatFullDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const getDayOfWeek = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

export const isToday = (date: string): boolean => {
  return date === new Date().toISOString().split('T')[0];
};

export const isYesterday = (date: string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date === yesterday.toISOString().split('T')[0];
};

export const getRelativeDate = (date: string): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDate(date);
};

export const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
];

export const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

export const motivationalPhrases = [
  "You're doing amazing! 🌟",
  "Keep pushing forward! 💪",
  "One step at a time 🚶",
  "You've got this! 🔥",
  "Excellence is a habit ⭐",
  "Progress, not perfection 📈",
  "Every action counts 🎯",
  "Be your best self 💎",
];

export const getMotivation = () => motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

const aiKnowledge: { [key: string]: string } = {
  productivity: "For maximum productivity, try time blocking. Dedicate specific hours for specific tasks. Use the 2-minute rule: if it takes less than 2 minutes, do it immediately. Also, try the 80/20 rule - 80% of results come from 20% of efforts.",
  
  habits: "The best way to build habits is to start tiny. Begin with just 2 minutes per day, then gradually increase. Use habit stacking: attach new habits to existing ones. And remember - consistency beats intensity!",
  
  focus: "For deep focus, try the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break. After 4 sessions, take a longer 15-30 minute break. Remove all distractions during focus sessions.",
  
  finance: "For financial health, follow the 50/30/20 rule: 50% needs (essentials), 30% wants (lifestyle), and 20% savings/debt repayment. Track every expense for a month to understand your spending patterns.",
  
  health: "For optimal health, prioritize: 7-9 hours of sleep, 30 minutes of exercise daily, and staying hydrated. Small consistent actions lead to big results over time.",
  
  learning: "For effective learning, use active recall and spaced repetition. Teach what you learn to someone else. Take notes by hand. And most importantly - apply what you learn immediately!",
  
  motivation: "Remember: progress is progress, no matter how small. Celebrate every win, even the tiny ones. Your future self will thank you for the work you're doing today.",
  
  stress: "When stressed, try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7, exhale for 8. Take a walk. Break large problems into small steps. You've handled challenges before - you can do this!",
  
  goals: "Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound. Write them down. Review them daily. Break yearly goals into monthly, weekly, and daily actions.",
  
  time: "Time is your most valuable resource. Say no to things that don't align with your goals. Batch similar tasks together. Protect your morning hours for your most important work.",
  
  default: "I'm here to help you succeed! Ask me about productivity, habits, focus, finance, health, learning, motivation, or any challenge you're facing. Let's figure it out together! 🌟"
};

export const getAIResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('productiv') || lowerInput.includes('focus') || lowerInput.includes('time')) {
    return aiKnowledge.productivity;
  }
  if (lowerInput.includes('habit')) {
    return aiKnowledge.habits;
  }
  if (lowerInput.includes('focus') || lowerInput.includes('pomodoro') || lowerInput.includes('concentrate')) {
    return aiKnowledge.focus;
  }
  if (lowerInput.includes('money') || lowerInput.includes('finance') || lowerInput.includes('save') || lowerInput.includes('budget')) {
    return aiKnowledge.finance;
  }
  if (lowerInput.includes('health') || lowerInput.includes('exercise') || lowerInput.includes('sleep') || lowerInput.includes('diet')) {
    return aiKnowledge.health;
  }
  if (lowerInput.includes('learn') || lowerInput.includes('study') || lowerInput.includes('memory')) {
    return aiKnowledge.learning;
  }
  if (lowerInput.includes('motivat') || lowerInput.includes('inspire') || lowerInput.includes('encourage')) {
    return aiKnowledge.motivation;
  }
  if (lowerInput.includes('stress') || lowerInput.includes('anxiety') || lowerInput.includes('worry') || lowerInput.includes('overwhelm')) {
    return aiKnowledge.stress;
  }
  if (lowerInput.includes('goal') || lowerInput.includes('achieve')) {
    return aiKnowledge.goals;
  }
  if (lowerInput.includes('time') || lowerInput.includes('schedule')) {
    return aiKnowledge.time;
  }
  
  return aiKnowledge.default;
};

export const generateDailyInsight = (state: any): { type: string; title: string; content: string } => {
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = state.tasks.filter((t: any) => t.createdAt?.startsWith(today));
  const completedTasks = state.tasks.filter((t: any) => t.completed && t.completedAt?.startsWith(today));
  const todayHabits = state.habits.filter((h: any) => h.completedDates?.includes(today));
  const totalStreak = state.habits.reduce((acc: number, h: any) => acc + (h.streak || 0), 0);
  
  if (completedTasks.length > 0) {
    return {
      type: 'achievement',
      title: 'Great Progress! 🎉',
      content: `You've completed ${completedTasks.length} tasks today. Keep up the amazing work!`
    };
  }
  
  if (totalStreak > 7) {
    return {
      type: 'tip',
      title: 'On Fire! 🔥',
      content: `You have a ${totalStreak} day streak across your habits. Consistency is key to success!`
    };
  }
  
  if (todayHabits.length > 0) {
    return {
      type: 'progress',
      title: 'Keep It Up! 💪',
      content: `${todayHabits.length} of ${state.habits.length} habits completed today. Every action counts!`
    };
  }
  
  return {
    type: 'tip',
    title: 'Start Your Day Right 🌅',
    content: 'Complete your morning habits and tasks to build momentum for the rest of the day!'
  };
};

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
export const getToday = () => new Date().toISOString().split('T')[0];
