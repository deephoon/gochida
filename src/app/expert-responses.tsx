import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Badge } from '../components/Badge';
import { Skeleton } from '../components/Skeleton';
import { theme } from '../theme';
import { ExpertResponse } from '../types';
import { fetchExpertResponses } from '../services/expertService';

export default function ExpertResponsesScreen() {
  const [responses, setResponses] = useState<ExpertResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExpertResponses('req-1').then(data => {
      setResponses(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.scroll}>
          <Text style={styles.mainTitle}>응답을 모으는 중</Text>
          <Text style={styles.subtitle}>믿을 수 있는 전문가 3-5명에게 요청을 보내고 있어요</Text>
          {[0, 1, 2].map(i => (
            <View key={i} style={styles.cardSkeleton}>
              <Skeleton width="40%" height={18} />
              <View style={{ height: 8 }} />
              <Skeleton width="60%" height={12} />
              <View style={{ height: 16 }} />
              <Skeleton width="100%" height={12} />
              <View style={{ height: 6 }} />
              <Skeleton width="80%" height={12} />
            </View>
          ))}
          <ActivityIndicator color={theme.colors.textTertiary} style={{ marginTop: theme.spacing.l }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>전문가 응답 {responses.length}건</Text>
        <Text style={styles.subtitle}>가격뿐 아니라 작업 방식과 보증 여부도 함께 비교하세요</Text>

        {responses.map(expert => (
          <TouchableOpacity
            key={expert.id}
            activeOpacity={0.85}
            style={styles.card}
            onPress={() => router.push(`/expert/${expert.id}`)}
          >
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.expertName}>{expert.expertName}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>★ {expert.rating}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>{expert.workType}</Text>
                </View>
              </View>
              {expert.warranty?.available && (
                <Badge label={expert.warranty.type} variant="success" />
              )}
            </View>

            <View style={styles.kvGrid}>
              <View style={styles.kvCol}>
                <Text style={styles.kvLabel}>비용 감각</Text>
                <Text style={styles.kvValue}>{expert.costLevel}</Text>
              </View>
              <View style={styles.kvCol}>
                <Text style={styles.kvLabel}>방문</Text>
                <Text style={styles.kvValue}>
                  {expert.visitRequired ? '현장 확인 필수' : '사진으로 가능'}
                </Text>
              </View>
            </View>

            <Text style={styles.comment} numberOfLines={2}>
              “{expert.comment}”
            </Text>

            <View style={styles.cta}>
              <Text style={styles.ctaText}>상세 보기</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1, padding: theme.spacing.l },

  mainTitle: { ...theme.typography.display, color: theme.colors.textPrimary, marginBottom: theme.spacing.s },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  cardSkeleton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.l },
  expertName: { ...theme.typography.h2, color: theme.colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaText: { ...theme.typography.caption, color: theme.colors.textSecondary },
  metaDot: { ...theme.typography.caption, color: theme.colors.textTertiary, marginHorizontal: 6 },

  kvGrid: { flexDirection: 'row', marginBottom: theme.spacing.m },
  kvCol: { flex: 1 },
  kvLabel: { ...theme.typography.small, color: theme.colors.textTertiary, marginBottom: 4 },
  kvValue: { ...theme.typography.bodyStrong, color: theme.colors.textPrimary },

  comment: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    paddingTop: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },

  cta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  ctaText: { ...theme.typography.caption, color: theme.colors.primary, fontWeight: '700' },
  ctaArrow: { ...theme.typography.caption, color: theme.colors.primary, marginLeft: 4 },
});
