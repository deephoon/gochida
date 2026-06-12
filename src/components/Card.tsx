import React from 'react';
import { View, StyleSheet, ViewProps, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { PressableScale } from './ui/PressableScale';

interface CardProps extends ViewProps {
  onPress?: TouchableOpacityProps['onPress'];
  radius?: number;
  pad?: number;
  border?: boolean;
}

export const Card = ({ children, style, onPress, radius = theme.borderRadius.xl, pad = theme.spacing.xl, border = false, ...props }: CardProps) => {
  const Component = onPress ? PressableScale : View;

  const baseStyle: StyleProp<ViewStyle> = [
    styles.base,
    { borderRadius: radius, padding: pad },
    border ? styles.bordered : null,
    style,
  ];

  return (
    <Component
      style={baseStyle}
      onPress={onPress}
      {...(props as any)}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.soft,
  },
  bordered: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowOpacity: 0, // When bordered, usually no shadow in this design
  },
});
