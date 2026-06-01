import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { mockExpertResponses } from '../data/mockData';
import { theme } from '../theme';
import { useRequest } from '../context/RequestContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TrustBadge } from '../components/ui/TrustBadge';

export default function ExpertResponsesScreen() {
  const { setSelectedExpertId } = useRequest();

  const handleSelect = (id: string) => {
    setSelectedExpertId(id);
    router.push(`/expert/${id}`);
  };

  if (mockExpertResponses.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="inbox-remove-outline" size={48} color={theme.colors.textTertiary} />
          <Text style={[theme.typography.h2, styles.emptyTitle]}>아직 도착한 전문가 응답이 없어요</Text>
          <Text style={[theme.typography.body, styles.emptyDesc]}>요청서를 보낸 뒤 전문가 응답이 도착하면 이곳에서 비교할 수 있어요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[theme.typography.display, styles.title]}>응답 비교</Text>
          <Text style={[theme.typography.body, styles.subtitle]}>
            작업 방식, 방문 필요 여부, 사후관리 조건을 함께 확인해 주세요.
          </Text>
        </View>

        <View style={styles.list}>
          {mockExpertResponses.map((expert) => (
            <Pressable
              key={expert.id}
              style={({ pressed }) => [
                styles.card,
                pressed && { transform: [{ scale: theme.motion.pressScale }], opacity: theme.motion.activeOpacity },
              ]}
              onPress={() => handleSelect(expert.id)}
              accessibilityRole="button"
              accessibilityLabel={`${expert.expertName} 상세 조건 보기`}
            >
              <View style={styles.cardHeader}>
                <View style={styles.expertProfileWrap}>
                  <View style={styles.expertAvatar}>
                    <MaterialCommunityIcons name="account" size={24} color={theme.colors.textTertiary} />
                  </View>
                  <Text style={[theme.typography.h2, styles.expertName]}>{expert.expertName}</Text>
                </View>
                <TrustBadge type={expert.warranty.type} size="sm" />
              </View>

              <View style={styles.commentBox}>
                <Text style={[theme.typography.body, styles.comment]} numberOfLines={3}>
                  {`"${expert.comment}"`}
                </Text>
              </View>

              <View style={styles.infoTable}>
                <View style={styles.infoRow}>
                  <Text style={[theme.typography.body, styles.infoLabel]}>작업 방식</Text>
                  <Text style={[theme.typography.bodyStrong, styles.infoValue]}>{expert.workType}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[theme.typography.body, styles.infoLabel]}>비용 감각</Text>
                  <Text style={[theme.typography.bodyStrong, styles.infoValue]}>{expert.costLevel}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[theme.typography.body, styles.infoLabel]}>방문 여부</Text>
                  <Text style={[theme.typography.bodyStrong, styles.infoValue]}>{expert.visitRequired ? '현장 확인 필요' : '사진 기반 확인 가능'}</Text>
                </View>
                <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
                  <Text style={[theme.typography.body, styles.infoLabel]}>가능 여부</Text>
                  <View style={styles.availabilityPill}>
                     <View style={[styles.availabilityDot, { backgroundColor: expert.available ? theme.colors.success : theme.colors.warning }]} />
                     <Text style={[theme.typography.bodyStrong, styles.infoValue]}>
                       {expert.available ? '작업 가능' : '추가 확인 필요'}
                     </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={[theme.typography.bodyStrong, styles.footerText]}>상세 조건 보기</Text>
                <View style={styles.footerIconWrap}>
                  <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.white} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: theme.spacing.xl },
  
  header: { marginBottom: 32, marginTop: 16 },
  title: { color: theme.colors.black, marginBottom: 12 },
  subtitle: { color: theme.colors.textSecondary, opacity: 0.9 },
  
  list: { gap: 24 },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 32,
    padding: 24,
    ...theme.shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  expertProfileWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expertAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertName: { color: theme.colors.black },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },
  
  commentBox: {
    marginBottom: 24,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.surfaceSoft,
  },
  comment: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  
  infoTable: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 24,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    borderStyle: 'solid',
  },
  infoLabel: { width: 90, color: theme.colors.textSecondary },
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
  
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: theme.colors.black,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
  footerText: {
    color: theme.colors.white,
  },
  footerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  emptyTitle: { color: theme.colors.black, marginTop: theme.spacing.m, marginBottom: theme.spacing.xs },
  emptyDesc: { color: theme.colors.textSecondary, textAlign: 'center' },
});
