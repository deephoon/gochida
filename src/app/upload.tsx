import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { useRequestFlow } from '../hooks/useRequestFlow';
import { theme } from '../theme';

export default function UploadScreen() {
  const {
    imageUris,
    location,
    symptom,
    locationOptions,
    symptomOptions,
    canProceed,
    remainingImageSlots,
    handlePickImages,
    handleRemoveImage,
    handleSelectLocation,
    handleSelectSymptom,
    handleStartAnalysis,
  } = useRequestFlow();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[theme.typography.caption, styles.stepLabel]}>1 / 3 사진 및 증상 등록</Text>
          <Text style={[theme.typography.display, styles.title]}>사진과 증상을{'\n'}등록해 주세요</Text>
          <Text style={[theme.typography.body, styles.subtitle]}>
            문제 부위가 잘 보이는 사진과 기본 정보를 입력하면 요청서 초안을 정리할 수 있어요.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h3, styles.sectionTitle]}>사진 등록</Text>
          <View style={styles.galleryRow}>
            {imageUris.map((uri, index) => (
              <View key={`${uri}-${index}`} style={styles.tile}>
                <Image source={{ uri }} style={styles.tileImg} />
                <Pressable
                  style={({ pressed }) => [
                    styles.removeButton,
                    pressed && { transform: [{ scale: theme.motion.pressScale }], opacity: theme.motion.activeOpacity },
                  ]}
                  onPress={() => handleRemoveImage(index)}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="사진 삭제"
                >
                  <MaterialCommunityIcons name="close" size={16} color={theme.colors.white} />
                </Pressable>
              </View>
            ))}

            {remainingImageSlots > 0 && (
              <Pressable
                onPress={handlePickImages}
                accessibilityRole="button"
                accessibilityLabel="사진 추가"
                style={({ pressed }) => [
                  styles.addTile,
                  pressed && { transform: [{ scale: theme.motion.pressScale }], opacity: theme.motion.activeOpacity },
                ]}
              >
                <MaterialCommunityIcons
                  name="camera-plus-outline"
                  size={28}
                  color={theme.colors.primary}
                  style={{ marginBottom: 8 }}
                />
                <Text style={[theme.typography.bodyStrong, styles.addLabel]}>사진 추가</Text>
                <Text style={[theme.typography.small, styles.addCount]}>{imageUris.length} / 3</Text>
              </Pressable>
            )}
          </View>
          <Text style={[theme.typography.caption, styles.helper]}>최대 3장까지 등록할 수 있어요.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h3, styles.sectionTitle]}>위치 선택</Text>
          <View style={styles.chipRow}>
            {locationOptions.map((loc) => (
              <Chip
                key={loc}
                label={loc}
                selected={location === loc}
                onPress={() => handleSelectLocation(loc)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h3, styles.sectionTitle]}>증상 선택</Text>
          <View style={styles.chipRow}>
            {symptomOptions.map((sym) => (
              <Chip
                key={sym}
                label={sym}
                selected={symptom === sym}
                onPress={() => handleSelectSymptom(sym)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!canProceed && (
          <Text style={[theme.typography.caption, styles.footerHelper]}>
            사진, 위치, 증상을 모두 입력하면 다음 단계로 이동할 수 있어요.
          </Text>
        )}
        <Button
          title="AI 요청서 정리 시작"
          onPress={handleStartAnalysis}
          disabled={!canProceed}
          accessibilityLabel="AI 요청서 정리 시작"
        />
      </View>
    </SafeAreaView>
  );
}

const TILE_SIZE = 110;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: theme.spacing.xl,
    paddingBottom: 160,
  },

  header: { marginBottom: theme.spacing.xl, marginTop: theme.spacing.l },
  stepLabel: { color: theme.colors.primary, marginBottom: theme.spacing.s },
  title: { color: theme.colors.textPrimary, marginBottom: theme.spacing.m, lineHeight: 40 },
  subtitle: { color: theme.colors.textSecondary },

  section: { marginTop: theme.spacing.xl },
  sectionTitle: { color: theme.colors.textPrimary, marginBottom: theme.spacing.l },

  galleryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.l,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.colors.surfaceMuted,
    ...theme.shadows.soft,
  },
  tileImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  addTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  addLabel: { color: theme.colors.primaryDark },
  addCount: { color: theme.colors.primary, marginTop: 2, opacity: 0.8 },
  helper: { color: theme.colors.textTertiary, marginTop: theme.spacing.m },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  footerHelper: {
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
});
