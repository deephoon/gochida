import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

interface ButtonProps extends Omit<PressableProps, 'style' | 'children' | 'disabled'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'md' | 'sm';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
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
  const isInactive = disabled || isLoading;

  const handlePress = (e: any) => {
    if (isInactive) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (props.onPress) {
      props.onPress(e);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isInactive}
      style={({ pressed }) => [
        styles.container,
        sizeStyle,
        variantStyle,
        isInactive && styles.disabled,
        // press 시 살짝 줄어들며 즉각적인 반응을 준다.
        pressed && !isInactive && {
          transform: [{ scale: theme.motion.pressScale }],
          opacity: theme.motion.activeOpacity,
        },
        style,
      ]}
      {...props}
      onPress={handlePress}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? theme.colors.white : theme.colors.primary} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      )}
    </Pressable>
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
  disabled: { opacity: theme.motion.disabledOpacity },
  text: { ...theme.typography.h3, letterSpacing: 0 },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: theme.colors.primary },
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
