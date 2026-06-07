import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleExport = async () => {
    try {
      const data = JSON.stringify({
        tasks: state.tasks,
        habits: state.habits,
        transactions: state.transactions,
        notes: state.notes,
        focusSessions: state.focusSessions,
      }, null, 2);
      
      await Share.share({
        message: data,
        title: 'LifeOS Data Export',
      });
    } catch (error) {
      Alert.alert('Export', 'Data exported successfully!');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete ALL your data. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Everything', style: 'destructive', onPress: () => {
          dispatch({ type: 'SET_TASKS', payload: [] });
          dispatch({ type: 'SET_HABITS', payload: [] });
          dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
          dispatch({ type: 'SET_NOTES', payload: [] });
          dispatch({ type: 'SET_FOCUS_SESSIONS', payload: [] });
          Alert.alert('Done', 'All data cleared');
        }},
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, right }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon as any} size={20} color={colors.dark.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {right || <Text style={styles.settingArrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Profile Section */}
      <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('Profile')}>
        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>{state.user.name.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{state.user.name}</Text>
          <Text style={styles.profileLevel}>Level {state.user.level} • {state.user.xp} XP</Text>
        </View>
        <Text style={styles.profileArrow}>›</Text>
      </TouchableOpacity>

      {/* Account */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.section}>
        <SettingItem icon="person" title="Edit Profile" subtitle="Change name, avatar" onPress={() => navigation.navigate('EditProfile')} />
        <SettingItem 
          icon="diamond" 
          title="Premium" 
          subtitle={state.user.isPremium 
            ? state.user.isLifetimeMember 
              ? "Lifetime Member" 
              : state.user.premiumTier === 'yearly' 
                ? "Yearly Premium" 
                : "Monthly Premium"
            : "Upgrade for more features"
          } 
          onPress={() => navigation.navigate('Premium')}
          right={
            state.user.isPremium ? 
            <Text style={[styles.premiumBadge, state.user.isLifetimeMember && styles.lifetimeBadge]}>
              {state.user.isLifetimeMember ? '👑' : '✓ Active'}
            </Text> : 
            <Text style={styles.upgradeText}>Upgrade</Text>
          }
        />
      </View>

      {/* App Settings */}
      <Text style={styles.sectionTitle}>App</Text>
      <View style={styles.section}>
        <SettingItem 
          icon="notifications" 
          title="Notifications" 
          subtitle="Manage reminders"
          onPress={() => navigation.navigate('Notifications')}
        />
        <SettingItem 
          icon="moon" 
          title="Dark Mode" 
          subtitle="Always on"
          right={<Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: colors.dark.primary }} />}
        />
        <SettingItem icon="color-palette" title="Themes" subtitle="Customize your app" onPress={() => navigation.navigate('Theme')} />
      </View>

      {/* Data */}
      <Text style={styles.sectionTitle}>Data</Text>
      <View style={styles.section}>
        <SettingItem icon="download" title="Export Data" subtitle="Download your data" onPress={handleExport} />
        <SettingItem icon="trash" title="Clear All Data" subtitle="Delete everything" onPress={handleClearData} />
      </View>

      {/* Progress */}
      <Text style={styles.sectionTitle}>Progress</Text>
      <View style={styles.section}>
        <SettingItem icon="trophy" title="Achievements" subtitle="View your achievements" onPress={() => navigation.navigate('Achievements')} />
      </View>

      {/* Support */}
      <Text style={styles.sectionTitle}>Support</Text>
      <View style={styles.section}>
        <SettingItem icon="help-circle" title="Help & FAQ" onPress={() => navigation.navigate('Help')} />
        <SettingItem icon="chatbubbles" title="Contact Us" subtitle="support@lifeos.app" onPress={() => navigation.navigate('Contact')} />
        <SettingItem icon="star" title="Rate App" onPress={() => {}} />
        <SettingItem icon="document-text" title="Privacy Policy" onPress={() => navigation.navigate('Privacy')} />
        <SettingItem icon="paper" title="Terms of Service" onPress={() => navigation.navigate('Terms')} />
      </View>

      {/* Developer */}
      <Text style={styles.sectionTitle}>Developer</Text>
      <View style={styles.section}>
        <SettingItem icon="🗄️" title="Database" subtitle="Mock data & storage" onPress={() => navigation.navigate('Database')} />
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>LifeOS Pro</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appCopyright}>Made with ❤️ for productivity</Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.dark.text },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.xl, padding: spacing.lg },
  profileAvatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  profileInitial: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  profileInfo: { flex: 1, marginLeft: spacing.md },
  profileName: { ...typography.h5, color: colors.dark.text },
  profileLevel: { ...typography.caption, color: colors.dark.textSecondary },
  profileArrow: { fontSize: 24, color: colors.dark.textTertiary },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.dark.textSecondary, paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  section: { backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.dark.border },
  settingIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.dark.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  settingEmoji: { fontSize: 18 },
  settingContent: { flex: 1, marginLeft: spacing.md },
  settingTitle: { ...typography.body, color: colors.dark.text, fontWeight: '500' },
  settingSubtitle: { ...typography.caption, color: colors.dark.textSecondary, marginTop: 2 },
  settingArrow: { fontSize: 20, color: colors.dark.textTertiary },
  premiumBadge: { color: colors.dark.success, fontWeight: '600' },
  lifetimeBadge: { fontSize: 16 },
  upgradeText: { color: colors.dark.primary, fontWeight: '600' },
  appInfo: { alignItems: 'center', paddingVertical: spacing.xxxl },
  appName: { ...typography.h5, color: colors.dark.text },
  appVersion: { ...typography.caption, color: colors.dark.textSecondary, marginTop: spacing.xs },
  appCopyright: { ...typography.caption, color: colors.dark.textTertiary, marginTop: spacing.sm },
});

export default SettingsScreen;
