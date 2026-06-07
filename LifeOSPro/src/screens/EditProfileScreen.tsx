import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card, ProgressBar, Badge } from '../components/UI';

const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.user.name);

  const saveName = () => {
    if (name.trim()) {
      dispatch({ type: 'SET_USER', payload: { name: name.trim() } });
      Alert.alert('Saved!', 'Your profile has been updated.');
    }
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={saveName}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.avatarSection}>
        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
        <TouchableOpacity style={styles.changePhoto}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.dark.textTertiary}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={state.user.email}
          placeholder="your@email.com"
          placeholderTextColor={colors.dark.textTertiary}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Member Since</Text>
        <Text style={styles.info}>{new Date(state.user.joinedAt).toLocaleDateString()}</Text>
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
  saveButton: { fontSize: 16, color: colors.dark.primary, fontWeight: '600' },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.xl },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#FFF' },
  changePhoto: {},
  changePhotoText: { color: colors.dark.primary, fontWeight: '600' },
  form: { paddingHorizontal: spacing.lg },
  label: { fontSize: 14, color: colors.dark.textSecondary, marginBottom: spacing.sm, marginTop: spacing.lg },
  input: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.lg, color: colors.dark.text, fontSize: 16 },
  info: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.lg, color: colors.dark.textSecondary, fontSize: 16 },
});

export default EditProfileScreen;
