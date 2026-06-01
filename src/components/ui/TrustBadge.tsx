import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import type { WarrantyType } from '../../types';

interface TrustBadgeProps {
  type: WarrantyType;
  size?: 'sm' | 'md' | 'lg';
}

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface Variant {
  label: string;
  bg: string;
  fg: string;
  icon: IconName;
}

// 보증서 타입별 시각 강조. '없음'도 숨기지 않고 명확히 노출한다.
function resolveVariant(type: WarrantyType): Variant {
  switch (type) {
    case '안심 보증서':
      return {
        label: '안심 보증서',
        bg: theme.colors.successLight,
        fg: theme.colors.success,
        icon: 'check-decagram',
      };
    case '작업 확인서':
      return {
        label: '작업 확인서',
        bg: theme.colors.primaryLight,
        fg: theme.colors.primary,
        icon: 'text-box-check-outline',
      };
    case '없음':
    default:
      return {
        label: '확인서 없음',
        bg: theme.colors.surfaceSoft,
        fg: theme.colors.textSecondary,
        icon: 'minus-circle-outline',
      };
  }
}

const SIZE_MAP = {
  sm: { paddingV: 4, paddingH: 8, icon: 12, text: theme.typography.small },
  md: { paddingV: 8, paddingH: 12, icon: 14, text: theme.typography.caption },
  lg: { paddingV: 14, paddingH: 18, icon: 20, text: theme.typography.h3 },
} as const;

export function TrustBadge({ type, size = 'md' }: TrustBadgeProps) {
  const variant = resolveVariant(type);
  const dims = SIZE_MAP[size];

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: variant.bg,
          paddingVertical: dims.paddingV,
          paddingHorizontal: dims.paddingH,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={variant.label}
    >
      <MaterialCommunityIcons
        name={variant.icon}
        size={dims.icon}
        color={variant.fg}
        style={styles.icon}
      />
      <Text style={[dims.text, { color: variant.fg }]}>{variant.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.borderRadius.pill,
  },
  icon: { marginRight: 6 },
});
