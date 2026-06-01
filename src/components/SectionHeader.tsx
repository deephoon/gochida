import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  size?: 'md' | 'sm';
}

export const SectionHeader = ({ title, subtitle, size = 'md' }: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={size === 'sm' ? styles.titleSm : styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  titleSm: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
