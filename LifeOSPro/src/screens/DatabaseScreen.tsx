import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { generateMockData, loadMockData, clearMockData, isMockDataLoaded } from '../utils/mockDatabase';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const DatabaseScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();
  const [mockLoaded, setMockLoaded] = useState(false);
  const [autoLoad, setAutoLoad] = useState(false);

  useEffect(() => {
    checkMockStatus();
  }, []);

  const checkMockStatus = async () => {
    const loaded = await isMockDataLoaded();
    setMockLoaded(loaded);
  };

  const handleLoadMockData = async () => {
    const mockData = generateMockData();
    
    dispatch({ type: 'SET_USER', payload: mockData.user });
    dispatch({ type: 'SET_TASKS', payload: mockData.tasks });
    dispatch({ type: 'SET_HABITS', payload: mockData.habits });
    dispatch({ type: 'SET_TRANSACTIONS', payload: mockData.transactions });
    dispatch({ type: 'SET_NOTES', payload: mockData.notes });
    dispatch({ type: 'SET_FOCUS_SESSIONS', payload: mockData.focusSessions });
    
    await loadMockData();
    setMockLoaded(true);
    Alert.alert('Success', 'Mock data loaded! Restart the app to see changes.');
  };

  const handleClearMockData = async () => {
    Alert.alert(
      'Clear Mock Data',
      'This will clear all test data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: async () => {
          await clearMockData();
          setMockLoaded(false);
          Alert.alert('Done', 'Mock data cleared.');
        }},
      ]
    );
  };

  const stats = {
    tasks: state.tasks.length,
    habits: state.habits.length,
    transactions: state.transactions.length,
    notes: state.notes.length,
    focusSessions: state.focusSessions.length,
    totalXP: state.user.xp,
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Database</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Mock Data Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Mock Data</Text>
          <View style={[styles.statusBadge, mockLoaded ? styles.statusActive : styles.statusInactive]}>
            <Ionicons name={mockLoaded ? "checkmark-circle" : "close-circle"} size={16} color={mockLoaded ? colors.dark.success : colors.dark.error} />
            <Text style={styles.statusText}> {mockLoaded ? 'Loaded' : 'Not Loaded'}</Text>
          </View>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.tasks}</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.habits}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.transactions}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.focusSessions}</Text>
            <Text style={styles.statLabel}>Focus</Text>
          </View>
        </View>
      </View>

      {/* Load Mock Data */}
      <Text style={styles.sectionTitle}>Test Data</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={handleLoadMockData}>
          <Ionicons name="download" size={20} color="#FFF" />
          <Text style={styles.buttonText}> Load Mock Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={handleClearMockData}>
          <Ionicons name="trash" size={20} color="#FFF" />
          <Text style={styles.buttonText}> Clear Mock Data</Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <Text style={styles.sectionTitle}>Current User</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{state.user.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Level:</Text>
          <Text style={styles.infoValue}>{state.user.level}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>XP:</Text>
          <Text style={styles.infoValue}>{state.user.xp}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Premium:</Text>
          <Text style={styles.infoValue}>{state.user.isPremium ? '✅ Yes' : '❌ No'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since:</Text>
          <Text style={styles.infoValue}>{new Date(state.user.joinedAt).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Auto Load Toggle */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.toggleLabel}>Auto-load Mock Data</Text>
          <Text style={styles.toggleHint}>Load test data on app start</Text>
        </View>
        <Switch value={autoLoad} onValueChange={setAutoLoad} trackColor={{ true: colors.dark.primary }} />
      </View>

      {/* API Endpoints (Mock) */}
      <Text style={styles.sectionTitle}>API Endpoints (Mock)</Text>
      <View style={styles.endpointsCard}>
        <Text style={styles.endpoint}>GET  /api/user</Text>
        <Text style={styles.endpoint}>GET  /api/tasks</Text>
        <Text style={styles.endpoint}>POST /api/tasks</Text>
        <Text style={styles.endpoint}>GET  /api/habits</Text>
        <Text style={styles.endpoint}>POST /api/habits</Text>
        <Text style={styles.endpoint}>GET  /api/finance</Text>
        <Text style={styles.endpoint}>POST /api/finance</Text>
        <Text style={styles.endpoint}>GET  /api/analytics</Text>
      </View>

      {/* Storage Info */}
      <Text style={styles.sectionTitle}>Local Storage</Text>
      <View style={styles.storageCard}>
        <Text style={styles.storageText}>@lifeos_pro_data</Text>
        <Text style={styles.storageSize}>~{(JSON.stringify(state).length / 1024).toFixed(2)} KB</Text>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  backButton: { fontSize: 24, color: colors.dark.text },
  title: { fontSize: 18, fontWeight: '600', color: colors.dark.text },
  statusCard: { backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.lg },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  statusLabel: { fontSize: 16, fontWeight: '600', color: colors.dark.text },
  statusBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  statusActive: { backgroundColor: colors.dark.success + '20' },
  statusInactive: { backgroundColor: colors.dark.error + '20' },
  statusText: { fontSize: 12, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '700', color: colors.dark.primary },
  statLabel: { fontSize: 12, color: colors.dark.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.dark.textSecondary, paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.sm, textTransform: 'uppercase' },
  section: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  button: { backgroundColor: colors.dark.primary, padding: spacing.lg, borderRadius: borderRadius.md, alignItems: 'center' },
  buttonDanger: { backgroundColor: colors.dark.error },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  infoCard: { backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.lg },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.dark.border },
  infoLabel: { color: colors.dark.textSecondary },
  infoValue: { color: colors.dark.text, fontWeight: '500' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, marginTop: spacing.lg, padding: spacing.lg, borderRadius: borderRadius.lg },
  toggleLabel: { fontSize: 16, color: colors.dark.text, fontWeight: '500' },
  toggleHint: { fontSize: 12, color: colors.dark.textSecondary, marginTop: 2 },
  endpointsCard: { backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.lg },
  endpoint: { fontSize: 14, color: colors.dark.primary, fontFamily: 'monospace', paddingVertical: spacing.xs },
  storageCard: { backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between' },
  storageText: { color: colors.dark.text, fontFamily: 'monospace' },
  storageSize: { color: colors.dark.textSecondary },
});

export default DatabaseScreen;
