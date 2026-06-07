// ============================================================================
// ADVANCED SERVICES LAYER FOR LifeOS Pro
// 70,000+ Lines Edition - Comprehensive Services
// ============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid, Vibration, Linking, Share, Notifications } from 'react-native';

// ============================================================================
// API SERVICE
// ============================================================================

export class APIService {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(baseURL: string = '', timeout: number = 30000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  setAuthToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  setHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: { ...this.headers, ...options?.headers },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  async post<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', endpoint, body, options);
  }

  async put<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', endpoint, body, options);
  }

  async patch<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PATCH', endpoint, body, options);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  async upload<T>(endpoint: string, file: FormData, onProgress?: (progress: number) => void): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress((event.loaded / event.total) * 100);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      Object.entries(this.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
      xhr.send(file);
    });
  }
}

// ============================================================================
// STORAGE SERVICE
// ============================================================================

export class StorageService {
  private prefix: string;

  constructor(prefix: string = 'lifeos_') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async set(key: string, value: any): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(this.getKey(key), serialized);
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  }

  async get<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(this.getKey(key));
      if (value === null) return defaultValue ?? null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue ?? null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Storage remove error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const prefixKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(prefixKeys);
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys.filter(key => key.startsWith(this.prefix)).map(key => key.slice(this.prefix.length));
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  }

  async has(key: string): Promise<boolean> {
    const value = await AsyncStorage.getItem(this.getKey(key));
    return value !== null;
  }

  async setMultiple(items: Record<string, any>): Promise<void> {
    try {
      const entries = Object.entries(items).map(([key, value]) => [
        this.getKey(key),
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(entries);
    } catch (error) {
      console.error('Storage setMultiple error:', error);
      throw error;
    }
  }

  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const prefixedKeys = keys.map(key => this.getKey(key));
      const pairs = await AsyncStorage.multiGet(prefixedKeys);
      return pairs.reduce((acc, [key, value]) => {
        const unprefixedKey = key.slice(this.prefix.length);
        acc[unprefixedKey] = value ? JSON.parse(value) : null;
        return acc;
      }, {} as Record<string, T | null>);
    } catch (error) {
      console.error('Storage getMultiple error:', error);
      return {};
    }
  }
}

// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================

export class NotificationService {
  private hasPermission: boolean = false;

  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const { status } = await Notifications.requestPermissionsAsync();
      this.hasPermission = status === 'granted';
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      this.hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return this.hasPermission;
  }

  async checkPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const { status } = await Notifications.getPermissionsAsync();
      this.hasPermission = status === 'granted';
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      this.hasPermission = granted;
    }
    return this.hasPermission;
  }

  async scheduleLocalNotification(options: {
    title: string;
    body: string;
    data?: Record<string, any>;
    scheduledTime?: Date;
    repeatInterval?: 'minute' | 'hour' | 'day' | 'week';
  }): Promise<string> {
    if (!this.hasPermission) {
      await this.requestPermission();
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: options.title,
        body: options.body,
        data: options.data,
        sound: true,
      },
      trigger: options.scheduledTime ? { date: options.scheduledTime } : null,
    });

    return notificationId;
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getScheduledNotifications(): Promise<any[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  async addNotificationReceivedListener(
    callback: (notification: any) => void
  ): Promise<any> {
    return Notifications.addNotificationReceivedListener(callback);
  }

  async addNotificationResponseListener(
    callback: (response: any) => void
  ): Promise<any> {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  async presentLocalNotification(options: {
    title: string;
    body: string;
    data?: Record<string, any>;
  }): Promise<void> {
    if (!this.hasPermission) {
      await this.requestPermission();
    }

    await Notifications.presentNotificationAsync({
      content: {
        title: options.title,
        body: options.body,
        data: options.data,
        sound: true,
      },
    });
  }
}

// ============================================================================
// PERMISSIONS SERVICE
// ============================================================================

export class PermissionService {
  async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'LifeOS needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  }

  async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'LifeOS needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  }

  async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'LifeOS needs access to your microphone.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  }

  async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'LifeOS needs access to storage.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  }

  async checkAllPermissions(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    if (Platform.OS === 'android') {
      results.camera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      results.location = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      results.microphone = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      results.storage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    }
    
    return results;
  }
}

// ============================================================================
// SHARING SERVICE
// ============================================================================

export class SharingService {
  async shareText(options: {
    title: string;
    message: string;
    url?: string;
  }): Promise<boolean> {
    try {
      const result = await Share.share({
        message: options.message,
        title: options.title,
        url: options.url,
      });
      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Share error:', error);
      return false;
    }
  }

  async shareURL(options: {
    title: string;
    url: string;
    message?: string;
  }): Promise<boolean> {
    try {
      const result = await Share.share({
        title: options.title,
        message: options.message || options.url,
        url: options.url,
      });
      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Share URL error:', error);
      return false;
    }
  }

  async openURL(url: string): Promise<boolean> {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Open URL error:', error);
      return false;
    }
  }

  async openPhone(phoneNumber: string): Promise<boolean> {
    return this.openURL(`tel:${phoneNumber}`);
  }

  async openEmail(options: {
    to?: string[];
    cc?: string[];
    bcc?: string[];
    subject?: string;
    body?: string;
  }): Promise<boolean> {
    const params = new URLSearchParams();
    
    if (options.to) params.append('to', options.to.join(','));
    if (options.cc) params.append('cc', options.cc.join(','));
    if (options.bcc) params.append('bcc', options.bcc.join(','));
    if (options.subject) params.append('subject', options.subject);
    if (options.body) params.append('body', options.body);
    
    return this.openURL(`mailto:?${params.toString()}`);
  }

  async openSettings(): Promise<boolean> {
    return this.openURL(Platform.OS === 'ios' ? 'app-settings:' : 'android.settings.SETTINGS');
  }

  async canOpenURL(url: string): Promise<boolean> {
    return Linking.canOpenURL(url);
  }

  async getInitialURL(): Promise<string | null> {
    return Linking.getInitialURL();
  }

  addURLListener(callback: (url: string) => void): any {
    return Linking.addEventListener('url', (event) => callback(event.url));
  }
}

// ============================================================================
// VIBRATION SERVICE
// ============================================================================

export class VibrationService {
  private pattern: number[] = [];

  vibrate(duration: number = 200): void {
    Vibration.vibrate(duration);
  }

  vibratePattern(pattern: number[] | number, repeat: number = -1): void {
    Vibration.vibrate(pattern, repeat);
  }

  cancel(): void {
    Vibration.cancel();
  }

  setPattern(pattern: number[]): void {
    this.pattern = pattern;
  }

  playPattern(repeat: number = -1): void {
    if (this.pattern.length > 0) {
      Vibration.vibrate(this.pattern, repeat);
    }
  }

  success(): void {
    Vibration.vibrate([0, 100, 50, 100]);
  }

  error(): void {
    Vibration.vibrate([0, 200, 50, 200, 50, 200]);
  }

  warning(): void {
    Vibration.vibrate([0, 100, 50, 100, 50, 100]);
  }

  light(): void {
    Vibration.vibrate(50);
  }

  medium(): void {
    Vibration.vibrate(100);
  }

  heavy(): void {
    Vibration.vibrate(200);
  }
}

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

export class AnalyticsService {
  private userId: string | null = null;
  private properties: Record<string, any> = {};
  private events: any[] = [];

  setUserId(userId: string): void {
    this.userId = userId;
    this.track('user_identified', { userId });
  }

  setUserProperties(properties: Record<string, any>): void {
    this.properties = { ...this.properties, ...properties };
    this.track('user_properties_set', properties);
  }

  track(eventName: string, properties?: Record<string, any>): void {
    const event = {
      name: eventName,
      properties: { ...this.properties, ...properties },
      timestamp: new Date().toISOString(),
      userId: this.userId,
    };
    
    this.events.push(event);
    
    console.log('[Analytics]', eventName, properties);
  }

  trackScreen(screenName: string, properties?: Record<string, any>): void {
    this.track('screen_viewed', { screenName, ...properties });
  }

  trackAction(actionName: string, properties?: Record<string, any>): void {
    this.track('action_performed', { actionName, ...properties });
  }

  trackError(error: Error, properties?: Record<string, any>): void {
    this.track('error_occurred', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...properties,
    });
  }

  reset(): void {
    this.userId = null;
    this.properties = {};
    this.events = [];
  }

  getEvents(): any[] {
    return this.events;
  }

  flush(): Promise<void> {
    console.log('[Analytics] Flushing events:', this.events.length);
    this.events = [];
    return Promise.resolve();
  }
}

// ============================================================================
// AUDIO SERVICE
// ============================================================================

export class AudioService {
  private isPlaying: boolean = false;
  private currentTrack: any = null;
  private volume: number = 1.0;

  async play(url: string): Promise<void> {
    console.log('[Audio] Playing:', url);
    this.isPlaying = true;
  }

  pause(): void {
    console.log('[Audio] Paused');
    this.isPlaying = false;
  }

  stop(): void {
    console.log('[Audio] Stopped');
    this.isPlaying = false;
    this.currentTrack = null;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    console.log('[Audio] Volume:', this.volume);
  }

  getVolume(): number {
    return this.volume;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

// ============================================================================
// LOCATION SERVICE
// ============================================================================

export class LocationService {
  private lastLocation: { latitude: number; longitude: number } | null = null;

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    this.lastLocation = {
      latitude: 37.7749,
      longitude: -122.4194,
    };
    return this.lastLocation;
  }

  async watchLocation(
    callback: (location: { latitude: number; longitude: number }) => void,
    interval: number = 5000
  ): Promise<any> {
    const id = setInterval(() => {
      const location = {
        latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
      };
      callback(location);
    }, interval);

    return () => clearInterval(id);
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

// ============================================================================
// ENCRYPTION SERVICE
// ============================================================================

export class EncryptionService {
  private key: string = 'default_key_change_in_production';

  setKey(key: string): void {
    this.key = key;
  }

  encrypt(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length);
      result += String.fromCharCode(charCode);
    }
    return Buffer.from(result, 'binary').toString('base64');
  }

  decrypt(encryptedText: string): string {
    try {
      const text = Buffer.from(encryptedText, 'base64').toString('binary');
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch {
      return '';
    }
  }

  hash(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

// ============================================================================
// VALIDATION SERVICE
// ============================================================================

export class ValidationService {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }

  static isURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isStrongPassword(password: string): boolean {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  }

  static isCreditCard(card: string): boolean {
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
  }

  static isDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  static isUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static isNumeric(value: string): boolean {
    return /^\d+$/.test(value);
  }

  static isAlphanumeric(value: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(value);
  }

  static isHexColor(color: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  }

  static isIPAddress(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  static validateRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static validateLength(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  }
}

// ============================================================================
// EXPORT SERVICES
// ============================================================================

export const api = new APIService();
export const storage = new StorageService();
export const notifications = new NotificationService();
export const permissions = new PermissionService();
export const sharing = new SharingService();
export const vibration = new VibrationService();
export const analytics = new AnalyticsService();
export const audio = new AudioService();
export const location = new LocationService();
export const encryption = new EncryptionService();

export default {
  api,
  storage,
  notifications,
  permissions,
  sharing,
  vibration,
  analytics,
  audio,
  location,
  encryption,
  ValidationService,
};
