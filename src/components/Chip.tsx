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
    paddingHorizontal: 18,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  idle: {
    backgroundColor: theme.colors.surfaceSoft,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  selected: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    ...theme.typography.bodyStrong,
  },
  textIdle: { color: theme.colors.textSecondary },
  textSelected: { color: theme.colors.white },
});
