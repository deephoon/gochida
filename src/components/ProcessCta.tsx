import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

/**
 * 프로세스(업로드~요청서 검토) 화면에서 스크롤 콘텐츠의 맨 끝에 배치되는 인라인 CTA 영역.
 * - 하단 네비게이션 위에 고정 버튼을 띄우지 않고, 사용자가 내용을 끝까지 확인한 뒤
 *   자연스럽게 다음 행동(버튼)을 누르도록 유도한다.
 * - 상단에 옅은 구분선과 충분한 여백을 둬 본문과 시각적으로 분리한다.
 */
export function ProcessCta({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.cta}>
      <View style={styles.divider} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cta: {
    marginTop: 24,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginBottom: 24,
  },
});
