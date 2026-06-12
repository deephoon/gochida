import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { theme } from '../../theme';
import { TabHeader } from '../../components/Header';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Icon, IconName } from '../../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const menu: [string, IconName, string][] = [
    ['고치다 사용법', 'sparkle', '사진 한 장으로 요청서를 만드는 방법을 안내해요.'],
    ['작업 확인서 · 보증서 안내', 'shield', '작업 확인서와 안심 보증서가 무엇을 보장하는지 설명해요.'],
    ['안전 유의사항', 'warning', '직접 시도하면 위험한 작업과 주의사항을 알려드려요.'],
    ['자주 묻는 질문', 'info', '비용, 응답 시간, 사후관리에 대한 답변을 모았어요.'],
    ['앱 정보', 'receipt', '버전 1.0.0 · 고치다 MVP 데모'],
    ['데모 버전 안내', 'bell', '이 앱은 데모입니다. 실제 결제·로그인은 제공되지 않아요.'],
  ];

  return (
    <View style={styles.container}>
      <TabHeader title="내 정보" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Card */}
        <Card radius={theme.borderRadius.xxl} pad={20} style={styles.userCard}>
          <LinearGradient colors={['#6E7BFF', theme.colors.primary]} style={styles.userAvatar}>
            <Icon name="person" size={30} color="#FFF" />
          </LinearGradient>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>데모 사용자</Text>
            <Text style={styles.userDesc}>고치다 체험 계정</Text>
          </View>
          <Badge label="DEMO" variant="primary" />
        </Card>

        {/* Menu List */}
        <Card radius={theme.borderRadius.xxl} pad={6} style={{ paddingHorizontal: 8 }}>
          {menu.map(([label, icon, msg], i) => (
            <Pressable 
              key={label} 
              style={[styles.menuItem, i < menu.length - 1 && styles.menuItemBorder]}
              onPress={() => Alert.alert(label, msg)}
            >
              <View style={styles.menuIconWrap}>
                <Icon name={icon} size={19} color={theme.colors.textSecondary} />
              </View>
              <Text style={styles.menuLabel}>{label}</Text>
              <Icon name="chevronR" size={17} color={theme.colors.textTertiary} />
            </Pressable>
          ))}
        </Card>

        {/* Footer */}
        <Text style={styles.footerText}>
          고치다 v1.0.0 · 데모 버전{'\n'}최종 작업 범위와 비용은 전문가 상담 후 결정됩니다.
        </Text>
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
    paddingTop: 8,
    paddingBottom: 110,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 22,
  },
  userAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  userDesc: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    ...theme.typography.body,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  footerText: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: 22,
    lineHeight: 18,
    fontWeight: '500',
  },
});
