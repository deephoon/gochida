import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Icon } from './Icon';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function AppHeader({ title, onBack, showBack = true, right }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = Math.max(insets.top, 20) + 10;
  
  return (
    <View style={[styles.appHeaderContainer, { paddingTop }]}>
      {showBack && onBack ? (
        <Pressable onPress={onBack} style={styles.appHeaderBtn} hitSlop={10}>
          <Icon name="chevronL" size={24} color={theme.colors.textPrimary} strokeWidth={2.2} />
        </Pressable>
      ) : (
        <View style={styles.appHeaderPlaceholder} />
      )}
      <Text style={styles.appHeaderTitle} numberOfLines={1}>{title}</Text>
      <View style={styles.appHeaderRight}>{right}</View>
    </View>
  );
}

interface TabHeaderProps {
  title: string;
  subtitle?: string;
}

export function TabHeader({ title, subtitle }: TabHeaderProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = Math.max(insets.top, 20) + 20;

  return (
    <View style={[styles.tabHeaderContainer, { paddingTop }]}>
      <Text style={styles.tabHeaderTitle}>{title}</Text>
      {subtitle && <Text style={styles.tabHeaderSubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  appHeaderContainer: {
    paddingBottom: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    zIndex: 5,
  },
  appHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appHeaderPlaceholder: {
    width: 40,
  },
  appHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  appHeaderRight: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tabHeaderContainer: {
    paddingBottom: 8,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.background,
  },
  tabHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: theme.colors.primary,
  },
  tabHeaderSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
