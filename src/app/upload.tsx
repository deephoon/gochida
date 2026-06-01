import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { useRequest } from '../context/RequestContext';
import { theme } from '../theme';

const LOCATION_OPTIONS = ['거실', '주방', '욕실', '침실', '베란다', '현관', '기타'];
const SYMPTOM_OPTIONS = ['파손/고장', '소음', '누수', '작동 불량', '악취', '기타'];

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
    submitAnalysis 
  } = useRequest();

  const pickImage = async () => {
    if (imageUris.length >= 3) {
      Alert.alert('안내', '사진은 최대 3장까지만 첨부할 수 있습니다.');
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('권한 필요', '사진 접근 권한이 필요합니다. 문제 부위를 선택하려면 사진 라이브러리 접근을 허용해 주세요.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    } catch {
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

  const canProceed = imageUris.length > 0 && location.length > 0 && symptom.length > 0;

  const handleNext = () => {
    if (canProceed) {
      submitAnalysis(); // Trigger AI analysis in background
      router.push('/analysis');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[theme.typography.h3, styles.stepIndicator]}>Step 1 of 3</Text>
          <Text style={[theme.typography.display, styles.title]}>문제 상황을{'\n'}보여주세요</Text>
          <Text style={[theme.typography.body, styles.subtitle]}>
            사진이 명확할수록 전문가가 더 정확한 견적을 낼 수 있어요. (최대 3장)
          </Text>
        </View>

        <View style={styles.galleryRow}>
          {imageUris.map((uri, index) => (
            <View key={index} style={styles.tile}>
              <Image source={{ uri }} style={styles.tileImg} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <MaterialCommunityIcons name="close" size={16} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          ))}

          {imageUris.length < 3 && (
            <TouchableOpacity style={styles.addTile} onPress={pickImage} activeOpacity={0.85}>
              <MaterialCommunityIcons name="camera-plus-outline" size={28} color={theme.colors.primary} style={{ marginBottom: 8 }} />
              <Text style={[theme.typography.bodyStrong, styles.addLabel]}>사진 추가</Text>
              <Text style={[theme.typography.small, styles.addCount]}>{imageUris.length} / 3</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formCard}>
          <View style={styles.section}>
            <Text style={[theme.typography.h2, styles.sectionTitle]}>어디에 문제가 있나요?</Text>
            <View style={styles.chipRow}>
              {LOCATION_OPTIONS.map(loc => (
                <Chip
                  key={loc}
                  label={loc}
                  selected={location === loc}
                  onPress={() => setLocation(loc)}
                />
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={[theme.typography.h2, styles.sectionTitle]}>어떤 증상인가요?</Text>
            <View style={styles.chipRow}>
              {SYMPTOM_OPTIONS.map(sym => (
                <Chip
                  key={sym}
                  label={sym}
                  selected={symptom === sym}
                  onPress={() => setSymptom(sym)}
                />
              ))}
            </View>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="AI 분석 시작하기" 
          onPress={handleNext} 
          disabled={!canProceed} 
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
    paddingBottom: 120,
  },
  
  header: { marginBottom: 32, marginTop: 16 },
  stepIndicator: { color: theme.colors.primary, marginBottom: 8 },
  title: { color: theme.colors.textPrimary, marginBottom: 12, lineHeight: 40 },
  subtitle: { color: theme.colors.textSecondary },

  galleryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 24,
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
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  addLabel: {
    color: theme.colors.primaryDark,
  },
  addCount: {
    color: theme.colors.primary,
    marginTop: 2,
    opacity: 0.8,
  },

  formCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 32,
    padding: 24,
    ...theme.shadows.soft,
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 20,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: 'rgba(245,245,247,0.9)',
  },
});
