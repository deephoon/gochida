import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { TabHeader } from '../../components/Header';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Icon } from '../../components/Icon';
import { MOCK_REQUESTS } from '../../data/mockData';

const STATUS_VARIANT: any = {
  draft: 'neutral', ai_done: 'primary', waiting: 'warning',
  responded: 'primary', chatting: 'warning', completed: 'success',
};
const STATUS_LABEL: any = {
  draft: '작성 중', ai_done: 'AI 분석 완료', waiting: '전문가 대기 중',
  responded: '응답 도착', chatting: '채팅/상담 중', completed: '작업 완료',
};

function RequestCard({ req, onPress, onCompare }: any) {
  const done = req.status === 'completed';
  return (
    <Card radius={theme.borderRadius.xxl} pad={18} onPress={onPress} style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
        <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: done ? theme.colors.successLight : theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={done ? 'checkCircle' : 'image'} size={23} color={done ? theme.colors.success : theme.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{req.title}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>{req.location} · {req.symptom} · {req.dateText}</Text>
        </View>
        <Icon name="chevronR" size={18} color={theme.colors.textTertiary} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 14 }}>
        <Badge label={STATUS_LABEL[req.status] || req.status} variant={STATUS_VARIANT[req.status] || 'neutral'} dot />
        <Badge label={req.tradeCategory} variant="neutral" />
      </View>
      {!done && (
        <Pressable style={styles.compareBtn} onPress={(e) => { e.stopPropagation(); onCompare(); }}>
          <Text style={styles.compareBtnText}>전문가 응답 비교하기</Text>
          <Icon name="chevronR" size={15} color="#FFF" strokeWidth={2.4} />
        </Pressable>
      )}
    </Card>
  );
}

export default function HistoryScreen() {
  const active = MOCK_REQUESTS.filter((r: any) => r.status !== 'completed');
  const done = MOCK_REQUESTS.filter((r: any) => r.status === 'completed');

  const handleCompare = () => {
    router.push('/expert-responses');
  };

  // 응답이 도착한 요청은 비교 화면으로, 완료된 요청 상세는 MVP 범위 밖으로 안내한다.
  const handleOpenRequest = (status: string) => {
    if (status === 'completed') {
      Alert.alert('MVP 범위 외 기능입니다.', '실제 서비스에서는 작업 확인서와 작업 기록을 확인할 수 있습니다.');
      return;
    }
    handleCompare();
  };

  return (
    <View style={styles.container}>
      <TabHeader title="요청" subtitle="내가 만든 요청서와 진행 상태를 확인하세요" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>진행 중 {active.length}</Text>
        {active.map((r: any) => (
          <RequestCard key={r.id} req={r} onPress={() => handleOpenRequest(r.status)} onCompare={handleCompare} />
        ))}
        
        <Text style={[styles.sectionHeader, { marginTop: 18 }]}>완료 {done.length}</Text>
        {done.map((r: any) => (
          <RequestCard key={r.id} req={r} onPress={() => handleOpenRequest(r.status)} onCompare={handleCompare} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 110,
  },
  sectionHeader: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.textTertiary,
    marginBottom: 12,
    marginLeft: 2,
  },
  cardTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
  },
  cardSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  compareBtn: {
    marginTop: 14,
    width: '100%',
    height: 46,
    borderRadius: 23,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  compareBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
