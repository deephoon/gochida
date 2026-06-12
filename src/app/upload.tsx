import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRequest } from '../context/RequestContext';
import { useRequestFlow, MAX_PHOTOS } from '../hooks/useRequestFlow';
import { theme } from '../theme';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';
import { AppHeader } from '../components/Header';
import { ASSET, LOCATIONS, SYMPTOMS } from '../data/mockData';
import { PressableScale } from '../components/ui/PressableScale';

function StepIndicator({ current, total, label }: { current: number, total: number, label: string }) {
  return (
    <View style={styles.stepIndicator}>
      <Text style={styles.stepTitle}>{label}</Text>
      <Text style={styles.stepCount}>{current} <Text style={{ color: theme.colors.textTertiary }}>/ {total}</Text></Text>
    </View>
  );
}

export default function UploadScreen() {
  const {
    setLocation, setSymptom, setImageUris, setImageBase64s, submitAnalysis,
    location, symptom, imageUris
  } = useRequest();
  // 사진 추가(촬영/앨범) 로직은 홈 CTA/FAB와 공유하는 useRequestFlow 훅이 담당한다.
  // 이전 요청 초기화는 홈/FAB의 startNewRequest 시점에 수행되므로 여기서는 하지 않는다.
  const { addPhotos } = useRequestFlow();

  const photoCount = imageUris.length;
  const done = [photoCount > 0, !!location, !!symptom].filter(Boolean).length;
  const remaining = 3 - done;
  const canProceed = remaining === 0;

  const handleAddPhotos = () => {
    addPhotos();
  };

  const handleRemovePhoto = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setImageUris(prev => prev.filter((_, i) => i !== index));
    setImageBase64s(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (!canProceed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    // 이전 결과/에러가 남아 있어도 현재 사진·선택 기준으로 새 분석을 시작한다.
    void submitAnalysis();
    router.push('/analysis');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader title="요청서 작성" onBack={() => router.back()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 22 }}>
          <StepIndicator current={1} total={2} label="요청서 작성" />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Image source={ASSET.uploadCamera} style={styles.infoCardImage} />
          <View style={styles.infoCardTextWrap}>
            <Text style={styles.infoCardTitle}>사진을 올리면 시작돼요</Text>
            <Text style={styles.infoCardSubtitle}>문제 부위가 잘 보이게 찍어주세요.</Text>
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderInner}>
            <Text style={styles.subSectionTitle}>문제 사진</Text>
            <Text style={styles.subSectionCount}>{photoCount} / {MAX_PHOTOS} · 최대 {MAX_PHOTOS}장</Text>
          </View>
          <Text style={styles.subSectionDesc}>다양한 각도로 찍을수록 요청서가 정확해져요.</Text>

          <View style={styles.photoContainer}>
            {imageUris.map((uri, i) => (
              <View key={i} style={styles.photoSlot}>
                <Image source={{ uri }} style={styles.photoImage} />
                <PressableScale style={styles.removePhotoBtn} onPress={() => handleRemovePhoto(i)} hitSlop={10}>
                  <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
                </PressableScale>
              </View>
            ))}
            {photoCount < MAX_PHOTOS && (
              <PressableScale style={styles.addPhotoBtn} onPress={handleAddPhotos}>
                <View style={styles.addPhotoIconWrapper}>
                  <Ionicons name="camera" size={24} color={theme.colors.textSecondary} />
                </View>
                <Text style={styles.addPhotoText}>사진 추가</Text>
              </PressableScale>
            )}
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.subSectionTitle}>어디서 발생했나요?</Text>
          <View style={styles.chipContainer}>
            {LOCATIONS.map((loc) => (
              <Chip
                key={loc}
                label={loc}
                selected={location === loc}
                onPress={() => setLocation(location === loc ? '' : loc)}
              />
            ))}
          </View>
        </View>

        {/* Symptom Section */}
        <View style={styles.section}>
          <Text style={styles.subSectionTitle}>어떤 증상인가요?</Text>
          <View style={styles.chipContainer}>
            {SYMPTOMS.map((sym) => (
              <Chip
                key={sym}
                label={sym}
                selected={symptom === sym}
                onPress={() => setSymptom(symptom === sym ? '' : sym)}
              />
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Floating Footer */}
      <View style={styles.footer}>
        {!canProceed && (
          <Text style={styles.footerHint}>
            {[
              photoCount === 0 && '사진',
              !location && '위치',
              !symptom && '증상',
            ].filter(Boolean).join(' · ')}을(를) 선택하면 요청서 정리를 시작할 수 있어요
          </Text>
        )}
        <Button
          title="AI 요청서 정리 시작"
          disabled={!canProceed}
          onPress={handleAnalyze}
          leftIcon={<Ionicons name="sparkles" size={20} color="#FFF" />}
        />
      </View>
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
    paddingTop: 10,
    paddingBottom: 150,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  stepCount: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 28,
    ...theme.shadows.soft,
  },
  infoCardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  infoCardTextWrap: {
    flex: 1,
  },
  infoCardTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textPrimary,
  },
  infoCardSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeaderInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  subSectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: 14,
  },
  subSectionCount: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
  },
  subSectionDesc: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: 14,
  },
  photoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  photoSlot: {
    width: 106,
    height: 106,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
  },
  addPhotoBtn: {
    width: 106,
    height: 106,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoIconWrapper: {
    marginBottom: 6,
    opacity: 0.6,
  },
  addPhotoText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 34,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
  },
  footerHint: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginBottom: 12,
  },
});
