import { Stack } from 'expo-router';
import { theme } from '../theme';
import { RequestProvider } from '../context/RequestContext';

export default function RootLayout() {
  return (
    <RequestProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: '고치다', headerShown: false }}
        />
        <Stack.Screen name="upload" options={{ title: '문제 사진 업로드' }} />
        <Stack.Screen name="analysis" options={{ title: 'AI 분석 결과' }} />
        <Stack.Screen name="request-review" options={{ title: '요청서 확인' }} />
        <Stack.Screen
          name="expert-responses"
          options={{ title: '전문가 응답', headerLeft: () => null }}
        />
        <Stack.Screen name="expert/[id]" options={{ title: '전문가 상세' }} />
      </Stack>
    </RequestProvider>
  );
}
