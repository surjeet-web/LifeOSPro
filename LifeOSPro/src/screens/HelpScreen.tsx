import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const HelpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const faqs = [
    { q: 'How does the AI Coach work?', a: 'Our AI analyzes your habits and productivity patterns to provide personalized advice. It learns from your data to give increasingly better recommendations.' },
    { q: 'What is the free tier limit?', a: 'Free users get 10 AI messages per day, basic task/habit tracking, and local data storage.' },
    { q: 'How do I cancel my subscription?', a: 'Go to Settings > Premium > Cancel Subscription. You can cancel anytime with no penalties.' },
    { q: 'Is my data secure?', a: 'Yes! We use bank-level encryption. Your data is stored securely and never shared with third parties.' },
    { q: 'How do streaks work?', a: 'Complete your daily habits to maintain your streak. Miss a day and your streak resets! Use Premium to protect streaks.' },
    { q: 'Can I export my data?', a: 'Yes! Go to Settings > Data > Export to download your data in JSON format.' },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Help & FAQ</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>❓</Text>
        <Text style={styles.heroTitle}>How can we help?</Text>
        <Text style={styles.heroSubtitle}>Find answers to common questions below</Text>
      </View>

      <View style={styles.faqSection}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.faqQuestion}>{faq.q}</Text>
            <Text style={styles.faqAnswer}>{faq.a}</Text>
          </View>
        ))}
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Still need help?</Text>
        <Text style={styles.contactText}>Contact our support team at support@lifeos.app</Text>
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
  heroEmoji: { fontSize: 50, marginBottom: spacing.md },
  heroTitle: { fontSize: 24, fontWeight: '700', color: colors.dark.text },
  heroSubtitle: { fontSize: 14, color: colors.dark.textSecondary, marginTop: spacing.sm },
  faqSection: { paddingHorizontal: spacing.lg },
  faqCard: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: colors.dark.text, marginBottom: spacing.sm },
  faqAnswer: { fontSize: 14, color: colors.dark.textSecondary, lineHeight: 22 },
  contactSection: { alignItems: 'center', paddingVertical: spacing.xl },
  contactTitle: { fontSize: 18, fontWeight: '600', color: colors.dark.text },
  contactText: { fontSize: 14, color: colors.dark.primary, marginTop: spacing.sm },
});

export default HelpScreen;
