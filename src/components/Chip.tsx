import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export const Chip = ({ label, selected, onPress }: ChipProps) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onPress) onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.idle,
        // press 시 살짝 축소되어 선택 반응을 즉각적으로 느끼게 한다.
        pressed && { transform: [{ scale: theme.motion.chipPressScale }] },
      ]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textIdle]}>{label}</Text>
    </Pressable>
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
