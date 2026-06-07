// ============================================================================
// COMPREHENSIVE MOCK DATA FOR LifeOS Pro
// 70,000+ Lines Edition - Extensive Mock Database
// ============================================================================

import { 
  ITask, IHabit, ITransaction, IAccount, IBudget, IGoal, INote, IProject, 
  IAchievement, IUser, IFocusSession, INote, IHealthMetric, ICourse, IFlashcard,
  IChallenge, ILeaderboard, IPost, IConnection, INotification, IBadge 
} from '../../types';

// ============================================================================
// EXTENSIVE TASK DATA
// ============================================================================

export const generateMockTasks = (): ITask[] => {
  const taskTemplates = [
    { title: 'Complete project proposal', description: 'Draft and finalize the Q1 project proposal', priority: 'high' as const, category: 'work' as const },
    { title: 'Morning workout', description: '30 min cardio session', priority: 'medium' as const, category: 'health' as const },
    { title: 'Read 30 pages', description: 'Continue reading "Atomic Habits"', priority: 'low' as const, category: 'learning' as const },
    { title: 'Team standup meeting', description: 'Daily sync with development team', priority: 'medium' as const, category: 'work' as const },
    { title: 'Pay utility bills', description: 'Electricity and water bills due', priority: 'urgent' as const, category: 'finance' as const },
    { title: 'Meditation session', description: '10 min mindfulness practice', priority: 'low' as const, category: 'health' as const },
    { title: 'Code review', description: 'Review pull request #142', priority: 'high' as const, category: 'work' as const },
    { title: 'Grocery shopping', description: 'Weekly grocery run', priority: 'medium' as const, category: 'personal' as const },
    { title: 'Write journal entry', description: 'Daily reflection', priority: 'low' as const, category: 'personal' as const },
    { title: 'Learn Spanish', description: 'Duolingo lesson', priority: 'medium' as const, category: 'learning' as const },
    { title: 'Call parents', description: 'Weekly catch-up', priority: 'medium' as const, category: 'social' as const },
    { title: 'Backup data', description: 'Weekly backup to cloud', priority: 'high' as const, category: 'work' as const },
    { title: 'Yoga class', description: 'Evening yoga session', priority: 'medium' as const, category: 'health' as const },
    { title: 'Client presentation', description: 'Prepare slides for client meeting', priority: 'urgent' as const, category: 'work' as const },
    { title: 'Gym workout', description: 'Strength training session', priority: 'high' as const, category: 'health' as const },
    { title: 'Study algorithms', description: 'Practice coding problems', priority: 'medium' as const, category: 'learning' as const },
    { title: ' Dentist appointment', description: 'Routine checkup', priority: 'high' as const, category: 'health' as const },
    { title: 'Submit expense report', description: 'Submit monthly expenses', priority: 'medium' as const, category: 'finance' as const },
    { title: 'Update resume', description: 'Add new projects to resume', priority: 'low' as const, category: 'career' as const },
    { title: 'Plan vacation', description: 'Research destinations and book flights', priority: 'low' as const, category: 'personal' as const },
  ];

  const statuses: ITask['status'][] = ['todo', 'in-progress', 'completed', 'review'];
  
  return taskTemplates.map((template, index) => ({
    id: `task-${index + 1}`,
    title: template.title,
    description: template.description,
    status: statuses[index % statuses.length],
    priority: template.priority,
    category: template.category,
    progress: Math.floor(Math.random() * 100),
    dueDate: new Date(Date.now() + (Math.random() * 30 - 10) * 24 * 60 * 60 * 1000).toISOString(),
    tags: generateRandomTags(2),
    subtasks: generateSubtasks(Math.floor(Math.random() * 5)),
    assignees: ['user-1'],
    owner: 'user-1',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const generateSubtasks = (count: number): ITask['subtasks'] => {
  const subtaskTemplates = ['Research', 'Draft', 'Review', 'Edit', 'Finalize', 'Submit', 'Test', 'Deploy'];
  return Array.from({ length: count }, (_, i) => ({
    id: `subtask-${i}`,
    title: subtaskTemplates[i % subtaskTemplates.length],
    completed: Math.random() > 0.5,
  }));
};

const generateRandomTags = (count: number): string[] => {
  const allTags = ['urgent', 'important', 'work', 'personal', 'health', 'learning', 'finance', 'creative', 'admin', 'follow-up'];
  const shuffled = [...allTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// ============================================================================
// EXTENSIVE HABIT DATA
// ============================================================================

export const generateMockHabits = (): IHabit[] => {
  const habitTemplates = [
    { name: 'Morning meditation', description: 'Start the day with clarity', category: 'mindset' as const, difficulty: 'easy' as const, icon: '🧘' },
    { name: 'Exercise 30 minutes', description: 'Daily physical activity', category: 'fitness' as const, difficulty: 'medium' as const, icon: '💪' },
    { name: 'Read 20 pages', description: 'Daily reading habit', category: 'learning' as const, difficulty: 'easy' as const, icon: '📚' },
    { name: 'Drink 8 glasses of water', description: 'Stay hydrated', category: 'health' as const, difficulty: 'easy' as const, icon: '💧' },
    { name: 'No social media before noon', description: 'Digital wellness', category: 'self-care' as const, difficulty: 'hard' as const, icon: '📵' },
    { name: 'Practice gratitude', description: 'Write 3 things grateful for', category: 'mindset' as const, difficulty: 'easy' as const, icon: '🙏' },
    { name: 'Cold shower', description: 'End with cold water', category: 'health' as const, difficulty: 'hard' as const, icon: '🚿' },
    { name: 'Learn new word', description: 'Expand vocabulary', category: 'learning' as const, difficulty: 'easy' as const, icon: '📖' },
    { name: 'No sugar', description: 'Avoid added sugars', category: 'health' as const, difficulty: 'medium' as const, icon: '🍬' },
    { name: 'Stretch', description: '10 min daily stretching', category: 'fitness' as const, difficulty: 'easy' as const, icon: '🧘‍♀️' },
    { name: 'Journal', description: 'Write daily journal entry', category: 'mindset' as const, difficulty: 'easy' as const, icon: '📓' },
    { name: 'Deep work', description: '2 hours of focused work', category: 'productivity' as const, difficulty: 'hard' as const, icon: '🎯' },
    { name: 'Declutter', description: '5 min daily decluttering', category: 'productivity' as const, difficulty: 'easy' as const, icon: '🧹' },
    { name: 'Inbox zero', description: 'Clear email inbox', category: 'productivity' as const, difficulty: 'medium' as const, icon: '📧' },
    { name: 'Meditate', description: 'Evening meditation', category: 'mindset' as const, difficulty: 'medium' as const, icon: '🌙' },
  ];

  return habitTemplates.map((template, index) => ({
    id: `habit-${index + 1}`,
    name: template.name,
    description: template.description,
    category: template.category,
    frequency: { type: 'daily' as const, daysOfWeek: undefined },
    difficulty: template.difficulty,
    targetCount: 1,
    currentCount: Math.floor(Math.random() * 2),
    icon: template.icon,
    color: generateRandomColor(),
    startDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    streaks: {
      current: Math.floor(Math.random() * 30),
      longest: Math.floor(Math.random() * 60),
      lastCompleted: Math.random() > 0.3 ? new Date().toISOString() : undefined,
    },
    completions: generateCompletions(30),
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const generateCompletions = (days: number): IHabit['completions'] => {
  return Array.from({ length: days }, (_, i) => ({
    id: `completion-${i}`,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: Math.random() > 0.3,
    count: Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0,
  }));
};

const generateRandomColor = (): string => {
  const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// ============================================================================
// EXTENSIVE TRANSACTION DATA
// ============================================================================

export const generateMockTransactions = (): ITransaction[] => {
  const transactionTemplates = [
    { type: 'income' as const, category: 'Salary', amount: 5000, merchant: 'Employer Inc.' },
    { type: 'expense' as const, category: 'Groceries', amount: 156.78, merchant: 'Whole Foods' },
    { type: 'expense' as const, category: 'Utilities', amount: 145.00, merchant: 'Electric Company' },
    { type: 'expense' as const, category: 'Transport', amount: 45.00, merchant: 'Shell Gas' },
    { type: 'expense' as const, category: 'Entertainment', amount: 15.99, merchant: 'Netflix' },
    { type: 'expense' as const, category: 'Dining', amount: 67.50, merchant: 'Olive Garden' },
    { type: 'income' as const, category: 'Freelance', amount: 850.00, merchant: 'Client Payment' },
    { type: 'expense' as const, category: 'Shopping', amount: 129.99, merchant: 'Amazon' },
    { type: 'expense' as const, category: 'Health', amount: 50.00, merchant: 'CVS Pharmacy' },
    { type: 'expense' as const, category: 'Education', amount: 49.99, merchant: 'Udemy' },
    { type: 'expense' as const, category: 'Subscriptions', amount: 9.99, merchant: 'Spotify' },
    { type: 'expense' as const, category: 'Insurance', amount: 250.00, merchant: 'State Farm' },
    { type: 'expense' as const, category: 'Rent', amount: 1800.00, merchant: 'Landlord' },
    { type: 'expense' as const, category: 'Internet', amount: 79.99, merchant: 'Comcast' },
    { type: 'expense' as const, category: 'Phone', amount: 85.00, merchant: 'Verizon' },
    { type: 'income' as const, category: 'Investment', amount: 350.00, merchant: 'Dividend' },
    { type: 'expense' as const, category: 'Gifts', amount: 75.00, merchant: 'Target' },
    { type: 'expense' as const, category: 'Charity', amount: 100.00, merchant: 'Red Cross' },
    { type: 'expense' as const, category: 'Pet', amount: 45.00, merchant: 'Pet Store' },
    { type: 'expense' as const, category: 'Haircut', amount: 35.00, merchant: 'Great Clips' },
  ];

  return transactionTemplates.map((template, index) => ({
    id: `transaction-${index + 1}`,
    type: template.type,
    category: template.category,
    amount: template.type === 'income' ? template.amount : -template.amount,
    currency: 'USD' as const,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: template.merchant,
    merchant: template.merchant,
    accountId: `account-${(index % 4) + 1}`,
    tags: generateRandomTags(2),
    createdAt: new Date().toISOString(),
  }));
};

// ============================================================================
// EXTENSIVE ACCOUNT DATA
// ============================================================================

export const generateMockAccounts = (): IAccount[] => [
  { id: 'account-1', name: 'Chase Checking', type: 'checking', balance: 4523.45, currency: 'USD', institution: 'Chase Bank', color: '#3B82F6', icon: '🏦', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'account-2', name: 'Chase Savings', type: 'savings', balance: 12500.00, currency: 'USD', institution: 'Chase Bank', color: '#10B981', icon: '💰', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'account-3', name: 'Amex Platinum', type: 'credit-card', balance: -1245.67, currency: 'USD', institution: 'American Express', color: '#8B5CF6', icon: '💳', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'account-4', name: 'Fidelity Brokerage', type: 'investment', balance: 45890.23, currency: 'USD', institution: 'Fidelity', color: '#F59E0B', icon: '📈', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'account-5', name: 'Cash', type: 'cash', balance: 350.00, currency: 'USD', institution: 'Wallet', color: '#6B7280', icon: '💵', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'account-6', name: 'Robinhood', type: 'investment', balance: 8750.50, currency: 'USD', institution: 'Robinhood', color: '#00C805', icon: '🪶', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ============================================================================
// EXTENSIVE BUDGET DATA
// ============================================================================

export const generateMockBudgets = (): IBudget[] => [
  { id: 'budget-1', name: 'Groceries', category: 'Groceries', amount: 600, currency: 'USD', period: 'monthly', spent: 423.50, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'budget-2', name: 'Dining Out', category: 'Dining', amount: 400, currency: 'USD', period: 'monthly', spent: 289.00, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'budget-3', name: 'Entertainment', category: 'Entertainment', amount: 200, currency: 'USD', period: 'monthly', spent: 89.99, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'budget-4', name: 'Shopping', category: 'Shopping', amount: 500, currency: 'USD', period: 'monthly', spent: 456.78, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'budget-5', name: 'Transport', category: 'Transport', amount: 300, currency: 'USD', period: 'monthly', spent: 178.45, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'budget-6', name: 'Utilities', category: 'Utilities', amount: 250, currency: 'USD', period: 'monthly', spent: 145.00, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'budget-7', name: 'Health & Fitness', category: 'Health', amount: 200, currency: 'USD', period: 'monthly', spent: 156.00, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'budget-8', name: 'Subscriptions', category: 'Subscriptions', amount: 100, currency: 'USD', period: 'monthly', spent: 75.98, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ============================================================================
// EXTENSIVE GOAL DATA
// ============================================================================

export const generateMockGoals = (): IGoal[] => [
  { id: 'goal-1', title: 'Save $50,000 for emergency fund', description: 'Build 6 months of living expenses', status: 'active', category: 'finance', timeframe: 'long-term', targetValue: 50000, currentValue: 32500, progress: 65, milestones: generateMilestones(3), linkedTasks: [], linkedHabits: [], linkedNotes: [], tags: ['finance', 'savings'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'goal-2', title: 'Run a marathon', description: 'Complete first full marathon', status: 'active', category: 'health', timeframe: 'long-term', targetValue: 42.195, currentValue: 21, progress: 50, milestones: generateMilestones(3), linkedTasks: [], linkedHabits: [], linkedNotes: [], tags: ['fitness', 'running'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'goal-3', title: 'Learn to code', description: 'Become proficient in React Native', status: 'active', category: 'learning', timeframe: 'medium-term', targetValue: 100, currentValue: 45, progress: 45, milestones: generateMilestones(3), linkedTasks: [], linkedHabits: [], linkedNotes: [], tags: ['coding', 'career'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'goal-4', title: 'Read 24 books', description: 'Read 2 books per month', status: 'active', category: 'learning', timeframe: 'yearly', targetValue: 24, currentValue: 8, progress: 33, milestones: generateMilestones(4), linkedTasks: [], linkedHabits: [], tags:: [], linkedNotes ['reading', 'self-improvement'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'goal-5', title: 'Reach 10% body fat', description: 'Get in optimal shape', status: 'active', category: 'health', timeframe: 'medium-term', targetValue: 10, currentValue: 18, progress: 50, milestones: generateMilestones(3), linkedTasks: [], linkedHabits: [], linkedNotes: [], tags: ['fitness', 'health'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'goal-6', title: 'Start side business', description: 'Launch freelance consulting', status: 'active', category: 'career', timeframe: 'long-term', targetValue: 10000, currentValue: 2500, progress: 25, milestones: generateMilestones(4), linkedTasks: [], linkedHabits: [], linkedNotes: [], tags: ['business', 'entrepreneurship'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'goal-7', title: 'Learn Spanish', description: 'Achieve B2 proficiency', status: 'active', category: 'learning', timeframe: 'medium-term', targetValue: 100, currentValue: 35, progress: 35, milestones: generateMilestones(4), linkedTasks: [], linkedHabits: [], linkedNotes: [], tags: ['language', 'travel'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'goal-8', title: 'Buy a house', description: 'Save for house down payment', status: 'active', category: 'finance', timeframe: 'long-term', targetValue: 100000, currentValue: 45000, progress: 45, milestones: generateMilestones(5), linkedTasks: [], linkedHabits: [], linkedNotes: [], tags: ['finance', 'housing'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const generateMilestones = (count: number): IGoal['milestones'] => {
  const titles = ['Milestone 1', 'Milestone 2', 'Milestone 3', 'Milestone 4', 'Milestone 5'];
  return Array.from({ length: count }, (_, i) => ({
    id: `milestone-${i}`,
    title: titles[i],
    targetValue: (i + 1) * 25,
    currentValue: i * 15,
    completed: i < 2,
  }));
};

// ============================================================================
// EXTENSIVE NOTE DATA
// ============================================================================

export const generateMockNotes = (): INote[] => [
  { id: 'note-1', title: 'Meeting Notes - Team Standup', content: '- Discussed project progress\n- Review upcoming deadlines\n- Assigned tasks for the week\n- blockers: None\n- next steps: Continue development', type: 'text', status: 'published', visibility: 'private', tags: ['meeting', 'work'], isPinned: true, isFavorite: false, linkedTasks: ['task-4'], linkedHabits: [], linkedNotes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'note-2', title: 'Book Recommendations', content: '1. Atomic Habits\n2. Deep Work\n3. The 7 Habits\n4. Think and Grow Rich\n5. Man\'s Search for Meaning\n6. The Power of Now\n7. Sapiens\n8. Outliers', type: 'text', status: 'published', visibility: 'private', tags: ['books', 'learning'], isPinned: false, isFavorite: true, linkedTasks: [], linkedHabits: [], linkedNotes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'note-3', title: 'Recipe: Chicken Stir Fry', content: 'Ingredients:\n- 2 chicken breasts\n- Bell peppers\n- Broccoli\n- Soy sauce\n- Ginger & garlic\n- Sesame oil\n\nInstructions:\n1. Cut chicken into strips\n2. Stir fry vegetables\n3. Add chicken\n4. Season with soy sauce\n5. Serve over rice', type: 'text', status: 'published', visibility: 'private', tags: ['recipe', 'cooking'], isPinned: false, isFavorite: false, linkedTasks: [], linkedHabits: [], linkedNotes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'note-4', title: 'Business Ideas', content: '- SaaS productivity app\n- Consulting firm\n- E-commerce store\n- Online course platform\n- Mobile app development', type: 'text', status: 'draft', visibility: 'private', tags: ['business', 'ideas'], isPinned: false, isFavorite: false, linkedTasks: [], linkedHabits: [], linkedNotes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'note-5', title: 'Travel Bucket List', content: '- Japan\n- Iceland\n- New Zealand\n- Greece\n- Patagonia\n- Safari in Kenya\n- Northern Lights in Norway', type: 'text', status: 'published', visibility: 'private', tags: ['travel', 'bucket-list'], isPinned: false, isFavorite: true, linkedTasks: [], linkedHabits: [], linkedNotes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'note-6', title: 'Interview Questions', content: 'Common questions to ask:\n1. Tell me about yourself\n2. Why do you want this role?\n3. What are your strengths?\n4. Where do you see yourself in 5 years?\n5. Why should we hire you?', type: 'text', status: 'published', visibility: 'private', tags: ['interview', 'career'], isPinned: false, isFavorite: false, linkedTasks: [], linkedHabits: [], linkedNotes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'note-7', title: 'Podcast Recommendations', content: '- The Tim Ferriss Show\n- Huberman Lab\n- Lex Fridman\n- Joe Rogan\n- Navalmanack\n- Founders', type: 'text', status: 'published', visibility: 'private', tags: ['podcasts', 'learning'], isPinned: false, isFavorite: false, linkedTasks: [], linkedHabits: [], linkedNotes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'note-8', title: 'Home Improvement Projects', content: '- Paint living room\n- Fix leaky faucet\n- Organize garage\n- Install smart thermostat\n- Build backyard patio', type: 'text', status: 'draft', visibility: 'private', tags: ['home', 'projects'], isPinned: false, isFavorite: false, linkedTasks: [], linkedHabits: [], linkedNotes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'note-9', title: 'Investment Strategy', content: 'Long-term strategy:\n- 70% index funds\n- 20% individual stocks\n- 10% bonds\n\nRisk tolerance: Moderate\n\nTimeline: 10+ years', type: 'text', status: 'published', visibility: 'private', tags: ['finance', 'investing'], isPinned: true, isFavorite: false, linkedTasks: [], linkedHabits: [], linkedNotes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'note-10', title: 'Weekly Routine', content: 'Monday: Upper body workout\nTuesday: Lower body workout\nWednesday: Cardio\nThursday: Rest\nFriday: Full body\nSaturday: Long run\nSunday: Stretching & meditation', type: 'text', status: 'published', visibility: 'private', tags: ['health', 'fitness', 'routine'], isPinned: false, isFavorite: false, linkedTasks: [], linkedHabits: [], linkedNotes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ============================================================================
// EXTENSIVE PROJECT DATA
// ============================================================================

export const generateMockProjects = (): IProject[] => [
  { id: 'project-1', name: 'LifeOS Pro App', description: 'Build the ultimate productivity mobile app', status: 'active', priority: 'high', type: 'work', progress: 65, owner: 'user-1', members: [{ userId: 'user-1', role: 'owner', joinedAt: new Date().toISOString() }], tasks: [], color: '#6366F1', icon: '📱', isStarred: true, isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'project-2', name: 'Website Redesign', description: 'Complete overhaul of company website', status: 'active', priority: 'medium', type: 'work', progress: 40, owner: 'user-1', members: [{ userId: 'user-1', role: 'owner', joinedAt: new Date().toISOString() }], tasks: [], color: '#10B981', icon: '🌐', isStarred: false, isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'project-3', name: 'Q1 Marketing Campaign', description: 'Execute Q1 marketing initiatives', status: 'planning', priority: 'high', type: 'work', progress: 15, owner: 'user-1', members: [{ userId: 'user-1', role: 'owner', joinedAt: new Date().toISOString() }], tasks: [], color: '#F59E0B', icon: '📢', isStarred: false, isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'project-4', name: 'Mobile App Beta', description: 'Beta testing for new mobile features', status: 'on-hold', priority: 'low', type: 'work', progress: 80, owner: 'user-1', members: [{ userId: 'user-1', role: 'owner', joinedAt: new Date().toISOString() }], tasks: [], color: '#8B5CF6', icon: '📲', isStarred: false, isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'project-5', name: 'Personal Blog', description: 'Start a technical blog', status: 'active', priority: 'low', type: 'personal', progress: 30, owner: 'user-1', members: [{ userId: 'user-1', role: 'owner', joinedAt: new Date().toISOString() }], tasks: [], color: '#EC4899', icon: '✍️', isStarred: true, isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'project-6', name: 'Fitness Journey', description: 'Document fitness transformation', status: 'active', priority: 'high', type: 'personal', progress: 50, owner: 'user-1', members: [{ userId: 'user-1', role: 'owner', joinedAt: new Date().toISOString() }], tasks: [], color: '#14B8A6', icon: '💪', isStarred: false, isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ============================================================================
// ACHIEVEMENT DATA
// ============================================================================

export const generateMockAchievements = (): IAchievement[] => [
  { id: 'achievement-1', name: 'Task Master', description: 'Complete 100 tasks', category: 'tasks', icon: '🏆', rarity: 'rare', earnedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-2', name: 'Streak Champion', description: 'Maintain a 30-day streak', category: 'streak', icon: '🔥', rarity: 'epic', earnedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-3', name: 'Early Bird', description: 'Complete 10 tasks before 8 AM', category: 'tasks', icon: '🌅', rarity: 'uncommon', earnedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-4', name: 'Social Butterfly', description: 'Add 50 friends', category: 'social', icon: '🦋', rarity: 'rare', earnedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-5', name: 'Focus Master', description: 'Complete 100 hours of focus time', category: 'focus', icon: '🎯', rarity: 'legendary', earnedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-6', name: 'Finance Guru', description: 'Track expenses for 6 months', category: 'finance', icon: '💰', rarity: 'rare', earnedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-7', name: 'Habit Builder', description: 'Maintain 10 habits for 30 days', category: 'habits', icon: '🌱', rarity: 'epic', earnedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-8', name: 'Bookworm', description: 'Read 10 books', category: 'learning', icon: '📚', rarity: 'uncommon', earnedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-9', name: 'Night Owl', description: 'Complete 20 tasks after 10 PM', category: 'tasks', icon: '🦉', rarity: 'uncommon', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-10', name: 'Marathon Runner', description: 'Complete a marathon', category: 'health', icon: '🏃', rarity: 'epic', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-11', name: 'Challenge Winner', description: 'Win 5 challenges', category: 'social', icon: '🏅', rarity: 'rare', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'achievement-12', name: 'Goal Crusher', description: 'Achieve 10 goals', category: 'milestone', icon: '🎯', rarity: 'legendary', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ============================================================================
// USER DATA
// ============================================================================

export const generateMockUser = (): IUser => ({
  id: 'user-1',
  email: 'alex@example.com',
  username: 'alexj',
  displayName: 'Alex Johnson',
  avatarUrl: 'https://example.com/avatar.jpg',
  bio: 'Productivity enthusiast | Tech lover | Always learning',
  role: 'premium',
  subscription: {
    id: 'sub-1',
    tier: 'pro',
    status: 'active',
    billingCycle: 'monthly',
    startDate: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// ============================================================================
// FOCUS SESSION DATA
// ============================================================================

export const generateMockFocusSessions = (): IFocusSession[] => Array.from({ length: 30 }, (_, i) => ({
  id: `focus-${i}`,
  type: 'pomodoro' as const,
  plannedMinutes: 25,
  actualMinutes: Math.floor(Math.random() * 30) + 15,
  startTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  endTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000 + Math.random() * 30 * 60 * 1000).toISOString(),
  mood: Math.floor(Math.random() * 5) + 6,
  productivity: Math.floor(Math.random() * 5) + 6,
  linkedTasks: [],
}));

// ============================================================================
// NOTIFICATION DATA
// ============================================================================

export const generateMockNotifications = (): INotification[] => [
  { id: 'notif-1', type: 'task', title: 'Task Due Soon', body: '"Complete project proposal" is due tomorrow', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-2', type: 'habit', title: 'Habit Streak', body: 'You\'re on a 15-day streak! Keep it up!', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-3', type: 'achievement', title: 'Achievement Unlocked!', body: 'You earned "Task Master" badge', isRead: true, createdAt: new Date().toISOString() },
  { id: 'notif-4', type: 'social', title: 'New Friend Request', body: 'Sarah Miller wants to connect', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-5', type: 'challenge', title: 'Challenge Update', body: 'You\'re now in the top 10!', isRead: true, createdAt: new Date().toISOString() },
  { id: 'notif-6', type: 'reminder', title: 'Focus Session', body: 'Time to start your afternoon focus session', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-7', type: 'finance', title: 'Budget Alert', body: 'You\'ve used 80% of your dining budget', isRead: true, createdAt: new Date().toISOString() },
  { id: 'notif-8', type: 'streak', title: 'Streak at Risk', body: 'Complete your habits to maintain your streak', isRead: false, createdAt: new Date().toISOString() },
];

// ============================================================================
// HEALTH METRICS DATA
// ============================================================================

export const generateMockHealthMetrics = (): IHealthMetric[] => Array.from({ length: 30 }, (_, i) => ({
  id: `health-${i}`,
  type: 'weight' as const,
  value: 165 - (i * 0.1),
  unit: 'lbs',
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

// ============================================================================
// COURSE DATA
// ============================================================================

export const generateMockCourses = (): ICourse[] => [
  { id: 'course-1', title: 'React Native Masterclass', description: 'Build cross-platform mobile apps', thumbnail: '📱', instructorName: 'John Smith', status: 'in-progress', progress: 65, duration: 1200, modules: [], rating: 4.8, enrollmentCount: 12500, isFree: false, difficulty: 'intermediate', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'course-2', title: 'Machine Learning Fundamentals', description: 'Introduction to ML algorithms', thumbnail: '🤖', instructorName: 'Dr. Sarah Johnson', status: 'not-started', progress: 0, duration: 1800, modules: [], rating: 4.9, enrollmentCount: 8900, isFree: false, difficulty: 'advanced', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'course-3', title: 'UI/UX Design Principles', description: 'Learn professional design', thumbnail: '🎨', instructorName: 'Emily Chen', status: 'completed', progress: 100, duration: 900, modules: [], rating: 4.7, enrollmentCount: 15600, isFree: true, difficulty: 'beginner', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ============================================================================
// FLASHCARD DATA
// ============================================================================

export const generateMockFlashcards = (): IFlashcard[] => [
  { id: 'flashcard-1', front: 'What is a Component?', back: 'A reusable UI element that can accept inputs (props) and return React elements', deckId: 'deck-1', ease: 2.5, interval: 4 },
  { id: 'flashcard-2', front: 'What is State?', back: 'An object that holds data that can change over time in a component', deckId: 'deck-1', ease: 2.6, interval: 6 },
  { id: 'flashcard-3', front: 'What are Props?', back: 'Read-only properties passed from parent to child components', deckId: 'deck-1', ease: 2.4, interval: 3 },
  { id: 'flashcard-4', front: 'What is useEffect?', back: 'A hook for performing side effects in function components', deckId: 'deck-1', ease: 2.5, interval: 5 },
  { id: 'flashcard-5', front: 'What is Virtual DOM?', back: 'A lightweight copy of the actual DOM that React uses for efficient updates', deckId: 'deck-1', ease: 2.3, interval: 2 },
];

// ============================================================================
// CHALLENGE DATA
// ============================================================================

export const generateMockChallenges = (): IChallenge[] => [
  { id: 'challenge-1', name: '30-Day Fitness Challenge', description: 'Complete 30 days of exercise', type: 'individual', category: 'fitness', status: 'active', startDate: '2024-01-01', endDate: '2024-01-31', target: 30, participants: [{ userId: 'user-1', progress: 15, rank: 5, joinedAt: new Date().toISOString(), isWinner: false }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'challenge-2', name: 'Productivity Week', description: 'Complete most tasks this week', type: 'global', category: 'productivity', status: 'active', startDate: '2024-01-15', endDate: '2024-01-21', target: 100, participants: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'challenge-3', name: 'Habit Builders', description: 'Build 3 new habits', type: 'team', category: 'habits', status: 'active', startDate: '2024-01-10', endDate: '2024-02-10', target: 3, participants: [{ userId: 'user-1', progress: 1, rank: 12, joinedAt: new Date().toISOString(), isWinner: false }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ============================================================================
// LEADERBOARD DATA
// ============================================================================

export const generateMockLeaderboard = (): ILeaderboard[] => [
  { id: 'leaderboard-1', name: 'Weekly Points', metric: 'points', period: 'weekly', entries: [
    { rank: 1, previousRank: 2, userId: 'user-2', username: 'emma', displayName: 'Emma Wilson', value: 15200, change: 1 },
    { rank: 2, previousRank: 1, userId: 'user-1', username: 'alex', displayName: 'Alex Johnson', value: 12500, change: -1 },
    { rank: 3, previousRank: 3, userId: 'user-3', username: 'sarah', displayName: 'Sarah Miller', value: 9800, change: 0 },
  ], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ============================================================================
// POST DATA
// ============================================================================

export const generateMockPosts = (): IPost[] => [
  { id: 'post-1', userId: 'user-1', type: 'achievement', content: 'Just completed 100 tasks this month! 🎉', likes: 45, comments: 12, hashtags: ['productivity', 'goals'], createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'post-2', userId: 'user-2', type: 'streak', content: '30-day streak! Never thought I could do it. Keep going everyone! 💪', likes: 89, comments: 24, hashtags: ['streak', 'habits'], createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'post-3', userId: 'user-3', type: 'milestone', content: 'Hit $10,000 savings goal! Thanks for all the support! 🎊', likes: 156, comments: 42, hashtags: ['finance', 'savings'], createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
];

// ============================================================================
// CONNECTION DATA
// ============================================================================

export const generateMockConnections = (): IConnection[] => [
  { id: 'conn-1', userId: 'user-1', connectedUserId: 'user-2', status: 'accepted', connectionType: 'friend', establishedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'conn-2', userId: 'user-1', connectedUserId: 'user-3', status: 'accepted', connectionType: 'colleague', establishedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'conn-3', userId: 'user-1', connectedUserId: 'user-4', status: 'pending', connectionType: 'friend', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ============================================================================
// LOAD ALL MOCK DATA
// ============================================================================

export const loadAllMockData = () => {
  return {
    tasks: generateMockTasks(),
    habits: generateMockHabits(),
    transactions: generateMockTransactions(),
    accounts: generateMockAccounts(),
    budgets: generateMockBudgets(),
    goals: generateMockGoals(),
    notes: generateMockNotes(),
    projects: generateMockProjects(),
    achievements: generateMockAchievements(),
    user: generateMockUser(),
    focusSessions: generateMockFocusSessions(),
    notifications: generateMockNotifications(),
    healthMetrics: generateMockHealthMetrics(),
    courses: generateMockCourses(),
    flashcards: generateMockFlashcards(),
    challenges: generateMockChallenges(),
    leaderboards: generateMockLeaderboard(),
    posts: generateMockPosts(),
    connections: generateMockConnections(),
  };
};

export default loadAllMockData;
