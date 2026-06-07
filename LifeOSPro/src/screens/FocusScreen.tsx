import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { generateId, getToday } from '../utils/helpers';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card, Button } from '../components/UI';

const FOCUS_MODES = [
  { name: 'Pomodoro', work: 25, break: 5, longBreak: 15 },
  { name: 'Quick', work: 15, break: 3, longBreak: 10 },
  { name: 'Deep', work: 50, break: 10, longBreak: 30 },
];

const FocusScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch, addXP } = useApp();
  const [mode, setMode] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(FOCUS_MODES[0].work * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const today = getToday();
  const todayMinutes = state.focusSessions
    .filter(s => s.completed && s.date === today)
    .reduce((acc, s) => acc + s.duration, 0);

  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (!isBreak) {
      const newSession = {
        id: generateId(),
        duration: FOCUS_MODES[mode].work,
        type: 'focus' as const,
        completed: true,
        date: today,
      };
      dispatch({ type: 'ADD_FOCUS_SESSION', payload: newSession });
      setSessionsCompleted(s => s + 1);
      addXP(20);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(FOCUS_MODES[mode].work * 60);
  };

  const switchMode = (index: number) => {
    setMode(index);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(FOCUS_MODES[index].work * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentMode = FOCUS_MODES[mode];
  const totalTime = isBreak 
    ? (sessionsCompleted % 4 === 3 ? currentMode.longBreak : currentMode.break) * 60 
    : currentMode.work * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Focus</Text>
        <View style={styles.statsBadge}>
          <Text style={styles.statsText}>⏱️ {todayMinutes} min today</Text>
        </View>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        {FOCUS_MODES.map((m, i) => (
          <TouchableOpacity
            key={m.name}
            style={[styles.modeButton, mode === i && styles.modeButtonActive]}
            onPress={() => switchMode(i)}
          >
            <Text style={[styles.modeButtonText, mode === i && styles.modeButtonTextActive]}>
              {m.name}
            </Text>
            <Text style={[styles.modeButtonSubtext, mode === i && styles.modeButtonSubtextActive]}>
              {m.work}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        <Animated.View style={[styles.timerCircle, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={isBreak ? ['#10B981', '#059669'] : colors.dark.gradient.primary as any}
            style={styles.timerGradient}
          >
            <View style={styles.timerInner}>
              <Text style={[styles.timerLabel, isBreak && styles.timerLabelBreak]}>
                {isBreak ? 'Break Time' : 'Focus Time'}
              </Text>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.sessionText}>
                Session {sessionsCompleted + 1}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
          <Text style={styles.controlIcon}>↺</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mainButton} onPress={toggleTimer}>
          <LinearGradient
            colors={isBreak ? ['#10B981', '#34D399'] : colors.dark.gradient.primary as any}
            style={styles.mainButtonGradient}
          >
            <Text style={styles.mainButtonIcon}>{isRunning ? '⏸' : '▶'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
          <Text style={styles.controlIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statEmoji}>🎯</Text>
          <Text style={styles.statNumber}>{sessionsCompleted}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statEmoji}>⏱️</Text>
          <Text style={styles.statNumber}>{sessionsCompleted * currentMode.work}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statNumber}>{sessionsCompleted * 20}</Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </Card>
      </View>

      {/* Premium CTA */}
      {!state.user.isPremium && (
        <Card style={styles.premiumCard} onPress={() => navigation.navigate('Premium')}>
          <Text style={styles.premiumIcon}>💎</Text>
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>Unlock Focus Analytics</Text>
            <Text style={styles.premiumText}>Track weekly trends, set goals & more</Text>
          </View>
          <Text style={styles.premiumArrow}>→</Text>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.dark.text },
  statsBadge: { backgroundColor: colors.dark.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  statsText: { ...typography.bodySmall, color: colors.dark.textSecondary },
  modeSelector: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.xl, gap: spacing.sm },
  modeButton: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, backgroundColor: colors.dark.surface, alignItems: 'center' },
  modeButtonActive: { backgroundColor: colors.dark.primary },
  modeButtonText: { ...typography.button, color: colors.dark.textSecondary },
  modeButtonTextActive: { color: '#FFFFFF' },
  modeButtonSubtext: { ...typography.caption, color: colors.dark.textTertiary, marginTop: 2 },
  modeButtonSubtextActive: { color: 'rgba(255,255,255,0.7)' },
  timerContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl },
  timerCircle: { width: 280, height: 280, borderRadius: 140 },
  timerGradient: { flex: 1, borderRadius: 140, alignItems: 'center', justifyContent: 'center' },
  timerInner: { alignItems: 'center' },
  timerLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.sm },
  timerLabelBreak: { color: 'rgba(255,255,255,0.9)' },
  timerText: { fontSize: 64, fontWeight: '700', color: '#FFFFFF', letterSpacing: 2 },
  sessionText: { ...typography.bodySmall, color: 'rgba(255,255,255,0.6)', marginTop: spacing.sm },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, marginTop: spacing.xl },
  controlButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.dark.surface, alignItems: 'center', justifyContent: 'center' },
  controlIcon: { fontSize: 24, color: colors.dark.textSecondary },
  mainButton: {},
  mainButtonGradient: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  mainButtonIcon: { fontSize: 28, color: '#FFFFFF' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: spacing.xl, gap: spacing.md },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  statEmoji: { fontSize: 24, marginBottom: spacing.sm },
  statNumber: { ...typography.h4, color: colors.dark.text },
  statLabel: { ...typography.caption, color: colors.dark.textSecondary, marginTop: spacing.xs },
  premiumCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.lg, marginTop: spacing.lg, backgroundColor: colors.dark.accent + '15' },
  premiumIcon: { fontSize: 24 },
  premiumContent: { flex: 1, marginLeft: spacing.md },
  premiumTitle: { ...typography.body, color: colors.dark.text, fontWeight: '600' },
  premiumText: { ...typography.caption, color: colors.dark.textSecondary, marginTop: 2 },
  premiumArrow: { fontSize: 20, color: colors.dark.accent },
});

export default FocusScreen;
