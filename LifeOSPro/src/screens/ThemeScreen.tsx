import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../utils/theme';

const themes = [
  { id: 'dark', name: 'Dark Mode', icon: 'moon', colors: ['#0A0A0F', '#6366F1'] },
  { id: 'light', name: 'Light Mode', icon: 'sunny', colors: ['#FFFFFF', '#6366F1'] },
  { id: 'ocean', name: 'Ocean', icon: 'water', colors: ['#0C1929', '#0EA5E9'] },
  { id: 'forest', name: 'Forest', icon: 'leaf', colors: ['#0A1F0A', '#22C55E'] },
  { id: 'sunset', name: 'Sunset', icon: 'sunny', colors: ['#1A0A0A', '#F59E0B'] },
  { id: 'purple', name: 'Purple Dream', icon: 'color-filter', colors: ['#0F0A1A', '#8B5CF6'] },
];

const ThemeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Themes</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>Premium themes are available for Pro members</Text>
      </View>

      <View style={styles.grid}>
        {themes.map((theme) => (
          <TouchableOpacity key={theme.id} style={styles.themeCard}>
            <View style={[styles.themePreview, { backgroundColor: theme.colors[0] }]}>
              <View style={[styles.themeAccent, { backgroundColor: theme.colors[1] }]} />
            </View>
            <View style={styles.themeNameContainer}>
              <Ionicons name={theme.icon as any} size={18} color={colors.dark.text} />
              <Text style={styles.themeName}> {theme.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  info: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  infoText: { fontSize: 14, color: colors.dark.textSecondary, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.md },
  themeCard: { width: '47%', alignItems: 'center', marginBottom: spacing.lg },
  themePreview: { width: '100%', height: 80, borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: spacing.sm },
  themeAccent: { width: '100%', height: 20, position: 'absolute', bottom: 0 },
  themeName: { fontSize: 14, color: colors.dark.text },
});

export default ThemeScreen;
