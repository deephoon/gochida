import { useCallback, useMemo } from 'react';
import { Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useRequest } from '../context/RequestContext';

const MAX_IMAGES = 3;

export const LOCATION_OPTIONS = ['거실', '주방', '욕실', '침실', '베란다', '현관', '기타'];
export const SYMPTOM_OPTIONS = ['파손/고장', '소음', '누수', '작동 불량', '악취', '기타'];

// Android에서 LayoutAnimation을 쓰려면 명시적으로 활성화해야 한다.
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** haptics는 인터랙션 보조일 뿐, 실패해도 기능에 영향을 주지 않도록 안전 처리한다. */
const safeHaptic = (fn: () => Promise<void>) => {
  try {
    void fn();
  } catch {
    // no-op
  }
};

/**
 * 사진 업로드 / 위치·증상 선택 / 다음 화면 이동 로직을 UI에서 분리한다.
 * 화면 컴포넌트는 이미지 선택 로직을 직접 들고 있지 않는다.
 */
export function useRequestFlow() {
  const {
    imageUris,
    imageBase64s,
    setImageUris,
    setImageBase64s,
    location,
    setLocation,
    symptom,
    setSymptom,
    submitAnalysis,
  } = useRequest();

  const remainingImageSlots = Math.max(0, MAX_IMAGES - imageUris.length);

  const canProceed =
    imageUris.length > 0 && location.length > 0 && symptom.length > 0;

  const handlePickImages = useCallback(async () => {
    if (remainingImageSlots <= 0) {
      Alert.alert('안내', `사진은 최대 ${MAX_IMAGES}장까지만 등록할 수 있어요.`);
      return;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          '권한 필요',
          '사진을 등록하려면 사진 라이브러리 접근을 허용해 주세요.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remainingImageSlots,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
        const newUris = result.assets.map((a) => a.uri);
        const newBase64s = result.assets.map((a) => a.base64 ?? '');
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setImageUris([...imageUris, ...newUris].slice(0, MAX_IMAGES));
        setImageBase64s([...imageBase64s, ...newBase64s].slice(0, MAX_IMAGES));
      }
    } catch {
      Alert.alert('오류', '이미지를 불러오는 중 문제가 발생했어요.');
    }
  }, [imageUris, imageBase64s, remainingImageSlots, setImageUris, setImageBase64s]);

  const handleRemoveImage = useCallback(
    (index: number) => {
      safeHaptic(() => Haptics.selectionAsync());
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setImageUris(imageUris.filter((_, i) => i !== index));
      setImageBase64s(imageBase64s.filter((_, i) => i !== index));
    },
    [imageUris, imageBase64s, setImageUris, setImageBase64s],
  );

  const handleSelectLocation = useCallback(
    (value: string) => {
      safeHaptic(() => Haptics.selectionAsync());
      setLocation(value);
    },
    [setLocation],
  );

  const handleSelectSymptom = useCallback(
    (value: string) => {
      safeHaptic(() => Haptics.selectionAsync());
      setSymptom(value);
    },
    [setSymptom],
  );

  const handleStartAnalysis = useCallback(() => {
    if (!canProceed) return;
    safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
    // 백그라운드에서 요청서 정리를 시작한 뒤 결과 화면으로 이동한다.
    void submitAnalysis();
    router.push('/analysis');
  }, [canProceed, submitAnalysis]);

  const locationOptions = useMemo(() => LOCATION_OPTIONS, []);
  const symptomOptions = useMemo(() => SYMPTOM_OPTIONS, []);

  return {
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
  };
}
