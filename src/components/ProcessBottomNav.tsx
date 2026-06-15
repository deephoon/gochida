import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';
import { Icon, IconName } from './Icon';
import { useRequest } from '../context/RequestContext';
import { useRequestFlow } from '../hooks/useRequestFlow';

/**
 * 프로세스(업로드~전문가 상세) 화면 하단에 항상 노출되는 미니 네비게이션.
 * - 홈/요청/촬영/채팅/내 정보로 이동할 수 있어 앱이 실제 서비스처럼 동작한다.
 * - RequestContext가 루트에 있으므로 다른 탭으로 이동했다 돌아와도 요청 상태가 유지된다.
 * - CTA(cta prop)가 있으면 네비 위에 수직으로 배치해 절대 겹치지 않게 한다.
 * - 촬영은 진행 중인 요청이 있으면 초기화 여부를 먼저 확인한다.
 */
export function ProcessBottomNav({ cta }: { cta?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { imageUris, analysisResult, location, symptom } = useRequest();
  const { startNewRequest } = useRequestFlow();
  const bottomPadding = Math.max(insets.bottom, 12);

  const hasActiveRequest =
    imageUris.length > 0 || !!analysisResult || !!location || !!symptom;

  const go = (path: string) => {
    Haptics.selectionAsync().catch(() => {});
    // 탭은 루트 스택의 (tabs) 그룹 안에 있으므로 navigate 시 프로세스 스택을 빠져나가
    // 해당 탭으로 전환된다. 요청 상태(Context)는 루트에 있어 유지된다.
    router.navigate(path as any);
  };

  const handleCamera = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (hasActiveRequest) {
      Alert.alert(
        '새로 촬영할까요?',
        '진행 중인 요청 내용이 초기화되고 새 요청서 작성이 시작돼요.',
        [
          { text: '취소', style: 'cancel' },
          { text: '새로 촬영하기', style: 'destructive', onPress: () => startNewRequest() },
        ],
        { cancelable: true }
      );
      return;
    }
    startNewRequest();
  };

  const items: { key: string; label: string; icon: IconName; onPress: () => void }[] = [
    { key: 'home', label: '홈', icon: 'home', onPress: () => go('/') },
    { key: 'history', label: '요청', icon: 'doc', onPress: () => go('/history') },
    { key: 'chats', label: '채팅', icon: 'chat', onPress: () => go('/chats') },
    { key: 'profile', label: '내 정보', icon: 'person', onPress: () => go('/profile') },
  ];

  const left = items.slice(0, 2);
  const right = items.slice(2);

  const renderItem = (it: typeof items[number]) => (
    <Pressable
      key={it.key}
      onPress={it.onPress}
      style={styles.navItem}
      accessibilityRole="button"
      accessibilityLabel={it.label}
      hitSlop={6}
    >
      <Icon name={it.icon} size={22} color={theme.colors.textTertiary} strokeWidth={1.9} />
      <Text style={styles.navLabel}>{it.label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.wrapper}>
      {cta ? <View style={styles.ctaArea}>{cta}</View> : null}
      <View style={[styles.navBar, { paddingBottom: bottomPadding }]}>
        {left.map(renderItem)}

        <Pressable
          onPress={handleCamera}
          style={styles.cameraItem}
          accessibilityRole="button"
          accessibilityLabel="새 사진으로 요청 시작"
        >
          <View style={styles.cameraButton}>
            <Icon name="camera" size={22} color="#FFF" />
          </View>
          <Text style={styles.cameraLabel}>촬영</Text>
        </Pressable>

        {right.map(renderItem)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  ctaArea: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  navLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    color: theme.colors.textTertiary,
    letterSpacing: -0.2,
  },
  cameraItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primary,
  },
  cameraLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: -0.2,
  },
});
