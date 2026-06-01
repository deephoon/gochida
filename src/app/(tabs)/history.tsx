import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>요청 내역</Text>
      
      <View style={styles.emptyCard}>
        <Ionicons name="document-text-outline" size={48} color={theme.colors.textSecondary} />
        <Text style={styles.emptyTitle}>아직 등록된 요청이 없어요.</Text>
        <Text style={styles.emptyDescription}>
          사진으로 요청을 시작하면 이곳에서 진행 상황을 확인할 수 있어요.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    paddingTop: 60, // for header spacing
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 24,
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
