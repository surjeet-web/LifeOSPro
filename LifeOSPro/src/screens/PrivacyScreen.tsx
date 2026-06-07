import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const PrivacyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Last Updated: January 2025</Text>
        
        <Text style={styles.text}>
          At LifeOS, we take your privacy seriously. This policy explains how we collect, use, and protect your data.
        </Text>

        <Text style={styles.sectionTitle}>1. Data We Collect</Text>
        <Text style={styles.text}>
          • Personal information (name, email){'\n'}
          • Task and habit data{'\n'}
          • Focus session data{'\n'}
          • Financial information (optional){'\n'}
          • Usage analytics
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>
        <Text style={styles.text}>
          • Provide our services{'\n'}
          • Personalize your experience{'\n'}
          • Improve our app{'\n'}
          • Send important notifications
        </Text>

        <Text style={styles.sectionTitle}>3. Data Security</Text>
        <Text style={styles.text}>
          We use industry-standard encryption to protect your data. Your information is stored securely and never sold to third parties.
        </Text>

        <Text style={styles.sectionTitle}>4. Your Rights</Text>
        <Text style={styles.text}>
          • Access your data{'\n'}
          • Delete your account{'\n'}
          • Export your data{'\n'}
          • Opt-out of analytics
        </Text>

        <Text style={styles.sectionTitle}>5. Contact</Text>
        <Text style={styles.text}>
          Questions? Email us at privacy@lifeos.app
        </Text>
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
  content: { paddingHorizontal: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.dark.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  text: { fontSize: 14, color: colors.dark.textSecondary, lineHeight: 22 },
});

export default PrivacyScreen;
