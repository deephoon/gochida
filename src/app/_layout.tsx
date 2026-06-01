import { Stack } from 'expo-router';
import { theme } from '../theme';
import { RequestProvider } from '../context/RequestContext';

export default function RootLayout() {
  return (
    <RequestProvider>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleStyle: {
            color: theme.colors.textPrimary,
            fontWeight: '700',
          },
          headerTintColor: theme.colors.textPrimary,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="upload" options={{ title: '요청서 작성' }} />
        <Stack.Screen name="analysis" options={{ title: 'AI 요청서 정리' }} />
        <Stack.Screen name="request-review" options={{ title: '요청서 확인' }} />
        <Stack.Screen name="expert-responses" options={{ title: '전문가 응답', headerLeft: () => null }} />
        <Stack.Screen name="expert/[id]" options={{ title: '전문가 상세' }} />
      </Stack>
    </RequestProvider>
  );
}
