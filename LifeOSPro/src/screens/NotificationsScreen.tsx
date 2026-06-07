import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [reminder, setReminder] = useState('9:00 AM');
  const [habitReminders, setHabitReminders] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.sectionTitle}>Daily Reminder</Text>
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Daily Reminder Time</Text>
            <Text style={styles.settingSubtitle}>Get reminded to complete your tasks</Text>
          </View>
          <TextInput
            style={styles.timeInput}
            value={reminder}
            onChangeText={setReminder}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Notification Types</Text>
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Habit Reminders</Text>
            <Text style={styles.settingSubtitle}>Remind me to do daily habits</Text>
          </View>
          <Switch value={habitReminders} onValueChange={setHabitReminders} trackColor={{ true: colors.dark.primary }} />
        </View>
        
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Task Due Reminders</Text>
            <Text style={styles.settingSubtitle}>Notify when tasks are due</Text>
          </View>
          <Switch value={taskReminders} onValueChange={setTaskReminders} trackColor={{ true: colors.dark.primary }} />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Daily Summary</Text>
            <Text style={styles.settingSubtitle}>Morning motivation & tips</Text>
          </View>
          <Switch value={dailySummary} onValueChange={setDailySummary} trackColor={{ true: colors.dark.primary }} />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Streak Alerts</Text>
            <Text style={styles.settingSubtitle}>Warn before streak breaks</Text>
          </View>
          <Switch value={streakAlerts} onValueChange={setStreakAlerts} trackColor={{ true: colors.dark.primary }} />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Weekly Report</Text>
            <Text style={styles.settingSubtitle}>Your weekly progress summary</Text>
          </View>
          <Switch value={weeklyReport} onValueChange={setWeeklyReport} trackColor={{ true: colors.dark.primary }} />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={() => Alert.alert('Saved!', 'Your notification preferences have been saved.')}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  backButton: { fontSize: 24, color: colors.dark.text },
  title: { fontSize: 18, fontWeight: '600', color: colors.dark.text },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.dark.textSecondary, paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.sm, textTransform: 'uppercase' },
  section: { backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.dark.border },
  settingTitle: { fontSize: 16, color: colors.dark.text, fontWeight: '500' },
  settingSubtitle: { fontSize: 12, color: colors.dark.textSecondary, marginTop: 2 },
  timeInput: { backgroundColor: colors.dark.surfaceLight, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.sm, color: colors.dark.text },
  saveButton: { backgroundColor: colors.dark.primary, marginHorizontal: spacing.lg, marginTop: spacing.xl, padding: spacing.lg, borderRadius: borderRadius.md, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});

export default NotificationsScreen;
