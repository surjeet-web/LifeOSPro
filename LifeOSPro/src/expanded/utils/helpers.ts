// ============================================================================
// ADVANCED UTILITIES FOR LifeOS Pro
// 70,000+ Lines Edition - Comprehensive Utility Functions
// ============================================================================

import { Platform } from 'react-native';

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

export const formatDate = (date: Date | string, format: string = 'MM/DD/YYYY'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const formats: Record<string, string> = {
    'MM/DD/YYYY': `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`,
    'DD/MM/YYYY': `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
    'YYYY-MM-DD': `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    'MMMM DD, YYYY': d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    'MMM DD, YYYY': d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    'DD MMM YYYY': d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    'EEEE, MMMM DD': d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  };
  
  return formats[format] || formats['MM/DD/YYYY'];
};

export const formatTime = (date: Date | string, use24Hour: boolean = false): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (use24Hour) {
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const formatDateTime = (date: Date | string, format: string = 'MM/DD/YYYY HH:mm'): string => {
  return `${formatDate(date, format.split(' ')[0])} ${formatTime(date, format.includes('HH'))}`;
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

export const formatDuration = (minutes: number, format: 'short' | 'long' = 'short'): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (format === 'long') {
    if (hours > 0 && mins > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${mins} minute${mins > 1 ? 's' : ''}`;
  }
  
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
};

export const formatTimeAgo = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return formatDate(d, 'MMM DD, YYYY');
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.getDate() === today.getDate() && 
         d.getMonth() === today.getMonth() && 
         d.getFullYear() === today.getFullYear();
};

export const isYesterday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.getDate() === yesterday.getDate() && 
         d.getMonth() === yesterday.getMonth() && 
         d.getFullYear() === yesterday.getFullYear();
};

export const isTomorrow = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d.getDate() === tomorrow.getDate() && 
         d.getMonth() === tomorrow.getMonth() && 
         d.getFullYear() === tomorrow.getFullYear();
};

export const getDateRange = (period: 'today' | 'week' | 'month' | 'year'): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date();
  const end = new Date();
  
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const startOfWeek = (date: Date, weekStartsOn: number = 0): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const startOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const startOfYear = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(0, 1);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getMonthsDifference = (date1: Date, date2: Date): number => {
  const months = (date2.getFullYear() - date1.getFullYear()) * 12;
  return months + date2.getMonth() - date1.getMonth();
};

export const getYearsDifference = (date1: Date, date2: Date): number => {
  return date2.getFullYear() - date1.getFullYear();
};

// ============================================================================
// NUMBER & CURRENCY UTILITIES
// ============================================================================

export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (
  value: number,
  decimals: number = 0,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatCompactNumber = (value: number): string => {
  if (value < 1000) return value.toString();
  if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
  if (value < 1000000000) return `${(value / 1000000).toFixed(1)}M`;
  return `${(value / 1000000000).toFixed(1)}B`;
};

export const formatPercentage = (
  value: number,
  decimals: number = 0,
  showSign: boolean = false
): string => {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const roundToDecimal = (value: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const average = (...numbers: number[]): number => {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
};

export const sum = (...numbers: number[]): number => {
  return numbers.reduce((a, b) => a + b, 0);
};

export const median = (...numbers: number[]): number => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const standardDeviation = (...numbers: number[]): number => {
  const avg = average(...numbers);
  const squareDiffs = numbers.map((value) => Math.pow(value - avg, 2));
  return Math.sqrt(average(...squareDiffs));
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const calculateChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

export const calculateGrowthRate = (initialValue: number, finalValue: number, periods: number): number => {
  if (initialValue === 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / periods) - 1) * 100;
};

export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  timesCompounded: number,
  years: number
): number => {
  return principal * Math.pow(1 + rate / timesCompounded, timesCompounded * years);
};

export const calculateSimpleInterest = (principal: number, rate: number, years: number): number => {
  return principal * rate * years;
};

export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  const monthlyRate = annualRate / 12 / 100;
  const payments = years * 12;
  if (monthlyRate === 0) return principal / payments;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
         (Math.pow(1 + monthlyRate, payments) - 1);
};

export const calculateROI = (gain: number, cost: number): number => {
  if (cost === 0) return 0;
  return ((gain - cost) / cost) * 100;
};

export const calculateProfitMargin = (revenue: number, cost: number): number => {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
};

export const calculateBreakEven = (fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number): number => {
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  return fixedCosts / contributionMargin;
};

// ============================================================================
// STRING UTILITIES
// ============================================================================

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeWords = (str: string): string => {
  return str.split(' ').map(capitalize).join(' ');
};

export const camelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '');
};

export const snakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
};

export const kebabCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
};

export const pascalCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
    .replace(/\s+/g, '');
};

export const titleCase = (str: string): string => {
  const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in'];
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) =>
      index === 0 || !minorWords.includes(word)
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(' ');
};

export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
};

export const truncateWords = (str: string, wordCount: number, suffix: string = '...'): string => {
  const words = str.split(' ');
  if (words.length <= wordCount) return str;
  return words.slice(0, wordCount).join(' ') + suffix;
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const unslugify = (str: string): string => {
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map(capitalize)
    .join(' ');
};

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

export const escapeHtml = (str: string): string => {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => entities[char]);
};

export const unescapeHtml = (html: string): string => {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
  };
  return html.replace(/&(amp|lt|gt|quot|#x27|#x2F);/g, (entity) => entities[entity]);
};

export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const isEmail = (str: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
};

export const isUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export const isPhone = (str: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(str);
};

export const generateRandomString = (length: number, charset?: string): string => {
  const defaultCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const chars = charset || defaultCharset;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateNanoId = (size: number = 21): string => {
  const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
  let id = '';
  for (let i = 0; i < size; i++) {
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id;
};

export const md5 = (str: string): string => {
  // Simple MD5 implementation for demonstration
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

export const sha256 = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const base64Encode = (str: string): string => {
  return Buffer.from(str, 'utf-8').toString('base64');
};

export const base64Decode = (str: string): string => {
  return Buffer.from(str, 'base64').toString('utf-8');
};

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const compact = <T>(array: (T | null | undefined | false | 0 | '')[]): T[] => {
  return array.filter(Boolean) as T[];
};

export const difference = <T>(array: T[], ...others: T[][]): T[] => {
  const flatOthers = others.flat();
  return array.filter((item) => !flatOthers.includes(item));
};

export const intersection = <T>(...arrays: T[][]): T[] => {
  if (arrays.length === 0) return [];
  return arrays[0].filter((item) => arrays.every((arr) => arr.includes(item)));
};

export const union = <T>(...arrays: T[][]): T[] => {
  return Array.from(new Set(arrays.flat()));
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const flatten = <T>(array: (T | T[])[]): T[] => {
  return array.flat();
};

export const groupBy = <T>(array: T[], key: keyof T | ((item: T) => string | number)): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T | ((item: T) => any), order: 'asc' | 'desc' = 'asc'): T[] => {
  const sorted = [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
};

export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const sample = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const sampleSize = <T>(array: T[], size: number): T[] => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, size);
};

export const partition = <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];
  array.forEach((item) => {
    if (predicate(item)) pass.push(item);
    else fail.push(item);
  });
  return [pass, fail];
};

export const pluck = <T, K extends keyof T>(array: T[], key: K): T[K][] => {
  return array.map((item) => item[key]);
};

export const invoke = <T>(array: T[], methodName: keyof T, ...args: any[]): any[] => {
  return array.map((item) => (item[methodName] as any)?.(...args));
};

export const zip = <T>(...arrays: T[][]): T[][] => {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  const result: T[][] = [];
  for (let i = 0; i < maxLength; i++) {
    result.push(arrays.map((arr) => arr[i]));
  }
  return result;
};

export const unzip = <T>(zipped: T[][]): T[][] => {
  return zip(...zipped);
};

export const range = (start: number, end?: number, step: number = 1): number[] => {
  const actualEnd = end ?? start;
  const actualStart = end ? start : 0;
  const result: number[] = [];
  for (let i = actualStart; i < actualEnd; i += step) {
    result.push(i);
  }
  return result;
};

export const repeat = <T>(value: T, times: number): T[] => {
  return Array(times).fill(value);
};

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(deepClone) as any;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

export const merge = <T extends object>(...objects: Partial<T>[]): T => {
  return Object.assign({}, ...objects);
};

export const deepMerge = <T extends object>(...objects: Partial<T>[]): T => {
  const result = {} as T;
  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      const k = key as keyof T;
      if (isObject(obj[k]) && isObject(result[k])) {
        result[k] = deepMerge(result[k], obj[k]);
      } else {
        result[k] = obj[k] as T[keyof T];
      }
    });
  });
  return result;
};

export const isObject = (value: any): value is object => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const get = <T>(obj: any, path: string, defaultValue?: T): T | undefined => {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }
  return result ?? defaultValue;
};

export const set = <T extends object>(obj: T, path: string, value: any): T => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }
  
  if (lastKey) {
    current[lastKey] = value;
  }
  
  return obj;
};

export const has = (obj: any, path: string): boolean => {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current == null || !(key in current)) return false;
    current = current[key];
  }
  return true;
};

export const values = <T>(obj: T): T[keyof T][] => {
  return Object.values(obj);
};

export const keys = <T>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export const entries = <T>(obj: T): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};

export const mapValues = <T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): Record<keyof T, U> => {
  const result = {} as Record<keyof T, U>;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = fn(obj[key], key);
    }
  }
  return result;
};

export const invert = <T extends Record<string, string | number>>(obj: T): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[String(obj[key])] = key;
    }
  }
  return result;
};

export const camelCaseKeys = <T extends object>(obj: T): any => {
  if (!isObject(obj)) return obj;
  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = camelCase(key);
      result[camelKey] = camelCaseKeys(obj[key]);
    }
  }
  return result;
};

export const snakeCaseKeys = <T extends object>(obj: T): any => {
  if (!isObject(obj)) return obj;
  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = snakeCase(key);
      result[snakeKey] = snakeCaseKeys(obj[key]);
    }
  }
  return result;
};

// ============================================================================
// FUNCTION UTILITIES
// ============================================================================

export const identity = <T>(value: T): T => value;

export const constant = <T>(value: T) => (): T => value;

export const noop = (): void => {};

export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

export const once = <T extends (...args: any[]) => any>(fn: T): T => {
  let called = false;
  let result: any;
  return ((...args: any[]) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  }) as T;
};

export const after = <T extends (...args: any[]) => any>(times: number, fn: T): T => {
  let count = 0;
  return ((...args: any[]) => {
    count++;
    if (count >= times) {
      return fn(...args);
    }
  }) as T;
};

export const before = <T extends (...args: any[]) => any>(times: number, fn: T): T => {
  let count = 0;
  return ((...args: any[]) => {
    if (count < times) {
      count++;
      return fn(...args);
    }
  }) as T;
};

export const curry = <T extends (...args: any[]) => any>(fn: T): any => {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  };
};

export const compose = <T>(...fns: ((arg: T) => T)[]): ((arg: T) => T) => {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
};

export const pipe = <T>(...fns: ((arg: T) => T)[]): ((arg: T) => T) => {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
};

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const partial = <T extends (...args: any[]) => any>(
  fn: T,
  ...partialArgs: any[]
): ((...args: any[]) => any => {
  return (...args: any[]) => fn(...partialArgs, ...args);
});

export const flip = <T extends (...args: any[]) => any>(fn: T): T => {
  return ((...args: any[]) => fn(...args.reverse())) as T;
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean';
};

export const isArray = (value: any): value is any[] => {
  return Array.isArray(value);
};

export const isFunction = (value: any): value is Function => {
  return typeof value === 'function';
};

export const isObjectType = (value: any): value is object => {
  return typeof value === 'object' && value !== null;
};

export const isDate = (value: any): value is Date => {
  return value instanceof Date;
};

export const isValidDate = (value: any): boolean => {
  return value instanceof Date && !isNaN(value.getTime());
};

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isUrlValid = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isPhoneValid = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

export const isCreditCard = (card: string): boolean => {
  const cleaned = card.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const isStrongPassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

export const isJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const isPalindrome = (str: string): boolean => {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
};

export const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

export const isEven = (num: number): boolean => {
  return num % 2 === 0;
};

export const isOdd = (num: number): boolean => {
  return num % 2 !== 0;
};

export const isPositive = (num: number): boolean => {
  return num > 0;
};

export const isNegative = (num: number): boolean => {
  return num < 0;
};

export const isInteger = (num: number): boolean => {
  return Number.isInteger(num);
};

export const isFloat = (num: number): boolean => {
  return !Number.isInteger(num);
};

export const isDivisibleBy = (num: number, divisor: number): boolean => {
  return num % divisor === 0;
};

// ============================================================================
// COLOR UTILITIES
// ============================================================================

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
};

export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

export const lighten = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.min(100, hsl.l + percent);
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

export const darken = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.max(0, hsl.l - percent);
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

export const saturate = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = Math.min(100, hsl.s + percent);
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

export const desaturate = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = Math.max(0, hsl.s - percent);
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

export const invertColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
};

export const getContrastColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

export const getColorPalette = (baseColor: string): string[] => {
  return [
    lighten(baseColor, 40),
    lighten(baseColor, 20),
    baseColor,
    darken(baseColor, 20),
    darken(baseColor, 40),
  ];
};

// ============================================================================
// FILE & STORAGE UTILITIES
// ============================================================================

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

export const getFileName = (path: string): string => {
  return path.split('/').pop() || path;
};

export const getFileNameWithoutExtension = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, '');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(filename).toLowerCase());
};

export const isVideoFile = (filename: string): boolean => {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
  return videoExtensions.includes(getFileExtension(filename).toLowerCase());
};

export const isAudioFile = (filename: string): boolean => {
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'];
  return audioExtensions.includes(getFileExtension(filename).toLowerCase());
};

export const isPdfFile = (filename: string): boolean => {
  return getFileExtension(filename).toLowerCase() === 'pdf';
};

export const isDocumentFile = (filename: string): boolean => {
  const docExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt'];
  return docExtensions.includes(getFileExtension(filename).toLowerCase());
};

// ============================================================================
// DEVICE & PLATFORM UTILITIES
// ============================================================================

export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

export const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};

export const isMobile = (): boolean => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

export const getPlatform = (): string => {
  return Platform.OS;
};

export const getVersion = (): string => {
  return Platform.Version?.toString() || 'Unknown';
};

export const getSystemVersion = (): string => {
  return Platform.select({
    ios: 'iOS',
    android: 'Android',
  }) || 'Unknown';
};

export const isTablet = (): boolean => {
  const { width, height } = require('react-native').Dimensions.get('window');
  const diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  return diagonal >= 1000;
};

export const isPortrait = (): boolean => {
  const { width, height } = require('react-native').Dimensions.get('window');
  return height > width;
};

export const isLandscape = (): boolean => {
  return !isPortrait();
};

export const hasNotch = (): boolean => {
  if (!isIOS()) return false;
  const { width, height } = require('react-native').Dimensions.get('window');
  return height >= 812 || width >= 812;
};

export const getDeviceId = (): string => {
  return Platform.OS === 'ios' ? 'ios' : 'android';
};

// ============================================================================
// MISCELLANEOUS UTILITIES
// ============================================================================

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const waitFor = <T>(condition: () => T | false, timeout: number = 5000): Promise<T> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      const result = condition();
      if (result) {
        resolve(result);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout'));
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
};

export const promiseAll = <T>(promises: Promise<T>[]): Promise<T[]> => {
  return Promise.all(promises);
};

export const promiseRace = <T>(promises: Promise<T>[]): Promise<T> => {
  return Promise.race(promises);
};

export const createDeferred = <T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
} => {
  let resolve!: (value: T) => void;
  let reject!: (error: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

export const poll = async <T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  interval: number = 1000,
  maxAttempts: number = 10
): Promise<T> => {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await fn();
    if (condition(result)) return result;
    await sleep(interval);
  }
  throw new Error('Polling failed');
};

// ============================================================================
// CRYPTO UTILITIES
// ============================================================================

export const generateKey = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const xorEncrypt = (text: string, key: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return Buffer.from(result, 'binary').toString('base64');
};

export const xorDecrypt = (encrypted: string, key: string): string => {
  const text = Buffer.from(encrypted, 'base64').toString('binary');
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
};

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  // Date & Time
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatDuration,
  formatTimeAgo,
  getDaysInMonth,
  getWeekNumber,
  isToday,
  isYesterday,
  isTomorrow,
  getDateRange,
  addDays,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  getDaysDifference,
  getMonthsDifference,
  getYearsDifference,

  // Number & Currency
  formatCurrency,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  roundToDecimal,
  clamp,
  randomInt,
  randomFloat,
  average,
  sum,
  median,
  standardDeviation,
  calculatePercentage,
  calculateChange,
  calculateGrowthRate,
  calculateCompoundInterest,
  calculateSimpleInterest,
  calculateMonthlyPayment,
  calculateROI,
  calculateProfitMargin,
  calculateBreakEven,

  // String
  capitalize,
  capitalizeWords,
  camelCase,
  snakeCase,
  kebabCase,
  pascalCase,
  titleCase,
  truncate,
  truncateWords,
  slugify,
  unslugify,
  stripHtml,
  escapeHtml,
  unescapeHtml,
  escapeRegex,
  isEmail,
  isUrl,
  isPhone,
  generateRandomString,
  generateUUID,
  generateNanoId,
  md5,
  sha256,
  base64Encode,
  base64Decode,

  // Array
  chunk,
  compact,
  difference,
  intersection,
  union,
  unique,
  flatten,
  groupBy,
  sortBy,
  shuffle,
  sample,
  sampleSize,
  partition,
  pluck,
  invoke,
  zip,
  unzip,
  range,
  repeat,
  deepClone,

  // Object
  pick,
  omit,
  merge,
  deepMerge,
  isObject,
  isEmpty,
  get,
  set,
  has,
  values,
  keys,
  entries,
  mapValues,
  invert,
  camelCaseKeys,
  snakeCaseKeys,

  // Function
  identity,
  constant,
  noop,
  memoize,
  once,
  after,
  before,
  curry,
  compose,
  pipe,
  debounce,
  throttle,
  partial,
  flip,

  // Validation
  isString,
  isNumber,
  isBoolean,
  isArray,
  isFunction,
  isObjectType,
  isDate,
  isValidDate,
  isEmailValid,
  isUrlValid,
  isPhoneValid,
  isCreditCard,
  isStrongPassword,
  isJSON,
  isPalindrome,
  isPrime,
  isEven,
  isOdd,
  isPositive,
  isNegative,
  isInteger,
  isFloat,
  isDivisibleBy,

  // Color
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  lighten,
  darken,
  saturate,
  desaturate,
  invertColor,
  getContrastColor,
  generateRandomColor,
  getColorPalette,

  // File
  getFileExtension,
  getFileName,
  getFileNameWithoutExtension,
  formatFileSize,
  isImageFile,
  isVideoFile,
  isAudioFile,
  isPdfFile,
  isDocumentFile,

  // Device
  isIOS,
  isAndroid,
  isMobile,
  getPlatform,
  getVersion,
  getSystemVersion,
  isTablet,
  isPortrait,
  isLandscape,
  hasNotch,
  getDeviceId,

  // Misc
  sleep,
  waitFor,
  retry,
  timeout,
  promiseAll,
  promiseRace,
  createDeferred,
  poll,

  // Crypto
  generateKey,
  xorEncrypt,
  xorDecrypt,
};
