import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const painPoints = [
    { id: 'procrastination', emoji: '😩', title: 'Procrastination', desc: 'I put things off and feel guilty' },
    { id: 'unfocused', emoji: '🦋', title: 'Unfocused', desc: 'I get distracted easily' },
    { id: 'nohabits', emoji: '😔', title: 'No Habits', desc: 'I can never stick to routines' },
    { id: 'finances', emoji: '💸', title: 'Finances', desc: 'I dont know where money goes' },
    { id: 'overwhelmed', emoji: '😰', title: 'Overwhelmed', desc: 'Too much to do, no direction' },
  ];

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      scrollRef.current?.scrollTo({ x: (step + 1) * width, animated: true });
    } else {
      navigation.replace('Main');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.gradientCircle}>
              <Text style={styles.emojiLogo}>🚀</Text>
            </LinearGradient>
            <Text style={styles.title}>Transform Your Life</Text>
            <Text style={styles.subtitle}>The app that ACTUALLY works</Text>
            
            <View style={styles.trustBadges}>
              <Text style={styles.trustText}>🏆 #1 Productivity App</Text>
              <Text style={styles.trustText}>⭐ 4.9 Star Rating</Text>
              <Text style={styles.trustText}>👥 2M+ Users</Text>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={nextStep}>
              <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.buttonGradient}>
                <Text style={styles.startButtonText}>Start Free →</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.guarantee}>🔒 7-Day Free Trial • Cancel Anytime</Text>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your biggest struggle? 🤔</Text>
            <Text style={styles.stepSubtitle}>This helps us personalize your experience</Text>
            
            <View style={styles.painPointsGrid}>
              {painPoints.map((point) => (
                <TouchableOpacity
                  key={point.id}
                  style={[styles.painPointCard, painPoint === point.id && styles.painPointSelected]}
                  onPress={() => setPainPoint(point.id)}
                >
                  <Text style={styles.painPointEmoji}>{point.emoji}</Text>
                  <Text style={styles.painPointTitle}>{point.title}</Text>
                  <Text style={styles.painPointDesc}>{point.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.startButton} onPress={nextStep} disabled={!painPoint}>
              <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.buttonGradient}>
                <Text style={styles.startButtonText}>Continue →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>See What's Possible ✨</Text>
            
            <View style={styles.resultCard}>
              <Text style={styles.resultEmoji}>🎯</Text>
              <Text style={styles.resultTitle}>Before: "I waste 4 hours/day"</Text>
              <Text style={styles.resultArrow}>↓</Text>
              <Text style={styles.resultTitleGreen}>After: "I get MORE done in 2 hours"</Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultEmoji}>💰</Text>
              <Text style={styles.resultTitle}>Before: "$0 saved in 2024"</Text>
              <Text style={styles.resultArrow}>↓</Text>
              <Text style={styles.resultTitleGreen}>After: "$10,000 in savings"</Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultEmoji}>🔥</Text>
              <Text style={styles.resultTitle}>Before: "0 habits stuck"</Text>
              <Text style={styles.resultArrow}>↓</Text>
              <Text style={styles.resultTitleGreen}>After: "30-day streaks become normal"</Text>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={nextStep}>
              <LinearGradient colors={['#10B981', '#34D399']} style={styles.buttonGradient}>
                <Text style={styles.startButtonText}>I Want This! →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Join 2 Million Others 🌟</Text>
            
            <ScrollView style={styles.testimonialScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.testimonial}>
                <Text style={styles.testimonialText}>"I used to procrastinate ALL day. After 30 days with LifeOS, I completed my first marathon training AND launched my side project. This app is LEGIT."</Text>
                <Text style={styles.testimonialAuthor}>— Sarah M., 28</Text>
                <View style={styles.stars}>⭐⭐⭐⭐⭐</View>
              </View>

              <View style={styles.testimonial}>
                <Text style={styles.testimonialText}>"The AI coach feels like having a therapist AND productivity mentor in my pocket. Worth every penny."</Text>
                <Text style={styles.testimonialAuthor}>— James K., 35</Text>
                <View style={styles.stars}>⭐⭐⭐⭐⭐</View>
              </View>

              <View style={styles.testimonial}>
                <Text style={styles.testimonialText}>"I saved $8,000 in 3 months just by tracking expenses. The AI insights are actually helpful!"</Text>
                <Text style={styles.testimonialAuthor}>— Mike T., 42</Text>
                <View style={styles.stars}>⭐⭐⭐⭐⭐</View>
              </View>
            </ScrollView>

            <View style={styles.offerBox}>
              <Text style={styles.offerTitle}>🎁 Limited Offer</Text>
              <Text style={styles.offerText}>Start FREE for 7 days</Text>
              <Text style={styles.offerPrice}>Then just $9.99/month</Text>
              <Text style={styles.offerCancel}>Cancel anytime</Text>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={nextStep}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.buttonGradient}>
                <Text style={styles.startButtonText}>Start My Free Trial →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Progress Dots */}
      <View style={styles.progressDots}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, step >= i && styles.dotActive]} />
        ))}
      </View>

      <ScrollView ref={scrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} scrollEnabled={false}>
        {renderStep()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  progressDots: { flexDirection: 'row', justifyContent: 'center', paddingTop: 60, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' },
  dotActive: { backgroundColor: '#6366F1', width: 24 },
  stepContainer: { width, padding: 24, alignItems: 'center', justifyContent: 'center', flex: 1 },
  gradientCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  emojiLogo: { fontSize: 50 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFF', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#9CA3AF', textAlign: 'center', marginBottom: 32 },
  trustBadges: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  trustText: { fontSize: 12, color: '#6B7280' },
  startButton: { width: '100%', marginBottom: 16 },
  buttonGradient: { padding: 18, borderRadius: 16, alignItems: 'center' },
  startButtonText: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  guarantee: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  stepTitle: { fontSize: 28, fontWeight: '700', color: '#FFF', textAlign: 'center', marginBottom: 8 },
  stepSubtitle: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginBottom: 24 },
  painPointsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 32 },
  painPointCard: { width: '45%', backgroundColor: '#1A1A25', borderRadius: 16, padding: 16, borderWidth: 2, borderColor: 'transparent' },
  painPointSelected: { borderColor: '#6366F1', backgroundColor: '#6366F1' + '20' },
  painPointEmoji: { fontSize: 32, marginBottom: 8 },
  painPointTitle: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 4 },
  painPointDesc: { fontSize: 12, color: '#9CA3AF' },
  resultCard: { backgroundColor: '#1A1A25', borderRadius: 16, padding: 20, width: '100%', marginBottom: 12, alignItems: 'center' },
  resultEmoji: { fontSize: 28, marginBottom: 8 },
  resultTitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
  resultArrow: { fontSize: 20, color: '#6366F1', marginVertical: 4 },
  resultTitleGreen: { fontSize: 16, fontWeight: '600', color: '#10B981', textAlign: 'center' },
  testimonialScroll: { maxHeight: 300, marginBottom: 20 },
  testimonial: { backgroundColor: '#1A1A25', borderRadius: 16, padding: 20, marginBottom: 12 },
  testimonialText: { fontSize: 14, color: '#E5E7EB', fontStyle: 'italic', lineHeight: 22 },
  testimonialAuthor: { fontSize: 12, color: '#9CA3AF', marginTop: 12 },
  stars: { fontSize: 14, marginTop: 8 },
  offerBox: { backgroundColor: '#F59E0B' + '20', borderRadius: 16, padding: 20, width: '100%', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#F59E0B' },
  offerTitle: { fontSize: 18, fontWeight: '700', color: '#F59E0B', marginBottom: 4 },
  offerText: { fontSize: 14, color: '#FFF' },
  offerPrice: { fontSize: 24, fontWeight: '800', color: '#FFF', marginVertical: 8 },
  offerCancel: { fontSize: 12, color: '#9CA3AF' },
});

export default OnboardingScreen;
