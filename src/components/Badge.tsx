import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  icon?: string;
}

export function Badge({ label, variant = 'neutral', icon }: BadgeProps) {
  const v = palette[variant];

  return (
    <View style={[styles.container, { backgroundColor: v.bg }]}>
      {icon ? <Text style={[styles.icon, { color: v.text }]}>{icon}</Text> : null}
      <Text style={[styles.text, { color: v.text }]}>{label}</Text>
    </View>
  );
}

const palette = {
  primary: { bg: theme.colors.primaryLight, text: theme.colors.primary },
  success: { bg: theme.colors.successLight, text: theme.colors.success },
  warning: { bg: theme.colors.warningLight, text: theme.colors.warning },
  danger: { bg: theme.colors.dangerLight, text: theme.colors.danger },
  neutral: { bg: theme.colors.surfaceMuted, text: theme.colors.textSecondary },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.s,
    alignSelf: 'flex-start',
  },
  icon: { fontSize: 11, marginRight: 4 },
  text: { ...theme.typography.small, fontWeight: '600' },
});
