import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, IconName } from '../../components/Icon';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { useRequestFlow } from '../../hooks/useRequestFlow';
import { useRequest } from '../../context/RequestContext';
import {
  PRICE_PREVIEW,
  ASSET,
  HOME_CATEGORIES,
  HOME_STATS,
  HOME_PROMOS,
  RECOMMENDED_EXPERTS,
  HOME_REVIEWS,
  HOME_TIPS,
  ACTIVE_REQUEST,
} from '../../data/mockData';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { PressableScale } from '../../components/ui/PressableScale';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 24;
const CONTENT_WIDTH = SCREEN_WIDTH - H_PADDING * 2;
const GRID_GAP = 12;
const CATEGORY_W = (CONTENT_WIDTH - GRID_GAP * 3) / 4;
const PRICE_CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.42, 170);
const PROMO_WIDTH = SCREEN_WIDTH - H_PADDING * 2;
const EXPERT_CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.62, 250);
const REVIEW_CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return '늦은 시간까지 고생 많으세요';
  if (h < 12) return '좋은 아침이에요';
  if (h < 18) return '오늘도 안녕하세요';
  return '편안한 저녁이에요';
}

function SectionTitle({ title, caption, action, onAction }: { title: string; caption?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionTitleContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {caption && <Text style={styles.sectionTitleCaption}>{caption}</Text>}
      </View>
      {action && (
        <Pressable onPress={onAction} style={styles.sectionAction} hitSlop={8}>
          <Text style={styles.sectionActionText}>{action}</Text>
          <Icon name="chevronR" size={14} color={theme.colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1.5 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={size} color={i <= Math.round(rating) ? theme.colors.warning : theme.colors.border} />
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const { startNewRequest } = useRequestFlow();
  const { clearRequest, setLocation, setSymptom } = useRequest();

  const handleCategory = (cat: typeof HOME_CATEGORIES[number]) => {
    clearRequest();
    if (cat.preset) {
      if (cat.preset.location) setLocation(cat.preset.location);
      if (cat.preset.symptom) setSymptom(cat.preset.symptom);
    }
    router.push('/upload');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Greeting Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerLogoRow}>
            <Image source={require('../../../assets/images/hero.png')} style={styles.headerLogoIcon} />
            <Text style={styles.headerLogoText}>고치다</Text>
          </View>
          <Text style={styles.headerGreeting}>{greeting()} 👋</Text>
        </View>
        <Pressable style={styles.bellBtn} onPress={() => router.push('/profile')} hitSlop={8}>
          <Icon name="bell" size={21} color={theme.colors.textPrimary} />
          <View style={styles.bellDot} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Quick search-style entry */}
        <PressableScale style={styles.searchBar} onPress={startNewRequest}>
          <Icon name="camera" size={19} color={theme.colors.primary} />
          <Text style={styles.searchText}>어떤 곳을 고쳐볼까요? 사진으로 시작</Text>
          <View style={styles.searchSparkle}>
            <Icon name="sparkle" size={14} color="#FFF" />
          </View>
        </PressableScale>

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

        {/* Category Grid */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="무엇을 고쳐드릴까요?" caption="자주 찾는 작업으로 빠르게 시작해요" />
          <View style={styles.categoryGrid}>
            {HOME_CATEGORIES.map((cat) => (
              <PressableScale key={cat.key} style={styles.categoryItem} onPress={() => handleCategory(cat)}>
                <View style={[styles.categoryIconWrap, { backgroundColor: cat.bg }]}>
                  <Icon name={cat.icon as IconName} size={24} color={cat.tint} />
                </View>
                <Text style={styles.categoryLabel} numberOfLines={1}>{cat.label}</Text>
              </PressableScale>
            ))}
          </View>
        </View>

        {/* Active Request Tracker */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="진행 중인 요청" action="전체 보기" onAction={() => router.push('/history')} />
          <Card pad={18} radius={theme.borderRadius.xxl} onPress={() => router.push('/expert-responses')}>
            <View style={styles.trackerHead}>
              <View style={styles.trackerIconWrap}>
                <Icon name="image" size={22} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.trackerTitle} numberOfLines={1}>{ACTIVE_REQUEST.title}</Text>
                <Text style={styles.trackerSub}>전문가 응답 {ACTIVE_REQUEST.responses}건 · {ACTIVE_REQUEST.tradeCategory}</Text>
              </View>
              <Icon name="chevronR" size={18} color={theme.colors.textTertiary} />
            </View>

            {/* Stepper */}
            <View style={styles.stepper}>
              {ACTIVE_REQUEST.steps.map((label, i) => {
                const done = i < ACTIVE_REQUEST.currentStep;
                const current = i === ACTIVE_REQUEST.currentStep;
                const active = done || current;
                return (
                  <React.Fragment key={label}>
                    <View style={styles.stepNodeWrap}>
                      <View style={[styles.stepNode, active && styles.stepNodeActive, current && styles.stepNodeCurrent]}>
                        {done ? (
                          <Icon name="check" size={12} color="#FFF" strokeWidth={2.6} />
                        ) : (
                          <Text style={[styles.stepNodeText, current && { color: '#FFF' }]}>{i + 1}</Text>
                        )}
                      </View>
                      <Text style={[styles.stepLabel, active && styles.stepLabelActive]} numberOfLines={1}>{label}</Text>
                    </View>
                    {i < ACTIVE_REQUEST.steps.length - 1 && (
                      <View style={[styles.stepLine, i < ACTIVE_REQUEST.currentStep && styles.stepLineActive]} />
                    )}
                  </React.Fragment>
                );
              })}
            </View>

            <View style={styles.trackerEta}>
              <Icon name="clock" size={14} color={theme.colors.primary} />
              <Text style={styles.trackerEtaText}>{ACTIVE_REQUEST.etaText}</Text>
            </View>
          </Card>
        </View>

        {/* Trust Stats Strip */}
        <View style={styles.statsStrip}>
          {HOME_STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < HOME_STATS.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Promotions */}
        <View style={styles.sectionMargin}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={PROMO_WIDTH + 12}
            decelerationRate="fast"
            style={styles.bleedScroll}
            contentContainerStyle={styles.bleedScrollContent}
          >
            {HOME_PROMOS.map((p) => (
              <PressableScale key={p.id} onPress={startNewRequest}>
                <LinearGradient colors={p.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.promoCard, { width: PROMO_WIDTH }]}>
                  <View style={styles.promoIconBg}>
                    <Icon name={p.icon as IconName} size={66} color="rgba(255,255,255,0.18)" />
                  </View>
                  <View style={styles.promoBadge}>
                    <Text style={styles.promoBadgeText}>{p.badge}</Text>
                  </View>
                  <Text style={styles.promoTitle}>{p.title}</Text>
                  <Text style={styles.promoDesc}>{p.desc}</Text>
                </LinearGradient>
              </PressableScale>
            ))}
          </ScrollView>
        </View>

        {/* AI Preview */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="AI 요청서는 이렇게 정리돼요" />
          <Card pad={0} radius={theme.borderRadius.xxl} style={{ overflow: 'hidden' }}>
            <View style={styles.aiPreviewHeader}>
              <Image source={ASSET.aiDraft} style={styles.aiPreviewIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.aiPreviewTitle}>AI 요청서 미리보기</Text>
                <Text style={styles.aiPreviewSubtitle}>예시 · 베란다 방충망</Text>
              </View>
              <Badge label="자동 생성" variant="primary" icon="sparkle" />
            </View>
            <View style={styles.aiPreviewBody}>
              {[
                ['위치', '베란다'],
                ['증상', '파손/고장'],
                ['공종 후보', '방충망/창호'],
                ['요청 작업', '망 교체 또는 프레임 확인'],
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
          <SectionTitle title="참고 시공 단가" caption="시작 전 비용 감각을 잡아보세요" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleedScroll} contentContainerStyle={styles.bleedScrollContent}>
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

        {/* Recommended Experts */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="우리 동네 추천 전문가" caption="평점·후기·보증 기준으로 선별했어요" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleedScroll} contentContainerStyle={styles.bleedScrollContent}>
            {RECOMMENDED_EXPERTS.map((e) => (
              <PressableScale key={e.id} style={[styles.expertCard, { width: EXPERT_CARD_WIDTH }]} onPress={() => router.push(`/expert/${e.id}`)}>
                <View style={styles.expertCardTop}>
                  <View style={styles.expertCardAvatar}>
                    <Icon name="user" size={24} color={theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.expertCardName} numberOfLines={1}>{e.name}</Text>
                    <Text style={styles.expertCardTrade} numberOfLines={1}>{e.trade} · 경력 {e.career}년</Text>
                  </View>
                </View>
                <View style={styles.expertCardRating}>
                  <Stars rating={e.rating} />
                  <Text style={styles.expertCardRatingText}>{e.rating.toFixed(1)}</Text>
                  <Text style={styles.expertCardReviews}>후기 {e.reviews}</Text>
                </View>
                <View style={styles.expertCardMeta}>
                  <Icon name="pin" size={13} color={theme.colors.textTertiary} />
                  <Text style={styles.expertCardArea} numberOfLines={1}>{e.area}</Text>
                </View>
                <View style={styles.expertCardTags}>
                  <Badge label={e.tag} variant={e.tagType} />
                  <Badge label={e.badge} variant="neutral" icon="shield-checkmark" />
                </View>
              </PressableScale>
            ))}
          </ScrollView>
        </View>

        {/* Reviews */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="실시간 시공 후기" action="더보기" onAction={() => Alert.alert('후기', '실제 서비스에서는 전체 시공 후기를 확인할 수 있어요.')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleedScroll} contentContainerStyle={styles.bleedScrollContent}>
            {HOME_REVIEWS.map((r) => (
              <View key={r.id} style={[styles.reviewCard, { width: REVIEW_CARD_WIDTH }]}>
                <View style={styles.reviewHead}>
                  <Stars rating={r.rating} size={13} />
                  <Text style={styles.reviewTime}>{r.time}</Text>
                </View>
                <View style={styles.reviewQuoteWrap}>
                  <Icon name="quote" size={18} color={theme.colors.primaryLight} />
                  <Text style={styles.reviewText} numberOfLines={3}>{r.text}</Text>
                </View>
                <View style={styles.reviewFooter}>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <Text style={styles.reviewTrade}>· {r.trade}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Tips */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="생활 시공 꿀팁" caption="직접 확인하고 안전하게 대처해요" />
          <Card pad={6} radius={theme.borderRadius.xxl} style={{ paddingHorizontal: 8 }}>
            {HOME_TIPS.map((t, i) => (
              <Pressable
                key={t.id}
                style={[styles.tipRow, i < HOME_TIPS.length - 1 && styles.tipRowBorder]}
                onPress={() => Alert.alert(t.title, '실제 서비스에서는 상세 가이드 콘텐츠를 제공합니다.')}
              >
                <View style={[styles.tipIconWrap, { backgroundColor: t.bg }]}>
                  <Icon name={t.icon as IconName} size={20} color={t.tint} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tipCategory}>{t.category} · 읽기 {t.readTime}</Text>
                  <Text style={styles.tipTitle} numberOfLines={2}>{t.title}</Text>
                </View>
                <Icon name="chevronR" size={17} color={theme.colors.textTertiary} />
              </Pressable>
            ))}
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
  headerGreeting: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
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
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.danger,
    borderWidth: 1.5,
    borderColor: theme.colors.surface,
  },
  scrollContent: {
    paddingTop: 6,
    paddingHorizontal: H_PADDING,
    paddingBottom: 110,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingLeft: 16,
    paddingRight: 6,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.surface,
    marginBottom: 16,
    ...theme.shadows.soft,
  },
  searchText: {
    flex: 1,
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  searchSparkle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroWrapper: {
    marginBottom: 24,
  },
  heroBanner: {
    borderRadius: 24,
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 4,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  sectionTitleCaption: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    marginTop: 3,
    fontWeight: '500',
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingTop: 2,
  },
  sectionActionText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  sectionMargin: {
    marginBottom: 26,
  },
  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
    columnGap: GRID_GAP,
  },
  categoryItem: {
    width: CATEGORY_W,
    alignItems: 'center',
    gap: 8,
  },
  categoryIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    letterSpacing: -0.2,
  },
  // Tracker
  trackerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  trackerIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
  },
  trackerSub: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
    paddingHorizontal: 2,
  },
  stepNodeWrap: {
    alignItems: 'center',
    width: 58,
  },
  stepNode: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepNodeActive: {
    backgroundColor: theme.colors.primary,
  },
  stepNodeCurrent: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryLight,
  },
  stepNodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textTertiary,
  },
  stepLabel: {
    fontSize: 10.5,
    color: theme.colors.textTertiary,
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.surfaceSoft,
    marginTop: 12,
    marginHorizontal: -6,
  },
  stepLineActive: {
    backgroundColor: theme.colors.primary,
  },
  trackerEta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 18,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.m,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  trackerEtaText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    fontWeight: '600',
    flex: 1,
  },
  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    paddingVertical: 18,
    marginBottom: 26,
    ...theme.shadows.soft,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.divider,
  },
  // Bleed scrolls (horizontal lists that extend to screen edges)
  bleedScroll: {
    marginHorizontal: -H_PADDING,
  },
  bleedScrollContent: {
    paddingHorizontal: H_PADDING,
    paddingVertical: 6,
    gap: 12,
  },
  // Promo
  promoCard: {
    borderRadius: theme.borderRadius.xxl,
    paddingVertical: 22,
    paddingHorizontal: 22,
    overflow: 'hidden',
    minHeight: 116,
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  promoIconBg: {
    position: 'absolute',
    right: 8,
    bottom: -6,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: theme.borderRadius.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  promoBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.2,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.4,
  },
  promoDesc: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 5,
    maxWidth: '82%',
    lineHeight: 18,
  },
  // AI preview
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
  // Price
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
  // Expert cards
  expertCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    ...theme.shadows.soft,
  },
  expertCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 12,
  },
  expertCardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expertCardName: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
  },
  expertCardTrade: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  expertCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  expertCardRatingText: {
    ...theme.typography.caption,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  expertCardReviews: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
  },
  expertCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  expertCardArea: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    flex: 1,
  },
  expertCardTags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  // Reviews
  reviewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: 18,
    ...theme.shadows.soft,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewTime: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
  },
  reviewQuoteWrap: {
    gap: 6,
    marginBottom: 12,
  },
  reviewText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewName: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  reviewTrade: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
  },
  // Tips
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  tipRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  tipIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCategory: {
    ...theme.typography.small,
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: 3,
  },
  tipTitle: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    lineHeight: 19,
  },
  // Trust card (premium dark)
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
