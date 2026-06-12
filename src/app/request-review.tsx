import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRequest } from '../context/RequestContext';
import { theme } from '../theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AppHeader } from '../components/Header';
import { ASSET } from '../data/mockData';

function StepIndicator({ current, total, label }: any) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepLabel}>{label}</Text>
      <View style={styles.stepDots}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.stepDot,
              i + 1 === current ? styles.stepDotActive : null
            ]}
          />
        ))}
      </View>
    </View>
  );
}

export default function RequestReviewScreen() {
  const { analysisResult: analysis, setAnalysisResult, location, symptom, imageUris } = useRequest();
  const [memo, setMemo] = useState('');
  const insets = useSafeAreaInsets();

  const a = analysis;
  const s = a ? a.requestDraft.structured : null;
  const docTitle = a ? a.requestDraft.title : '시공 점검 요청';
  const trade = a ? a.tradeCategory : '생활시공';

  const fields = [
    { label: '문제 위치', icon: 'location', value: s ? s.location : `${location || '직접 확인 필요'} · ${symptom || ''}` },
    { label: '의심 원인', icon: 'sparkles', value: s ? s.suspected_issue : '직접 확인 필요' },
    { label: '요청 작업', icon: 'build', value: s ? s.requested_work : '전문가 상담 후 결정' },
  ];
  const memoLen = memo.length;

  // 요청서 완성도: 항목당 20%로 단순 환산해 사용자가 무엇을 보완하면 좋은지 보여준다.
  const checkItems = [
    { label: '문제 위치', done: !!(s?.location || location) },
    { label: '증상 설명', done: !!(s?.symptom || symptom) },
    { label: '사진 근거', done: imageUris.length > 0 },
    { label: '요청 작업 방향', done: !!s?.requested_work },
    { label: '추가 메모', done: memo.trim().length > 0 },
  ];
  const doneItems = checkItems.filter((c) => c.done);
  const score = Math.round((doneItems.length / checkItems.length) * 100);
  const missingHints = memo.trim().length > 0
    ? []
    : (a?.additionalQuestions?.length
        ? a.additionalQuestions.slice(0, 3)
        : ['방문 가능 시간', '문제 크기/범위', '언제부터 발생했는지']);

  // 메모를 요청서 초안(additional_note)에 반영한 뒤 전문가 응답으로 이동한다.
  const handleSubmit = () => {
    const note = memo.trim();
    if (a && note) {
      setAnalysisResult({
        ...a,
        requestDraft: {
          ...a.requestDraft,
          structured: { ...a.requestDraft.structured, additional_note: note },
        },
      });
    }
    router.push('/expert-responses');
  };

  return (
    // AppHeader가 내부에서 insets.top을 처리하므로 SafeAreaView로 감싸면 상단 inset이
    // 이중 적용된다. 다른 화면(upload/analysis)과 동일하게 plain View를 사용한다.
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AppHeader title="요청서 검토" onBack={() => router.back()} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: 24 }}>
            <StepIndicator current={2} total={2} label="요청서 검토" />
          </View>

          <View>
            <Text style={styles.h1}>요청서를 확인해 주세요</Text>
            <Text style={styles.bodyText}>전문가가 한눈에 이해할 수 있도록 정리했어요. 내용을 확인하고 메모를 더해보세요.</Text>

            {/* Completeness card */}
            <Card radius={theme.borderRadius.xxl}>
              <View style={styles.scoreHeader}>
                <Text style={styles.h3}>요청서 완성도</Text>
                <Text style={styles.scoreValue}>{score}%</Text>
              </View>
              <View style={styles.scoreTrack}>
                <View style={[styles.scoreFill, { width: `${score}%` }]} />
              </View>
              <View style={styles.scoreChips}>
                {checkItems.map((c) => (
                  <View key={c.label} style={[styles.scoreChip, c.done ? styles.scoreChipDone : styles.scoreChipTodo]}>
                    <Ionicons
                      name={c.done ? 'checkmark-circle' : 'ellipse-outline'}
                      size={13}
                      color={c.done ? theme.colors.success : theme.colors.textTertiary}
                    />
                    <Text style={[styles.scoreChipText, c.done && styles.scoreChipTextDone]}>{c.label}</Text>
                  </View>
                ))}
              </View>
              {missingHints.length > 0 && (
                <View style={styles.hintBox}>
                  <Text style={styles.hintTitle}>이런 내용을 더하면 좋아요</Text>
                  {missingHints.map((h: string) => (
                    <Text key={h} style={styles.hintText}>· {h}</Text>
                  ))}
                </View>
              )}
            </Card>

            {/* Document card */}
            <Card radius={theme.borderRadius.xxxl} pad={0} style={{ overflow: 'hidden', marginTop: 16 }}>
              {/* header band */}
              <View style={styles.docHeaderBand}>
                <View style={styles.docHeaderCircle} />
                <View style={styles.docHeaderContent}>
                  <View style={styles.docHeaderRow}>
                    <View style={styles.docHeaderLeft}>
                      <View style={styles.docIconWrap}>
                        <Image source={ASSET.aiDraft} style={styles.docIconImg} />
                      </View>
                      <Text style={styles.docDraftText}>AI 요청서 초안</Text>
                    </View>
                    <View style={styles.docTradeBadge}>
                      <Text style={styles.docTradeText}>{trade}</Text>
                    </View>
                  </View>
                  <Text style={styles.docTitleText}>{docTitle}</Text>
                </View>
              </View>
              {/* fields */}
              <View style={styles.docFieldsArea}>
                {fields.map((f, i) => (
                  <View key={f.label} style={[styles.docFieldRow, i < fields.length - 1 && styles.docFieldBorder]}>
                    <View style={styles.docFieldIconWrap}>
                      <Ionicons name={f.icon as any} size={17} color={theme.colors.primary} />
                    </View>
                    <View style={styles.docFieldContent}>
                      <Text style={styles.docFieldLabel}>{f.label}</Text>
                      <Text style={styles.docFieldValue}>{f.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            {/* Memo */}
            <View style={{ marginTop: 16 }}>
              <View style={styles.memoHeader}>
                <Text style={styles.h3}>전문가에게 전하고 싶은 말</Text>
                <Text style={styles.memoCount}>{memoLen}/200</Text>
              </View>
              <Text style={styles.memoSubtitle}>방문 가능 시간이나 상황 설명을 남겨주세요. (선택)</Text>
              <View style={styles.memoInputWrap}>
                <TextInput
                  value={memo}
                  maxLength={200}
                  onChangeText={setMemo}
                  placeholder="예: 평일 저녁이나 주말 오전에 방문 가능합니다."
                  placeholderTextColor={theme.colors.textTertiary}
                  multiline
                  style={styles.memoInput}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerRow}>
              <Ionicons name="information-circle" size={16} color={theme.colors.textTertiary} style={{ marginTop: 1 }} />
              <Text style={styles.disclaimerText}>
                AI가 사진과 입력 정보를 바탕으로 작성한 초안입니다. 최종 작업 범위와 비용은 전문가 상담 후 결정됩니다.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <Button
            title="이대로 전문가에게 요청하기"
            onPress={handleSubmit}
            leftIcon={<Ionicons name="arrow-forward" size={19} color="#FFF" />}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: { flex: 1 },
  scroll: { flex: 1 },
  // paddingBottom은 고정 CTA(버튼 56 + 패딩)보다 충분히 커야 마지막 카드가 가려지지 않는다.
  scrollContent: { paddingTop: 4, paddingHorizontal: 24, paddingBottom: 130 },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.soft,
  },
  stepLabel: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  stepDots: {
    flexDirection: 'row',
    gap: 4,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceSoft,
  },
  stepDotActive: {
    backgroundColor: theme.colors.primary,
    width: 12,
  },

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
    marginBottom: 24,
  },

  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: theme.colors.primary,
  },
  scoreTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceSoft,
    marginTop: 12,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  scoreChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scoreChipDone: {
    backgroundColor: theme.colors.successLight,
  },
  scoreChipTodo: {
    backgroundColor: theme.colors.surfaceSoft,
  },
  scoreChipText: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    fontWeight: '600',
  },
  scoreChipTextDone: {
    color: '#1F8A45',
  },
  hintBox: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.borderRadius.l,
  },
  hintTitle: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    marginBottom: 6,
  },
  hintText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  docHeaderBand: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.premiumDark,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  docHeaderCircle: {
    position: 'absolute',
    top: -40,
    right: -28,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(91,108,255,0.45)',
  },
  docHeaderContent: {
    position: 'relative',
    zIndex: 1,
  },
  docHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  docIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconImg: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  docDraftText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: theme.colors.accent,
    letterSpacing: 0.2,
  },
  docTradeBadge: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  docTradeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFF',
  },
  docTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 16,
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  docFieldsArea: {
    paddingTop: 6,
    paddingHorizontal: 22,
    paddingBottom: 10,
  },
  docFieldRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  docFieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  docFieldIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  docFieldContent: {
    flex: 1,
    paddingTop: 1,
  },
  docFieldLabel: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    fontWeight: '600',
  },
  docFieldValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
    marginTop: 3,
    lineHeight: 22,
  },

  memoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memoCount: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    fontWeight: '500',
  },
  memoSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  memoInputWrap: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    ...theme.shadows.soft,
    padding: 4,
  },
  memoInput: {
    width: '100%',
    minHeight: 104,
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.m,
    padding: 14,
    fontSize: 15,
    lineHeight: 23,
    color: theme.colors.textPrimary,
  },

  disclaimerRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 2,
  },
  disclaimerText: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    lineHeight: 18,
    fontWeight: '500',
    flex: 1,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
