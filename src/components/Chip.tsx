import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export const Chip = ({ label, selected, onPress }: ChipProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.base, selected ? styles.selected : styles.idle]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textIdle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.round,
  },
  idle: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  selected: {
    backgroundColor: theme.colors.textPrimary,
  },
  text: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  textIdle: { color: theme.colors.textSecondary },
  textSelected: { color: theme.colors.white },
});
