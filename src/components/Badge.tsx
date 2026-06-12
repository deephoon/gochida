import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Icon, IconName } from './Icon';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  /** Icon 컴포넌트에 정의된 아이콘 이름. 텍스트가 아니라 SVG 아이콘으로 렌더된다. */
  icon?: IconName;
  dot?: boolean;
}

export function Badge({ label, variant = 'neutral', icon, dot }: BadgeProps) {
  const v = palette[variant];

  return (
    <View style={[styles.container, { backgroundColor: v.bg }]}>
      {dot && <View style={[styles.dot, { backgroundColor: v.text }]} />}
      {icon ? <Icon name={icon} size={13} color={v.text} /> : null}
      <Text style={[styles.text, { color: v.text }]}>{label}</Text>
    </View>
  );
}

const palette = {
  primary: { bg: theme.colors.primaryLight, text: theme.colors.primary },
  success: { bg: theme.colors.successLight, text: theme.colors.success },
  warning: { bg: theme.colors.warningLight, text: '#C77F12' },
  danger: { bg: theme.colors.dangerLight, text: theme.colors.danger },
  neutral: { bg: theme.colors.surfaceSoft, text: theme.colors.textSecondary },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.pill,
    alignSelf: 'flex-start',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  icon: { fontSize: 13 },
  text: { fontSize: 12, fontWeight: '700', letterSpacing: -0.1 },
});
