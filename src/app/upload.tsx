import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { SectionHeader } from '../components/SectionHeader';
import { StepIndicator } from '../components/StepIndicator';
import { useRequest } from '../context/RequestContext';
import { theme } from '../theme';

const LOCATIONS = ['거실', '주방', '욕실', '침실', '베란다', '현관', '기타'];
const SYMPTOMS = ['파손/고장', '소음', '누수', '작동 불량', '악취', '기타'];

export default function UploadScreen() {
  const {
    imageUris,
    setImageUris,
    imageBase64s,
    setImageBase64s,
    location,
    setLocation,
    symptom,
    setSymptom,
    setAnalysisResult,
  } = useRequest();

  const pickImage = async () => {
    if (imageUris.length >= 3) {
      Alert.alert('안내', '사진은 최대 3장까지만 첨부할 수 있습니다.');
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('권한 필요', '사진을 첨부하려면 갤러리 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 3 - imageUris.length,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUris = result.assets.map(a => a.uri);
        const newBase64s = result.assets.map(a => a.base64 || '');

        setImageUris([...imageUris, ...newUris].slice(0, 3));
        setImageBase64s([...imageBase64s, ...newBase64s].slice(0, 3));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '이미지를 불러오는 중 문제가 발생했습니다.');
    }
  };

  const removeImage = (index: number) => {
    const newUris = [...imageUris];
    newUris.splice(index, 1);
    setImageUris(newUris);

    const newBase64s = [...imageBase64s];
    newBase64s.splice(index, 1);
    setImageBase64s(newBase64s);
  };

  const handleNext = () => {
    if (imageUris.length === 0 || !location || !symptom) return;
    setAnalysisResult(null);
    router.push('/analysis');
  };

  const completed = [imageUris.length > 0, !!location, !!symptom].filter(Boolean).length;
  const canProceed = completed === 3;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator current={1} total={2} label="요청서 작성" />

        <SectionHeader
          title="문제 상황을 보여주세요"
          subtitle="다각도로 최대 3장까지. 사진이 정확할수록 진단도 정확해집니다."
        />

        <View style={styles.galleryRow}>
          {imageUris.map((uri, index) => (
            <View key={index} style={styles.tile}>
              <Image source={{ uri }} style={styles.tileImg} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
                hitSlop={8}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}

          {imageUris.length < 3 && (
            <TouchableOpacity style={styles.addTile} onPress={pickImage} activeOpacity={0.85}>
              <Text style={styles.addPlus}>+</Text>
              <Text style={styles.addLabel}>사진 추가</Text>
              <Text style={styles.addCount}>{imageUris.length}/3</Text>
            </TouchableOpacity>
          )}
        </View>

        <SectionHeader title="어디에 문제가 있나요?" size="sm" />
        <View style={styles.chipRow}>
          {LOCATIONS.map(loc => (
            <Chip
              key={loc}
              label={loc}
              selected={location === loc}
              onPress={() => setLocation(loc)}
            />
          ))}
        </View>

        <View style={{ height: theme.spacing.l }} />

        <SectionHeader title="어떤 증상인가요?" size="sm" />
        <View style={styles.chipRow}>
          {SYMPTOMS.map(sym => (
            <Chip
              key={sym}
              label={sym}
              selected={symptom === sym}
              onPress={() => setSymptom(sym)}
            />
          ))}
        </View>

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>

      <View style={styles.footer}>
        {!canProceed && (
          <Text style={styles.helperText}>
            {3 - completed}개 항목을 완료하면 분석을 시작할 수 있어요
          </Text>
        )}
        <Button title="AI 분석 시작" onPress={handleNext} disabled={!canProceed} />
      </View>
    </View>
  );
}

const TILE_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: theme.spacing.l,
  },
  galleryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.xl,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: theme.borderRadius.l,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.colors.surfaceMuted,
  },
  tileImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(15, 17, 21, 0.7)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16,
  },
  addTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.borderRadius.l,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPlus: {
    fontSize: 24,
    fontWeight: '300',
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  addLabel: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  addCount: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
  },
  footer: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderColor: theme.colors.divider,
  },
  helperText: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginBottom: theme.spacing.s,
  },
});
