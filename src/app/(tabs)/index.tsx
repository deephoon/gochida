import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { useRequestFlow } from '../../hooks/useRequestFlow';
import { PRICE_PREVIEW, MOCK_REQUESTS, ASSET } from '../../data/mockData';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { PressableScale } from '../../components/ui/PressableScale';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRICE_CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.42, 170);

function SectionTitle({ title, action, onAction }: { title: string, action?: string, onAction?: () => void }) {
  return (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <Pressable onPress={onAction} style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{action}</Text>
          <Icon name="chevronR" size={14} color={theme.colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const request = MOCK_REQUESTS[0];
  const { startNewRequest } = useRequestFlow();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <View style={styles.headerLogoRow}>
            <Image source={require('../../../assets/images/hero.png')} style={styles.headerLogoIcon} />
            <Text style={styles.headerLogoText}>고치다</Text>
          </View>
          <Text style={styles.headerSubtitle}>사진으로 시작하는 생활시공 요청</Text>
        </View>
        <Pressable style={styles.bellBtn} onPress={() => router.push('/profile')}>
          <Icon name="bell" size={21} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero CTA */}
        <View style={styles.heroWrapper}>
          <LinearGradient
            colors={['#6E7BFF', theme.colors.primary, '#4654D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
            <Image source={ASSET.heroFlow} style={styles.heroImage} />
            
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Icon name="sparkle" size={13} color="#FFF" />
                <Text style={styles.heroBadgeText}>AI 요청서 정리</Text>
              </View>
              <Text style={styles.heroTitle}>사진 한 장이면{'\n'}충분해요</Text>
              <Text style={styles.heroDesc}>문제 부위를 올리면 AI가 전문가에게 전달할 요청서 초안을 정리해드려요.</Text>
              <PressableScale style={styles.heroBtn} onPress={startNewRequest}>
                <Icon name="camera" size={19} color={theme.colors.primary} />
                <Text style={styles.heroBtnText}>사진으로 시작하기</Text>
              </PressableScale>
            </View>
          </LinearGradient>
        </View>

        {/* Recent Request */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="최근 요청" />
          <Card onPress={() => router.push('/history')} pad={18} radius={theme.borderRadius.xxl}>
            <View style={styles.recentRow}>
              <View style={styles.recentIconWrap}>
                <Icon name="image" size={23} color={theme.colors.primary} />
              </View>
              <View style={styles.recentTextWrap}>
                <Text style={styles.recentTitle} numberOfLines={1}>{request.title}</Text>
                <Text style={styles.recentSubtitle}>AI 요청서 정리 완료 · 전문가 응답 {request.responses}건</Text>
              </View>
              <Icon name="chevronR" size={18} color={theme.colors.textTertiary} />
            </View>
            <View style={styles.recentBadges}>
              <Badge label="응답 도착" variant="primary" dot />
              <Badge label={request.tradeCategory} variant="neutral" />
            </View>
          </Card>
        </View>

        {/* AI Preview */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="AI 요청서는 이렇게 정리돼요" />
          <Card pad={0} radius={theme.borderRadius.xxl} style={{ overflow: 'hidden' }}>
            <View style={styles.aiPreviewHeader}>
              <Image source={ASSET.aiDraft} style={styles.aiPreviewIcon} />
              <View>
                <Text style={styles.aiPreviewTitle}>AI 요청서 미리보기</Text>
                <Text style={styles.aiPreviewSubtitle}>예시 · 베란다 방충망</Text>
              </View>
            </View>
            <View style={styles.aiPreviewBody}>
              {[
                ['위치', '베란다'],
                ['증상', '파손/고장'],
                ['공종 후보', '방충망/창호'],
                ['요청 작업', '망 교체 또는 프레임 확인']
              ].map(([k, v], i, arr) => (
                <View key={k} style={[styles.aiPreviewRow, i === arr.length - 1 && styles.noBorder]}>
                  <Text style={styles.aiPreviewLabel}>{k}</Text>
                  <Text style={styles.aiPreviewValue}>{v}</Text>
                </View>
              ))}
            </View>
          </Card>
          <Text style={styles.sectionCaption}>사진과 선택 정보를 바탕으로 전문가가 이해하기 쉬운 요청서 초안을 만듭니다.</Text>
        </View>

        {/* Price Guide */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="참고 시공 단가" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priceScrollWrapper} contentContainerStyle={styles.priceScroll}>
            {PRICE_PREVIEW.map((p, i) => (
              <PressableScale key={i} style={styles.priceCard}>
                <View style={styles.priceImgWrap}>
                  <Image source={p.img} style={styles.priceImg} />
                </View>
                <Text style={styles.priceLabel} numberOfLines={1}>{p.label}</Text>
                <Text style={styles.priceValue}>{p.price}</Text>
              </PressableScale>
            ))}
          </ScrollView>
          <Text style={styles.sectionCaption}>최종 비용은 전문가 확인 후 달라질 수 있어요.</Text>
        </View>

        {/* Expert Preview */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="전문가 응답은 같은 기준으로 비교해요" />
          <Card pad={18} radius={theme.borderRadius.xxl}>
            <View style={styles.expertHeader}>
              <View style={styles.expertAvatar}>
                <Icon name="person" size={21} color={theme.colors.primary} />
              </View>
              <View style={styles.expertInfo}>
                <Text style={styles.expertName}>김반장 홈케어</Text>
                <View style={styles.expertStats}>
                  <Icon name="star" size={12} color={theme.colors.warning} />
                  <Text style={styles.expertStatsText}>4.8 · 후기 312</Text>
                </View>
              </View>
              <Badge label="작업 확인서" variant="neutral" icon="shield-checkmark" />
            </View>
            <View style={styles.expertQuoteWrap}>
              <Text style={styles.expertQuote}>“사진상 망 손상 중심으로 보여요. 현장에서 바로 부분 교체 가능합니다.”</Text>
            </View>
            <View style={styles.expertDetails}>
              {[
                ['작업 방식', '부분 교체'],
                ['비용 감각', '소규모 작업'],
                ['방문 여부', '사진 기반 확인 가능']
              ].map(([k, v], i, arr) => (
                <View key={k} style={[styles.expertDetailRow, i === arr.length - 1 && styles.noBorder]}>
                  <Text style={styles.expertDetailLabel}>{k}</Text>
                  <Text style={styles.expertDetailValue}>{v}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Trust Guide */}
        <View style={{ marginBottom: 4 }}>
          <SectionTitle title="안심 선택을 돕는 기준" />
          <PressableScale style={styles.trustCard} onPress={() => router.push('/profile')}>
            <View style={styles.trustCircle} />
            <Image source={ASSET.warranty} style={styles.trustImage} />
            <View style={styles.trustContent}>
              <View style={styles.trustHeaderRow}>
                <View style={styles.trustIconWrap}>
                  <Icon name="shield" size={20} color={theme.colors.accent} />
                </View>
                <Text style={styles.trustTitle}>작업 확인서 · 안심 보증</Text>
              </View>
              <Text style={styles.trustDesc}>작업 확인서와 사후관리 조건을 통해 작업 범위와 이후 확인 가능 여부를 함께 비교할 수 있어요.</Text>
              {['작업 전후 사진 기록', '작업 범위 정리', '사후관리 조건 확인'].map((b) => (
                <View key={b} style={styles.trustBullet}>
                  <Icon name="check" size={15} color={theme.colors.accent} />
                  <Text style={styles.trustBulletText}>{b}</Text>
                </View>
              ))}
            </View>
          </PressableScale>
        </View>

        <Text style={styles.footerNote}>고치다 데모 버전 · 실제 시공 계약은 전문가와 직접 진행됩니다</Text>
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    zIndex: 5,
  },
  headerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  headerLogoIcon: {
    width: 26,
    height: 26,
  },
  headerLogoText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  scrollContent: {
    paddingTop: 6,
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  heroWrapper: {
    marginBottom: 16,
  },
  heroBanner: {
    borderRadius: 24, // var(--r-3xl)
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 22,
    overflow: 'hidden',
    ...theme.shadows.primary,
  },
  heroCircle1: {
    position: 'absolute',
    top: -46,
    right: -36,
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -54,
    right: 38,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  heroImage: {
    position: 'absolute',
    top: 14,
    right: -8,
    width: 124,
    height: 124,
    resizeMode: 'contain',
    zIndex: 0,
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: theme.borderRadius.pill,
    paddingVertical: 5,
    paddingHorizontal: 11,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: '#FFF',
    marginTop: 14,
    lineHeight: 31,
  },
  heroDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 8,
    maxWidth: 200,
  },
  heroBtn: {
    marginTop: 18,
    height: 50,
    width: '100%',
    borderRadius: theme.borderRadius.pill,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroBtnText: {
    color: theme.colors.primary,
    fontSize: 15.5,
    fontWeight: '800',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionActionText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  sectionMargin: {
    marginBottom: 22,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  recentIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentTextWrap: {
    flex: 1,
  },
  recentTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
  },
  recentSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  recentBadges: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 14,
  },
  aiPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  aiPreviewIcon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  aiPreviewTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
  },
  aiPreviewSubtitle: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    marginTop: 2,
    fontWeight: '500',
  },
  aiPreviewBody: {
    paddingTop: 4,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  aiPreviewRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  aiPreviewLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    width: 66,
  },
  aiPreviewValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  sectionCaption: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginTop: 10,
    lineHeight: 18,
    paddingHorizontal: 4,
  },
  priceScrollWrapper: {
    marginHorizontal: -24,
  },
  priceScroll: {
    paddingHorizontal: 24,
    paddingVertical: 6,
    gap: 12,
  },
  priceCard: {
    width: PRICE_CARD_WIDTH,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    ...theme.shadows.soft,
  },
  priceImgWrap: {
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 8,
  },
  priceImg: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  priceLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  priceValue: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginTop: 4,
    letterSpacing: -0.4,
  },
  expertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 13,
  },
  expertAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
  },
  expertStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  expertStatsText: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  expertQuoteWrap: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.surfaceSoft,
    paddingLeft: 13,
    marginBottom: 14,
  },
  expertQuote: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  expertDetails: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.borderRadius.l,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  expertDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  expertDetailLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  expertDetailValue: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  trustCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.borderRadius.xxl,
    backgroundColor: theme.colors.premiumDark,
    paddingVertical: 20,
    paddingHorizontal: 22,
    ...theme.shadows.medium,
  },
  trustCircle: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(91,108,255,0.4)',
  },
  trustImage: {
    position: 'absolute',
    right: -6,
    bottom: -8,
    width: 108,
    height: 108,
    resizeMode: 'contain',
    zIndex: 0,
  },
  trustContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 212,
  },
  trustHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  trustIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTitle: {
    ...theme.typography.h3,
    color: '#FFF',
  },
  trustDesc: {
    ...theme.typography.caption,
    color: theme.colors.onDarkSoft,
    lineHeight: 20,
    marginBottom: 14,
  },
  trustBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 9,
  },
  trustBulletText: {
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '500',
  },
  footerNote: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
});
