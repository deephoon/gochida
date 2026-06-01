import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { mockExpertResponses } from '../../data/mockData';
import { Button } from '../../components/Button';
import { theme } from '../../theme';
import type { WarrantyType } from '../../types';

function LargeWarrantyBadge({ type }: { type: WarrantyType }) {
  let bgColor = theme.colors.surfaceSoft;
  let textColor = theme.colors.textSecondary;
  let iconName = 'shield-off-outline';
  let label = '확인서 제공 없음';

  if (type === '안심 보증서') {
    bgColor = theme.colors.successLight;
    textColor = theme.colors.success;
    iconName = 'shield-check';
    label = '안심 보증서 제공';
  } else if (type === '작업 확인서') {
    bgColor = theme.colors.black;
    textColor = theme.colors.white;
    iconName = 'text-box-check-outline';
    label = '작업 확인서 제공';
  }

  return (
    <View style={[styles.largeBadge, { backgroundColor: bgColor }]}>
      <MaterialCommunityIcons name={iconName as any} size={20} color={textColor} style={{ marginRight: 8 }} />
      <Text style={[theme.typography.h3, { color: textColor }]}>{label}</Text>
    </View>
  );
}

export default function ExpertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const rawId = Array.isArray(id) ? id[0] : id;

  const expert = mockExpertResponses.find((item) => item.id === rawId);

  if (!expert) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="account-search-outline" size={48} color={theme.colors.textTertiary} />
          <Text style={[theme.typography.h2, styles.emptyTitle]}>전문가 정보를 찾을 수 없어요</Text>
          <Text style={[theme.typography.body, styles.emptyDesc]}>응답 목록으로 돌아가 다시 선택해 주세요.</Text>
          <Button title="응답 목록으로 돌아가기" onPress={() => router.replace('/expert-responses')} style={{ marginTop: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  const handleRequest = () => {
    Alert.alert('데모 안내', '데모 버전에서는 여기까지 지원됩니다.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.expertAvatarLg}>
             <MaterialCommunityIcons name="account" size={40} color={theme.colors.textSecondary} />
          </View>
          <View>
            <Text style={[theme.typography.body, styles.subtitle]}>상세 조건 확인</Text>
            <Text style={[theme.typography.display, styles.expertName]}>{expert.expertName}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={[theme.typography.h2, styles.sectionTitle]}>작업 상세 정보</Text>
          </View>
          
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={[theme.typography.body, styles.infoLabel]}>작업 가능 여부</Text>
              <View style={styles.availabilityPill}>
                 <View style={[styles.availabilityDot, { backgroundColor: expert.available ? theme.colors.success : theme.colors.warning }]} />
                 <Text style={[theme.typography.bodyStrong, styles.infoValue]}>
                   {expert.available ? '작업 가능' : '추가 확인 필요'}
                 </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={[theme.typography.body, styles.infoLabel]}>작업 방식</Text>
              <Text style={[theme.typography.bodyStrong, styles.infoValue]}>{expert.workType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[theme.typography.body, styles.infoLabel]}>비용 감각</Text>
              <Text style={[theme.typography.bodyStrong, styles.infoValue]}>{expert.costLevel}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[theme.typography.body, styles.infoLabel]}>방문 필요 여부</Text>
              <Text style={[theme.typography.bodyStrong, styles.infoValue]}>{expert.visitRequired ? '방문 필요' : '사진 기반 확인 가능'}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0, flexDirection: 'column', alignItems: 'flex-start' }]}>
              <Text style={[theme.typography.body, styles.infoLabel, { marginBottom: 16 }]}>전문가 의견</Text>
              <View style={styles.commentBox}>
                <Text style={[theme.typography.body, styles.commentText]}>{`"${expert.comment}"`}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Premium Warranty Card (Inspired by reference dark card styling if it was a warranty) */}
        <View style={styles.warrantySection}>
          <View style={styles.warrantyHeader}>
            <MaterialCommunityIcons name="shield-star" size={28} color={theme.colors.black} />
            <Text style={[theme.typography.h1, styles.sectionTitle, { marginBottom: 0 }]}>사후관리 조건</Text>
          </View>
          
          <Text style={[theme.typography.body, styles.warrantyDesc]}>
            작업 범위와 사후관리 조건을 구조화해 사용자가 비교할 수 있도록 정리한 정보입니다.
          </Text>

          <LargeWarrantyBadge type={expert.warranty.type} />

          <View style={styles.careList}>
            {expert.warranty.includedCare.length > 0 ? (
              expert.warranty.includedCare.map((care, i) => (
                <View key={i} style={styles.careItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.black} style={styles.bulletIcon} />
                  <Text style={[theme.typography.bodyStrong, styles.careText]}>{care}</Text>
                </View>
              ))
            ) : (
              <Text style={[theme.typography.body, styles.emptyCare]}>등록된 사후관리 조건이 없습니다.</Text>
            )}
          </View>

          <View style={styles.legalNoticeBox}>
            <MaterialCommunityIcons name="information" size={16} color={theme.colors.textTertiary} />
            <Text style={[theme.typography.small, styles.legalNotice]}>
              본 확인서는 구조화된 작업 이력 데이터이며, 법적 책임은 전문가 제시 기준에 따릅니다.
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.floatingFooter}>
        <Button 
          title="이 전문가에게 의뢰하기" 
          onPress={handleRequest} 
          variant="primary" 
          style={styles.floatingButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: theme.spacing.xl, paddingBottom: 40 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 32, 
    marginTop: 16,
    gap: 16
  },
  expertAvatarLg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surfaceSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertName: { color: theme.colors.black },
  subtitle: { color: theme.colors.textSecondary },

  card: {
    backgroundColor: theme.colors.white,
    padding: 24,
    borderRadius: 32,
    marginBottom: 24,
    ...theme.shadows.soft,
  },
  sectionHeader: { marginBottom: 24 },
  sectionTitle: { color: theme.colors.black },
  
  infoTable: { },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    borderStyle: 'solid',
  },
  infoLabel: { width: 120, color: theme.colors.textSecondary },
  infoValue: { flex: 1, color: theme.colors.black },
  
  availabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  commentBox: {
    backgroundColor: theme.colors.surfaceSoft,
    padding: 20,
    borderRadius: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.borderStrong,
  },
  commentText: { color: theme.colors.textPrimary, fontStyle: 'italic', lineHeight: 24 },

  warrantySection: {
    backgroundColor: theme.colors.white,
    padding: 32,
    borderRadius: 32,
    ...theme.shadows.soft,
  },
  warrantyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  warrantyDesc: {
    color: theme.colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  largeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 100,
    marginBottom: 32,
  },
  
  careList: {
    backgroundColor: theme.colors.surfaceSoft,
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  careItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bulletIcon: { marginRight: 12 },
  careText: { flex: 1, color: theme.colors.black, lineHeight: 24 },
  emptyCare: { color: theme.colors.textTertiary, textAlign: 'center', fontStyle: 'italic' },
  
  legalNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: theme.colors.surfaceSoft,
    padding: 16,
    borderRadius: 16,
  },
  legalNotice: {
    flex: 1,
    color: theme.colors.textTertiary,
    lineHeight: 18,
  },

  floatingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 40, 
    paddingTop: 16,
    // Add a gradient or just transparent background if we want it to float
    backgroundColor: 'rgba(245,245,247, 0.9)', 
  },
  floatingButton: {
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  emptyTitle: { color: theme.colors.black, marginTop: theme.spacing.m, marginBottom: theme.spacing.xs },
  emptyDesc: { color: theme.colors.textSecondary, textAlign: 'center' },
});
