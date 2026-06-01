import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface StepIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export const StepIndicator = ({ current, total, label }: StepIndicatorProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(current / total) * 100}%` }]} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{label ?? `단계 ${current}`}</Text>
        <Text style={styles.count}>
          {current} / {total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: theme.spacing.l },
  track: {
    height: 3,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borderRadius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.colors.textPrimary,
    borderRadius: theme.borderRadius.pill,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.s,
  },
  label: { ...theme.typography.small, color: theme.colors.textSecondary },
  count: { ...theme.typography.small, color: theme.colors.textTertiary },
});
