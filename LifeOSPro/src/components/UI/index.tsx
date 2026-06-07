import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  gradient?: string[];
}

export const Card: React.FC<CardProps> = ({ children, style, onPress, gradient }) => {
  const content = gradient ? (
    <LinearGradient colors={gradient as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, style]}>
      {children}
    </LinearGradient>
  ) : (
    <View style={[styles.card, style]}>{children}</View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.8}>{content}</TouchableOpacity>;
  }
  return content;
};

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, onPress }) => {
  const content = (
    <View style={[styles.glassCard, style]}>
      {children}
    </View>
  );
  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.8}>{content}</TouchableOpacity>;
  }
  return content;
};

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  gradient?: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = colors.dark.primary, height = 8, gradient }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View style={[styles.progressContainer, { height }]}>
      {gradient ? (
        <LinearGradient
          colors={gradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${clampedProgress}%`, height }]}
        />
      ) : (
        <View style={[styles.progressFill, { backgroundColor: color, width: `${clampedProgress}%`, height }]} />
      )}
    </View>
  );
};

interface BadgeProps {
  text: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, color = colors.dark.primary, size = 'md', icon }) => {
  const sizes = { sm: { paddingH: 6, paddingV: 2, fontSize: 10 }, md: { paddingH: 10, paddingV: 4, fontSize: 12 }, lg: { paddingH: 14, paddingV: 6, fontSize: 14 } };
  const s = sizes[size];

  return (
    <View style={[styles.badge, { backgroundColor: color + '20', paddingHorizontal: s.paddingH, paddingVertical: s.paddingV }]}>
      {icon && <Ionicons name={icon as any} size={s.fontSize - 2} color={color} style={{ marginRight: 4 }} />}
      <Text style={[styles.badgeText, { color, fontSize: s.fontSize }]}>{text}</Text>
    </View>
  );
};

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title, onPress, variant = 'primary', size = 'md', icon, iconPosition = 'left', style, disabled, loading
}) => {
  const sizes = { sm: { paddingH: 12, paddingV: 8, fontSize: 12 }, md: { paddingH: 20, paddingV: 12, fontSize: 14 }, lg: { paddingH: 28, paddingV: 16, fontSize: 16 } };
  const s = sizes[size];

  const buttonStyles = [
    styles.button,
    { paddingHorizontal: s.paddingH, paddingVertical: s.paddingV },
    variant === 'primary' && styles.buttonPrimary,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'outline' && styles.buttonOutline,
    variant === 'ghost' && styles.buttonGhost,
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    { fontSize: s.fontSize },
    variant === 'primary' && styles.buttonTextPrimary,
    variant === 'secondary' && styles.buttonTextSecondary,
    variant === 'outline' && styles.buttonTextOutline,
    variant === 'ghost' && styles.buttonTextGhost,
    disabled && styles.buttonTextDisabled,
  ];

  const content = (
    <>
      {loading ? (
        <Ionicons name="sync" size={s.fontSize} color="#FFFFFF" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <Ionicons name={icon as any} size={s.fontSize + 2} color={variant === 'outline' ? colors.dark.primary : '#FFFFFF'} style={{ marginRight: 6 }} />}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && <Ionicons name={icon as any} size={s.fontSize + 2} color={variant === 'outline' ? colors.dark.primary : '#FFFFFF'} style={{ marginLeft: 6 }} />}
        </>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
        <LinearGradient colors={disabled ? ['#666', '#444'] : colors.dark.gradient.primary} style={buttonStyles}>
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8} style={buttonStyles}>
      {content}
    </TouchableOpacity>
  );
};

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, onPress, size = 'md', variant = 'ghost', style }) => {
  const sizes = { sm: 32, md: 44, lg: 56 };
  const iconSizes = { sm: 16, md: 20, lg: 28 };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.iconButton,
        { width: sizes[size], height: sizes[size], borderRadius: sizes[size] / 2 },
        variant === 'primary' && { backgroundColor: colors.dark.primary },
        variant === 'secondary' && { backgroundColor: colors.dark.surface },
        variant === 'ghost' && {},
        style,
      ]}
    >
      <Ionicons name={icon as any} size={iconSizes[size]} color={variant === 'primary' ? '#FFFFFF' : colors.dark.text} />
    </TouchableOpacity>
  );
};

interface AvatarProps {
  name?: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ name, image, size = 'md', style }) => {
  const sizes = { sm: 32, md: 48, lg: 64, xl: 96 };
  const fontSizes = { sm: 12, md: 18, lg: 24, xl: 36 };

  return (
    <View style={[styles.avatar, { width: sizes[size], height: sizes[size], borderRadius: sizes[size] / 2 }, style]}>
      {image ? (
        <View style={[styles.avatarImage, { width: sizes[size], height: sizes[size], borderRadius: sizes[size] / 2 }]} />
      ) : (
        <Text style={[styles.avatarText, { fontSize: fontSizes[size] }]}>{name?.charAt(0).toUpperCase() || '?'}</Text>
      )}
    </View>
  );
};

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  rightContent?: ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({ title, subtitle, leftIcon, rightIcon, rightContent, onPress, showArrow = true }) => {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      {leftIcon && (
        <View style={styles.listItemLeft}>
          <View style={styles.listItemIcon}>
            <Ionicons name={leftIcon as any} size={20} color={colors.dark.primary} />
          </View>
        </View>
      )}
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
      </View>
      {rightContent || (
        <View style={styles.listItemRight}>
          {rightIcon && <Ionicons name={rightIcon as any} size={20} color={colors.dark.textTertiary} />}
          {showArrow && onPress && <Ionicons name="chevron-forward" size={18} color={colors.dark.textTertiary} style={{ marginLeft: 4 }} />}
        </View>
      )}
    </TouchableOpacity>
  );
};

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionText, onAction }) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionText && onAction && (
        <TouchableOpacity onPress={onAction} style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{actionText}</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.dark.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  trend?: { value: number; isPositive: boolean };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = colors.dark.primary, trend }) => {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statCardIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
      <Text style={styles.statCardTitle}>{title}</Text>
      {trend && (
        <View style={styles.statCardTrend}>
          <Ionicons name={trend.isPositive ? 'trending-up' : 'trending-down'} size={14} color={trend.isPositive ? colors.dark.success : colors.dark.error} />
          <Text style={[styles.statCardTrendText, { color: trend.isPositive ? colors.dark.success : colors.dark.error }]}>
            {trend.value}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  glassCard: {
    backgroundColor: colors.dark.surface + '80',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark.border + '40',
    ...shadows.sm,
  },
  progressContainer: {
    backgroundColor: colors.dark.surfaceLight,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: borderRadius.full,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  buttonPrimary: {},
  buttonSecondary: {
    backgroundColor: colors.dark.surface,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.dark.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: '600',
  },
  buttonTextPrimary: { color: '#FFFFFF' },
  buttonTextSecondary: { color: colors.dark.text },
  buttonTextOutline: { color: colors.dark.primary },
  buttonTextGhost: { color: colors.dark.primary },
  buttonTextDisabled: { color: colors.dark.textTertiary },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  avatarImage: {
    backgroundColor: colors.dark.surfaceLight,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  listItemLeft: {
    marginRight: spacing.md,
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    ...{ fontSize: 16, fontWeight: '500', color: colors.dark.text },
  },
  listItemSubtitle: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginTop: 2,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.text,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionActionText: {
    fontSize: 14,
    color: colors.dark.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  statCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  statCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark.text,
  },
  statCardTitle: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginTop: 4,
  },
  statCardTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statCardTrendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
});
