import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { useRequest } from '../context/RequestContext';

export default function HomeScreen() {
  const { clearRequest } = useRequest();

  const handleStart = () => {
    clearRequest();
    router.push('/upload');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>AI 생활시공 어시스턴트</Text>
          <Text style={styles.logo}>고치다</Text>
          <Text style={styles.headline}>
            사진 한 장이면{'\n'}전문가에게 정확하게 전달됩니다
          </Text>
          <Text style={styles.sub}>
            문제를 찍기만 하세요. 어디가 어떻게 고장났는지,{'\n'}
            얼마쯤 들지까지 AI가 대신 정리합니다.
          </Text>
        </View>

        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button title="사진으로 시작하기" onPress={handleStart} />
          <Text style={styles.footnote}>30초면 충분해요</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const STEPS = [
  { title: '문제 사진 찍기', desc: '거실, 욕실, 어디든 한 장이면 OK' },
  { title: 'AI가 진단', desc: '공종 분류와 예상 비용까지 자동' },
  { title: '전문가 응답 비교', desc: '검증된 시공자 견적을 한 번에' },
];

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  content: { marginTop: theme.spacing.xl },
  eyebrow: {
    ...theme.typography.small,
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: theme.spacing.s,
    letterSpacing: 0.4,
  },
  logo: {
    fontSize: 38,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -1,
    marginBottom: theme.spacing.l,
  },
  headline: {
    ...theme.typography.display,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.m,
  },
  sub: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  steps: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.l,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.m,
  },
  stepNumText: { ...theme.typography.small, fontWeight: '700', color: theme.colors.textPrimary },
  stepTitle: { ...theme.typography.bodyStrong, color: theme.colors.textPrimary },
  stepDesc: { ...theme.typography.caption, color: theme.colors.textSecondary, marginTop: 2 },
  footer: {
    marginTop: theme.spacing.l,
  },
  footnote: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: theme.spacing.m,
  },
});
