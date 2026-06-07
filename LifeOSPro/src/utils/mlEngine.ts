import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@lifeos_ml_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export interface CacheEntry {
  data: any;
  timestamp: number;
  hits: number;
}

export interface AIPattern {
  patterns: { [key: string]: number };
  lastUsed: string;
}

// Smart Cache for API responses
export class MLEngine {
  private cache: Map<string, CacheEntry> = new Map();
  private patterns: AIPattern = { patterns: {}, lastUsed: '' };
  
  constructor() {
    this.loadFromStorage();
  }

  // Get cached response or null
  getCached(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
      this.cache.delete(key);
      return null;
    }
    
    // Increment hits
    entry.hits++;
    this.saveToStorage();
    return entry.data;
  }

  // Cache a response
  setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
    });
    this.saveToStorage();
  }

  // Learn from user patterns
  learnPattern(input: string): void {
    const words = input.toLowerCase().split(' ');
    words.forEach(word => {
      if (word.length > 3) {
        this.patterns[word] = (this.patterns[word] || 0) + 1;
      }
    });
    this.patterns.lastUsed = new Date().toISOString();
    this.savePatterns();
  }

  // Get personalized suggestions based on learned patterns
  getSuggestions(): string[] {
    const sorted = Object.entries(this.patterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
    return sorted;
  }

  // Local AI Response Generator (saves API credits!)
  generateLocalResponse(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // Task-related responses
    if (lowerInput.includes('task') || lowerInput.includes('todo')) {
      const responses = [
        "For tasks, I recommend using the Eisenhower Matrix: Urgent/Important, Not Urgent/Important, Urgent/Not Important, Not Urgent/Not Important. This helps prioritize effectively!",
        "Try breaking large tasks into smaller sub-tasks. It makes them more manageable and gives you that satisfying completion feeling more often.",
        "The Two-Minute Rule: If a task takes less than 2 minutes, do it immediately. This prevents small tasks from piling up!",
        "Consider time-boxing your tasks. Assign a specific time limit to each task and stick to it.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Habit-related responses
    if (lowerInput.includes('habit')) {
      const responses = [
        "The best way to build a habit is to start incredibly small. Like 2 minutes small. Then gradually increase. Consistency beats intensity!",
        "Use habit stacking: After [current habit], I will [new habit]. This leverages existing habits to build new ones.",
        "Make it obvious, attractive, easy, and satisfying ( atomic habits framework). Design your environment for success!",
        "Track your habits daily. The simple act of checking off a habit reinforces the behavior.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Focus-related responses
    if (lowerInput.includes('focus') || lowerInput.includes('concentrate')) {
      const responses = [
        "Try the Pomodoro Technique: 25 minutes of deep work, then 5 minutes break. After 4 sessions, take a longer 15-30 minute break.",
        "Remove all distractions before starting. Put your phone in another room. Clear your workspace.",
        "Focus is like a muscle - the more you exercise it, the stronger it gets. Start with small increments.",
        "Best focus times vary: Most people peak between 9-11 AM and 2-4 PM. Schedule important work then!",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Finance-related responses
    if (lowerInput.includes('money') || lowerInput.includes('finance') || lowerInput.includes('save')) {
      const responses = [
        "Try the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. Simple and effective!",
        "Automate your savings. Set up automatic transfers to savings on payday. Out of sight, out of mind!",
        "Track every expense for one month. You'll be surprised where your money goes. Knowledge is power!",
        "The key to wealth is spending less than you earn. It's simple but not easy. Start with small cuts.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Health-related responses
    if (lowerInput.includes('health') || lowerInput.includes('exercise') || lowerInput.includes('sleep')) {
      const responses = [
        "Aim for 7-9 hours of sleep. Sleep is when your body and brain recover and consolidate learning.",
        "Exercise doesn't have to be intense. Even a 10-minute walk can boost mood and energy significantly.",
        "Stay hydrated! Aim for 8 glasses of water daily. Dehydration causes fatigue and reduced focus.",
        "Morning sunlight exposure helps regulate your circadian rhythm and improves sleep quality.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Productivity responses
    if (lowerInput.includes('productiv') || lowerInput.includes('procrastinat')) {
      const responses = [
        "Identify your peak energy hours and protect them. Use low energy times for admin tasks.",
        "The 5-minute rule: If you'll do it in under 5 minutes, do it now. Otherwise, schedule it.",
        "Eliminate decision fatigue: Lay out clothes, plan meals, and automate routine choices the night before.",
        "Review your goals daily. Keep them visible. What gets measured gets managed!",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default responses
    const defaults = [
      "I'm learning your patterns to give better advice! Keep using me regularly for personalized suggestions.",
      "Great question! Consistency is key - small daily actions compound into big results over time.",
      "Remember: Progress, not perfection. Every step forward counts, no matter how small!",
      "Your future self will thank you for the work you're doing today. Keep going!",
      "The best time to start was yesterday. The second best time is now. Let's go!",
    ];
    
    return defaults[Math.floor(Math.random() * defaults.length)];
  }

  // Predict user behavior based on patterns
  predictNextAction(): string {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 9) {
      return 'Morning routine - Time for habits!';
    } else if (hour >= 9 && hour < 12) {
      return 'Deep work session - Focus time!';
    } else if (hour >= 12 && hour < 14) {
      return 'Lunch break - Maybe log a meal?';
    } else if (hour >= 14 && hour < 18) {
      return 'Afternoon tasks - Keep momentum!';
    } else if (hour >= 18 && hour < 21) {
      return 'Evening review - Plan tomorrow!';
    } else {
      return 'Wind down - Track your day!';
    }
  }

  // Calculate productivity score
  calculateProductivityScore(tasks: any[], habits: any[], focusSessions: any[]): number {
    let score = 50; // Base score
    
    const today = new Date().toISOString().split('T')[0];
    const completedTasks = tasks.filter(t => t.completed && t.completedAt?.startsWith(today)).length;
    const totalTasks = tasks.length;
    
    // Task completion (up to 20 points)
    if (totalTasks > 0) {
      score += (completedTasks / totalTasks) * 20;
    }
    
    // Habit completion (up to 15 points)
    const completedHabits = habits.filter(h => h.completedDates?.includes(today)).length;
    if (habits.length > 0) {
      score += (completedHabits / habits.length) * 15;
    }
    
    // Focus sessions (up to 15 points)
    const todayFocus = focusSessions.filter(s => s.completed && s.date === today).length;
    score += Math.min(15, todayFocus * 5);
    
    return Math.min(100, Math.round(score));
  }

  // Get motivation message based on score
  getMotivationMessage(score: number): string {
    if (score >= 80) {
      return "🔥 You're on fire! Amazing productivity today!";
    } else if (score >= 60) {
      return "💪 Great progress! Keep up the momentum!";
    } else if (score >= 40) {
      return "📈 You're making progress. Every step counts!";
    } else {
      return "🌱 Let's get started! Small actions lead to big changes.";
    }
  }

  // Save cache to storage
  private async saveToStorage(): Promise<void> {
    try {
      const cacheArray = Array.from(this.cache.entries());
      await AsyncStorage.setItem(CACHE_PREFIX + 'cache', JSON.stringify(cacheArray));
    } catch (e) {
      console.log('Cache save error:', e);
    }
  }

  // Load cache from storage
  private async loadFromStorage(): Promise<void> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_PREFIX + 'cache');
      if (cached) {
        this.cache = new Map(JSON.parse(cached));
      }
    } catch (e) {
      console.log('Cache load error:', e);
    }
  }

  // Save patterns to storage
  private async savePatterns(): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_PREFIX + 'patterns', JSON.stringify(this.patterns));
    } catch (e) {
      console.log('Patterns save error:', e);
    }
  }

  // Clear all cached data
  clearCache(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  // Get cache stats
  getStats(): { size: number; hits: number } {
    let totalHits = 0;
    this.cache.forEach(entry => totalHits += entry.hits);
    return { size: this.cache.size, hits: totalHits };
  }
}

// Export singleton instance
export const mlEngine = new MLEngine();

// Helper to check if should use local AI (saves credits!)
export const shouldUseLocalAI = (): boolean => {
  // Use local AI if:
  // 1. User is not premium
  // 2. Daily API usage exceeded
  // 3. Offline mode
  // For demo, we'll use local AI 70% of the time to save credits
  return Math.random() > 0.3;
};

// Generate response (local or mock API)
export const generateSmartResponse = (input: string, useLocal: boolean = true): string => {
  // Learn from input
  mlEngine.learnPattern(input);
  
  if (useLocal) {
    return mlEngine.generateLocalResponse(input);
  }
  
  // Otherwise return cached or local
  const cacheKey = input.toLowerCase().substring(0, 50);
  const cached = mlEngine.getCached(cacheKey);
  if (cached) {
    return cached;
  }
  
  const response = mlEngine.generateLocalResponse(input);
  mlEngine.setCache(cacheKey, response);
  return response;
};
