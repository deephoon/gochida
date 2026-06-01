import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useRequest } from '../context/RequestContext';
import { theme } from '../theme';

const LOADING_STEPS = [
  '사진 속 문제 부위 스캔',
  '필요한 시공 공정 분석',
  '유사 시공 사례 검색',
  '최종 견적 범위 산출',
];

const STANDARD_PRICES = [
  { title: '수전 교체', price: '3~5만원', desc: '단순 교체 기준' },
  { title: '실리콘 재시공', price: '5~10만원', desc: '욕실 1칸 기준' },
  { title: '변기 부속 교체', price: '4~7만원', desc: '부속품 포함' },
  { title: '배관 막힘 통수', price: '7~15만원', desc: '단순 막힘 기준' },
];

export default function AnalysisResultScreen() {
  const { analysisResult, isLoading, error } = useRequest();
  const [stepIndex, setStepIndex] = useState(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]).start();

      interval = setInterval(() => {
        setStepIndex((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
      }, 1500);

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, fadeAnim, slideAnim, pulseAnim]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={theme.colors.danger} />
        <Text style={[theme.typography.bodyStrong, styles.errorText]}>{error}</Text>
        <Button title="뒤로 가기" onPress={() => router.back()} />
      </View>
    );
  }

  if (isLoading || !analysisResult) {
    return (
      <View style={styles.loadingContainer}>
        <ScrollView contentContainerStyle={styles.loadingScroll} showsVerticalScrollIndicator={false}>
          
          <View style={styles.loadingTop}>
            <Animated.View style={[styles.loadingIconWrap, { transform: [{ scale: pulseAnim }] }]}>
              <MaterialCommunityIcons name="robot-outline" size={32} color={theme.colors.white} />
            </Animated.View>
            <Text style={[theme.typography.h1, styles.loadingTitle]}>AI가 분석 중입니다</Text>
            <Text style={[theme.typography.body, styles.loadingSubtitle]}>잠시만 기다려주세요</Text>
          </View>

          <Animated.View style={[styles.stepsContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {LOADING_STEPS.map((step, idx) => {
              const isActive = idx === stepIndex;
              const isDone = idx < stepIndex;
              return (
                <View key={idx} style={[styles.stepRow, isActive && styles.stepRowActive]}>
                  <View style={[styles.stepIconBox, isActive && styles.stepIconBoxActive, isDone && styles.stepIconBoxDone]}>
                    {isDone ? (
                      <MaterialCommunityIcons name="check" size={12} color={theme.colors.white} />
                    ) : isActive ? (
                      <MaterialCommunityIcons name="loading" size={12} color={theme.colors.primary} style={styles.spinIcon} />
                    ) : (
                      <View style={styles.stepDot} />
                    )}
                  </View>
                  <Text style={[theme.typography.bodyStrong, styles.stepText, isActive && styles.stepTextActive, isDone && styles.stepTextDone]}>
                    {step}
                  </Text>
                </View>
              );
            })}
          </Animated.View>

          <Animated.View style={[styles.priceGuideContainer, { opacity: fadeAnim }]}>
            <View style={styles.priceGuideHeader}>
              <Text style={[theme.typography.h3, styles.priceGuideTitle]}>기다리시는 동안 참고하세요</Text>
              <Text style={[theme.typography.caption, styles.priceGuideSubtitle]}>주요 생활시공 평균 단가 (부품비 제외)</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.priceGuideScroll}>
              {STANDARD_PRICES.map((item, idx) => (
                <View key={idx} style={styles.priceCard}>
                  <View style={styles.priceCardIconWrap}>
                    <MaterialCommunityIcons name="wallet-outline" size={18} color={theme.colors.primary} />
                  </View>
                  <Text style={[theme.typography.bodyStrong, styles.priceCardTitle]}>{item.title}</Text>
                  <Text style={[theme.typography.h2, styles.priceCardValue]}>{item.price}</Text>
                  <Text style={[theme.typography.small, styles.priceCardDesc]}>{item.desc}</Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

        </ScrollView>
      </View>
    );
  }

  if (analysisResult.status === 'REJECTED') {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="image-off-outline" size={48} color={theme.colors.textSecondary} />
        <Text style={[theme.typography.h2, styles.errorTitle]}>분석할 수 없는 사진입니다</Text>
        <Text style={[theme.typography.body, styles.errorDesc]}>{analysisResult.rejection_reason}</Text>
        <Button title="다시 촬영하기" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Premium Brand Cost Card: Dark Navy background with Orange accent */}
        <View style={styles.premiumDarkCard}>
          <View style={styles.premiumDarkCardHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color={theme.colors.accent} />
            <Text style={[theme.typography.h3, styles.premiumDarkCardTitle]}>예상 시공 비용</Text>
          </View>
          
          {/* CRITICAL FIX: Changed from display to body/h3 for readability of long paragraphs */}
          <Text style={[theme.typography.body, styles.premiumDarkCardValue]}>
            {analysisResult.costSense}
          </Text>
          
          <View style={styles.premiumDarkCardActionRow}>
            <View style={styles.premiumDarkCardPill}>
              <Text style={[theme.typography.small, styles.premiumDarkCardPillText]}>부품비 제외 기준</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerArea}>
          <Text style={[theme.typography.h1, styles.mainTitle]}>{analysisResult.problemCandidate}</Text>
          <View style={styles.badgeRow}>
            <Badge label={analysisResult.tradeCategory} variant="primary" />
            {analysisResult.visitRequired && <Badge label="방문 확인 필요" variant="warning" />}
            {analysisResult.riskLevel === '높음' && <Badge label="고위험" variant="warning" />}
          </View>
        </View>

        <View style={styles.cardsContainer}>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconBox, { backgroundColor: theme.colors.primaryLight }]}>
                <MaterialCommunityIcons name="check-decagram-outline" size={22} color={theme.colors.primary} />
              </View>
              <Text style={[theme.typography.h2, styles.cardTitle]}>추천 조치</Text>
            </View>
            <View style={styles.actionBox}>
              <Text style={[theme.typography.body, styles.actionCardBody]}>{analysisResult.actionRecommendation}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconBox, { backgroundColor: theme.colors.surfaceSoft }]}>
                <MaterialCommunityIcons name="line-scan" size={22} color={theme.colors.textPrimary} />
              </View>
              <Text style={[theme.typography.h2, styles.cardTitle]}>AI 발견 사항</Text>
              <View style={styles.confidenceBadge}>
                <Text style={[theme.typography.small, styles.confidenceText]}>신뢰도: {analysisResult.confidence}</Text>
              </View>
            </View>
            <View style={styles.bulletList}>
              {analysisResult.visibleEvidence.map((line, i) => (
                <View key={`ev-${i}`} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={[theme.typography.body, styles.bulletText]}>{line}</Text>
                </View>
              ))}
            </View>
          </View>

          {analysisResult.uncertainty.length > 0 && (
            <View style={[styles.card, styles.warningCard]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBox, { backgroundColor: '#FFF5E5' }]}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={22} color={theme.colors.warning} />
                </View>
                <Text style={[theme.typography.h2, styles.cardTitle, { color: theme.colors.warning }]}>추가 확인 필요</Text>
              </View>
              <View style={styles.bulletList}>
                {analysisResult.uncertainty.map((line, i) => (
                  <View key={`un-${i}`} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, { backgroundColor: theme.colors.warning }]} />
                    <Text style={[theme.typography.body, styles.bulletText]}>{line}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        </View>

        <Text style={[theme.typography.caption, styles.disclaimer]}>{analysisResult.disclaimer}</Text>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button title="이대로 요청서 확인하기" onPress={() => router.push('/request-review')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1, padding: theme.spacing.xl },

  loadingContainer: { flex: 1, backgroundColor: theme.colors.background },
  loadingScroll: { padding: theme.spacing.xl, paddingBottom: 40 },
  loadingTop: { marginTop: 80, alignItems: 'center', marginBottom: 40 },
  loadingIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary, // Brand Blue
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingTitle: { color: theme.colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  loadingSubtitle: { color: theme.colors.textSecondary, textAlign: 'center' },
  
  stepsContainer: { 
    width: '100%', 
    backgroundColor: theme.colors.white, 
    padding: 32, 
    borderRadius: 24, 
    marginBottom: 40,
    ...theme.shadows.soft,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, opacity: 0.4 },
  stepRowActive: { opacity: 1 },
  stepIconBox: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: theme.colors.surfaceSoft, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16, 
  },
  stepIconBoxActive: { backgroundColor: theme.colors.primaryLight },
  stepIconBoxDone: { backgroundColor: theme.colors.primary },
  stepDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.textTertiary },
  stepText: { color: theme.colors.textSecondary },
  stepTextActive: { color: theme.colors.primaryDark },
  stepTextDone: { color: theme.colors.textPrimary, textDecorationLine: 'line-through', opacity: 0.5 },
  spinIcon: { transform: [{ rotate: '180deg' }] },

  priceGuideContainer: { width: '100%' },
  priceGuideHeader: { marginBottom: 16 },
  priceGuideTitle: { color: theme.colors.textPrimary, marginBottom: 4 },
  priceGuideSubtitle: { color: theme.colors.textSecondary },
  priceGuideScroll: { gap: 16, paddingRight: theme.spacing.xl, paddingBottom: 20 },
  priceCard: {
    backgroundColor: theme.colors.white,
    padding: 24,
    borderRadius: 24,
    width: 160,
    ...theme.shadows.soft,
  },
  priceCardIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  priceCardTitle: { color: theme.colors.textSecondary, marginBottom: 8 },
  priceCardValue: { color: theme.colors.textPrimary, marginBottom: 4 },
  priceCardDesc: { color: theme.colors.textTertiary },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  errorTitle: { color: theme.colors.textPrimary, marginTop: theme.spacing.m, marginBottom: theme.spacing.s },
  errorDesc: { color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.xl },
  errorText: { color: theme.colors.textPrimary, textAlign: 'center', marginTop: theme.spacing.m, marginBottom: theme.spacing.xl },

  // Dark Premium Cost Card (Deep Navy)
  premiumDarkCard: {
    backgroundColor: '#1E2335', // Deep Navy Blue instead of harsh black
    borderRadius: 24,
    padding: 32,
    marginTop: 8,
    marginBottom: 32,
    ...theme.shadows.medium,
  },
  premiumDarkCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  premiumDarkCardTitle: { color: theme.colors.white, opacity: 0.9 },
  premiumDarkCardValue: { color: theme.colors.white, marginBottom: 24, lineHeight: 26 }, // Much more readable
  premiumDarkCardActionRow: { flexDirection: 'row', gap: 12 },
  premiumDarkCardPill: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 100 
  },
  premiumDarkCardPillText: { color: theme.colors.white },

  headerArea: { marginBottom: 24, paddingHorizontal: 4 },
  mainTitle: { color: theme.colors.textPrimary, marginBottom: 16, lineHeight: 34 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  cardsContainer: { gap: 20 },
  card: { 
    backgroundColor: theme.colors.white, 
    padding: 24, 
    borderRadius: 24, 
    ...theme.shadows.soft,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  cardIconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: theme.colors.textPrimary, flex: 1 },
  confidenceBadge: { backgroundColor: theme.colors.surfaceSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  confidenceText: { color: theme.colors.textSecondary },
  
  actionBox: {
    backgroundColor: '#F7F8FC', // Very soft blue tint
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  actionCardBody: { color: theme.colors.textPrimary, lineHeight: 26 },

  warningCard: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: '#FFEBEA' },
  warningText: { color: theme.colors.textPrimary, lineHeight: 26 },

  bulletList: { gap: 14 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start' },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary, marginTop: 8, marginRight: 12 },
  bulletText: { flex: 1, color: theme.colors.textSecondary, lineHeight: 24 },

  disclaimer: { color: theme.colors.textTertiary, textAlign: 'center', marginTop: 40, paddingHorizontal: 24, lineHeight: 20 },

  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    paddingHorizontal: theme.spacing.xl, paddingTop: 16, paddingBottom: 40, 
    backgroundColor: theme.colors.background, 
  },
});
