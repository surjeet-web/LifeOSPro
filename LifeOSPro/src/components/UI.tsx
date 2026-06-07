import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, typography } from '../utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: string[];
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, gradient, onPress }) => {
  const content = gradient ? (
    <LinearGradient colors={gradient as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[cardStyles.card, style]}>
      {children}
    </LinearGradient>
  ) : (
    <View style={[cardStyles.card, style]}>{children}</View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.8}>{content}</TouchableOpacity>;
  }

  return content;
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
});

export const GlassCard: React.FC<CardProps> = ({ children, style, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8}
      style={[glassCardStyles.glassCard, style]}
    >
      {children}
    </TouchableOpacity>
  );
};

const glassCardStyles = StyleSheet.create({
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  gradient?: string[];
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  gradient,
  icon,
  disabled = false,
  style,
}) => {
  const content = (
    <>
      {icon}
      <Text style={buttonTextStyles[`buttonText_${variant}` as keyof typeof buttonTextStyles]}>
        {title}
      </Text>
    </>
  );

  if (gradient || variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}>
        <LinearGradient
          colors={gradient || colors.dark.gradient.primary as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[buttonStyles.button, buttonStyles[`button_${variant}` as keyof typeof buttonStyles], buttonStyles[`button_${size}` as keyof typeof buttonStyles], disabled && buttonStyles.buttonDisabled, style]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8} style={[buttonStyles.button, buttonStyles[`button_${variant}` as keyof typeof buttonStyles], buttonStyles[`button_${size}` as keyof typeof buttonStyles], disabled && buttonStyles.buttonDisabled, style]}>
      {content}
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  button_primary: {
    backgroundColor: colors.dark.primary,
  },
  button_secondary: {
    backgroundColor: colors.dark.surfaceLight,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  button_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  button_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

const buttonTextStyles = StyleSheet.create({
  buttonText_primary: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonText_secondary: {
    color: colors.dark.text,
    fontWeight: '600',
  },
  buttonText_outline: {
    color: colors.dark.text,
    fontWeight: '600',
  },
  buttonText_ghost: {
    color: colors.dark.primary,
    fontWeight: '600',
  },
});

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.dark.primary,
  height = 8,
  style,
}) => {
  return (
    <View style={[progressStyles.progressContainer, { height }, style]}>
      <View style={[progressStyles.progressFill, { width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: color }]} />
    </View>
  );
};

const progressStyles = StyleSheet.create({
  progressContainer: {
    backgroundColor: colors.dark.surfaceLight,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});

interface BadgeProps {
  text: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ text, color = colors.dark.primary, size = 'sm' }) => {
  return (
    <View style={[badgeStyles.badge, { backgroundColor: color + '20' }, size === 'md' && badgeStyles.badgeMd]}>
      <Text style={[badgeStyles.badgeText, { color }, size === 'md' && badgeStyles.badgeTextMd]}>{text}</Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextMd: {
    fontSize: 14,
  },
});

interface AvatarProps {
  name: string;
  size?: number;
  image?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 48 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  return (
    <View style={[avatarStyles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[avatarStyles.avatarText, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
};

const avatarStyles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
