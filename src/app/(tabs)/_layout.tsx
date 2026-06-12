import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';
import { useRequestFlow } from '../../hooks/useRequestFlow';
import { PressableScale } from '../../components/ui/PressableScale';
import { Icon, IconName } from '../../components/Icon';

const TAB_DEFS = [
  { name: 'index', label: '홈', icon: 'home', iconFill: 'homeFill' },
  { name: 'history', label: '요청', icon: 'doc', iconFill: 'docFill' },
  { name: 'chats', label: '채팅', icon: 'chat', iconFill: 'chatFill' },
  { name: 'profile', label: '내 정보', icon: 'person', iconFill: 'personFill' },
] as const;

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { startNewRequest } = useRequestFlow();
  const bottomPadding = Math.max(insets.bottom, 26); // prototype paddingBottom 26

  // Look the route up by name (instead of a hard-coded index) so the tab bar
  // never desyncs from the actual route order. Returns null if not mounted yet.
  const renderTab = (tabDef: typeof TAB_DEFS[number]) => {
    const routeIndex = state.routes.findIndex((r: any) => r.name === tabDef.name);
    if (routeIndex === -1) return null;
    const route = state.routes[routeIndex];
    const isFocused = state.index === routeIndex;
    const color = isFocused ? theme.colors.primary : '#8A8A8F';
    const badges: Record<string, number> = { chats: 1 }; // Mock unread badge
    const badgeCount = badges[tabDef.name] || 0;

    const onPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    return (
      <Pressable
        key={tabDef.name}
        onPress={onPress}
        style={styles.tabItem}
        accessibilityRole="tab"
        accessibilityState={{ selected: isFocused }}
        accessibilityLabel={tabDef.label}
      >
        <View style={styles.iconContainer}>
          <Icon name={isFocused ? tabDef.iconFill as IconName : tabDef.icon as IconName} size={25} color={color} strokeWidth={1.9} />
          {badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '700' : '500' }]}>{tabDef.label}</Text>
      </Pressable>
    );
  };

  const left = [TAB_DEFS[0], TAB_DEFS[1]]; // 홈, 요청
  const right = [TAB_DEFS[2], TAB_DEFS[3]]; // 채팅, 내 정보

  return (
    <View style={styles.absoluteContainer}>
      <BlurView intensity={80} tint="light" style={[styles.tabBarContainer, { paddingBottom: bottomPadding }]}>
        <View style={styles.tabContent}>
          {left.map(renderTab)}

          <View style={styles.fabWrapper}>
            <PressableScale
              style={styles.fabButton}
              onPress={startNewRequest}
              accessibilityRole="button"
              accessibilityLabel="사진으로 요청 시작"
            >
              <LinearGradient
                colors={['#6E7BFF', theme.colors.primary, '#4654D9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fabGradient}
              >
                <Icon name="camera" size={27} color="#FFF" />
              </LinearGradient>
            </PressableScale>
            <Text style={styles.fabLabel}>촬영</Text>
          </View>

          {right.map(renderTab)}
        </View>
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="history" options={{ title: '요청' }} />
      <Tabs.Screen name="chats" options={{ title: '채팅' }} />
      <Tabs.Screen name="profile" options={{ title: '내 정보' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarContainer: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -6,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.danger,
    borderWidth: 1.5,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: -0.2,
  },
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  fabButton: {
    position: 'relative',
    top: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: theme.colors.surface,
    backgroundColor: theme.colors.primary,
    shadowColor: '#5B6CFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.42,
    shadowRadius: 18,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: -0.2,
    marginTop: -10,
    marginBottom: 4,
  }
});
