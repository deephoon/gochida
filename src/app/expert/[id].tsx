import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { buildExperts, ASSET } from '../../data/mockData';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { AppHeader } from '../../components/Header';
import { Skeleton } from '../../components/Skeleton';
import { ProcessBottomNav } from '../../components/ProcessBottomNav';
import { TrustStatsCard } from '../../components/TrustStatsCard';
import { CertificatePreviewCard } from '../../components/CertificatePreviewCard';
import { getAvailabilityColor } from '../../utils/expertDisplay';
import { useRequest } from '../../context/RequestContext';
import { theme } from '../../theme';
import type { ExpertDetailRouteParams } from '../../types';

export default function ExpertDetailScreen() {
  const { id } = useLocalSearchParams() as ExpertDetailRouteParams;
  const rawId = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(true);
  const { analysisResult, setSelectedExpertId, setSelectedExpertName } = useRequest();

  const ex = buildExperts(analysisResult).find((item: any) => item.id === rawId);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [rawId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader title="전문가 상세" onBack={() => router.back()} />
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
          <Skeleton width="50%" height={22} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={14} style={{ marginBottom: 10 }} />
          <Skeleton width="84%" height={14} style={{ marginBottom: 28 }} />
          <Skeleton width="100%" height={150} radius={24} />
        </View>
      </View>
    );
  }

  // 존재하지 않는 id로 진입한 경우 스켈레톤에 머물지 않고 안내 후 돌아갈 수 있게 한다.
  if (!ex) {
    return (
      <View style={styles.container}>
        <AppHeader title="전문가 상세" onBack={() => router.back()} />
        <View style={styles.notFoundWrap}>
          <View style={styles.notFoundIconWrap}>
            <Ionicons name="person-outline" size={32} color={theme.colors.textTertiary} />
          </View>
          <Text style={styles.notFoundTitle}>전문가 정보를 찾을 수 없어요</Text>
          <Text style={styles.notFoundDesc}>응답 목록에서 전문가를 다시 선택해 주세요.</Text>
          <View style={{ alignSelf: 'stretch', marginTop: 28 }}>
            <Button title="응답 목록으로 돌아가기" onPress={() => router.back()} />
          </View>
        </View>
      </View>
    );
  }

  const detail = [
    ['가능 여부', ex.availableLabel, getAvailabilityColor(ex.available)],
    ['작업 방식', ex.workType, theme.colors.textPrimary],
    ['예상 비용', ex.costLevel, theme.colors.textPrimary],
    ['방문 필요', ex.visitLabel, theme.colors.textPrimary],
    ['가능 일정', ex.schedule, theme.colors.textPrimary],
  ];

  // 상담하기: 선택한 전문가를 저장하고 상담 준비 화면으로 이동한다. (단순 Alert로 끝내지 않음)
  const handleRequest = () => {
    setSelectedExpertId(ex.id);
    setSelectedExpertName(ex.expertName);
    router.push(`/consultation/${ex.id}` as any);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="전문가 상세" onBack={() => router.back()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profile */}
        <View style={styles.profileRow}>
          <View style={styles.avatarWrap}>
            <Ionicons name="person" size={28} color={theme.colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.h1} numberOfLines={1}>{ex.expertName}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={theme.colors.warning} />
              <Text style={styles.ratingText}>{ex.rating}</Text>
              <Text style={styles.reviewText}>· 후기 {ex.reviews}개</Text>
            </View>
          </View>
        </View>

        {/* Trust Elements */}
        <View style={styles.trustWrap}>
          {ex.trustElements.map((t: string) => (
            <View key={t} style={styles.trustChip}>
              <Text style={styles.trustChipText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Comment */}
        <Card radius={theme.borderRadius.xxl} style={{ marginTop: 22 }}>
          <Text style={styles.commentLabel}>전문가 소견</Text>
          <Text style={styles.commentText}>“{ex.comment}”</Text>
        </Card>

        {/* Detail Table */}
        <Card radius={theme.borderRadius.xxl} style={{ paddingVertical: 6, paddingHorizontal: 22, marginTop: 12 }}>
          {detail.map(([k, v, c], i) => (
            <View key={k as string} style={[styles.detailRow, i < detail.length - 1 && styles.detailBorder]}>
              <Text style={styles.detailKey}>{k as string}</Text>
              <View style={styles.detailValWrap}>
                {i === 0 && <View style={[styles.detailDot, { backgroundColor: c as string }]} />}
                <Text style={[styles.detailVal, { color: c as string }]}>{v as string}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Warranty info */}
        <Card radius={theme.borderRadius.xxl} style={{ paddingVertical: 6, paddingHorizontal: 22, marginTop: 12 }}>
          <View style={styles.warrantyHeader}>
            <View style={[styles.warrantyIconWrap, { backgroundColor: ex.warranty.available ? theme.colors.successLight : theme.colors.surfaceSoft }]}>
              {ex.warranty.available ? (
                <Image source={ASSET.warranty} style={styles.warrantyImg} />
              ) : (
                <Ionicons name="shield-checkmark" size={20} color={theme.colors.textTertiary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.h3}>{ex.warranty.type === '없음' ? '사후관리 미제공' : ex.warranty.type}</Text>
              {ex.warranty.period && <Text style={styles.warrantyPeriod}>보증 기간 {ex.warranty.period}</Text>}
            </View>
          </View>

          <Text style={[styles.warrantyDesc, { marginBottom: ex.warranty.includedCare.length ? 14 : 0 }]}>
            {ex.warranty.description}
          </Text>

          {ex.warranty.includedCare.map((c: string) => (
            <View key={c} style={styles.careRow}>
              <Ionicons name="checkmark" size={16} color={theme.colors.success} />
              <Text style={styles.careText}>{c}</Text>
            </View>
          ))}

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
              보증·확인서 조건과 책임 범위는 전문가와 직접 협의 후 확정됩니다. 고치다는 중개 정보를 제공하며 시공 결과를 법적으로 보장하지 않습니다.
            </Text>
          </View>
        </Card>

        {/* 신뢰 데이터 섹션 */}
        <Text style={styles.sectionLabel}>신뢰 데이터</Text>
        <TrustStatsCard stats={ex.trustStats} warrantyType={ex.warranty.type} />
        <CertificatePreviewCard expertName={ex.expertName} />

        {/* 상담하기 CTA: 하단 고정 대신 콘텐츠 끝에서 스크롤로 도달해 누른다 */}
        <View style={styles.ctaWrap}>
          <Button
            title="이 전문가와 상담하기"
            onPress={handleRequest}
            leftIcon={<Ionicons name="chatbubble" size={18} color="#FFF" />}
          />
        </View>

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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 130, paddingTop: 16 },

  ctaWrap: { marginTop: 28 },

  sectionLabel: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 2,
    marginLeft: 2,
  },

  notFoundWrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 90,
    paddingHorizontal: 32,
  },
  notFoundIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  notFoundTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  notFoundDesc: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },

  h1: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
  },
  h3: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
  },
  reviewText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },

  trustWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  trustChip: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  trustChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  commentLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    fontWeight: '700',
    marginBottom: 8,
  },
  commentText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 24,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  detailBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  detailKey: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  detailValWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  detailVal: {
    ...theme.typography.bodyStrong,
  },

  warrantyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 14,
  },
  warrantyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warrantyImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  warrantyPeriod: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  warrantyDesc: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 23,
  },
  careRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  careText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  disclaimerBox: {
    marginTop: 8,
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.borderRadius.l,
  },
  disclaimerText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    lineHeight: 18,
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
