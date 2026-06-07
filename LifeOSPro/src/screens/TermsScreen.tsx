import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../utils/theme';

const TermsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Last Updated: January 2025</Text>
        
        <Text style={styles.text}>
          By using LifeOS, you agree to these terms. Please read them carefully.
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By downloading and using LifeOS, you accept and agree to be bound by these Terms of Service.
        </Text>

        <Text style={styles.sectionTitle}>2. Use License</Text>
        <Text style={styles.text}>
          LifeOS grants you a limited, non-exclusive license to use our app for personal, non-commercial purposes.
        </Text>

        <Text style={styles.sectionTitle}>3. User Account</Text>
        <Text style={styles.text}>
          You are responsible for maintaining the confidentiality of your account and password.
        </Text>

        <Text style={styles.sectionTitle}>4. Prohibited Uses</Text>
        <Text style={styles.text}>
          You may not:{'\n'}
          • Use the app illegally{'\n'}
          • Copy or modify the app{'\n'}
          • Attempt to reverse engineer{'\n'}
          • Use automated systems
        </Text>

        <Text style={styles.sectionTitle}>5. Subscription & Payments</Text>
        <Text style={styles.text}>
          Premium subscriptions auto-renew unless cancelled. You can cancel anytime through your app store.
        </Text>

        <Text style={styles.sectionTitle}>6. Disclaimer</Text>
        <Text style={styles.text}>
          LifeOS is provided "as is" without warranties of any kind. We don't guarantee specific results.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact</Text>
        <Text style={styles.text}>
          Questions? Email us at terms@lifeos.app
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

export default TermsScreen;
