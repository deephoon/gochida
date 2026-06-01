import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { RepairPriceGuide } from '../types';
import { theme } from '../theme';

interface Props {
  guide: RepairPriceGuide;
}

export function LoadingPriceGuideCard({ guide }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>비슷한 공종의 참고 시세예요</Text>
      
      <Card style={styles.card}>
        <Text style={styles.tradeCategory}>{guide.tradeCategory}</Text>
        <Text style={styles.title}>{guide.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.averageLabel}>평균</Text>
          <Text style={styles.averagePrice}>{guide.averagePrice}</Text>
        </View>
        <Text style={styles.priceRange}>참고 범위 {guide.priceRange}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.reasonTitle}>가격이 달라지는 이유</Text>
        <Text style={styles.reasonText}>
          {guide.factors.join(', ')} 등에 따라 비용이 달라질 수 있어요.
        </Text>
        <Text style={styles.disclaimer}>{guide.disclaimer}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.standardTitle}>고치다의 비교 기준</Text>
        <Text style={styles.standardText}>
          고치다는 최저가보다 작업 범위와 사후관리 가능성을 함께 비교합니다.
        </Text>
      </Card>
      
      <Text style={styles.footerDisclaimer}>
        아래 금액은 참고용 시세이며, 최종 비용은 전문가 확인 후 달라질 수 있어요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  card: {
    marginBottom: theme.spacing.m,
    padding: theme.spacing.l,
  },
  tradeCategory: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs,
  },
  averageLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.s,
  },
  averagePrice: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  priceRange: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  reasonText: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.s,
  },
  disclaimer: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  standardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  standardText: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  footerDisclaimer: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
});
