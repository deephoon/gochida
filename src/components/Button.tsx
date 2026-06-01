import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { theme } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'md' | 'sm';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  style,
  disabled,
  ...props
}: ButtonProps) => {
  const variantStyle = variantStyles[variant];
  const textStyle = textStyles[variant];
  const sizeStyle = size === 'sm' ? styles.sm : styles.md;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.container, sizeStyle, variantStyle, (disabled || isLoading) && styles.disabled, style]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? theme.colors.white : theme.colors.primary} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  md: { height: 56 }, 
  sm: { height: 44, paddingHorizontal: theme.spacing.l },
  content: { flexDirection: 'row', alignItems: 'center' },
  leftIcon: { marginRight: theme.spacing.s },
  disabled: { opacity: 0.45 },
  text: { ...theme.typography.h3, letterSpacing: 0 },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: theme.colors.primary }, // Reverted to Blue
  secondary: { backgroundColor: theme.colors.surfaceSoft },
  outline: {
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
  },
  ghost: { backgroundColor: 'transparent' },
});

const textStyles = StyleSheet.create({
  primary: { color: theme.colors.white },
  secondary: { color: theme.colors.textPrimary },
  outline: { color: theme.colors.textPrimary },
  ghost: { color: theme.colors.textPrimary },
});
