import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '../../components/Button';
import { theme } from '../../theme';
import { useRequest } from '../../context/RequestContext';

const STEPS = [
  { title: '사진 찍기', desc: '문제 부위를 사진으로 남겨요' },
  { title: 'AI가 요청서 정리', desc: '공종과 요청 내용을 보기 쉽게 정리해요' },
  { title: '전문가 응답 비교', desc: '작업 방식과 비용 감각을 함께 확인해요' },
];

export default function HomeScreen() {
  const { clearRequest } = useRequest();

  const handleStart = () => {
    clearRequest();
    router.push('/upload');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>AI 생활시공 어시스턴트</Text>
          <Text style={styles.logo}>고치다</Text>
          <Text style={styles.description}>
            사진 한 장으로 생활시공 요청을 시작하고, AI가 전문가에게 전달할 요청서를 정리해드려요.
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.stepCard}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="사진으로 시작하기"
          variant="primary"
          size="md"
          onPress={handleStart}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xxl,
    paddingBottom: 100, // 하단 버튼 영역 공간 확보
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.m,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  stepsContainer: {
    gap: theme.spacing.l,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(91, 108, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.m,
  },
  stepNumText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
