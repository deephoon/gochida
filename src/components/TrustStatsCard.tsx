import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Card } from './Card';
import type { TrustStats, WarrantyType } from '../types';

/**
 * 전문가 신뢰 데이터 섹션.
 * 별점 외에 작업 확인서·보증서 발급 이력과 사후관리 응답률을 리뷰처럼 누적 지표로 보여준다.
 * (법적 보장이 아니라 작업 기록·사후관리 가능성을 판단하는 "참고 지표"임을 문구로 명확히 한다.)
 */
export function TrustStatsCard({
  stats,
  warrantyType,
}: {
  stats?: TrustStats;
  warrantyType?: WarrantyType;
}) {
  if (!stats) return null;

  const tiles: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; accent?: boolean }[] = [
    { icon: 'document-text', label: '작업 확인서', value: `${stats.certificateIssuedCount}건`, accent: true },
    { icon: 'shield-checkmark', label: '안심 보증서', value: `${stats.warrantyIssuedCount}건`, accent: true },
    { icon: 'checkmark-done', label: '확인 완료 작업', value: `${stats.completedJobs}건` },
    { icon: 'chatbubbles', label: '사후관리 응답률', value: `${stats.afterCareResponseRate}%` },
  ];

  return (
    <Card radius={theme.borderRadius.xxl} style={{ marginTop: 12 }}>
      <View style={styles.header}>
        <Ionicons name="ribbon" size={18} color={theme.colors.primary} />
        <Text style={styles.title}>확인서 기반 신뢰 지표</Text>
      </View>

      <View style={styles.grid}>
        {tiles.map((t) => (
          <View key={t.label} style={styles.tile}>
            <View style={styles.tileHeader}>
              <Ionicons name={t.icon} size={14} color={t.accent ? theme.colors.primary : theme.colors.textTertiary} />
              <Text style={styles.tileLabel}>{t.label}</Text>
            </View>
            <Text style={[styles.tileValue, t.accent && { color: theme.colors.primary }]}>{t.value}</Text>
          </View>
        ))}
      </View>

      {(stats.recentCertificateCount != null || stats.verifiedJobRatio != null) && (
        <View style={styles.recentRow}>
          {stats.recentCertificateCount != null && (
            <View style={styles.recentChip}>
              <Ionicons name="time-outline" size={13} color={theme.colors.textSecondary} />
              <Text style={styles.recentText}>
                최근 30일 확인서 발급 {stats.recentCertificateCount}건
                {stats.recentCertificateIssuedAt ? ` · 최근 ${stats.recentCertificateIssuedAt}` : ''}
              </Text>
            </View>
          )}
          {stats.verifiedJobRatio != null && (
            <View style={styles.recentChip}>
              <Ionicons name="bar-chart-outline" size={13} color={theme.colors.textSecondary} />
              <Text style={styles.recentText}>확인서 기반 검증 작업 {stats.verifiedJobRatio}%</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          {warrantyType === '없음'
            ? '아직 발급 이력이 적은 전문가예요. 작업 방식과 사후관리 조건을 함께 비교해 보세요.'
            : '발급 이력이 많을수록 작업 기록이 축적된 전문가예요. 작업 확인서 발급 이력은 작업 기록과 사후관리 가능성을 판단하는 참고 지표입니다.'}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.borderRadius.l,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textTertiary,
  },
  tileValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: theme.colors.textPrimary,
  },
  recentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  recentText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  noteBox: {
    marginTop: 14,
    paddingVertical: 11,
    paddingHorizontal: 13,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.m,
  },
  noteText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    lineHeight: 20,
  },
});
