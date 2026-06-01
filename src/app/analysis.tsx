import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Skeleton } from '../components/Skeleton';
import { useRequest } from '../context/RequestContext';
import { theme } from '../theme';
import { getSuggestedPriceGuide } from '../data/repairPriceGuides';

export default function AnalysisResultScreen() {
  const { analysisResult, isLoading, error, submitAnalysis, location, symptom } = useRequest();

  useEffect(() => {
    if (!analysisResult && !isLoading && !error) submitAnalysis();
  }, []);

  if (isLoading) {
    const guide = getSuggestedPriceGuide(location || '', symptom || '');
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.loadingScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.loadingTitle}>요청서를 정리하고 있어요</Text>
          <Text style={styles.loadingDesc}>
            사진 속 문제 범위와 필요한 공종을 확인 중입니다. 보통 10초 안에 끝나요.
          </Text>

          <View style={styles.skeletonStack}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="90%" height={14} />
            <Skeleton width="80%" height={14} />
          </View>

          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>{guide.tradeCategory} · 참고 시세</Text>
            <Text style={styles.priceValue}>{guide.averagePrice}</Text>
            <View style={styles.hr} />
            <Text style={styles.priceFactorLabel}>가격 변동 요인</Text>
            <Text style={styles.priceFactor}>{guide.factors.join(' · ')}</Text>
            <Text style={styles.priceDisclaimer}>{guide.disclaimer}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (error || analysisResult?.status === 'REJECTED') {
    const displayError = error || analysisResult?.rejection_reason || '분석을 완료하지 못했어요.';
    const isTimeoutOrNetworkError =
      displayError.includes('초과') || displayError.includes('오류') || displayError.includes('지연');

    return (
      <View style={styles.errorWrap}>
        <View style={styles.errorMark}>
          <Text style={styles.errorMarkText}>!</Text>
        </View>
        <Text style={styles.stateTitle}>분석을 완료하지 못했어요</Text>
        <Text style={styles.stateSubtitle}>{displayError}</Text>
        <View style={{ height: theme.spacing.xl }} />
        <View style={styles.buttonStack}>
          {isTimeoutOrNetworkError ? (
            <Button title="다시 분석 시도하기" onPress={submitAnalysis} variant="outline" />
          ) : (
            <Button title="사진 다시 올리기" onPress={() => router.replace('/upload')} variant="outline" />
          )}
          <View style={{ height: theme.spacing.s }} />
          <Button title="직접 요청서 작성하기" onPress={() => router.push('/request-review')} />
        </View>
      </View>
    );
  }

  if (!analysisResult) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>AI 분석 완료</Text>
        <Text style={styles.mainTitle}>{analysisResult.problemCandidate}</Text>
        <View style={styles.badgeRow}>
          <Badge label={analysisResult.tradeCategory} variant="primary" />
          {analysisResult.visitRequired && <Badge label="방문 확인 필요" variant="warning" />}
          <Badge label={`신뢰도 ${analysisResult.confidence}`} variant="neutral" />
        </View>

        <Section title="확인된 근거">
          {analysisResult.visibleEvidence.map((line, i) => (
            <BulletLine key={`ev-${i}`}>{line}</BulletLine>
          ))}
        </Section>

        {analysisResult.uncertainty.length > 0 && (
          <Section title="추가 확인이 필요한 부분">
            {analysisResult.uncertainty.map((line, i) => (
              <BulletLine key={`un-${i}`} muted>
                {line}
              </BulletLine>
            ))}
          </Section>
        )}

        <Section title="추천 작업 방향">
          <Text style={styles.body}>{analysisResult.actionRecommendation}</Text>
          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>예상 비용 감각</Text>
            <Text style={styles.kvValue}>{analysisResult.costSense}</Text>
          </View>
        </Section>

        <Text style={styles.disclaimer}>{analysisResult.disclaimer}</Text>
        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button title="요청서 확인하기" onPress={() => router.push('/request-review')} />
      </View>
    </View>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const BulletLine = ({ children, muted }: { children: React.ReactNode; muted?: boolean }) => (
  <View style={styles.bulletRow}>
    <View style={[styles.bulletDot, muted && { backgroundColor: theme.colors.textTertiary }]} />
    <Text style={[styles.bulletText, muted && { color: theme.colors.textSecondary }]}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1, padding: theme.spacing.l },

  loadingScroll: { padding: theme.spacing.l, paddingTop: theme.spacing.xxl },
  loadingTitle: { ...theme.typography.h1, color: theme.colors.textPrimary, marginBottom: theme.spacing.s },
  loadingDesc: { ...theme.typography.body, color: theme.colors.textSecondary, marginBottom: theme.spacing.xl },
  skeletonStack: { gap: theme.spacing.s, marginBottom: theme.spacing.xl },

  priceCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  priceLabel: { ...theme.typography.small, color: theme.colors.primary, fontWeight: '700', marginBottom: 6 },
  priceValue: { ...theme.typography.display, color: theme.colors.textPrimary },
  hr: { height: 1, backgroundColor: theme.colors.divider, marginVertical: theme.spacing.m },
  priceFactorLabel: { ...theme.typography.small, color: theme.colors.textTertiary, marginBottom: 4 },
  priceFactor: { ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.m },
  priceDisclaimer: { ...theme.typography.small, color: theme.colors.textTertiary, lineHeight: 18 },

  errorWrap: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  errorMark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.warningLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  errorMarkText: { ...theme.typography.h1, color: theme.colors.warning },
  stateTitle: { ...theme.typography.h1, color: theme.colors.textPrimary, marginBottom: theme.spacing.s, textAlign: 'center' },
  stateSubtitle: { ...theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center' },
  buttonStack: { width: '100%' },

  eyebrow: {
    ...theme.typography.small,
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: theme.spacing.s,
    letterSpacing: 0.4,
  },
  mainTitle: { ...theme.typography.display, color: theme.colors.textPrimary, marginBottom: theme.spacing.m },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.s, marginBottom: theme.spacing.xl },

  section: {
    paddingVertical: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  sectionTitle: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: theme.spacing.m,
    fontWeight: '700',
  },
  body: { ...theme.typography.body, color: theme.colors.textPrimary },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: theme.spacing.s },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textPrimary,
    marginTop: 9,
    marginRight: theme.spacing.m,
  },
  bulletText: { flex: 1, ...theme.typography.body, color: theme.colors.textPrimary },

  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.m,
    paddingTop: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  kvLabel: { ...theme.typography.caption, color: theme.colors.textSecondary },
  kvValue: { ...theme.typography.bodyStrong, color: theme.colors.textPrimary },

  disclaimer: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
    lineHeight: 18,
  },

  footer: {
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
});
