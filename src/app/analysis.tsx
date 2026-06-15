import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Animated } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRequest } from '../context/RequestContext';
import { theme } from '../theme';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { AppHeader } from '../components/Header';
import { Skeleton } from '../components/Skeleton';
import { ProcessBottomNav } from '../components/ProcessBottomNav';
import { ProcessCta } from '../components/ProcessCta';
import { ASSET } from '../data/mockData';
import { getRecommendedPriceGuides } from '../data/repairPriceGuides';
import { normalizeAiText } from '../utils/text';

const GUIDE_ROTATE_MS = 2600;
const GUIDE_FADE_MS = 220;

// 체감 속도 개선: 진행 중인 작업을 단계적으로 보여준다.
const LOADING_STAGES = [
  '사진 속 문제 범위를 확인하고 있어요',
  '필요한 공종을 추정하고 있어요',
  '전문가에게 보낼 요청서를 정리하고 있어요',
  '참고 비용 감각을 함께 확인하고 있어요',
];
const STAGE_ROTATE_MS = 2500;
const SLOW_HINT_AFTER_MS = 15000; // 15초 이상이면 직접 작성 옵션 노출

/** 단계형 로딩 헤더: 문구가 순차적으로 바뀌고, 오래 걸리면 직접 작성 CTA를 보여준다. */
function AnalysisLoadingHeader({ onManual }: { onManual: () => void }) {
  const [stage, setStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStage((s) => Math.min(s + 1, LOADING_STAGES.length - 1));
    }, STAGE_ROTATE_MS);
    const elapsedTimer = setInterval(() => setElapsed((e) => e + 1000), 1000);
    return () => {
      clearInterval(stageTimer);
      clearInterval(elapsedTimer);
    };
  }, []);

  const isSlow = elapsed >= SLOW_HINT_AFTER_MS;
  const reachedLast = stage >= LOADING_STAGES.length - 1;
  const title = isSlow && reachedLast ? '조금 더 확인 중이에요' : '요청서를 정리하고 있어요';

  return (
    <View>
      <Text style={styles.h1}>{title}</Text>
      <View style={styles.stageRow}>
        <Ionicons name="sparkles" size={15} color={theme.colors.primary} />
        <Text style={styles.stageText}>{LOADING_STAGES[stage]}</Text>
      </View>
      {isSlow && (
        <View style={styles.slowBox}>
          <Text style={styles.slowText}>
            생각보다 오래 걸리고 있어요. 기다리기 어려우면 직접 요청서를 작성할 수 있어요.
          </Text>
          <Button title="직접 요청서 작성하기" variant="outline" size="sm" onPress={onManual} />
        </View>
      )}
    </View>
  );
}

/**
 * 로딩 중 참고 시세 영역.
 * 위치/증상 관련 공종을 activeGuide 큰 카드로 보여주고 2.6초마다 순환하며,
 * 나머지 추천 공종은 가로 스크롤 미니 카드로 함께 노출한다.
 */
function LoadingPriceGuides({ location, symptom }: { location: string; symptom: string }) {
  const guides = useMemo(
    () => getRecommendedPriceGuides(location, symptom, 4),
    [location, symptom]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (guides.length < 2) return;
    const id = setInterval(() => {
      Animated.timing(fade, { toValue: 0, duration: GUIDE_FADE_MS, useNativeDriver: true }).start(() => {
        setActiveIndex((i) => (i + 1) % guides.length);
        Animated.timing(fade, { toValue: 1, duration: GUIDE_FADE_MS, useNativeDriver: true }).start();
      });
    }, GUIDE_ROTATE_MS);
    return () => clearInterval(id);
  }, [guides, fade]);

  const active = guides[activeIndex];
  if (!active) return null;
  const others = guides.filter((g) => g.id !== active.id);

  return (
    <View>
      <Text style={styles.guideSectionLabel}>참고 시공 단가</Text>
      <Animated.View style={{ opacity: fade }}>
        <Card radius={theme.borderRadius.xxl} style={{ marginBottom: 8 }}>
          <Text style={styles.guideEyebrow}>{active.tradeCategory} · 참고 시세</Text>
          <Text style={styles.guideTitle}>{active.title}</Text>
          <View style={styles.guidePriceRow}>
            <Text style={styles.guidePriceLabel}>평균</Text>
            <Text style={styles.guidePriceValue}>{active.averagePrice}</Text>
          </View>
          <View style={styles.guideFactorsDivider} />
          <Text style={styles.guideFactorsLabel}>가격이 달라지는 이유</Text>
          <Text style={styles.cardDesc}>{active.factors.join(' · ')}</Text>
        </Card>
      </Animated.View>
      <View style={styles.guideDots}>
        {guides.map((g, i) => (
          <View key={g.id} style={[styles.guideDot, i === activeIndex && styles.guideDotActive]} />
        ))}
      </View>

      {others.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.guideSectionLabel}>함께 참고하면 좋은 시공</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.miniScrollWrapper}
            contentContainerStyle={styles.miniScroll}
          >
            {others.map((g) => (
              <View key={g.id} style={styles.miniCard}>
                <Text style={styles.miniCardTrade} numberOfLines={1}>{g.tradeCategory}</Text>
                <Text style={styles.miniCardTitle} numberOfLines={2}>{g.title}</Text>
                <Text style={styles.miniCardPrice}>{g.averagePrice}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <Card radius={theme.borderRadius.l} style={{ paddingVertical: 16, paddingHorizontal: 18, marginTop: 16, marginBottom: 12 }}>
        <Text style={styles.cardHeader}>고치다의 비교 기준</Text>
        <Text style={styles.cardDesc}>최저가보다 작업 범위와 사후관리 가능성을 함께 비교합니다.</Text>
      </Card>
      <Text style={styles.disclaimerText}>
        참고용 시세이며, 최종 비용은 전문가 확인 후 달라질 수 있어요.
      </Text>
    </View>
  );
}

/** 에러/거부 등 결과를 보여줄 수 없을 때의 안내 화면. */
function StatusScreen({
  icon, iconColor, iconBg, title, description, primaryLabel, onPrimary, secondaryLabel, onSecondary,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
}) {
  return (
    <View style={styles.statusWrap}>
      <View style={[styles.statusIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={34} color={iconColor} />
      </View>
      <Text style={styles.statusTitle}>{title}</Text>
      <Text style={styles.statusDesc}>{description}</Text>
      <View style={styles.statusActions}>
        <Button title={secondaryLabel} variant="outline" onPress={onSecondary} />
        <View style={{ height: 12 }} />
        <Button title={primaryLabel} onPress={onPrimary} />
      </View>
    </View>
  );
}

export default function AnalysisScreen() {
  const { location, symptom, imageBase64s, analysisResult: a, isLoading, error, submitAnalysis } = useRequest();

  // 화면 진입 시 결과가 없고 진행 중/에러 상태가 아니며 이미지가 있을 때 요청서 정리를 시작한다.
  useEffect(() => {
    if (!a && !isLoading && !error && imageBase64s.length > 0) {
      submitAnalysis();
    }
    // 마운트 시 1회만 트리거 (재시도는 버튼으로 처리)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRejected = a?.status === 'REJECTED';
  const showLoading = isLoading || (!a && !error);

  // 실제 Gemini 응답이 일부 필드를 누락해도 렌더가 깨지지 않도록 방어한다.
  const visibleEvidence = a?.visibleEvidence ?? [];
  const uncertainty = a?.uncertainty ?? [];
  const selfCheckSteps = a?.selfCheckGuide?.steps ?? [];
  const doNotAttempt = a?.selfCheckGuide?.doNotAttemptIf ?? [];
  const additionalQuestions = a?.additionalQuestions ?? [];
  const showAdditionalPhotos = !!a?.additionalPhotosNeeded || additionalQuestions.length > 0;
  // 분석 신뢰도 미터(3칸)용 레벨.
  const confLevel = a?.confidence === '높음' ? 3 : a?.confidence === '보통' ? 2 : 1;

  const formatPrice = (priceRange: string) => {
    const m = priceRange?.match(/(\d+)\D+(\d+)/);
    return m ? `${m[1]}~${m[2]}만원` : priceRange;
  };

  const handleRetry = () => submitAnalysis();
  const handleManual = () => router.push('/request-review');
  const handleReshoot = () => router.back();

  return (
    <View style={styles.container}>
      <AppHeader title="AI 요청서 정리" onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {showLoading ? (
          <View>
            <AnalysisLoadingHeader onManual={handleManual} />
            <View style={{ marginVertical: 24, marginBottom: 28 }}>
              <Skeleton width="58%" height={16} style={{ marginBottom: 12 }} />
              <Skeleton width="90%" height={16} style={{ marginBottom: 12 }} />
              <Skeleton width="74%" height={16} />
            </View>
            <LoadingPriceGuides location={location} symptom={symptom} />
          </View>
        ) : error ? (
          <StatusScreen
            icon="alert-circle"
            iconColor={theme.colors.warning}
            iconBg={theme.colors.warningLight}
            title="요청서를 정리하지 못했어요"
            description={error}
            secondaryLabel="다시 시도하기"
            onSecondary={handleRetry}
            primaryLabel="직접 요청서 작성하기"
            onPrimary={handleManual}
          />
        ) : isRejected ? (
          <StatusScreen
            icon="image"
            iconColor={theme.colors.primary}
            iconBg={theme.colors.primaryLight}
            title="사진을 다시 확인해 주세요"
            description={a?.rejection_reason || '문제 부위가 잘 보이는 사진으로 다시 시도하면 더 정확한 요청서를 만들 수 있어요.'}
            secondaryLabel="사진 다시 올리기"
            onSecondary={handleReshoot}
            primaryLabel="직접 요청서 작성하기"
            onPrimary={handleManual}
          />
        ) : a ? (
          <View>
            {/* 참고 비용 카드 (확정 견적 아님) */}
            <View style={styles.costCard}>
              <View style={styles.costCircle} />
              <Image source={ASSET.priceGuide} style={styles.costImage} />
              <View style={styles.costContent}>
                <View style={styles.costHeaderRow}>
                  <View style={styles.costIconWrap}>
                    <Ionicons name="flash" size={15} color={theme.colors.accent} />
                  </View>
                  <Text style={styles.costEyebrow}>참고 비용 감각</Text>
                </View>
                <Text style={styles.costPrice}>{formatPrice(a.priceGuide?.priceRange || '')}</Text>
                <Text style={styles.costDesc}>{a.costSense} · {a.priceGuide?.tradeCategory} 참고 시세 · 부품비 제외</Text>
              </View>
            </View>

            {/* 문제 후보 헤더 */}
            <View style={{ marginTop: 24 }}>
              <View style={styles.resultEyebrow}>
                <Ionicons name="sparkles" size={13} color={theme.colors.primary} />
                <Text style={styles.resultEyebrowText}>AI가 사진을 분석해 정리했어요</Text>
              </View>
              <Text style={styles.h1}>{normalizeAiText(a.problemCandidate)}</Text>
              <View style={styles.badgeRow}>
                <Badge label={a.tradeCategory} variant="primary" icon="wrench" />
                {a.visitRequired && <Badge label="방문 확인 필요" variant="warning" dot />}
                {a.riskLevel === '높음' && <Badge label="위험도 높음" variant="danger" icon="warning" />}
              </View>
              {/* 분석 신뢰도 미터 */}
              <View style={styles.confCard}>
                <View style={styles.confTextRow}>
                  <Text style={styles.confLabel}>분석 신뢰도</Text>
                  <Text style={styles.confValue}>{a.confidence}</Text>
                </View>
                <View style={styles.confSegs}>
                  {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.confSeg, i <= confLevel && styles.confSegOn]} />
                  ))}
                </View>
              </View>
            </View>

            {/* 전문가에게 전달할 요청 방향 */}
            <Card radius={theme.borderRadius.xxl} style={{ marginTop: 20 }}>
              <View style={styles.cardIconHeader}>
                <Ionicons name="sparkles" size={18} color={theme.colors.primary} />
                <Text style={styles.h3}>전문가에게 전달할 요청 방향</Text>
              </View>
              <View style={styles.recommendationWrap}>
                <Text style={styles.recommendationText}>{normalizeAiText(a.actionRecommendation)}</Text>
              </View>
            </Card>

            {/* AI가 사진에서 확인한 내용 */}
            <Card radius={theme.borderRadius.xxl} style={{ marginTop: 12 }}>
              <View style={styles.cardIconHeader}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
                <Text style={styles.h3}>사진에서 확인한 내용</Text>
              </View>
              {visibleEvidence.map((e: string, i: number) => (
                <View key={i} style={[styles.listItem, i === visibleEvidence.length - 1 && { marginBottom: 0 }]}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} style={{ marginTop: 1 }} />
                  <Text style={styles.listText}>{e}</Text>
                </View>
              ))}
            </Card>

            {/* 추가 확인이 필요한 내용 (불확실) */}
            <Card radius={theme.borderRadius.xxl} style={styles.warningCard}>
              <View style={styles.cardIconHeader}>
                <Ionicons name="warning" size={16} color="#C77F12" />
                <Text style={styles.warningCardTitle}>추가 확인이 필요해요</Text>
              </View>
              {uncertainty.map((u: string, i: number) => (
                <View key={i} style={[styles.listItem, i === uncertainty.length - 1 && { marginBottom: 0 }]}>
                  <View style={styles.warningDot} />
                  <Text style={styles.warningListText}>{u}</Text>
                </View>
              ))}
            </Card>

            {/* 추가 사진/정보 권장 카드 */}
            {showAdditionalPhotos && (
              <Card radius={theme.borderRadius.xxl} style={{ marginTop: 12 }}>
                <View style={styles.cardIconHeader}>
                  <Ionicons name="camera" size={18} color={theme.colors.primary} />
                  <Text style={styles.h3}>이런 사진을 추가하면 더 정확해져요</Text>
                </View>
                {additionalQuestions.map((q: string, i: number) => (
                  <View key={i} style={styles.listItem}>
                    <Ionicons name="add-circle" size={18} color={theme.colors.primary} style={{ marginTop: 1 }} />
                    <Text style={styles.listText}>{q}</Text>
                  </View>
                ))}
                <Button
                  title="사진 추가하러 가기"
                  variant="outline"
                  size="sm"
                  onPress={handleReshoot}
                />
              </Card>
            )}

            {/* 직접 확인 가이드 + 주의 */}
            <Card radius={theme.borderRadius.xxl} style={{ marginTop: 12 }}>
              <Text style={[styles.h3, { marginBottom: 14 }]}>직접 확인해 볼 수 있어요</Text>
              {selfCheckSteps.map((s: string, i: number) => (
                <View key={i} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.listText}>{s}</Text>
                </View>
              ))}
              <View style={styles.dangerBox}>
                <Text style={styles.dangerBoxTitle}>이런 경우 직접 시도하지 마세요</Text>
                {doNotAttempt.map((d: string, i: number) => (
                  <Text key={i} style={styles.dangerBoxText}>· {d}</Text>
                ))}
              </View>
            </Card>

            <Text style={styles.bottomDisclaimer}>{a.disclaimer}</Text>

            <ProcessCta>
              <Button
                title="이대로 요청서 확인하기"
                onPress={() => router.push('/request-review')}
                leftIcon={<Ionicons name="checkmark" size={20} color="#FFF" />}
              />
            </ProcessCta>
          </View>
        ) : null}
      </ScrollView>

      <ProcessBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24 },

  // Text Styles
  h1: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
  },
  h3: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  bodyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  stageText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  slowBox: {
    marginTop: 18,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    gap: 12,
    ...theme.shadows.soft,
  },
  slowText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // Status (error / rejected) screen
  statusWrap: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 8,
  },
  statusIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  statusTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  statusDesc: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 23,
  },
  statusActions: {
    alignSelf: 'stretch',
    marginTop: 32,
  },

  // Guide Card Styles
  guideSectionLabel: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    fontWeight: '700',
    marginBottom: 10,
  },
  guideFactorsDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginTop: 14,
    marginBottom: 12,
  },
  guideFactorsLabel: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    marginBottom: 4,
  },
  guideDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 2,
  },
  guideDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.borderStrong,
  },
  guideDotActive: {
    backgroundColor: theme.colors.primary,
    width: 12,
  },
  miniScrollWrapper: {
    marginHorizontal: -24,
  },
  miniScroll: {
    paddingHorizontal: 24,
    paddingVertical: 4,
    gap: 10,
  },
  miniCard: {
    width: 148,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    padding: 14,
    ...theme.shadows.soft,
  },
  miniCardTrade: {
    ...theme.typography.small,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  miniCardTitle: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  miniCardPrice: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 8,
  },
  guideEyebrow: {
    ...theme.typography.small,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  guideTitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  guidePriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 12,
  },
  guidePriceLabel: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
  },
  guidePriceValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: theme.colors.primary,
  },
  cardHeader: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
  },
  cardDesc: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  disclaimerText: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 14,
    lineHeight: 17,
    fontWeight: '500',
  },

  // Premium Cost Card
  costCard: {
    backgroundColor: theme.colors.premiumDark,
    borderRadius: theme.borderRadius.xxxl,
    padding: 24,
    ...theme.shadows.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  costCircle: {
    position: 'absolute',
    top: -34,
    right: -24,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(91,108,255,0.45)',
  },
  costImage: {
    position: 'absolute',
    right: -10,
    top: '50%',
    marginTop: -52, // half of height 104
    width: 104,
    height: 104,
    resizeMode: 'contain',
    zIndex: 0,
  },
  costContent: {
    position: 'relative',
    zIndex: 1,
    paddingRight: 80,
  },
  costHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  costIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(255,179,138,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  costEyebrow: {
    fontSize: 12.5,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  costPrice: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#FFF',
    marginTop: 14,
  },
  costDesc: {
    ...theme.typography.caption,
    marginTop: 8,
    color: theme.colors.onDarkSoft,
  },

  resultEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  resultEyebrowText: {
    ...theme.typography.small,
    color: theme.colors.primary,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  confCard: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    ...theme.shadows.soft,
  },
  confTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  confLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  confValue: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '800',
  },
  confSegs: {
    flexDirection: 'row',
    gap: 6,
  },
  confSeg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceSoft,
  },
  confSegOn: {
    backgroundColor: theme.colors.primary,
  },

  cardIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  recommendationWrap: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    paddingLeft: 14,
  },
  recommendationText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },

  listItem: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 12,
  },
  listText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 23,
    flex: 1,
  },

  warningCard: {
    marginTop: 12,
    backgroundColor: theme.colors.warningLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  warningCardTitle: {
    ...theme.typography.h3,
    color: '#9A6E13',
  },
  warningDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C77F12',
    marginTop: 9,
  },
  warningListText: {
    ...theme.typography.body,
    color: '#7A5A1E',
    lineHeight: 23,
    flex: 1,
  },

  stepItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  dangerBox: {
    marginTop: 6,
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.dangerLight,
    borderRadius: theme.borderRadius.l,
  },
  dangerBoxTitle: {
    ...theme.typography.small,
    color: theme.colors.danger,
    fontWeight: '700',
    marginBottom: 7,
  },
  dangerBoxText: {
    ...theme.typography.caption,
    color: '#B3271F',
    lineHeight: 19,
  },

  bottomDisclaimer: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 8,
    lineHeight: 18,
    fontWeight: '500',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 34,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
  },
});
