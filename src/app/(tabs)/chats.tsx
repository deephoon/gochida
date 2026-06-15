import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../theme';
import { TabHeader } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { Icon } from '../../components/Icon';
import { MOCK_CHATS } from '../../data/mockData';
import { useRequest } from '../../context/RequestContext';

export default function ChatsScreen() {
  const router = useRouter();
  const { consultations } = useRequest();

  // 사용자가 시작한 상담방을 목록 상단에 노출하고, 기존 Mock 채팅을 이어 보여준다.
  const chatList = useMemo(() => {
    const started = consultations.map((c) => ({
      id: c.id,
      expertName: c.expertName,
      requestTitle: c.requestTitle,
      lastMessage: c.lastMessage,
      timeText: c.timeText,
      warrantyType: c.warrantyType,
      unread: c.unread,
      isNew: true,
    }));
    return [...started, ...MOCK_CHATS.map((c: any) => ({ ...c, isNew: false }))];
  }, [consultations]);

  const handleOpenChat = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <View style={styles.container}>
      <TabHeader title="채팅" subtitle="전문가와 나눈 상담 내역" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {chatList.map((c: any) => (
          <Pressable key={c.id} style={styles.chatRow} onPress={() => handleOpenChat(c.id)}>
            <View style={styles.avatarWrap}>
              <Icon name="user" size={26} color={theme.colors.primary} />
              {c.unread > 0 && <View style={styles.unreadBadge} />}
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <View style={styles.nameWrap}>
                  <Text style={styles.expertName} numberOfLines={1}>{c.expertName}</Text>
                  {c.isNew && (
                    <View style={styles.newTag}>
                      <Text style={styles.newTagText}>상담 시작</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.timeText}>{c.timeText}</Text>
              </View>
              <Text style={styles.requestTitle} numberOfLines={1}>{c.requestTitle}</Text>
              <View style={styles.chatFooter}>
                <Text
                  style={[styles.lastMessage, c.unread > 0 && styles.lastMessageUnread]}
                  numberOfLines={1}
                >
                  {c.lastMessage}
                </Text>
                {c.warrantyType && c.warrantyType !== '없음' && (
                  <Badge label={c.warrantyType} variant={c.warrantyType === '안심 보증서' ? 'success' : 'neutral'} />
                )}
              </View>
            </View>
          </Pressable>
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 110,
  },
  chatRow: {
    flexDirection: 'row',
    gap: 13,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.l,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: theme.colors.danger,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  chatContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    paddingBottom: 14,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  expertName: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
  newTag: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  newTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  timeText: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    fontWeight: '500',
  },
  requestTitle: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  lastMessage: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  lastMessageUnread: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
});
