import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/Button';
import { theme } from '../../theme';
import { ExpertResponse } from '../../types';
import { fetchExpertResponseDetail } from '../../services/expertService';
import { getAvailableColor } from '../../utils/expertDisplay';

export default function ExpertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [expert, setExpert] = useState<ExpertResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchExpertResponseDetail(id);
        if (!cancelled && data) setExpert(data);
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="small" color={theme.colors.textTertiary} />
      </View>
    );
  }

  if (!expert) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>전문가 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const handleConsult = () => {
    Alert.alert('안내', '상담하기 기능은 MVP 범위 외입니다.');
  };

  const rows: { label: string; value: string; highlight?: boolean }[] = [
    {
      label: '가능 여부',
      value: typeof expert.available === 'boolean' ? (expert.available ? '가능' : '불가') : String(expert.available),
      highlight: true,
    },
    { label: '사전 방문', value: expert.visitRequired ? '방문 확인 필요' : '방문 없이 바로 시공' },
    { label: '작업 방식', value: expert.workType },
    { label: '예상 비용', value: expert.costLevel },
    { label: '가능 일정', value: expert.schedule },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.expertName}>{expert.expertName}</Text>
          <Text style={styles.rating}>★ {expert.rating}</Text>
        </View>

        <View style={styles.commentBlock}>
          <Text style={styles.commentLabel}>전문가 소견</Text>
          <Text style={styles.comment}>“{expert.comment}”</Text>
        </View>

        <View style={styles.detailsCard}>
          {rows.map((row, i) => (
            <View
              key={row.label}
              style={[styles.detailRow, i < rows.length - 1 && styles.detailRowDivider]}
            >
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text
                style={[
                  styles.detailValue,
                  row.highlight && {
                    color: getAvailableColor(expert.available),
                    fontWeight: '700',
                  },
                ]}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button title="이 전문가와 상담하기" onPress={handleConsult} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  centered: { justifyContent: 'center', alignItems: 'center', padding: theme.spacing.l },
  scroll: { flex: 1, padding: theme.spacing.l },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.l,
  },
  expertName: { ...theme.typography.display, color: theme.colors.textPrimary },
  rating: { ...theme.typography.bodyStrong, color: theme.colors.textPrimary },

  commentBlock: { marginBottom: theme.spacing.xl },
  commentLabel: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: theme.spacing.s,
    fontWeight: '700',
  },
  comment: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },

  detailsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.l,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
  },
  detailRowDivider: { borderBottomWidth: 1, borderBottomColor: theme.colors.divider },
  detailLabel: { ...theme.typography.body, color: theme.colors.textSecondary },
  detailValue: { ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '500' },

  emptyText: { ...theme.typography.body, color: theme.colors.textSecondary },

  footer: {
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
});
