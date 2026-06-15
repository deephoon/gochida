import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { buildExperts, ASSET } from '../data/mockData';
import { theme } from '../theme';
import { useRequest } from '../context/RequestContext';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { AppHeader } from '../components/Header';
import { Skeleton } from '../components/Skeleton';
import { ProcessBottomNav } from '../components/ProcessBottomNav';
import { getAvailabilityColor, getAvailabilityBg } from '../utils/expertDisplay';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExpertResponsesScreen() {
  const { setSelectedExpertId, analysisResult } = useRequest();
  const [loading, setLoading] = useState(true);
  // 분석 결과의 공종(tradeCategory)을 반영해 전문가 응답을 구성한다.
  const experts = useMemo(() => buildExperts(analysisResult), [analysisResult]);
  const maxRating = experts.reduce((m: number, e: any) => Math.max(m, e.rating), 0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (id: string) => {
    setSelectedExpertId(id);
    router.push(`/expert/${id}`);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="전문가 응답 비교" onBack={() => router.back()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View>
            <Text style={styles.h1}>응답을 모으는 중</Text>
            <Text style={styles.bodyText}>믿을 수 있는 전문가 3-5명에게 요청을 보내고 있어요.</Text>
            {[0, 1, 2].map((i) => (
              <Card key={i} radius={theme.borderRadius.xxl} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <Skeleton width={44} height={44} radius={22} />
                  <View style={{ flex: 1 }}>
                    <Skeleton width="40%" height={14} style={{ marginBottom: 8 }} />
                    <Skeleton width="58%" height={12} />
                  </View>
                </View>
                <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
                <Skeleton width="78%" height={12} />
              </Card>
            ))}
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              {/* Spinning loader could go here */}
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.heroRow}>
              <View style={styles.heroTextCol}>
                <Text style={styles.h1}>전문가 {experts.length}명이 응답했어요</Text>
                <Text style={styles.bodyText}>작업 방식과 보증 조건을 같은 기준으로 비교해 보세요.</Text>
              </View>
              <Image source={ASSET.expertCards} style={styles.heroImg} />
            </View>

            <View style={styles.filterRow}>
              <View style={styles.filterChip}>
                <Ionicons name="sparkles" size={13} color={theme.colors.primary} />
                <Text style={styles.filterChipText}>정렬 · 추천순</Text>
              </View>
              <Text style={styles.filterHint}>모두 같은 요청서 기준</Text>
            </View>

            {experts.map((ex: any) => {
              const isTop = ex.rating >= maxRating;
              const hasWarranty = ex.warranty.type !== '없음';
              const ts = ex.trustStats || {};
              const tiles = [
                ['작업 방식', ex.workType, 'build'],
                ['비용 감각', ex.costLevel, 'flash'],
                ['방문 여부', ex.visitRequired ? '방문 확인' : '사진 확인', 'location'],
              ];
              // 신뢰 미니 지표: 가격보다 먼저, 발급 이력을 리뷰처럼 노출한다.
              const trustPills = [
                ts.certificateIssuedCount != null && { icon: 'document-text', text: `작업 확인서 ${ts.certificateIssuedCount}건` },
                ts.warrantyIssuedCount != null && ts.warrantyIssuedCount > 0 && { icon: 'shield-checkmark', text: `안심 보증서 ${ts.warrantyIssuedCount}건` },
                ts.afterCareResponseRate != null && { icon: 'chatbubbles', text: `사후관리 응답 ${ts.afterCareResponseRate}%` },
              ].filter(Boolean) as { icon: string; text: string }[];

              return (
                <Card key={ex.id} radius={theme.borderRadius.xxxl} pad={0} style={styles.cardWrapper} onPress={() => handleSelect(ex.id)}>
                  {/* Head */}
                    <View style={styles.cardHead}>
                      <View style={styles.cardHeadRow}>
                        <View style={styles.avatarWrap}>
                          {isTop ? (
                            <LinearGradient colors={['#6E7BFF', theme.colors.primary]} style={styles.avatarGradient}>
                              <View style={styles.avatarInner}>
                                <Ionicons name="person" size={24} color={theme.colors.primary} />
                              </View>
                            </LinearGradient>
                          ) : (
                            <View style={[styles.avatarGradient, { backgroundColor: theme.colors.surfaceSoft }]}>
                              <View style={styles.avatarInner}>
                                <Ionicons name="person" size={24} color={theme.colors.primary} />
                              </View>
                            </View>
                          )}
                        </View>
                        <View style={styles.nameCol}>
                          <View style={styles.nameRow}>
                            <Text style={styles.nameText} numberOfLines={1}>{ex.expertName}</Text>
                            {isTop && (
                              <View style={styles.recommendBadge}>
                                <Text style={styles.recommendBadgeText}>추천</Text>
                              </View>
                            )}
                          </View>
                          <View style={styles.ratingRow}>
                            <Ionicons name="star" size={13} color={theme.colors.warning} />
                            <Text style={styles.ratingText}>{ex.rating}</Text>
                            <Text style={styles.reviewText}>· 후기 {ex.reviews}</Text>
                          </View>
                        </View>
                        <View style={[styles.availBadge, { backgroundColor: getAvailabilityBg(ex.available) }]}>
                          <View style={[styles.availDot, { backgroundColor: getAvailabilityColor(ex.available) }]} />
                          <Text style={[styles.availText, { color: getAvailabilityColor(ex.available) }]}>
                            {ex.available ? '작업 가능' : '확인 필요'}
                          </Text>
                        </View>
                      </View>
                      
                      {/* 신뢰 지표 미니 영역 (가격보다 먼저, 발급 이력을 리뷰처럼 노출) */}
                      {trustPills.length > 0 && (
                        <View style={styles.trustPillRow}>
                          {trustPills.map((p) => (
                            <View key={p.text} style={styles.trustPill}>
                              <Ionicons name={p.icon as any} size={12} color={theme.colors.primary} />
                              <Text style={styles.trustPillText}>{p.text}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Comment Bubble */}
                      <View style={styles.commentBubble}>
                        <Text style={styles.commentText} numberOfLines={3}>“{ex.comment}”</Text>
                      </View>
                    </View>

                    {/* Stat Tiles */}
                    <View style={styles.statsGrid}>
                      {tiles.map(([k, v, icon]) => (
                        <View key={k as string} style={styles.statTile}>
                          <View style={styles.statTileHeader}>
                            <Ionicons name={icon as any} size={12} color={theme.colors.textTertiary} />
                            <Text style={styles.statTileLabel}>{k as string}</Text>
                          </View>
                          <Text style={styles.statTileValue}>{v as string}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Warranty / Trust Strip */}
                    <View style={styles.warrantyStrip}>
                      <Ionicons name="checkmark-done" size={17} color={hasWarranty ? theme.colors.success : theme.colors.textTertiary} />
                      <Text style={styles.warrantyText} numberOfLines={1}>
                        {hasWarranty
                          ? `${ex.warranty.type} 제공 · 확인 완료 ${ts.completedJobs ?? 0}건`
                          : `확인 완료 ${ts.completedJobs ?? 0}건 · 확인서 발급은 적어요`}
                      </Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailText}>상세 보기</Text>
                        <Ionicons name="chevron-forward" size={15} color={theme.colors.primary} />
                      </View>
                    </View>
                </Card>
              );
            })}
            
            <Text style={styles.bottomDisclaimer}>최종 작업 범위와 비용은 전문가 상담 후 결정됩니다.</Text>
          </View>
        )}
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },

  h1: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
  },
  bodyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: 6,
    marginBottom: 24,
  },

  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  heroTextCol: {
    flex: 1,
  },
  heroImg: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterHint: {
    fontSize: 12.5,
    fontWeight: '500',
    color: theme.colors.textTertiary,
  },

  cardWrapper: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHead: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  cardHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    padding: 2,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  nameText: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  recommendBadge: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  recommendBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  ratingText: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  reviewText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availText: {
    fontSize: 12,
    fontWeight: '700',
  },
  trustPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 13,
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  trustPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: -0.2,
  },
  commentBubble: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.borderRadius.l,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginTop: 14,
  },
  commentText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 23,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  statTile: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.borderRadius.m,
    paddingVertical: 11,
    paddingHorizontal: 10,
  },
  statTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  statTileLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: theme.colors.textTertiary,
  },
  statTileValue: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '700',
    lineHeight: 17,
  },
  warrantyStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  warrantyText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '700',
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  bottomDisclaimer: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
});
