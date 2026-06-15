import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../theme';
import { Icon } from '../../components/Icon';
import { AppHeader } from '../../components/Header';
import { MOCK_CHATS, MOCK_CHAT_THREAD } from '../../data/mockData';
import { useRequest } from '../../context/RequestContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { consultations, appendConsultationMessage } = useRequest();

  // 사용자가 시작한 상담방이면 전역에 보관된 대화 스레드를 그대로 사용한다(탭 이동 후에도 유지).
  const consultRoom = consultations.find((c) => c.id === id);
  const chatInfo = consultRoom
    || MOCK_CHATS.find((c: any) => c.id === id)
    || { expertName: '전문가' };

  // 상담방은 Context를, Mock 채팅방은 로컬 상태를 메시지 소스로 사용한다.
  const [localMessages, setLocalMessages] = useState(MOCK_CHAT_THREAD);
  const messages = consultRoom ? consultRoom.thread : localMessages;
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    if (consultRoom) {
      appendConsultationMessage(consultRoom.id, { from: 'me', text });
    } else {
      setLocalMessages((prev) => [...prev, { from: 'me', text }]);
    }
    setInputText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={chatInfo.expertName}
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {/* 날짜 구분선 예시 */}
          <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>2024년 5월 12일</Text>
          </View>

          {messages.map((msg: any, index: number) => {
            const isMe = msg.from === 'me';
            const showAvatar = !isMe && (index === 0 || messages[index - 1].from === 'me');

            return (
              <View key={index} style={[styles.messageWrapper, isMe ? styles.messageWrapperMe : styles.messageWrapperExpert]}>
                {!isMe && (
                  <View style={styles.avatarContainer}>
                    {showAvatar ? (
                      <View style={styles.avatar}>
                        <Icon name="user" size={16} color={theme.colors.primary} strokeWidth={2} />
                      </View>
                    ) : (
                      <View style={{ width: 36 }} />
                    )}
                  </View>
                )}

                <View style={[styles.bubbleWrap, isMe ? styles.bubbleWrapMe : styles.bubbleWrapExpert]}>
                  <View style={[
                    styles.bubble,
                    isMe ? styles.bubbleMe : styles.bubbleExpert,
                    !isMe && showAvatar ? styles.bubbleExpertFirst : null,
                    isMe && (index === messages.length - 1 || messages[index + 1].from !== 'me') ? styles.bubbleMeLast : null
                  ]}>
                    <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextExpert]}>
                      {msg.text}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>오후 2:30</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={[styles.inputArea, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.inputContainer}>
            <Pressable style={styles.attachButton}>
              <Icon name="plus" size={24} color={theme.colors.textTertiary} strokeWidth={2} />
            </Pressable>
            <TextInput
              style={styles.input}
              placeholder="메시지를 입력하세요"
              placeholderTextColor={theme.colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            {inputText.trim().length > 0 && (
              <Pressable style={styles.sendButton} onPress={handleSend}>
                <Icon name="arrowUp" size={20} color={theme.colors.white} strokeWidth={3} />
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 24,
  },
  dateSeparatorText: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  messageWrapperMe: {
    justifyContent: 'flex-end',
  },
  messageWrapperExpert: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 20, // To align with the bottom of the bubble, adjusted for time text
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  bubbleWrap: {
    maxWidth: '75%',
    flexDirection: 'column',
  },
  bubbleWrapMe: {
    alignItems: 'flex-end',
  },
  bubbleWrapExpert: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    ...theme.shadows.soft,
  },
  bubbleMe: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 6,
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  bubbleMeLast: {
    borderBottomRightRadius: 4,
  },
  bubbleExpert: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 6,
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  bubbleExpertFirst: {
    borderTopLeftRadius: 6,
  },
  messageText: {
    ...theme.typography.body,
    lineHeight: 22,
  },
  messageTextMe: {
    color: theme.colors.white,
  },
  messageTextExpert: {
    color: theme.colors.textPrimary,
  },
  timeText: {
    ...theme.typography.small,
    fontSize: 11,
    color: theme.colors.textTertiary,
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputArea: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    ...theme.shadows.float, // Adds a nice shadow pointing upwards
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  attachButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    ...theme.shadows.primary,
  },
});
