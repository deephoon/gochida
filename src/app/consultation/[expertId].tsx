import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRequest } from '../../context/RequestContext';
import { theme } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AppHeader } from '../../components/Header';
import { ProcessBottomNav } from '../../components/ProcessBottomNav';
import {
  buildExperts,
  buildConsultationPreviewMessage,
  CONSULTATION_CHECKLIST,
} from '../../data/mockData';
import { normalizeAiText } from '../../utils/text';

/**
 * 상담 시작 전 확인 화면.
 * 선택한 전문가 정보 + 전문가가 받게 될 요청서 요약 + 확인서/보증서 가능 여부 +
 * 상담 전 확인 체크리스트 + 첫 메시지 미리보기를 보여준 뒤, 상담을 시작하면
 * 채팅 탭에 해당 전문가 상담방(Mock)을 만든다.
 */
export default function ConsultationReadyScreen() {
  const { expertId } = useLocalSearchParams() as { expertId?: string | string[] };
  const rawId = Array.isArray(expertId) ? expertId[0] : expertId;
  const { analysisResult, location, symptom, startConsultation } = useRequest();

  const ex = useMemo(
    () => buildExperts(analysisResult).find((item: any) => item.id === rawId),
    [analysisResult, rawId]
  );

  if (!ex) {
    return (
      <View style={styles.container}>
        <AppHeader title="상담 준비" onBack={() => router.back()} />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>전문가 정보를 찾을 수 없어요</Text>
          <View style={{ alignSelf: 'stretch', marginTop: 24 }}>
            <Button title="응답 목록으로 돌아가기" onPress={() => router.back()} />
          </View>
        </View>
      </View>
    );
  }

  const requestTitle = analysisResult?.requestDraft?.title || `${location || '집'} ${symptom || '생활시공'} 점검 요청`;
  const previewMessage = buildConsultationPreviewMessage(analysisResult, location, symptom);
  const hasWarranty = ex.warranty.type !== '없음';
  const summaryFields = [
    { label: '문제 위치', value: analysisResult?.requestDraft?.structured?.location || `${location || '직접 확인'} · ${symptom || ''}` },
    { label: '요청 작업', value: analysisResult?.requestDraft?.structured?.requested_work || '전문가 상담 후 결정' },
    { label: '공종', value: analysisResult?.tradeCategory || '생활시공' },
  ];

  const handleStart = () => {
    const roomId = `consult-${ex.id}`;
    startConsultation({
      id: roomId,
      expertId: ex.id,
      expertName: ex.expertName,
      requestTitle,
      warrantyType: ex.warranty.type,
      previewMessage,
    });
    // 채팅 탭으로 이동 (상담방이 목록 상단에 노출됨)
    router.navigate('/chats');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="상담 준비" onBack={() => router.back()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>상담 시작 전 확인해 주세요</Text>
        <Text style={styles.bodyText}>아래 내용으로 {ex.expertName} 전문가에게 상담을 시작할 수 있어요.</Text>

        {/* 선택한 전문가 */}
        <Card radius={theme.borderRadius.xxl} style={{ marginTop: 8 }}>
          <View style={styles.expertRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.expertName} numberOfLines={1}>{ex.expertName}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color={theme.colors.warning} />
                <Text style={styles.ratingText}>{ex.rating}</Text>
                <Text style={styles.reviewText}>· {ex.workType} · {ex.schedule}</Text>
              </View>
            </View>
          </View>
          <View style={styles.warrantyBanner}>
            <Ionicons
              name={hasWarranty ? 'shield-checkmark' : 'shield-outline'}
              size={16}
              color={hasWarranty ? theme.colors.success : theme.colors.textTertiary}
            />
            <Text style={styles.warrantyBannerText}>
              {hasWarranty
                ? `${ex.warranty.type} 발급 가능 · 작업 확인서 ${ex.trustStats?.certificateIssuedCount ?? 0}건 발급 이력`
                : '확인서/보증서 발급 이력은 적은 편이에요. 상담 시 직접 확인해 보세요.'}
            </Text>
          </View>
        </Card>

        {/* 전문가가 받는 요청서 요약 */}
        <Text style={styles.sectionLabel}>전문가가 받는 요청서</Text>
        <Card radius={theme.borderRadius.xxl}>
          <Text style={styles.summaryTitle}>{normalizeAiText(requestTitle)}</Text>
          {summaryFields.map((f, i) => (
            <View key={f.label} style={[styles.summaryRow, i < summaryFields.length - 1 && styles.summaryBorder]}>
              <Text style={styles.summaryKey}>{f.label}</Text>
              <Text style={styles.summaryVal} numberOfLines={2}>{normalizeAiText(f.value)}</Text>
            </View>
          ))}
        </Card>

        {/* 상담 전 확인 체크리스트 */}
        <Text style={styles.sectionLabel}>상담 전 확인하면 좋아요</Text>
        <Card radius={theme.borderRadius.xxl}>
          {CONSULTATION_CHECKLIST.map((c) => (
            <View key={c} style={styles.checkRow}>
              <Ionicons name="ellipse-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.checkText}>{c}</Text>
            </View>
          ))}
        </Card>

        {/* 첫 메시지 미리보기 */}
        <Text style={styles.sectionLabel}>전문가에게 보낼 첫 메시지</Text>
        <Card radius={theme.borderRadius.xxl}>
          <View style={styles.previewBubble}>
            <Text style={styles.previewText}>{previewMessage}</Text>
          </View>
          <Text style={styles.previewHint}>상담을 시작하면 이 메시지가 먼저 전송돼요.</Text>
        </Card>

        <Text style={styles.disclaimer}>
          최종 작업 범위와 비용은 전문가 상담 후 결정됩니다.
        </Text>
      </ScrollView>

      <ProcessBottomNav
        cta={
          <Button
            title="상담 시작하기"
            onPress={handleStart}
            leftIcon={<Ionicons name="chatbubble" size={18} color="#FFF" />}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 230 },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyTitle: { ...theme.typography.h2, color: theme.colors.textPrimary, textAlign: 'center' },

  h1: { ...theme.typography.h1, color: theme.colors.textPrimary },
  bodyText: { ...theme.typography.body, color: theme.colors.textSecondary, marginTop: 8, marginBottom: 16 },

  sectionLabel: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 2,
  },

  expertRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  expertName: { ...theme.typography.h3, color: theme.colors.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  ratingText: { ...theme.typography.caption, fontWeight: '700', color: theme.colors.textPrimary },
  reviewText: { ...theme.typography.caption, color: theme.colors.textTertiary, flex: 1 },
  warrantyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 11,
    paddingHorizontal: 13,
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.borderRadius.m,
  },
  warrantyBannerText: { ...theme.typography.caption, color: theme.colors.textSecondary, flex: 1, lineHeight: 19 },

  summaryTitle: { ...theme.typography.bodyStrong, color: theme.colors.textPrimary, marginBottom: 6 },
  summaryRow: { paddingVertical: 12 },
  summaryBorder: { borderBottomWidth: 1, borderBottomColor: theme.colors.divider },
  summaryKey: { ...theme.typography.small, color: theme.colors.textTertiary, fontWeight: '600', marginBottom: 4 },
  summaryVal: { ...theme.typography.body, color: theme.colors.textPrimary, lineHeight: 23 },

  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  checkText: { ...theme.typography.body, color: theme.colors.textPrimary },

  previewBubble: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.l,
    padding: 15,
  },
  previewText: { ...theme.typography.body, color: theme.colors.primaryDark, lineHeight: 24 },
  previewHint: { ...theme.typography.caption, color: theme.colors.textTertiary, marginTop: 10 },

  disclaimer: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: 18,
    fontWeight: '500',
  },
});
