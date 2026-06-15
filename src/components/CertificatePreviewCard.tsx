import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Card } from './Card';

/**
 * "이 전문가가 발급한 작업 확인서 예시" 미리보기.
 * 작업 확인서에 어떤 항목이 구조화되어 기록되는지 시각적으로 보여준다.
 * (실제 발급 문서가 아니라 항목 구성을 보여주는 예시 카드)
 */
const CERT_ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [
  { icon: 'camera-outline', label: '작업 전 사진', value: '시공 전 상태 기록' },
  { icon: 'images-outline', label: '작업 후 사진', value: '시공 완료 상태 기록' },
  { icon: 'construct-outline', label: '실제 작업 범위', value: '진행한 작업 항목' },
  { icon: 'remove-circle-outline', label: '제외된 작업 범위', value: '이번 시공에서 제외된 항목' },
  { icon: 'calendar-outline', label: '작업 일자', value: '시공 진행 날짜' },
  { icon: 'person-outline', label: '담당 전문가', value: '시공 담당자 정보' },
  { icon: 'checkmark-circle-outline', label: '사용자 확인', value: '완료 확인 서명' },
  { icon: 'shield-outline', label: '사후관리 조건', value: 'A/S 범위와 기간' },
];

export function CertificatePreviewCard({ expertName }: { expertName?: string }) {
  return (
    <Card radius={theme.borderRadius.xxl} style={{ marginTop: 12 }}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={18} color={theme.colors.primary} />
        <Text style={styles.title}>발급 작업 확인서 예시</Text>
      </View>
      <Text style={styles.subtitle}>
        {expertName ? `${expertName} 전문가가 ` : ''}작업 확인서에 기록하는 항목이에요. 작업 범위와 사후관리 조건을 구조화해 남겨요.
      </Text>

      <View style={styles.docFrame}>
        <View style={styles.docTopBar}>
          <Text style={styles.docTopText}>작업 확인서</Text>
          <View style={styles.docStamp}>
            <Ionicons name="checkmark" size={11} color={theme.colors.success} />
            <Text style={styles.docStampText}>기록 항목</Text>
          </View>
        </View>
        {CERT_ITEMS.map((item, i) => (
          <View key={item.label} style={[styles.row, i < CERT_ITEMS.length - 1 && styles.rowBorder]}>
            <Ionicons name={item.icon} size={16} color={theme.colors.textSecondary} style={{ marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.note}>
        예시 항목이며 실제 기록 내용은 작업 후 전문가가 작성합니다.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  docFrame: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    backgroundColor: theme.colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingBottom: 4,
  },
  docTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  docTopText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
  },
  docStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.successLight,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  docStampText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F8A45',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 11,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  rowLabel: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  rowValue: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  note: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    marginTop: 12,
    lineHeight: 17,
  },
});
