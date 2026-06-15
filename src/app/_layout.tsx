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
        <Stack.Screen name="upload" options={{ headerShown: false }} />
        <Stack.Screen name="analysis" options={{ headerShown: false }} />
        <Stack.Screen name="request-review" options={{ headerShown: false }} />
        <Stack.Screen name="expert-responses" options={{ headerShown: false }} />
        <Stack.Screen name="expert/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="consultation/[expertId]" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      </Stack>
    </RequestProvider>
  );
}
