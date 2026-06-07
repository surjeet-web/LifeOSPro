import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Dimensions, Platform, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';

const { width } = Dimensions.get('window');

type SubscriptionTier = 'free' | 'monthly' | 'yearly' | 'lifetime';

interface PlanFeature {
  icon: string;
  title: string;
  free: string | boolean;
  premium: string | boolean;
}

const PLAN_FEATURES: PlanFeature[] = [
  { icon: '🤖', title: 'AI Companion', free: '10/day', premium: 'Unlimited' },
  { icon: '📊', title: 'Advanced Analytics', free: false, premium: true },
  { icon: '☁️', title: 'Cloud Backup', free: false, premium: true },
  { icon: '🎨', title: 'Premium Themes', free: false, premium: true },
  { icon: '🚫', title: 'Ad-Free', free: false, premium: true },
  { icon: '⚡', title: 'Priority Support', free: false, premium: true },
  { icon: '🚀', title: 'Early Access', free: false, premium: true },
  { icon: '📈', title: 'AI Insights', free: false, premium: true },
  { icon: '🎯', title: 'Advanced Goals', free: '3 goals', premium: 'Unlimited' },
  { icon: '💾', title: 'Data Export', free: false, premium: true },
];

const LIFETIME_FEATURES = [
  '🎁 Lifetime Premium Access',
  '🎁 All Future Updates Free',
  '🎁 Exclusive Lifetime Badge',
  '🎁 Early Access to Beta Features',
  '🎁 Priority Lifetime Support',
];

const TESTIMONIALS = [
  { text: "This app literally changed my life. I've been more productive, healthier, and finally achieved my goals!", author: 'Sarah M.', age: 28 },
  { text: "The AI coach is incredible. It's like having a therapist and productivity expert in my pocket 24/7.", author: 'Michael R.', age: 34 },
  { text: "I've tried EVERY productivity app. This is the ONLY one that actually stuck. 90-day streak!", author: 'David K.', age: 38 },
];

const PremiumScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('lifetime');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLifetimeModal, setShowLifetimeModal] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const getPlanPrice = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'monthly': return { price: '$9.99', period: '/month', trial: '7-day free trial' };
      case 'yearly': return { price: '$79.99', period: '/year', trial: '7-day free trial', savings: 'Save 33%' };
      case 'lifetime': return { price: '$299.99', period: '', trial: 'One-time payment' };
      default: return null;
    }
  };

  const subscribe = () => {
    if (selectedTier === 'lifetime') {
      setShowLifetimeModal(true);
    } else {
      const expiresAt = selectedTier === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      
      dispatch({ 
        type: 'SET_USER', 
        payload: { 
          isPremium: true, 
          premiumTier: selectedTier,
          premiumExpiresAt: expiresAt,
          premiumStartedAt: new Date().toISOString()
        } 
      });
      navigation.goBack();
    }
  };

  const confirmLifetime = () => {
    dispatch({ 
      type: 'SET_USER', 
      payload: { 
        isPremium: true, 
        premiumTier: 'lifetime',
        premiumExpiresAt: 'lifetime',
        premiumStartedAt: new Date().toISOString(),
        isLifetimeMember: true
      } 
    });
    setShowLifetimeModal(false);
    navigation.goBack();
  };

  if (state.user.isPremium) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Premium</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.premiumActive}>
          <Animated.View style={[styles.crownContainer, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient colors={colors.dark.gradient.aurora as any} style={styles.crownBadge}>
              <Ionicons name="diamond" size={48} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>
          <Animated.Text style={[styles.premiumActiveTitle, { opacity: fadeAnim }]}>
            {state.user.isLifetimeMember ? "Lifetime Premium!" : "You're Premium!"}
          </Animated.Text>
          <Text style={styles.premiumActiveText}>
            {state.user.isLifetimeMember 
              ? "Thank you for being a lifetime member!" 
              : `Premium since ${new Date(state.user.premiumStartedAt).toLocaleDateString()}`
            }
          </Text>
          
          <View style={styles.premiumFeaturesList}>
            {PLAN_FEATURES.filter(f => f.premium === true).slice(0, 4).map((feature, index) => (
              <View key={index} style={styles.premiumFeatureRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.dark.success} />
                <Text style={styles.premiumFeatureText}>{feature.title}</Text>
              </View>
            ))}
          </View>
          
          {state.user.isLifetimeMember && (
            <View style={styles.lifetimeBadge}>
              <Text style={styles.lifetimeBadgeText}>👑 Lifetime Member</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient
            colors={['#7C3AED', '#EC4899', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroBadge}>
              <Ionicons name="star" size={14} color="#FFF" />
              <Text style={styles.heroBadgeText}>MOST POPULAR</Text>
            </View>
            
            <Text style={styles.heroTitle}>Unlock Your{'\n'}Full Potential</Text>
            <Text style={styles.heroSubtitle}>Join 2M+ people transforming their lives</Text>
            
            <View style={styles.ratingRow}>
              <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.ratingText}>4.9/5 from 50K+ reviews</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Plan Selector */}
        <Animated.View style={[styles.plansContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Free Plan */}
          <TouchableOpacity 
            style={[styles.planCard, selectedTier === 'free' && styles.planCardSelected]}
            onPress={() => setSelectedTier('free')}
            activeOpacity={0.8}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Free</Text>
              <Text style={styles.planPrice}>$0</Text>
            </View>
            <Text style={styles.planDesc}>Forever free</Text>
            <View style={styles.planFeatures}>
              <Text style={styles.planFeatureText}>• Basic features</Text>
              <Text style={styles.planFeatureText}>• Limited AI (10/day)</Text>
            </View>
            {selectedTier === 'free' && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>Selected</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Monthly Plan */}
          <TouchableOpacity 
            style={[styles.planCard, selectedTier === 'monthly' && styles.planCardSelected]}
            onPress={() => setSelectedTier('monthly')}
            activeOpacity={0.8}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Pro</Text>
              <Text style={styles.planPrice}>$9.99</Text>
            </View>
            <Text style={styles.planDesc}>per month</Text>
            <View style={styles.planFeatures}>
              <Text style={styles.planFeatureText}>• Unlimited AI</Text>
              <Text style={styles.planFeatureText}>• All premium features</Text>
            </View>
            {selectedTier === 'monthly' && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>Selected</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Yearly Plan */}
          <TouchableOpacity 
            style={[styles.planCard, styles.planCardPopular, selectedTier === 'yearly' && styles.planCardSelected]}
            onPress={() => setSelectedTier('yearly')}
            activeOpacity={0.8}
          >
            <View style={[styles.popularRibbon, { backgroundColor: '#10B981' }]}>
              <Text style={styles.popularRibbonText}>BEST VALUE</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Pro Yearly</Text>
              <Text style={styles.planPrice}>$79.99</Text>
            </View>
            <Text style={styles.planDesc}>per year (save 33%)</Text>
            <View style={styles.planFeatures}>
              <Text style={styles.planFeatureText}>• Everything in Pro</Text>
              <Text style={styles.planFeatureText}>• Priority support</Text>
            </View>
            {selectedTier === 'yearly' && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>Selected</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Lifetime Plan */}
          <TouchableOpacity 
            style={[styles.planCard, styles.planCardLifetime, selectedTier === 'lifetime' && styles.planCardSelected]}
            onPress={() => setSelectedTier('lifetime')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#F59E0B', '#EF4444']} style={styles.lifetimeGradient}>
              <View style={styles.popularRibbon}>
                <Ionicons name="star" size={12} color="#FFF" />
                <Text style={styles.popularRibbonText}>LIFETIME</Text>
              </View>
            </LinearGradient>
            <View style={styles.planHeader}>
              <Text style={styles.planNameLifetime}>Lifetime</Text>
              <Text style={styles.planPriceLifetime}>$299.99</Text>
            </View>
            <Text style={styles.planDesc}>one-time payment</Text>
            <View style={styles.planFeatures}>
              <Text style={styles.planFeatureText}>• Premium forever</Text>
              <Text style={styles.planFeatureText}>• All future updates free</Text>
            </View>
            {selectedTier === 'lifetime' && (
              <View style={[styles.selectedBadge, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.selectedBadgeText}>Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Features Comparison */}
        <Animated.View style={[styles.featuresSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>
            {selectedTier === 'free' ? 'Your Current Plan' : 'What You Get'}
          </Text>
          
          <View style={styles.featuresList}>
            {PLAN_FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                </View>
                <View style={styles.featureStatus}>
                  {typeof feature.free === 'string' ? (
                    <Text style={styles.featureFree}>{feature.free}</Text>
                  ) : feature.free ? (
                    <View style={styles.checkRow}>
                      <Ionicons name="checkmark" size={14} color={colors.dark.success} />
                      <Text style={styles.featurePremiumText}>Free</Text>
                    </View>
                  ) : (
                    <Text style={styles.featureLocked}>—</Text>
                  )}
                  {selectedTier !== 'free' && (
                    <View style={styles.checkRow}>
                      <Ionicons name="checkmark" size={14} color={colors.dark.success} />
                      <Text style={styles.featurePremiumText}>{typeof feature.premium === 'string' ? feature.premium : 'Unlocked'}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Lifetime Special Features */}
        {selectedTier === 'lifetime' && (
          <Animated.View style={[styles.lifetimeSpecial, { opacity: fadeAnim }]}>
            <Text style={styles.lifetimeSpecialTitle}>🎁 Lifetime Exclusive</Text>
            {LIFETIME_FEATURES.map((feat, i) => (
              <Text key={i} style={styles.lifetimeSpecialText}>{feat}</Text>
            ))}
          </Animated.View>
        )}

        {/* Testimonials */}
        <Animated.View style={[styles.testimonialsSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>What Members Say</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialScroll}>
            {TESTIMONIALS.map((t, i) => (
              <View key={i} style={styles.testimonialCard}>
                <Text style={styles.testimonialText}>"{t.text}"</Text>
                <View style={styles.testimonialFooter}>
                  <Text style={styles.testimonialAuthor}>— {t.author}</Text>
                  <Text style={styles.testimonialAge}>{t.age}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Guarantee */}
        <Animated.View style={[styles.guaranteeSection, { opacity: fadeAnim }]}>
          <View style={styles.guaranteeCard}>
            <Ionicons name="shield-checkmark" size={32} color={colors.dark.success} />
            <Text style={styles.guaranteeTitle}>🛡️ 100% Money-Back Guarantee</Text>
            <Text style={styles.guaranteeText}>
              {selectedTier === 'lifetime' 
                ? 'Lifetime purchase is final. But if you\'re not satisfied within 30 days, get a full refund.'
                : 'Try risk-free for 7 days. If not satisfied, get every penny back. No questions asked.'
              }
            </Text>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaContainer, { paddingBottom: insets.bottom + 20, opacity: fadeAnim }]}>
          {selectedTier === 'free' ? (
            <TouchableOpacity 
              style={styles.continueFreeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.continueFreeText}>Continue with Free</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.ctaButton} onPress={subscribe} activeOpacity={0.9}>
                <LinearGradient 
                  colors={selectedTier === 'lifetime' ? ['#F59E0B', '#EF4444'] : ['#7C3AED', '#EC4899']}
                  style={styles.ctaGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.ctaButtonText}>
                    {selectedTier === 'lifetime' ? 'Get Lifetime Access →' : 
                     selectedTier === 'yearly' ? 'Start Yearly Trial →' : 'Start Free Trial →'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.ctaHint}>
                {selectedTier === 'lifetime' ? 'One-time payment • Lifetime access' : '7-day free trial • Cancel anytime'}
              </Text>
            </>
          )}
          
          <TouchableOpacity style={styles.restoreButton}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Lifetime Confirmation Modal */}
      <Modal visible={showLifetimeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.modalIcon}>
              <Ionicons name="diamond" size={40} color="#F59E0B" />
            </View>
            <Text style={styles.modalTitle}>Lifetime Access</Text>
            <Text style={styles.modalText}>
              You're about to get lifetime premium access for a one-time payment of $299.99. You'll never pay again!
            </Text>
            <View style={styles.modalFeatures}>
              <Text style={styles.modalFeature}>✓ Unlimited AI</Text>
              <Text style={styles.modalFeature}>✓ All premium features</Text>
              <Text style={styles.modalFeature}>✓ All future updates free</Text>
              <Text style={styles.modalFeature}>✓ Lifetime support</Text>
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={confirmLifetime}>
              <LinearGradient colors={['#F59E0B', '#EF4444']} style={styles.modalButtonGradient}>
                <Text style={styles.modalButtonText}>Confirm $299.99</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowLifetimeModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: typography.fontSizes.lg, fontWeight: '700', color: colors.dark.text },
  scrollContent: { paddingBottom: spacing.xxxl },
  
  hero: { marginHorizontal: spacing.lg, marginBottom: spacing.xl },
  heroGradient: { borderRadius: borderRadius.xxl, padding: spacing.xl, alignItems: 'center' },
  heroBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, marginBottom: spacing.lg, gap: spacing.xs },
  heroBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#FFF', textAlign: 'center', lineHeight: 40 },
  heroSubtitle: { fontSize: typography.fontSizes.md, color: 'rgba(255,255,255,0.8)', marginTop: spacing.sm, textAlign: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, gap: spacing.sm },
  ratingStars: { fontSize: 14 },
  ratingText: { fontSize: typography.fontSizes.sm, color: 'rgba(255,255,255,0.8)' },
  
  plansContainer: { paddingHorizontal: spacing.lg, gap: spacing.md },
  planCard: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 2, borderColor: 'transparent' },
  planCardSelected: { borderColor: colors.dark.primary, backgroundColor: colors.dark.primary + '10' },
  planCardPopular: { borderColor: '#10B981', backgroundColor: '#10B981' + '10' },
  planCardLifetime: { borderColor: '#F59E0B', backgroundColor: '#F59E0B' + '10', overflow: 'hidden' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { fontSize: typography.fontSizes.xl, fontWeight: '700', color: colors.dark.text },
  planPrice: { fontSize: typography.fontSizes['2xl'], fontWeight: '800', color: colors.dark.text },
  planDesc: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary, marginTop: spacing.xs },
  planFeatures: { marginTop: spacing.md },
  planFeatureText: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary },
  selectedBadge: { position: 'absolute', top: spacing.md, right: spacing.md, backgroundColor: colors.dark.primary, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  selectedBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
  popularRibbon: { position: 'absolute', top: -1, left: -1, right: -1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981', paddingVertical: spacing.xs, gap: 4 },
  popularRibbonText: { color: '#FFF', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  lifetimeGradient: { position: 'absolute', top: 0, left: 0, right: 0, paddingVertical: spacing.xs },
  planNameLifetime: { fontSize: typography.fontSizes.xl, fontWeight: '700', color: '#F59E0B' },
  planPriceLifetime: { fontSize: typography.fontSizes['2xl'], fontWeight: '800', color: '#F59E0B' },
  
  featuresSection: { marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  sectionTitle: { fontSize: typography.fontSizes.xl, fontWeight: '700', color: colors.dark.text, marginBottom: spacing.md },
  featuresList: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.xl, overflow: 'hidden' },
  featureRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark.border },
  featureIcon: { fontSize: 20, width: 36 },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: typography.fontSizes.md, color: colors.dark.text, fontWeight: '500' },
  featureStatus: { alignItems: 'flex-end', gap: 2 },
  featureFree: { fontSize: typography.fontSizes.xs, color: colors.dark.textSecondary },
  featureLocked: { fontSize: typography.fontSizes.xs, color: colors.dark.textTertiary },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  featurePremiumText: { fontSize: typography.fontSizes.xs, color: colors.dark.success, fontWeight: '600' },
  
  lifetimeSpecial: { marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: '#F59E0B' + '15', borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: '#F59E0B' + '30' },
  lifetimeSpecialTitle: { fontSize: typography.fontSizes.lg, fontWeight: '700', color: '#F59E0B', marginBottom: spacing.md },
  lifetimeSpecialText: { fontSize: typography.fontSizes.sm, color: colors.dark.text, marginBottom: spacing.xs },
  
  testimonialsSection: { marginTop: spacing.xl },
  testimonialScroll: { paddingLeft: spacing.lg },
  testimonialCard: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.xl, padding: spacing.lg, marginRight: spacing.md, width: width * 0.7 },
  testimonialText: { fontSize: typography.fontSizes.sm, color: colors.dark.text, fontStyle: 'italic', lineHeight: 22 },
  testimonialFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  testimonialAuthor: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary, fontWeight: '600' },
  testimonialAge: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary },
  
  guaranteeSection: { marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  guaranteeCard: { backgroundColor: colors.dark.success + '10', borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.dark.success + '30' },
  guaranteeTitle: { fontSize: typography.fontSizes.lg, fontWeight: '700', color: colors.dark.success, marginTop: spacing.md },
  guaranteeText: { fontSize: typography.fontSizes.sm, color: colors.dark.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
  
  ctaContainer: { marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  ctaButton: { marginBottom: spacing.sm },
  ctaGradient: { padding: spacing.lg, borderRadius: borderRadius.xl, alignItems: 'center' },
  ctaButtonText: { fontSize: typography.fontSizes.lg, fontWeight: '700', color: '#FFF' },
  ctaHint: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary, textAlign: 'center' },
  continueFreeButton: { backgroundColor: colors.dark.surface, padding: spacing.lg, borderRadius: borderRadius.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.dark.border },
  continueFreeText: { fontSize: typography.fontSizes.lg, fontWeight: '600', color: colors.dark.textSecondary },
  restoreButton: { marginTop: spacing.md, alignItems: 'center' },
  restoreText: { fontSize: typography.fontSizes.sm, color: colors.dark.textTertiary },
  
  premiumActive: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  crownContainer: { marginBottom: spacing.lg },
  crownBadge: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  premiumActiveTitle: { fontSize: typography.fontSizes['3xl'], fontWeight: '800', color: colors.dark.text },
  premiumActiveText: { fontSize: typography.fontSizes.md, color: colors.dark.textSecondary, marginTop: spacing.sm },
  premiumFeaturesList: { marginTop: spacing.xl, width: '100%' },
  premiumFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  premiumFeatureText: { fontSize: typography.fontSizes.md, color: colors.dark.text },
  lifetimeBadge: { marginTop: spacing.xl, backgroundColor: '#F59E0B' + '20', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  lifetimeBadgeText: { color: '#F59E0B', fontWeight: '600' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  modalContent: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.xxl, padding: spacing.xl, width: '100%', alignItems: 'center' },
  modalIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F59E0B' + '20', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  modalTitle: { fontSize: typography.fontSizes['2xl'], fontWeight: '800', color: colors.dark.text },
  modalText: { fontSize: typography.fontSizes.md, color: colors.dark.textSecondary, textAlign: 'center', marginTop: spacing.md, lineHeight: 24 },
  modalFeatures: { marginTop: spacing.lg, alignSelf: 'flex-start' },
  modalFeature: { fontSize: typography.fontSizes.md, color: colors.dark.text, marginBottom: spacing.xs },
  modalButton: { marginTop: spacing.xl, width: '100%' },
  modalButtonGradient: { padding: spacing.lg, borderRadius: borderRadius.xl, alignItems: 'center' },
  modalButtonText: { fontSize: typography.fontSizes.lg, fontWeight: '700', color: '#FFF' },
  modalCancel: { marginTop: spacing.md },
  modalCancelText: { fontSize: typography.fontSizes.md, color: colors.dark.textSecondary },
});

export default PremiumScreen;
