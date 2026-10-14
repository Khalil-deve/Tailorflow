import React from 'react';
import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, radius, shadow } from '@/theme';

type Props = {
  label: string;
  onPress?: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
};

export function AppButton({
  label,
  onPress,
  icon: Icon,
  variant = 'primary',
  disabled = false,
}: Props) {
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isPrimary = !isSecondary && !isGhost;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        disabled && styles.disabled,
      ]}
    >
      {Icon && (
        <Icon
          size={20}
          color={isPrimary ? '#FFFFFF' : isSecondary ? colors.primaryDark : colors.text}
          strokeWidth={2.4}
        />
      )}
      <Text
        style={[
          styles.label,
          isPrimary && styles.primaryText,
          isSecondary && styles.secondaryText,
          isGhost && styles.ghostText,
          disabled && styles.disabledText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
    ...shadow,
  },
  primary: {
    backgroundColor: colors.primaryStrong,
  },
  secondary: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#CBD4C0',
  },
  ghost: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E2D7',
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.1,
  },
  primaryText: {
    color: '#FFFFFF', // Solid bold white text
  },
  secondaryText: {
    color: colors.primaryDark,
  },
  ghostText: {
    color: '#1C1C1C',
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#FFFFFF',
  },
});
