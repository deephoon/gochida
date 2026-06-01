import React from 'react';
import {
  View,
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../theme';

interface CardProps extends ViewProps {
  onPress?: TouchableOpacityProps['onPress'];
  variant?: 'outlined' | 'muted';
}

export const Card = ({ children, style, onPress, variant = 'outlined', ...props }: CardProps) => {
  const Component = onPress ? TouchableOpacity : View;
  const variantStyle = variant === 'muted' ? styles.muted : styles.outlined;

  return (
    <Component
      style={[styles.base, variantStyle, style]}
      onPress={onPress}
      {...(onPress ? { activeOpacity: 0.85 } : {})}
      {...(props as any)}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  outlined: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  muted: {
    backgroundColor: theme.colors.surfaceMuted,
  },
});
