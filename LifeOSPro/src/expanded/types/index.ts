// ============================================================================
// COMPREHENSIVE TYPE DEFINITIONS FOR LifeOS Pro
// 70,000+ Lines Edition - Enterprise Grade TypeScript Types
// ============================================================================

// ============================================================================
// CORE APPLICATION TYPES
// ============================================================================

export type UUID = string & { readonly brand: unique symbol };
export type DateISO = string & { readonly brand: unique symbol };
export type Email = string & { readonly brand: unique symbol };
export type PhoneNumber = string & { readonly brand: unique symbol };
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR' | 'AUD' | 'CAD';
export type LocaleCode = 'en-US' | 'en-GB' | 'fr-FR' | 'de-DE' | 'es-ES' | 'ja-JP' | 'zh-CN' | 'pt-BR';
export type Timezone = string;

export interface IBaseEntity {
  id: UUID;
  createdAt: DateISO;
  updatedAt: DateISO;
  version: number;
  isDeleted: boolean;
  metadata?: Record<string, unknown>;
}

export interface IAuditableEntity extends IBaseEntity {
  createdBy: UUID;
  updatedBy: UUID;
  deletedAt?: DateISO;
  deletedBy?: UUID;
}

export interface ITenantAware {
  tenantId: UUID;
  organizationId?: UUID;
}

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export type UserRole = 'admin' | 'moderator' | 'premium' | 'free' | 'guest';
export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending' | 'deactivated';
export type AuthProvider = 'email' | 'google' | 'apple' | 'facebook' | 'twitter' | 'github';
export type TwoFactorMethod = 'sms' | 'email' | 'authenticator' | 'biometric';

export interface IUser extends IAuditableEntity {
  email: Email;
  username: string;
  displayName: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isTwoFactorEnabled: boolean;
  twoFactorMethod?: TwoFactorMethod;
  phoneNumber?: PhoneNumber;
  dateOfBirth?: DateISO;
  gender?: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';
  locale: LocaleCode;
  timezone: Timezone;
  preferences: IUserPreferences;
  stats: IUserStats;
  subscription?: ISubscription;
  profile: IUserProfile;
  socialLinks?: ISocialLinks;
  notificationSettings: INotificationSettings;
  privacySettings: IPrivacySettings;
  securitySettings: ISecuritySettings;
  onboardingStatus: IOnboardingStatus;
  lastLoginAt?: DateISO;
  lastActiveAt?: DateISO;
  streak: IUserStreak;
  achievements: IAchievement[];
  badges: IBadge[];
  referralCode: string;
  referredBy?: UUID;
}

export interface IUserPreferences {
  theme: ThemeMode;
  accentColor: string;
  fontSize: FontSize;
  language: LocaleCode;
  dateFormat: DateFormat;
  timeFormat: '12h' | '24h';
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  currency: CurrencyCode;
  measurementUnit: 'metric' | 'imperial';
  enableAnimations: boolean;
  enableHapticFeedback: boolean;
  enableSounds: boolean;
  enableVibration: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  screenReaderMode: boolean;
  compactMode: boolean;
  showTutorial: boolean;
  autoSaveInterval: number;
  maxAutoSaveAge: number;
}

export type ThemeMode = 'light' | 'dark' | 'auto' | 'oled' | 'sepia' | 'high-contrast';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD MMM YYYY';

export interface IUserStats {
  totalTasksCompleted: number;
  totalHabitsTracked: number;
  totalFocusSessions: number;
  totalFocusMinutes: number;
  totalNotesCreated: number;
  totalGoalsAchieved: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  totalXp: number;
  level: number;
  rank: number;
  totalFriends: number;
  totalChallengesJoined: number;
  totalChallengesWon: number;
  totalReferrals: number;
  totalRevenue: number;
  weeklyActivity: IWeeklyActivity[];
  monthlyActivity: IMonthlyActivity[];
  yearlyActivity: IYearlyActivity[];
}

export interface IWeeklyActivity {
  day: string;
  tasksCompleted: number;
  habitsCompleted: number;
  focusMinutes: number;
  notesCreated: number;
}

export interface IMonthlyActivity {
  week: number;
  tasksCompleted: number;
  habitsCompleted: number;
  focusMinutes: number;
  notesCreated: number;
  revenue: number;
}

export interface IYearlyActivity {
  month: number;
  tasksCompleted: number;
  habitsCompleted: number;
  focusMinutes: number;
  notesCreated: number;
  revenue: number;
}

export interface IUserProfile {
  headline?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  website?: string;
  birthday?: DateISO;
  anniversary?: DateISO;
  interests: string[];
  skills: string[];
  certifications: ICertification[];
  education: IEducation[];
  employment: IEmployment[];
  projects: IProjectReference[];
  publications: IPublication[];
  awards: IAward[];
  languages: ILanguage[];
  volunteer: IVolunteerWork[];
}

export interface ICertification {
  name: string;
  issuer: string;
  dateIssued: DateISO;
  expiryDate?: DateISO;
  credentialId?: string;
  credentialUrl?: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: DateISO;
  endDate?: DateISO;
  grade?: string;
  activities?: string[];
  description?: string;
}

export interface IEmployment {
  company: string;
  title: string;
  location?: string;
  startDate: DateISO;
  endDate?: DateISO;
  isCurrent: boolean;
  description?: string;
  achievements?: string[];
}

export interface IProjectReference {
  id: UUID;
  name: string;
  role: string;
  url?: string;
}

export interface IPublication {
  title: string;
  publisher: string;
  date: DateISO;
  url?: string;
  description?: string;
}

export interface IAward {
  title: string;
  issuer: string;
  date: DateISO;
  description?: string;
}

export interface ILanguage {
  language: string;
  proficiency: 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'native';
}

export interface IVolunteerWork {
  organization: string;
  role: string;
  cause: string;
  startDate: DateISO;
  endDate?: DateISO;
  description?: string;
  hours?: number;
}

export interface ISocialLinks {
  website?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  github?: string;
  dribbble?: string;
  behance?: string;
  medium?: string;
  reddit?: string;
  discord?: string;
  slack?: string;
}

export interface INotificationSettings {
  push: IPushNotificationSettings;
  email: IEmailNotificationSettings;
  sms: ISmsNotificationSettings;
  inApp: IInAppNotificationSettings;
  schedule: INotificationSchedule;
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
  reminders: boolean;
  promotions: boolean;
  sound: string;
  vibration: boolean;
}

export interface IEmailNotificationSettings {
  enabled: boolean;
  frequency: 'instant' | 'daily' | 'weekly' | 'monthly';
  tasks: boolean;
  habits: boolean;
  focus: boolean;
  social: boolean;
  finance: boolean;
  achievements: boolean;
  streak: boolean;
  reminders: boolean;
  promotions: boolean;
  newsletter: boolean;
  digest: boolean;
}

export interface ISmsNotificationSettings {
  enabled: boolean;
  tasks: boolean;
  habits: boolean;
  focus: boolean;
  social: boolean;
  finance: boolean;
  achievements: boolean;
  streak: boolean;
  reminders: boolean;
}

export interface IInAppNotificationSettings {
  enabled: boolean;
  tasks: boolean;
  habits: boolean;
  focus: boolean;
  social: boolean;
  finance: boolean;
  achievements: boolean;
  streak: boolean;
  reminders: boolean;
  showPreview: boolean;
  sound: boolean;
}

export interface INotificationSchedule {
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  doNotDisturb: boolean;
  scheduleNotifications: boolean;
}

export interface IPrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showActivity: boolean;
  showStats: boolean;
  showAchievements: boolean;
  allowTagging: boolean;
  allowMessaging: boolean;
  allowFriendRequests: boolean;
  showOnLeaderboard: boolean;
  shareDataForResearch: boolean;
  analyticsTracking: boolean;
  personalizedAds: boolean;
}

export interface ISecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: TwoFactorMethod;
  loginAlerts: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordExpiryDays: number;
  requireStrongPassword: boolean;
  biometricLogin: boolean;
  trustedDevices: ITrustedDevice[];
  activeSessions: ISession[];
}

export interface ITrustedDevice {
  id: UUID;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'other';
  os: string;
  browser?: string;
  lastUsed: DateISO;
  addedAt: DateISO;
}

export interface ISession {
  id: UUID;
  device: string;
  os: string;
  browser: string;
  ip: string;
  location: string;
  startedAt: DateISO;
  lastActive: DateISO;
  current: boolean;
}

export interface IOnboardingStatus {
  completed: boolean;
  currentStep: number;
  totalSteps: number;
  skippedSteps: number[];
  completedAt?: DateISO;
  steps: IOnboardingStep[];
}

export interface IOnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  skipped: boolean;
  completedAt?: DateISO;
}

export interface IUserStreak {
  current: number;
  longest: number;
  lastActivityDate?: DateISO;
  freezeCount: number;
  streakStartDate?: DateISO;
  streakEndDate?: DateISO;
  milestones: IStreakMilestone[];
}

export interface IStreakMilestone {
  days: number;
  reward: string;
  achieved: boolean;
  achievedAt?: DateISO;
}

// ============================================================================
// SUBSCRIPTION & PAYMENT TYPES
// ============================================================================

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past-due' | 'trialing' | 'paused';
export type BillingCycle = 'monthly' | 'yearly' | 'lifetime';
export type PaymentMethod = 'card' | 'paypal' | 'apple-pay' | 'google-pay' | 'bank-transfer' | 'crypto';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export interface ISubscription {
  id: UUID;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: DateISO;
  endDate?: DateISO;
  trialEndDate?: DateISO;
  autoRenew: boolean;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: IPaymentMethod;
  billingAddress?: IBillingAddress;
  invoices: IInvoice[];
  usage: ISubscriptionUsage;
  features: ISubscriptionFeatures;
  addons: ISubscriptionAddon[];
  referralDiscount?: IReferralDiscount;
  lifetimeDiscount?: ILifetimeDiscount;
}

export interface IPaymentMethod {
  id: UUID;
  type: PaymentMethod;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isVerified: boolean;
}

export interface IBillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IInvoice {
  id: UUID;
  number: string;
  amount: number;
  currency: Currency;
  status: 'draft' | 'pending' | 'paid' | 'void' | 'uncollectible' | 'refunded';
  date: DateISO;
  dueDate: DateISO;
  paidAt?: DateISO;
  description: string;
  items: IInvoiceItem[];
  tax: number;
  total: number;
  pdfUrl?: string;
}

export interface IInvoiceItem {
  id: UUID;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  tax?: number;
}

export interface ISubscriptionUsage {
  aiCredits: IUsageMetric;
  storageGB: IUsageMetric;
  apiCalls: IUsageMetric;
  teamMembers: IUsageMetric;
  customDomains: IUsageMetric;
  analyticsRetention: IUsageMetric;
}

export interface IUsageMetric {
  current: number;
  limit: number;
  unit: string;
  resetAt: DateISO;
  overage?: number;
  overageRate?: number;
}

export interface ISubscriptionFeatures {
  aiAssistant: boolean;
  advancedAnalytics: boolean;
  customThemes: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  integrations: boolean;
  customBranding: boolean;
  unlimitedHistory: boolean;
  advancedSecurity: boolean;
  teamCollaboration: boolean;
  exportData: boolean;
  removeAds: boolean;
  earlyAccess: boolean;
}

export interface ISubscriptionAddon {
  id: UUID;
  name: string;
  description: string;
  price: number;
  quantity: number;
  features: string[];
}

export interface IReferralDiscount {
  referrerDiscount: number;
  refereeDiscount: number;
  maxReferrals: number;
  currentReferrals: number;
}

export interface ILifetimeDiscount {
  discount: number;
  originalPrice: number;
  lifetimePrice: number;
  savings: number;
}

export interface IPricingPlan {
  id: UUID;
  name: string;
  tier: SubscriptionTier;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  lifetimePrice: number;
  features: IPlanFeature[];
  limits: IPlanLimits;
  popular: boolean;
  active: boolean;
}

export interface IPlanFeature {
  name: string;
  description: string;
  included: boolean;
  limit?: number;
}

export interface IPlanLimits {
  tasks: number;
  habits: number;
  notes: number;
  goals: number;
  aiCredits: number;
  storageGB: number;
  teamMembers: number;
  apiCalls: number;
}

// ============================================================================
// TASK MANAGEMENT TYPES
// ============================================================================

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
export type TaskCategory = 'personal' | 'work' | 'health' | 'finance' | 'learning' | 'social' | 'creative' | 'other';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type TaskComplexity = 'simple' | 'moderate' | 'complex' | 'epic';

export interface ITask extends IAuditableEntity {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  recurrence: ITaskRecurrence;
  complexity: TaskComplexity;
  dueDate?: DateISO;
  startDate?: DateISO;
  estimatedMinutes?: number;
  actualMinutes?: number;
  progress: number;
  tags: string[];
  attachments: IAttachment[];
  subtasks: ISubtask[];
  dependencies: ITaskDependency[];
  assignees: UUID[];
  owner: UUID;
  projectId?: UUID;
  parentId?: UUID;
  checklist: IChecklistItem[];
  timeLogs: ITimeLog[];
  comments: ITaskComment[];
  activity: ITaskActivity[];
  isTemplate: boolean;
  templateId?: UUID;
  customFields: ICustomField[];
  reminder?: ITaskReminder;
  linkedItems: ILinkedItem[];
}

export interface ITaskRecurrence {
  type: TaskRecurrence;
  interval: number;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  monthsOfYear?: number[];
  endDate?: DateISO;
  occurrences?: number;
  nextOccurrence?: DateISO;
}

export interface ISubtask {
  id: UUID;
  title: string;
  completed: boolean;
  order: number;
  assignee?: UUID;
}

export interface ITaskDependency {
  taskId: UUID;
  type: 'blocks' | 'blocked-by' | 'relates-to' | 'duplicates';
}

export interface IChecklistItem {
  id: UUID;
  text: string;
  completed: boolean;
  order: number;
  assignee?: UUID;
  dueDate?: DateISO;
}

export interface ITimeLog {
  id: UUID;
  userId: UUID;
  startTime: DateISO;
  endTime?: DateISO;
  duration: number;
  description?: string;
  billable: boolean;
  hourlyRate?: number;
}

export interface ITaskComment {
  id: UUID;
  userId: UUID;
  content: string;
  createdAt: DateISO;
  updatedAt?: DateISO;
  reactions: IReaction[];
  mentions: UUID[];
  attachments: IAttachment[];
  isEdited: boolean;
}

export interface ITaskActivity {
  id: UUID;
  userId: UUID;
  action: string;
  details: string;
  timestamp: DateISO;
  metadata?: Record<string, unknown>;
}

export interface ICustomField {
  id: UUID;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'url' | 'email' | 'phone' | 'currency' | 'duration' | 'rating' | 'location';
  value: unknown;
  options?: string[];
  required: boolean;
  visibility: 'public' | 'private' | 'team';
}

export interface ITaskReminder {
  enabled: boolean;
  beforeMinutes: number;
  notifyAssignees: boolean;
  notifyOwner: boolean;
  notificationType: 'push' | 'email' | 'sms' | 'all';
}

export interface ILinkedItem {
  id: UUID;
  type: 'task' | 'note' | 'goal' | 'project' | 'file' | 'url';
  itemId: UUID;
  relation: string;
}

export interface ITaskTemplate {
  id: UUID;
  name: string;
  description?: string;
  category: TaskCategory;
  tasks: ITask[];
  createdAt: DateISO;
  usageCount: number;
  isPublic: boolean;
  tags: string[];
}

export interface ITaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: TaskCategory[];
  assignee?: UUID[];
  owner?: UUID[];
  projectId?: UUID;
  tags?: string[];
  dueDate?: IDateRange;
  createdAt?: IDateRange;
  search?: string;
  sortBy?: 'dueDate' | 'priority' | 'status' | 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface IDateRange {
  start: DateISO;
  end: DateISO;
}

// ============================================================================
// HABIT TRACKING TYPES
// ============================================================================

export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';
export type HabitCategory = 'health' | 'fitness' | 'mindset' | 'learning' | 'productivity' | 'social' | 'finance' | 'creativity' | 'self-care' | 'other';
export type HabitDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export type HabitStreakType = 'current' | 'longest' | 'average';

export interface IHabit extends IAuditableEntity {
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: IHabitFrequency;
  difficulty: HabitDifficulty;
  targetCount: number;
  currentCount: number;
  unit?: string;
  icon: string;
  color: string;
  startDate: DateISO;
  endDate?: DateISO;
  reminder?: IHabitReminder;
  schedule: IHabitSchedule;
  streaks: IHabitStreaks;
  completions: IHabitCompletion[];
  statistics: IHabitStatistics;
  challenges: IHabitChallenge[];
  rewards: IHabitReward[];
  isArchived: boolean;
  archivedAt?: DateISO;
  linkedTasks: UUID[];
  linkedGoals: UUID[];
  notes?: string;
}

export interface IHabitFrequency {
  type: HabitFrequency;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  customSchedule?: string;
}

export interface IHabitReminder {
  enabled: boolean;
  time: string;
  repeat: string;
  daysOfWeek?: number[];
  notificationType: 'push' | 'email' | 'sms';
}

export interface IHabitSchedule {
  timezone: Timezone;
  startTime?: string;
  endTime?: string;
  flexibility: number;
}

export interface IHabitStreaks {
  current: number;
  longest: number;
  average: number;
  totalDays: number;
  lastCompleted?: DateISO;
  bestStreak: IStreakInfo;
}

export interface IStreakInfo {
  days: number;
  startDate: DateISO;
  endDate: DateISO;
}

export interface IHabitCompletion {
  id: UUID;
  date: DateISO;
  completed: boolean;
  count?: number;
  notes?: string;
  mood?: number;
  energy?: number;
  location?: string;
  context?: string;
}

export interface IHabitStatistics {
  totalCompletions: number;
  totalMisses: number;
  completionRate: number;
  averageCount: number;
  bestStreak: number;
  weeklyAverage: number;
  monthlyAverage: number;
  yearlyAverage: number;
  consistencyScore: number;
  trends: IHabitTrend[];
}

export interface IHabitTrend {
  period: string;
  completionRate: number;
  averageCount: number;
  streak: number;
}

export interface IHabitChallenge {
  id: UUID;
  name: string;
  description: string;
  targetDays: number;
  startDate: DateISO;
  endDate: DateISO;
  participants: UUID[];
  isActive: boolean;
  isCompleted: boolean;
}

export interface IHabitReward {
  id: UUID;
  name: string;
  description: string;
  type: 'badge' | 'points' | 'unlock' | 'discount';
  requirement: number;
  achieved: boolean;
  achievedAt?: DateISO;
}

export interface IHabitFilter {
  category?: HabitCategory[];
  frequency?: HabitFrequency[];
  difficulty?: HabitDifficulty[];
  search?: string;
  sortBy?: 'name' | 'streak' | 'completionRate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// FINANCE TRACKING TYPES
// ============================================================================

export type TransactionType = 'income' | 'expense' | 'transfer' | 'investment' | 'refund';
export type TransactionCategory = 
  | 'salary' | 'freelance' | 'investment' | 'gift' | 'refund' | 'other-income'
  | 'food' | 'transport' | 'housing' | 'utilities' | 'entertainment' | 'shopping'
  | 'healthcare' | 'education' | 'insurance' | 'taxes' | 'subscriptions' | 'travel'
  | 'personal' | 'gifts' | 'charity' | 'other-expense';
export type PaymentMethodType = 'cash' | 'debit-card' | 'credit-card' | 'bank-transfer' | 'digital-wallet' | 'crypto' | 'other';
export type InvestmentType = 'stock' | 'bond' | 'mutual-fund' | 'etf' | 'crypto' | 'real-estate' | 'commodity' | 'other';
export type BudgetPeriod = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export interface ITransaction extends IAuditableEntity {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: Currency;
  date: DateISO;
  description?: string;
  merchant?: string;
  paymentMethod?: PaymentMethodType;
  accountId: UUID;
  tags: string[];
  attachments: IAttachment[];
  isRecurring: boolean;
  recurringId?: UUID;
  location?: ILocation;
  notes?: string;
  billable?: boolean;
  invoiceId?: UUID;
  taxDeductible: boolean;
  customFields: ICustomField[];
}

export interface ILocation {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface IAccount extends IAuditableEntity {
  name: string;
  type: 'checking' | 'savings' | 'credit-card' | 'investment' | 'cash' | 'crypto' | 'other';
  balance: number;
  currency: Currency;
  institution?: string;
  accountNumber?: string;
  routingNumber?: string;
  isActive: boolean;
  isHidden: boolean;
  color: string;
  icon: string;
  creditLimit?: number;
  interestRate?: number;
  statements: IStatement[];
  transactions: UUID[];
}

export interface IStatement {
  id: UUID;
  accountId: UUID;
  period: string;
  startDate: DateISO;
  endDate: DateISO;
  startBalance: number;
  endBalance: number;
  totalIncome: number;
  totalExpenses: number;
  pdfUrl?: string;
}

export interface IBudget extends IBaseEntity {
  name: string;
  category: TransactionCategory;
  amount: number;
  currency: Currency;
  period: BudgetPeriod;
  startDate: DateISO;
  endDate?: DateISO;
  spent: number;
  remaining: number;
  alerts: IBudgetAlert[];
  rollover: boolean;
  isActive: boolean;
}

export interface IBudgetAlert {
  threshold: number;
  type: 'warning' | 'exceeded' | 'reset';
  enabled: boolean;
  lastTriggered?: DateISO;
}

export interface IInvestment extends IBaseEntity {
  name: string;
  type: InvestmentType;
  symbol?: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: DateISO;
  currency: Currency;
  accountId: UUID;
  notes?: string;
  dividends: IDividend[];
  performance: IInvestmentPerformance;
}

export interface IDividend {
  id: UUID;
  date: DateISO;
  amount: number;
  currency: Currency;
  reinvested: boolean;
}

export interface IInvestmentPerformance {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  percentageReturn: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  yearlyChange: number;
  sincePurchase: number;
}

export interface ISavingsGoal extends IBaseEntity {
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: Currency;
  targetDate: DateISO;
  monthlyContribution: number;
  interestRate?: number;
  icon: string;
  color: string;
  linkedTransactions: UUID[];
  milestones: ISavingsMilestone[];
}

export interface ISavingsMilestone {
  percentage: number;
  name: string;
  achieved: boolean;
  achievedAt?: DateISO;
}

export interface IBill extends IBaseEntity {
  name: string;
  amount: number;
  currency: Currency;
  dueDay: number;
  category: TransactionCategory;
  isRecurring: boolean;
  autoPay: boolean;
  paymentMethodId?: UUID;
  reminder: boolean;
  reminderDays: number[];
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  lastPaid?: DateISO;
  nextDue: DateISO;
}

export interface IFinanceFilter {
  type?: TransactionType[];
  category?: TransactionCategory[];
  accountId?: UUID;
  dateRange?: IDateRange;
  amountRange?: IAmountRange;
  tags?: string[];
  search?: string;
  paymentMethod?: PaymentMethodType[];
}

export interface IAmountRange {
  min: number;
  max: number;
}

// ============================================================================
// FOCUS & PRODUCTIVITY TYPES
// ============================================================================

export type FocusState = 'idle' | 'running' | 'paused' | 'break' | 'completed';
export type FocusSessionType = 'pomodoro' | 'deep-work' | 'quick-sprint' | 'custom';
export type FocusTimerPreset = '25-5' | '50-10' | '90-20' | 'custom';
export type FocusDistraction = 'notification' | 'app' | 'website' | 'environment' | 'thought' | 'other';

export interface IFocusSession extends IBaseEntity {
  type: FocusSessionType;
  state: FocusState;
  plannedMinutes: number;
  actualMinutes: number;
  startTime: DateISO;
  endTime?: DateISO;
  pausedAt?: DateISO;
  pausedDuration: number;
  breakCount: number;
  breaks: IFocusBreak[];
  distractions: IFocusDistraction[];
  mood: number;
  energy: number;
  productivity: number;
  linkedTasks: UUID[];
  linkedHabits: UUID[];
  linkedGoals: UUID[];
  location?: string;
  environment?: string;
  notes?: string;
  tags: string[];
}

export interface IFocusBreak {
  id: UUID;
  startTime: DateISO;
  endTime: DateISO;
  duration: number;
  type: 'short' | 'long';
  activity?: string;
  mood?: number;
}

export interface IFocusDistraction {
  id: UUID;
  type: FocusDistraction;
  description: string;
  timestamp: DateISO;
  avoided: boolean;
}

export interface IFocusPreset {
  id: UUID;
  name: string;
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  notificationEnabled: boolean;
  isDefault: boolean;
}

export interface IFocusStatistics {
  totalSessions: number;
  totalMinutes: number;
  averageSessionLength: number;
  longestSession: number;
  currentStreak: number;
  longestStreak: number;
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyTotal: number;
  completionRate: number;
  averageProductivity: number;
  averageMood: number;
  averageEnergy: number;
  mostProductiveDay: string;
  mostProductiveTime: string;
  trends: IFocusTrend[];
}

export interface IFocusTrend {
  period: string;
  sessions: number;
  minutes: number;
  productivity: number;
}

export interface IPomodoroTimer {
  preset: FocusTimerPreset;
  currentPhase: 'work' | 'short-break' | 'long-break';
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  sessionsCompleted: number;
  currentSession: number;
}

export interface IDeepWorkBlock {
  id: UUID;
  date: DateISO;
  startTime: string;
  endTime: string;
  duration: number;
  taskId?: UUID;
  notes?: string;
  interrupted: boolean;
  interruptionCount: number;
}

// ============================================================================
// SOCIAL & COMMUNITY TYPES
// ============================================================================

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';
export type ChallengeStatus = 'active' | 'completed' | 'cancelled' | 'expired';
export type ChallengeType = 'individual' | 'team' | 'global';
export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all-time';
export type LeaderboardMetric = 'points' | 'streak' | 'tasks' | 'focus' | 'habits' | 'fitness' | 'social';
export type PostType = 'achievement' | 'milestone' | 'streak' | 'goal' | 'habit' | 'challenge' | 'general' | 'motivation' | 'tip';

export interface IConnection extends IBaseEntity {
  userId: UUID;
  connectedUserId: UUID;
  status: ConnectionStatus;
  connectionType: 'friend' | 'colleague' | 'mentor' | 'coach' | 'family';
  establishedAt?: DateISO;
  blockedAt?: DateISO;
  notes?: string;
  tags: string[];
}

export interface IFriend {
  id: UUID;
  userId: UUID;
  friendId: UUID;
  nickname?: string;
  status: ConnectionStatus;
  addedAt: DateISO;
  lastInteraction?: DateISO;
  mutualFriends: number;
  commonInterests: string[];
}

export interface IChallenge extends IBaseEntity {
  name: string;
  description: string;
  type: ChallengeType;
  category: string;
  status: ChallengeStatus;
  startDate: DateISO;
  endDate: DateISO;
  target: number;
  metric: string;
  participants: IChallengeParticipant[];
  prizes: IChallengePrize[];
  rules: string;
  badges: IBadge[];
  leaderboard: ILeaderboardEntry[];
  isPublic: boolean;
  isFeatured: boolean;
  createdBy: UUID;
  thumbnail?: string;
}

export interface IChallengeParticipant {
  userId: UUID;
  progress: number;
  rank: number;
  joinedAt: DateISO;
  completedAt?: DateISO;
  isWinner: boolean;
  reward?: string;
}

export interface IChallengePrize {
  rank: number;
  type: 'points' | 'badge' | 'subscription' | 'gift-card' | 'recognition';
  value: number;
  description: string;
}

export interface ILeaderboard extends IBaseEntity {
  name: string;
  metric: LeaderboardMetric;
  period: LeaderboardPeriod;
  entries: ILeaderboardEntry[];
  isPublic: boolean;
  isFeatured: boolean;
}

export interface ILeaderboardEntry {
  rank: number;
  previousRank: number;
  userId: UUID;
  username: string;
  displayName: string;
  avatarUrl?: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface IPost extends IBaseEntity {
  userId: UUID;
  type: PostType;
  content: string;
  media?: IMedia[];
  linkedItem?: ILinkedItem;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isPinned: boolean;
  isFeatured: boolean;
  hashtags: string[];
  mentions: UUID[];
  location?: string;
  isPublic: boolean;
}

export interface IMedia {
  id: UUID;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  caption?: string;
}

export interface IComment extends IBaseEntity {
  postId: UUID;
  userId: UUID;
  content: string;
  parentId?: UUID;
  likes: number;
  replies: UUID[];
  isEdited: boolean;
  mentions: UUID[];
  attachments: IAttachment[];
}

export interface IReaction {
  type: 'like' | 'love' | 'celebrate' | 'insightful' | 'funny' | 'support' | 'fire' | '100';
  count: number;
  userIds: UUID[];
}

export interface IMessage extends IBaseEntity {
  senderId: UUID;
  receiverId: UUID;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location';
  media?: IMedia;
  readAt?: DateISO;
  deliveredAt?: DateISO;
  isDeleted: boolean;
  reactions: IReaction[];
}

export interface IConversation extends IBaseEntity {
  participants: UUID[];
  lastMessage?: IMessage;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  adminIds: UUID[];
  muteUntil?: DateISO;
  pinnedMessageId?: UUID;
}

export interface IGroup extends IBaseEntity {
  name: string;
  description?: string;
  image?: string;
  members: IGroupMember[];
  admins: UUID[];
  isPrivate: boolean;
  rules?: string[];
  createdBy: UUID;
}

export interface IGroupMember {
  userId: UUID;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: DateISO;
  lastActive?: DateISO;
}

export interface IVideoCall {
  id: UUID;
  participants: UUID[];
  startTime: DateISO;
  endTime?: DateISO;
  duration: number;
  type: '1-on-1' | 'group';
  status: 'ringing' | 'active' | 'ended';
  recording?: IRecording;
}

export interface IRecording {
  id: UUID;
  url: string;
  duration: number;
  size: number;
  createdAt: DateISO;
}

// ============================================================================
// NOTES & DOCUMENTS TYPES
// ============================================================================

export type NoteType = 'text' | 'checklist' | 'code' | 'markdown' | 'drawing' | 'audio' | 'scanned';
export type NoteStatus = 'draft' | 'published' | 'archived' | 'deleted';
export type NoteVisibility = 'private' | 'connections' | 'public';

export interface INote extends IAuditableEntity {
  title: string;
  content: string;
  type: NoteType;
  status: NoteStatus;
  visibility: NoteVisibility;
  category?: string;
  tags: string[];
  color?: string;
  icon?: string;
  isPinned: boolean;
  isFavorite: boolean;
  isEncrypted: boolean;
  linkedTasks: UUID[];
  linkedHabits: UUID[];
  linkedGoals: UUID[];
  linkedNotes: UUID[];
  attachments: IAttachment[];
  collaborators: ICollaborator[];
  versions: INoteVersion[];
  shareLink?: string;
  viewCount: number;
  wordCount: number;
  readingTime: number;
}

export interface ICollaborator {
  userId: UUID;
  permission: 'view' | 'edit' | 'admin';
  addedAt: DateISO;
  addedBy: UUID;
}

export interface INoteVersion {
  id: UUID;
  content: string;
  createdAt: DateISO;
  createdBy: UUID;
  changeDescription?: string;
}

export interface INotebook extends IBaseEntity {
  name: string;
  description?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isShared: boolean;
  members: ICollaborator[];
  notes: UUID[];
  createdBy: UUID;
}

export interface ITag extends IBaseEntity {
  name: string;
  color: string;
  icon?: string;
  count: number;
  createdBy: UUID;
}

export interface IAttachment extends IBaseEntity {
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  uploadedBy: UUID;
  isEncrypted: boolean;
}

// ============================================================================
// GOALS & MILESTONES TYPES
// ============================================================================

export type GoalStatus = 'active' | 'completed' | 'cancelled' | 'on-hold' | 'archived';
export type GoalCategory = 'career' | 'finance' | 'health' | 'learning' | 'personal' | 'relationships' | 'spiritual' | 'creative' | 'other';
export type GoalTimeframe = 'short-term' | 'medium-term' | 'long-term' | 'ongoing';
export type GoalVisibility = 'private' | 'connections' | 'public';

export interface IGoal extends IAuditableEntity {
  title: string;
  description?: string;
  status: GoalStatus;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  visibility: GoalVisibility;
  targetDate?: DateISO;
  targetValue: number;
  currentValue: number;
  unit?: string;
  progress: number;
  isPublic: boolean;
  isPinned: boolean;
  milestones: IMilestone[];
  linkedTasks: UUID[];
  linkedHabits: UUID[];
  linkedNotes: UUID[];
  linkedGoals: UUID[];
  collaborators: ICollaborator[];
  supporters: UUID[];
  cheerleaders: UUID[];
  checkIns: IGoalCheckIn[];
  rewards: IGoalReward[];
  tags: string[];
  coverImage?: string;
}

export interface IMilestone extends IBaseEntity {
  title: string;
  description?: string;
  targetDate?: DateISO;
  targetValue: number;
  currentValue: number;
  completed: boolean;
  completedAt?: DateISO;
  order: number;
}

export interface IGoalCheckIn extends IBaseEntity {
  userId: UUID;
  value: number;
  notes?: string;
  mood?: number;
  challenges?: string;
  nextSteps?: string;
}

export interface IGoalReward {
  id: UUID;
  name: string;
  description: string;
  type: 'badge' | 'points' | 'reward' | 'unlock';
  requirement: number;
  achieved: boolean;
  achievedAt?: DateISO;
}

// ============================================================================
// ANALYTICS & INSIGHTS TYPES
// ============================================================================

export type InsightType = 'achievement' | 'suggestion' | 'warning' | 'trend' | 'comparison' | 'prediction';

export interface IAnalytics {
  overview: IAnalyticsOverview;
  tasks: ITaskAnalytics;
  habits: IHabitAnalytics;
  focus: IFocusAnalytics;
  finance: IFinanceAnalytics;
  social: ISocialAnalytics;
  goals: IGoalAnalytics;
  engagement: IEngagementAnalytics;
}

export interface IAnalyticsOverview {
  productivityScore: number;
  consistencyScore: number;
  engagementScore: number;
  growthScore: number;
  topPerformers: string[];
  areasForImprovement: string[];
  recentAchievements: IAchievement[];
  upcomingMilestones: IMilestone[];
}

export interface ITaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  overdueTasks: number;
  upcomingTasks: number;
  taskDistribution: ITaskDistribution[];
  productivityTrends: ITrend[];
  completionByCategory: Record<string, number>;
  completionByPriority: Record<string, number>;
}

export interface ITaskDistribution {
  status: TaskStatus;
  count: number;
  percentage: number;
}

export interface IHabitAnalytics {
  totalHabits: number;
  activeHabits: number;
  completionRate: number;
  averageStreak: number;
  habitPerformance: IHabitPerformance[];
  categoryBreakdown: ICategoryBreakdown[];
  improvementAreas: string[];
}

export interface IHabitPerformance {
  habitId: UUID;
  habitName: string;
  completionRate: number;
  currentStreak: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface IFocusAnalytics {
  totalSessions: number;
  totalMinutes: number;
  averageSessionLength: number;
  completionRate: number;
  productivityTrends: ITrend[];
  peakProductivityHours: string[];
  focusQuality: number;
}

export interface IFinanceAnalytics {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  topCategories: ICategoryBreakdown[];
  budgetAdherence: number;
  financialHealth: number;
  spendingTrends: ITrend[];
}

export interface ISocialAnalytics {
  totalConnections: number;
  activeConnections: number;
  challengeWins: number;
  leaderboardRank: number;
  postsEngagement: number;
  communityContributions: number;
}

export interface IGoalAnalytics {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  completionRate: number;
  goalsNearCompletion: IGoal[];
  overdueGoals: IGoal[];
}

export interface IEngagementAnalytics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  sessionLength: number;
  returnRate: number;
  churnRisk: number;
}

export interface ITrend {
  date: string;
  value: number;
  change: number;
  changePercentage: number;
}

export interface ICategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface IInsight {
  id: UUID;
  type: InsightType;
  title: string;
  description: string;
  actionable: boolean;
  action?: string;
  relatedItem?: string;
  createdAt: DateISO;
  isRead: boolean;
  isActioned: boolean;
}

export interface IReport {
  id: UUID;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dateRange: IDateRange;
  generatedAt: DateISO;
  data: Record<string, unknown>;
  summary: string;
  charts: IChartData[];
}

export interface IChartData {
  type: 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'scatter';
  title: string;
  data: unknown[];
  options?: Record<string, unknown>;
}

// ============================================================================
// ACHIEVEMENTS & GAMIFICATION TYPES
// ============================================================================

export type AchievementCategory = 'tasks' | 'habits' | 'focus' | 'social' | 'finance' | 'learning' | 'streak' | 'milestone' | 'special';

export interface IAchievement extends IBaseEntity {
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  color: string;
  requirement: IAchievementRequirement;
  reward: IAchievementReward;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'exclusive';
  isSecret: boolean;
  unlockCriteria: string;
  tier?: number;
}

export interface IAchievementRequirement {
  type: string;
  target: number;
  metric: string;
  timeframe?: string;
}

export interface IAchievementReward {
  type: 'points' | 'badge' | 'title' | 'unlock' | 'discount' | 'feature';
  value: number;
  description: string;
}

export interface IBadge extends IBaseEntity {
  name: string;
  description: string;
  icon: string;
  color: string;
  category: AchievementCategory;
  earnedAt?: DateISO;
  earnedBy?: UUID;
  isFeatured: boolean;
}

export interface ILevel {
  level: number;
  title: string;
  xpRequired: number;
  xpProgress: number;
  perks: string[];
}

export interface IXpTransaction {
  id: UUID;
  userId: UUID;
  amount: number;
  reason: string;
  source: string;
  createdAt: DateISO;
}

export interface ILeaderboardRank {
  userId: UUID;
  rank: number;
  previousRank: number;
  points: number;
  trend: 'up' | 'down' | 'stable';
}

// ============================================================================
// NOTIFICATIONS TYPES
// ============================================================================

export type NotificationType = 
  | 'task' | 'habit' | 'focus' | 'social' | 'finance' 
  | 'achievement' | 'goal' | 'challenge' | 'system' | 'reminder'
  | 'leaderboard' | 'streak' | 'subscription' | 'security';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface INotification extends IBaseEntity {
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
  imageUrl?: string;
  isRead: boolean;
  readAt?: DateISO;
  isArchived: boolean;
  archivedAt?: DateISO;
  expiresAt?: DateISO;
  userId: UUID;
}

export interface INotificationPreferences {
  push: IChannelPreferences;
  email: IChannelPreferences;
  sms: IChannelPreferences;
  inApp: IChannelPreferences;
}

export interface IChannelPreferences {
  enabled: boolean;
  types: Record<NotificationType, boolean>;
  quietHours: IQuietHours;
}

export interface IQuietHours {
  enabled: boolean;
  start: string;
  end: string;
  timezone: Timezone;
}

// ============================================================================
// SETTINGS & PREFERENCES TYPES
// ============================================================================

export interface IAppSettings {
  general: IGeneralSettings;
  appearance: IAppearanceSettings;
  notifications: INotificationSettings;
  privacy: IPrivacySettings;
  security: ISecuritySettings;
  subscription: ISubscriptionSettings;
  data: IDataSettings;
  accessibility: IAccessibilitySettings;
  experimental: IExperimentalSettings;
}

export interface IGeneralSettings {
  language: LocaleCode;
  timezone: Timezone;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dateFormat: DateFormat;
  timeFormat: '12h' | '24h';
  defaultView: string;
  startScreen: string;
}

export interface IAppearanceSettings {
  theme: ThemeMode;
  accentColor: string;
  wallpaper?: string;
  fontSize: FontSize;
  iconStyle: 'filled' | 'outline';
  animationLevel: 'minimal' | 'normal' | 'high';
}

export interface ISubscriptionSettings {
  autoRenew: boolean;
  paymentMethod: string;
  billingAddress: string;
  invoices: boolean;
}

export interface IDataSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupDestination: string;
  exportFormat: 'json' | 'csv' | 'pdf';
  dataRetention: number;
  clearDataOnLogout: boolean;
}

export interface IAccessibilitySettings {
  screenReader: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface IExperimentalSettings {
  aiFeatures: boolean;
  newUI: boolean;
  betaFeatures: boolean;
  developerMode: boolean;
}

// ============================================================================
// INTEGRATIONS TYPES
// ============================================================================

export type IntegrationCategory = 'productivity' | 'communication' | 'finance' | 'health' | 'social' | 'development' | 'marketing' | 'other';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export interface IIntegration extends IBaseEntity {
  name: string;
  description: string;
  category: IntegrationCategory;
  icon: string;
  website: string;
  status: IntegrationStatus;
  lastSync?: DateISO;
  scopes: string[];
  config: IIntegrationConfig;
  features: IIntegrationFeature[];
}

export interface IIntegrationConfig {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: DateISO;
}

export interface IIntegrationFeature {
  name: string;
  description: string;
  enabled: boolean;
}

export interface IWebhook extends IBaseEntity {
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  lastTriggered?: DateISO;
  failureCount: number;
}

export interface IApiKey extends IBaseEntity {
  name: string;
  key: string;
  scopes: string[];
  expiresAt?: DateISO;
  lastUsed?: DateISO;
  isActive: boolean;
}

// ============================================================================
// AI & AUTOMATION TYPES
// ============================================================================

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'local' | 'custom';
export type AIResponseMode = 'fast' | 'balanced' | 'thorough';
export type AutomationTriggerType = 'schedule' | 'event' | 'condition' | 'manual';
export type AutomationActionType = 'notification' | 'task' | 'habit' | 'email' | 'webhook' | 'integration';

export interface IAIModel {
  id: UUID;
  name: string;
  provider: AIProvider;
  model: string;
  version: string;
  maxTokens: number;
  temperature: number;
  capabilities: string[];
  isDefault: boolean;
  isEnabled: boolean;
}

export interface IAIConversation extends IBaseEntity {
  userId: UUID;
  title: string;
  messages: IAIConversationMessage[];
  model: string;
  tokens: number;
  cost: number;
}

export interface IAIConversationMessage {
  id: UUID;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: DateISO;
  tokens: number;
  model: string;
  attachments?: IAttachment[];
}

export interface IAIResponse {
  content: string;
  tokens: number;
  model: string;
  finishReason: string;
  usage: IAIUsage;
  cached: boolean;
}

export interface IAIUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface IAutomation extends IBaseEntity {
  name: string;
  description: string;
  trigger: IAutomationTrigger;
  conditions: IAutomationCondition[];
  actions: IAutomationAction[];
  isActive: boolean;
  lastTriggered?: DateISO;
  runCount: number;
  errorCount: number;
}

export interface IAutomationTrigger {
  type: AutomationTriggerType;
  config: Record<string, unknown>;
  schedule?: ISchedule;
  event?: string;
}

export interface ISchedule {
  timezone: Timezone;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  time: string;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  startDate: DateISO;
  endDate?: DateISO;
}

export interface IAutomationCondition {
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than' | 'between' | 'in';
  value: unknown;
}

export interface IAutomationAction {
  type: AutomationActionType;
  config: Record<string, unknown>;
  delay?: number;
}

export interface IAIInsight {
  id: UUID;
  type: 'productivity' | 'health' | 'finance' | 'social' | 'learning';
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  data: Record<string, unknown>;
  createdAt: DateISO;
  isActioned: boolean;
}

export interface IAIAssistant {
  id: UUID;
  name: string;
  description: string;
  avatar: string;
  personality: string;
  capabilities: string[];
  instructions: string;
  isDefault: boolean;
  isActive: boolean;
}

// ============================================================================
// HEALTH & WELLNESS TYPES
// ============================================================================

export type HealthMetricType = 
  | 'weight' | 'height' | 'bmi' | 'blood-pressure' | 'heart-rate'
  | 'sleep' | 'steps' | 'calories' | 'water' | 'mood' | 'energy'
  | 'stress' | 'medication' | 'symptom' | 'exercise';

export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';
export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type EnergyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type StressLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface IHealthMetric extends IBaseEntity {
  type: HealthMetricType;
  value: number;
  unit: string;
  date: DateISO;
  notes?: string;
  source?: string;
  isManual: boolean;
}

export interface IWeightEntry extends IBaseEntity {
  weight: number;
  unit: 'kg' | 'lbs';
  bodyFat?: number;
  muscleMass?: number;
  bmi?: number;
  notes?: string;
}

export interface ISleepEntry extends IBaseEntity {
  sleepDuration: number;
  sleepQuality: SleepQuality;
  bedTime: string;
  wakeTime: string;
  deepSleep?: number;
  lightSleep?: number;
  remSleep?: number;
  awakeTime?: number;
  interruptions?: number;
  notes?: string;
}

export interface IExerciseEntry extends IBaseEntity {
  type: string;
  duration: number;
  calories: number;
  intensity: 'low' | 'moderate' | 'high';
  heartRate?: number;
  distance?: number;
  steps?: number;
  route?: IRoute;
  notes?: string;
}

export interface IRoute {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  distance: number;
  polyline?: string;
}

export interface INutritionEntry extends IBaseEntity {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: IFoodItem[];
  totalCalories: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  notes?: string;
}

export interface IFoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface IMoodEntry extends IBaseEntity {
  mood: MoodLevel;
  energy: EnergyLevel;
  stress: StressLevel;
  factors: string[];
  notes?: string;
}

export interface IHealthGoal extends IBaseEntity {
  metricType: HealthMetricType;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: DateISO;
  targetDate: DateISO;
  progress: number;
}

export interface IHealthInsights {
  sleepAnalysis: ISleepAnalysis;
  activityAnalysis: IActivityAnalysis;
  nutritionAnalysis: INutritionAnalysis;
  trends: IHealthTrend[];
}

export interface ISleepAnalysis {
  averageDuration: number;
  averageQuality: number;
  sleepDebt: number;
  recommendations: string[];
}

export interface IActivityAnalysis {
  averageSteps: number;
  activeMinutes: number;
  caloriesBurned: number;
  recommendations: string[];
}

export interface INutritionAnalysis {
  averageCalories: number;
  macroBreakdown: IMacroBreakdown;
  recommendations: string[];
}

export interface IMacroBreakdown {
  protein: number;
  carbs: number;
  fat: number;
}

export interface IHealthTrend {
  metricType: HealthMetricType;
  period: string;
  value: number;
  trend: 'improving' | 'declining' | 'stable';
}

// ============================================================================
// LEARNING & EDUCATION TYPES
// ============================================================================

export type CourseStatus = 'not-started' | 'in-progress' | 'completed' | 'paused' | 'abandoned';
export type ContentType = 'video' | 'article' | 'quiz' | 'exercise' | 'project' | 'live' | 'podcast';
export type LearningGoal = 'skill-acquisition' | 'career-advancement' | 'personal-development' | 'hobby' | 'certification';

export interface ICourse extends IBaseEntity {
  title: string;
  description: string;
  thumbnail: string;
  instructor: IInstructor;
  status: CourseStatus;
  progress: number;
  enrolledAt?: DateISO;
  completedAt?: DateISO;
  duration: number;
  modules: IModule[];
  resources: IResource[];
  discussions: IDiscussion[];
  certificateId?: UUID;
  tags: string[];
  rating: number;
  enrollmentCount: number;
  price?: number;
  isFree: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: LocaleCode;
}

export interface IInstructor {
  id: UUID;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  courses: number;
  students: number;
  rating: number;
}

export interface IModule {
  id: UUID;
  title: string;
  description: string;
  order: number;
  duration: number;
  lessons: ILesson[];
  isLocked: boolean;
}

export interface ILesson extends IBaseEntity {
  title: string;
  description: string;
  type: ContentType;
  content: string;
  duration: number;
  order: number;
  isCompleted: boolean;
  completedAt?: DateISO;
  resources: IResource[];
  quiz?: IQuiz;
}

export interface IResource {
  id: UUID;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface IQuiz extends IBaseEntity {
  title: string;
  questions: IQuestion[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
  bestScore?: number;
}

export interface IQuestion {
  id: UUID;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface IDiscussion extends IBaseEntity {
  userId: UUID;
  content: string;
  replies: UUID[];
  likes: number;
  isPinned: boolean;
  isAnswered: boolean;
}

export interface ICertificate extends IBaseEntity {
  courseId: UUID;
  courseName: string;
  userId: UUID;
  issuedAt: DateISO;
  credentialId: string;
  credentialUrl: string;
  verificationStatus: 'verified' | 'pending' | 'expired';
}

export interface ILearningPath extends IBaseEntity {
  title: string;
  description: string;
  thumbnail: string;
  courses: ICourse[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goals: LearningGoal[];
  skills: string[];
  certificate: boolean;
}

export interface IStudySession extends IBaseEntity {
  courseId: UUID;
  moduleId?: UUID;
  lessonId?: UUID;
  startTime: DateISO;
  endTime?: DateISO;
  duration: number;
  notes?: string;
  focusRating?: number;
}

export interface IFlashcard extends IBaseEntity {
  front: string;
  back: string;
  deckId: UUID;
  nextReview?: DateISO;
  easeFactor: number;
  interval: number;
  repetitions: number;
  lapses: number;
}

export interface IDeck extends IBaseEntity {
  name: string;
  description?: string;
  cards: UUID[];
  cardCount: number;
  dueCount: number;
  newCount: number;
}

// ============================================================================
// PROJECT MANAGEMENT TYPES
// ============================================================================

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'archived';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';
export type ProjectType = 'personal' | 'work' | 'team' | 'open-source' | 'client';
export type TaskEstimateUnit = 'hours' | 'days' | 'points' | 'story-points';

export interface IProject extends IAuditableEntity {
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  type: ProjectType;
  startDate?: DateISO;
  endDate?: DateISO;
  deadline?: DateISO;
  progress: number;
  budget?: number;
  actualCost?: number;
  owner: UUID;
  members: IProjectMember[];
  tasks: UUID[];
  milestones: UUID[];
  dependencies: IProjectDependency[];
  tags: string[];
  color: string;
  icon: string;
  isTemplate: boolean;
  isStarred: boolean;
  isArchived: boolean;
  archivedAt?: DateISO;
  settings: IProjectSettings;
  integrations: IProjectIntegration[];
}

export interface IProjectMember {
  userId: UUID;
  role: 'owner' | 'admin' | 'member' | 'viewer' | 'contractor';
  joinedAt: DateISO;
  assignedTasks: number;
  completedTasks: number;
}

export interface IProjectDependency {
  projectId: UUID;
  type: 'blocks' | 'blocked-by' | 'relates-to';
}

export interface IProjectSettings {
  visibility: 'private' | 'team' | 'public';
  taskAssignment: 'any' | 'admin-only';
  commenting: boolean;
  timeTracking: boolean;
  notifications: boolean;
}

export interface IProjectIntegration {
  integrationId: UUID;
  config: Record<string, unknown>;
  isActive: boolean;
}

export interface IKanbanBoard extends IBaseEntity {
  projectId: UUID;
  name: string;
  columns: IKanbanColumn[];
  WIPLimits: Record<string, number>;
}

export interface IKanbanColumn {
  id: UUID;
  name: string;
  order: number;
  color: string;
  wipLimit?: number;
  taskIds: UUID[];
}

export interface ITimelineView extends IBaseEntity {
  projectId: UUID;
  name: string;
  milestones: ITimelineMilestone[];
  tasks: ITimelineTask[];
}

export interface ITimelineMilestone {
  id: UUID;
  name: string;
  date: DateISO;
  completed: boolean;
}

export interface ITimelineTask {
  id: UUID;
  name: string;
  startDate: DateISO;
  endDate: DateISO;
  progress: number;
  dependencies: UUID[];
}

export interface IGanttChart extends IBaseEntity {
  projectId: UUID;
  name: string;
  tasks: IGanttTask[];
  dependencies: IGanttDependency[];
}

export interface IGanttTask {
  id: UUID;
  name: string;
  startDate: DateISO;
  endDate: DateISO;
  progress: number;
  assignees: UUID[];
  dependencies: UUID[];
}

export interface IGanttDependency {
  from: UUID;
  to: UUID;
  type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
}

export interface ITimesheet extends IBaseEntity {
  userId: UUID;
  projectId: UUID;
  taskId?: UUID;
  date: DateISO;
  hours: number;
  description?: string;
  billable: boolean;
  approved: boolean;
  approvedBy?: UUID;
  approvedAt?: DateISO;
}

export interface IProjectReport {
  id: UUID;
  projectId: UUID;
  type: 'status' | 'progress' | 'budget' | 'resource' | 'risk';
  date: DateISO;
  data: Record<string, unknown>;
  summary: string;
  generatedBy: UUID;
}

// ============================================================================
// SEARCH & FILTERS TYPES
// ============================================================================

export type SearchFilterType = 'tasks' | 'habits' | 'notes' | 'goals' | 'projects' | 'users' | 'all';

export interface ISearchQuery {
  query: string;
  filters: ISearchFilters;
  sort: ISearchSort;
  page: number;
  limit: number;
}

export interface ISearchFilters {
  types: SearchFilterType[];
  dateRange?: IDateRange;
  categories?: string[];
  tags?: string[];
  status?: string[];
  priority?: string[];
}

export interface ISearchSort {
  field: string;
  order: 'asc' | 'desc';
}

export interface ISearchResult {
  type: string;
  id: UUID;
  title: string;
  subtitle?: string;
  icon: string;
  url: string;
  score: number;
  highlights?: string[];
}

export interface ISearchSuggestion {
  text: string;
  type: 'recent' | 'suggestion' | 'popular';
  icon?: string;
}

// ============================================================================
// EXPORT & IMPORT TYPES
// ============================================================================

export type ExportFormat = 'json' | 'csv' | 'pdf' | 'xlsx' | 'xml';
export type ExportScope = 'all' | 'tasks' | 'habits' | 'notes' | 'goals' | 'finance' | 'projects' | 'settings';

export interface IExportJob extends IBaseEntity {
  format: ExportFormat;
  scope: ExportScope;
  filters?: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  fileSize?: number;
  startedAt?: DateISO;
  completedAt?: DateISO;
  error?: string;
}

export interface IImportJob extends IBaseEntity {
  format: ExportFormat;
  source: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: IImportError[];
  startedAt?: DateISO;
  completedAt?: DateISO;
}

export interface IImportError {
  row: number;
  field: string;
  value: string;
  error: string;
}

// ============================================================================
// BACKUP & SYNC TYPES
// ============================================================================

export type BackupStatus = 'pending' | 'in-progress' | 'completed' | 'failed';
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

export interface IBackup extends IBaseEntity {
  status: BackupStatus;
  size: number;
  fileUrl?: string;
  includedData: string[];
  excludedData: string[];
  encryption: boolean;
  startedAt?: DateISO;
  completedAt?: DateISO;
  error?: string;
}

export interface ISyncState {
  status: SyncStatus;
  lastSync?: DateISO;
  pendingChanges: number;
  conflicts: ISyncConflict[];
  error?: string;
}

export interface ISyncConflict {
  id: UUID;
  type: string;
  localValue: unknown;
  remoteValue: unknown;
  resolution?: 'local' | 'remote' | 'merge';
}

// ============================================================================
// FEEDBACK & SUPPORT TYPES
// ============================================================================

export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'compliment' | 'other';
export type FeedbackStatus = 'open' | 'in-review' | 'planned' | 'completed' | 'declined';

export interface IFeedback extends IBaseEntity {
  type: FeedbackType;
  status: FeedbackStatus;
  title: string;
  description: string;
  screenshots: string[];
  deviceInfo: string;
  userId: UUID;
  responses: IFeedbackResponse[];
  priority: 'low' | 'medium' | 'high';
}

export interface IFeedbackResponse {
  id: UUID;
  userId: UUID;
  content: string;
  createdAt: DateISO;
  isOfficial: boolean;
}

export interface ITicket extends IBaseEntity {
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  userId: UUID;
  assignedTo?: UUID;
  messages: ITicketMessage[];
  attachments: IAttachment[];
  resolvedAt?: DateISO;
}

export interface ITicketMessage {
  id: UUID;
  userId: UUID;
  content: string;
  createdAt: DateISO;
  isInternal: boolean;
}

// ============================================================================
// EVENT & WEBHOOK TYPES
// ============================================================================

export type EventType = 
  | 'task.created' | 'task.updated' | 'task.completed' | 'task.deleted'
  | 'habit.created' | 'habit.completed' | 'habit.streak'
  | 'goal.created' | 'goal.completed' | 'goal.milestone'
  | 'focus.session.started' | 'focus.session.completed'
  | 'achievement.unlocked' | 'streak.milestone'
  | 'user.registered' | 'user.subscription.updated'
  | 'payment.succeeded' | 'payment.failed';

export interface IEvent extends IBaseEntity {
  type: EventType;
  userId: UUID;
  data: Record<string, unknown>;
  processed: boolean;
  processedAt?: DateISO;
}

// ============================================================================
// ANALYTICS & TRACKING TYPES
// ============================================================================

export interface IAnalyticsEvent extends IBaseEntity {
  event: string;
  userId?: UUID;
  sessionId: string;
  timestamp: DateISO;
  properties: Record<string, unknown>;
  userAgent?: string;
  ip?: string;
  device?: string;
  os?: string;
  browser?: string;
}

export interface IUserJourney {
  userId: UUID;
  steps: IJourneyStep[];
  conversion: boolean;
  convertedAt?: DateISO;
}

export interface IJourneyStep {
  step: number;
  event: string;
  timestamp: DateISO;
  properties: Record<string, unknown>;
}

export interface IFunnel {
  id: UUID;
  name: string;
  steps: IFunnelStep[];
  conversionRate: number;
  dropOffRate: number;
}

export interface IFunnelStep {
  name: string;
  count: number;
  conversionRate: number;
}

// ============================================================================
// MULTILINGUAL & LOCALIZATION TYPES
// ============================================================================

export interface ITranslation {
  key: string;
  locale: LocaleCode;
  value: string;
  context?: string;
  updatedAt: DateISO;
}

export interface ILocaleConfig {
  locale: LocaleCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  numberFormat: string;
  currencyFormat: string;
}

export interface IPluralRule {
  locale: LocaleCode;
  rule: string;
}

// ============================================================================
// SECURITY & COMPLIANCE TYPES
// ============================================================================

export interface IPermission {
  id: UUID;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface IRole extends IBaseEntity {
  name: string;
  description: string;
  permissions: UUID[];
  isSystem: boolean;
}

export interface IAuditLog extends IBaseEntity {
  userId: UUID;
  action: string;
  resource: string;
  resourceId?: UUID;
  details: Record<string, unknown>;
  ip: string;
  userAgent: string;
}

export interface IDataRetentionPolicy {
  id: UUID;
  name: string;
  dataType: string;
  retentionDays: number;
  deletionMethod: 'permanent' | 'anonymized' | 'archived';
}

export interface IConsent {
  id: UUID;
  userId: UUID;
  type: string;
  granted: boolean;
  grantedAt?: DateISO;
  revokedAt?: DateISO;
  version: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: IApiError;
  meta?: IApiMeta;
}

export interface IApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface IApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ISortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface IFilterParams {
  [key: string]: unknown;
}

export interface IValidationError {
  field: string;
  message: string;
  code: string;
}

export interface IFormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface IOption {
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

export interface IColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export interface ICoordinate {
  latitude: number;
  longitude: number;
}

export interface ITimeSlot {
  start: string;
  end: string;
}

export interface IDuration {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface IBaseProps {
  style?: ViewStyle;
  testID?: string;
}

export interface IButtonProps extends IBaseProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export interface IInputProps extends IBaseProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardType;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}

export interface ICardProps extends IBaseProps {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  elevated?: boolean;
  bordered?: boolean;
}

export interface IModalProps extends IBaseProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export interface ITabsProps extends IBaseProps {
  tabs: ITab[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export interface ITab {
  label: string;
  icon?: string;
  content: React.ReactNode;
}

export interface IListItemProps extends IBaseProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  divider?: boolean;
}

export interface IAvatarProps extends IBaseProps {
  source?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export interface IBadgeProps extends IBaseProps {
  count?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export interface IProgressProps extends IBaseProps {
  progress: number;
  variant?: 'linear' | 'circular';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
}

export interface IChipProps extends IBaseProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: string;
  removable?: boolean;
  onRemove?: () => void;
}

export interface ITooltipProps extends IBaseProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export interface IDrawerProps extends IBaseProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right';
  width?: number | string;
}

export interface ICarouselProps extends IBaseProps {
  data: unknown[];
  renderItem: (item: unknown, index: number) => React.ReactNode;
  itemWidth?: number;
  showPagination?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export interface IDatePickerProps extends IBaseProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  format?: string;
}

export interface ISelectProps extends IBaseProps {
  value: string;
  options: IOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  searchable?: boolean;
  multiSelect?: boolean;
}

export interface ISwitchProps extends IBaseProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export interface ISliderProps extends IBaseProps {
  value: number;
  onChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
}

export interface ICheckboxProps extends IBaseProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export interface IRadioProps extends IBaseProps {
  value: string;
  options: IOption[];
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export interface ITextareaProps extends IInputProps {
  minLength?: number;
  maxLength?: number;
  showCount?: boolean;
}

export interface IFileUploadProps extends IBaseProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
}

export interface IDragDropProps extends IBaseProps {
  items: unknown[];
  onReorder: (items: unknown[]) => void;
  renderItem: (item: unknown, index: number) => React.ReactNode;
}

export interface IInfiniteScrollProps extends IBaseProps {
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
}

export interface ILazyLoadProps extends IBaseProps {
  src: string;
  placeholder?: string;
  errorSrc?: string;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  ViewStyle,
  TextStyle,
  StyleProp,
  KeyboardType,
  ReactNode,
  ReactElement,
} from 'react-native';

export type ViewStyle = any;
export type TextStyle = any;
export type StyleProp<T> = any;
export type KeyboardType = any;
export type ReactNode = any;
export type ReactElement = any;
