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
import { router } from 'expo-router';
import { Button } from '../components/Button';
import { StepIndicator } from '../components/StepIndicator';
import { useRequest } from '../context/RequestContext';
import { theme } from '../theme';

export default function RequestReviewScreen() {
  const { analysisResult, imageUris, location, symptom } = useRequest();
  const [userNote, setUserNote] = useState('');

  const draft = analysisResult?.requestDraft?.structured || {
    location: location || '거실',
    symptom: symptom || '누수',
    suspected_issue: analysisResult?.problemCandidate || '직접 확인 필요',
    requested_work: analysisResult?.actionRecommendation || '전문가 상담 후 결정',
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator current={2} total={3} label="요청서 검토" />

        <Text style={styles.mainTitle}>전문가에게 보낼 요청서</Text>
        <Text style={styles.subtitle}>아래 내용을 확인하고 필요하면 메모를 추가하세요.</Text>

        {imageUris.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {imageUris.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.thumbnail} />
            ))}
          </ScrollView>
        )}

        <View style={styles.kvCard}>
          {[
            { label: '문제 위치', value: `${draft.location || '-'} · ${draft.symptom || '-'}` },
            { label: '의심 원인', value: draft.suspected_issue },
            { label: '요청 작업', value: draft.requested_work },
          ].map((row, i, arr) => (
            <View key={row.label} style={[styles.kvRow, i < arr.length - 1 && styles.kvRowDivider]}>
              <Text style={styles.kvLabel}>{row.label}</Text>
              <Text style={styles.kvValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.fieldLabel}>전문가에게 추가로 전하고 싶은 말</Text>
        <Text style={styles.fieldHint}>방문 가능 시간이나 상황 설명을 남겨주세요</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="예) 평일 오후 2시 이후 방문 가능합니다."
          placeholderTextColor={theme.colors.textTertiary}
          value={userNote}
          onChangeText={setUserNote}
          textAlignVertical="top"
        />

        <Text style={styles.notice}>
          AI가 사진과 입력 정보를 바탕으로 작성한 초안입니다. 최종 작업 범위와 비용은 전문가
          상담 후 결정됩니다.
        </Text>

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="이대로 전문가에게 요청하기"
          onPress={() => router.push('/expert-responses')}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: theme.spacing.l },

  mainTitle: { fontSize: 28, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: theme.spacing.s },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.l,
  },

  imageScroll: {
    flexDirection: 'row',
    marginBottom: theme.spacing.l,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: theme.spacing.s,
    backgroundColor: theme.colors.border,
  },

  kvCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.xl,
  },
  kvRow: { paddingVertical: theme.spacing.m },
  kvRowDivider: { borderBottomWidth: 1, borderBottomColor: theme.colors.divider },
  kvLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.textTertiary, marginBottom: 4 },
  kvValue: { fontSize: 16, color: theme.colors.textPrimary, lineHeight: 22 },

  fieldLabel: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 4 },
  fieldHint: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.s,
  },
  input: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 16,
    padding: theme.spacing.l,
    minHeight: 120,
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.l,
  },

  notice: {
    fontSize: 12,
    color: theme.colors.textTertiary,
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
