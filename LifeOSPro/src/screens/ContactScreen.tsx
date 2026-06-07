import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const ContactScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const contactOptions = [
    { icon: 'mail', title: 'Email', subtitle: 'support@lifeos.app', action: () => Linking.openURL('mailto:support@lifeos.app') },
    { icon: 'chatbubbles', title: 'Live Chat', subtitle: 'Available 24/7', action: () => {} },
    { icon: 'logo-twitter', title: 'Twitter', subtitle: '@lifeosapp', action: () => Linking.openURL('https://twitter.com/lifeosapp') },
    { icon: 'logo-facebook', title: 'Facebook', subtitle: 'LifeOSApp', action: () => Linking.openURL('https://facebook.com/lifeosapp') },
    { icon: 'logo-instagram', title: 'Instagram', subtitle: '@lifeosapp', action: () => Linking.openURL('https://instagram.com/lifeosapp') },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>💬</Text>
        <Text style={styles.heroTitle}>We're here to help!</Text>
        <Text style={styles.heroSubtitle}>Choose your preferred way to reach us</Text>
      </View>

      <View style={styles.options}>
        {contactOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.optionCard} onPress={option.action}>
            <Ionicons name={option.icon as any} size={24} color={colors.dark.primary} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📞 Phone Support</Text>
        <Text style={styles.infoText}>Premium members: 1-800-LIFEOS</Text>
        <Text style={styles.infoHint}>Available Mon-Fri 9AM-6PM EST</Text>
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
  hero: { alignItems: 'center', paddingVertical: spacing.xl },
  heroEmoji: { fontSize: 60, marginBottom: spacing.md },
  heroTitle: { fontSize: 24, fontWeight: '700', color: colors.dark.text },
  heroSubtitle: { fontSize: 14, color: colors.dark.textSecondary, marginTop: spacing.sm },
  options: { paddingHorizontal: spacing.lg },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark.surface, padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.md },
  optionIcon: { fontSize: 28 },
  optionContent: { flex: 1, marginLeft: spacing.md },
  optionTitle: { fontSize: 16, fontWeight: '600', color: colors.dark.text },
  optionSubtitle: { fontSize: 12, color: colors.dark.textSecondary, marginTop: 2 },
  optionArrow: { fontSize: 24, color: colors.dark.textTertiary },
  infoCard: { backgroundColor: colors.dark.surface, marginHorizontal: spacing.lg, marginTop: spacing.lg, padding: spacing.lg, borderRadius: borderRadius.lg },
  infoTitle: { fontSize: 16, fontWeight: '600', color: colors.dark.text, marginBottom: spacing.sm },
  infoText: { fontSize: 14, color: colors.dark.primary },
  infoHint: { fontSize: 12, color: colors.dark.textSecondary, marginTop: spacing.xs },
});

export default ContactScreen;
