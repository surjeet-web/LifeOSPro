import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity, Animated } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import TasksScreen from './src/screens/TasksScreen';
import HabitsScreen from './src/screens/HabitsScreen';
import FinanceScreen from './src/screens/FinanceScreen';
import FocusScreen from './src/screens/FocusScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PremiumScreen from './src/screens/PremiumScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SocialScreen from './src/screens/SocialScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotesScreen from './src/screens/NotesScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import HelpScreen from './src/screens/HelpScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ContactScreen from './src/screens/ContactScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import TermsScreen from './src/screens/TermsScreen';
import ThemeScreen from './src/screens/ThemeScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import DatabaseScreen from './src/screens/DatabaseScreen';
import EmptyScreen from './src/screens/EmptyScreen';

import AIAssistantScreen from './src/expanded/screens/ai/AIAssistantScreen';
import HealthScreen from './src/expanded/screens/health/HealthScreen';
import ProjectsScreen from './src/expanded/screens/projects/ProjectsScreen';
import LearningScreen from './src/expanded/screens/learning/LearningScreen';

import { colors, spacing, borderRadius } from './src/utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    card: colors.dark.surface,
    text: colors.dark.text,
    border: colors.dark.border,
    notification: colors.dark.accent,
  },
};

const TabBarIcon = ({ name, focused, color, size }: { name: string; focused: boolean; color: string; size: number }) => {
  return (
    <View style={styles.iconContainer}>
      {focused && (
        <LinearGradient
          colors={colors.dark.gradient.primary as any}
          style={styles.iconGlow}
        />
      )}
      <Ionicons name={focused ? name : `${name}-outline`} size={size} color={color} />
    </View>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarShowLabel: true,
      tabBarLabelStyle: styles.tabLabel,
      tabBarActiveTintColor: colors.dark.primary,
      tabBarInactiveTintColor: colors.dark.textTertiary,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused, color }) => <TabBarIcon name="home" focused={focused} color={color} size={22} />,
      }}
    />
    <Tab.Screen
      name="Tasks"
      component={TasksScreen}
      options={{
        tabBarIcon: ({ focused, color }) => <TabBarIcon name="checkbox" focused={focused} color={color} size={22} />,
      }}
    />
    <Tab.Screen
      name="Habits"
      component={HabitsScreen}
      options={{
        tabBarIcon: ({ focused, color }) => <TabBarIcon name="leaf" focused={focused} color={color} size={22} />,
      }}
    />
    <Tab.Screen
      name="Health"
      component={HealthScreen}
      options={{
        tabBarIcon: ({ focused, color }) => <TabBarIcon name="fitness" focused={focused} color={color} size={22} />,
      }}
    />
    <Tab.Screen
      name="Finance"
      component={FinanceScreen}
      options={{
        tabBarIcon: ({ focused, color }) => <TabBarIcon name="wallet" focused={focused} color={color} size={22} />,
      }}
    />
    <Tab.Screen
      name="Focus"
      component={FocusScreen}
      options={{
        tabBarIcon: ({ focused, color }) => <TabBarIcon name="radio" focused={focused} color={color} size={22} />,
      }}
    />
    <Tab.Screen
      name="Projects"
      component={ProjectsScreen}
      options={{
        tabBarIcon: ({ focused, color }) => <TabBarIcon name="folder" focused={focused} color={color} size={22} />,
      }}
    />
    <Tab.Screen
      name="Learning"
      component={LearningScreen}
      options={{
        tabBarIcon: ({ focused, color }) => <TabBarIcon name="book" focused={focused} color={color} size={22} />,
      }}
    />
    <Tab.Screen
      name="Social"
      component={SocialScreen}
      options={{
        tabBarIcon: ({ focused, color }) => <TabBarIcon name="people" focused={focused} color={color} size={22} />,
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({ focused, color }) => <TabBarIcon name="settings" focused={focused} color={color} size={22} />,
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="AIChat" component={AIChatScreen} />
    <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Premium" component={PremiumScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="Contact" component={ContactScreen} />
    <Stack.Screen name="Privacy" component={PrivacyScreen} />
    <Stack.Screen name="Terms" component={TermsScreen} />
    <Stack.Screen name="Theme" component={ThemeScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} />
    <Stack.Screen name="Database" component={DatabaseScreen} />
    <Stack.Screen name="Notes" component={NotesScreen} />
    <Stack.Screen name="Goals" component={GoalsScreen} />
    <Stack.Screen name="Analytics" component={AnalyticsScreen} />
    <Stack.Screen name="Calendar" component={CalendarScreen} />
    <Stack.Screen name="AddTask" component={() => <EmptyScreen title="Add Task" navigation={{ goBack: () => {} }} />} />
    <Stack.Screen name="AddHabit" component={() => <EmptyScreen title="Add Habit" navigation={{ goBack: () => {} }} />} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
      <AppProvider>
        <NavigationContainer theme={DarkTheme}>
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.dark.surface,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    elevation: 0,
    shadowOpacity: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 28,
  },
  iconGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.15,
  },
});

export default App;
