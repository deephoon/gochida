import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useRequest } from '../context/RequestContext';

export const MAX_PHOTOS = 3;

/**
 * 촬영/앨범 선택 플로우를 홈 CTA·FAB·업로드 화면이 공유하는 훅.
 * imageUris와 imageBase64s가 항상 같은 길이를 유지하도록 base64가 있는 asset만 쌍으로 추가한다.
 */
export function useRequestFlow() {
  const { imageUris, setImageUris, setImageBase64s, clearRequest } = useRequest();

  /** 선택/촬영 결과를 상태에 반영하고 실제 추가된 장수를 반환한다. */
  const appendAssets = useCallback(
    (result: ImagePicker.ImagePickerResult): number => {
      if (result.canceled || !result.assets) return 0;
      const valid = result.assets.filter((a) => !!a.base64);
      if (valid.length < result.assets.length) {
        Alert.alert('안내', '일부 사진을 불러오지 못했어요. 다시 선택해 주세요.');
      }
      if (valid.length === 0) return 0;
      setImageUris((prev) => [...prev, ...valid.map((a) => a.uri)].slice(0, MAX_PHOTOS));
      setImageBase64s((prev) => [...prev, ...valid.map((a) => a.base64 as string)].slice(0, MAX_PHOTOS));
      return valid.length;
    },
    [setImageUris, setImageBase64s]
  );

  const takePhoto = useCallback(async (): Promise<number> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('카메라 권한 필요', '문제 상황을 직접 촬영하려면 설정에서 카메라 접근을 허용해 주세요.');
      return 0;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      base64: true,
    });
    return appendAssets(result);
  }, [appendAssets]);

  const pickFromLibrary = useCallback(
    async (remainingSlots: number): Promise<number> => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('사진 권한 필요', '앨범에서 사진을 선택하려면 설정에서 사진 접근을 허용해 주세요.');
        return 0;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, remainingSlots),
        quality: 0.7,
        base64: true,
      });
      return appendAssets(result);
    },
    [appendAssets]
  );

  const showSourceSheet = useCallback(
    (remainingSlots: number, onAdded?: (count: number) => void) => {
      // 웹에서는 Alert 버튼이 동작하지 않고 카메라도 일반적이지 않으므로 바로 앨범 선택으로 진행한다.
      if (Platform.OS === 'web') {
        void pickFromLibrary(remainingSlots).then((n) => onAdded?.(n));
        return;
      }
      Alert.alert(
        '사진을 어떻게 추가할까요?',
        '문제 부위를 직접 촬영하거나, 앨범에서 이미 찍어둔 사진을 선택할 수 있어요.',
        [
          {
            text: '사진 촬영하기',
            onPress: () => {
              void takePhoto().then((n) => onAdded?.(n));
            },
          },
          {
            text: '앨범에서 선택하기',
            onPress: () => {
              void pickFromLibrary(remainingSlots).then((n) => onAdded?.(n));
            },
          },
          { text: '취소', style: 'cancel' },
        ],
        { cancelable: true }
      );
    },
    [takePhoto, pickFromLibrary]
  );

  /** 홈 CTA/FAB: 이전 요청을 비우고 선택 UI를 띄운 뒤, 사진이 추가되면 업로드 화면으로 이동한다. */
  const startNewRequest = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    clearRequest();
    showSourceSheet(MAX_PHOTOS, (count) => {
      if (count > 0) router.push('/upload');
    });
  }, [clearRequest, showSourceSheet]);

  /** 업로드 화면: 남은 슬롯만큼만 추가 선택을 허용한다. */
  const addPhotos = useCallback(() => {
    const remaining = MAX_PHOTOS - imageUris.length;
    if (remaining <= 0) {
      Alert.alert('안내', `사진은 최대 ${MAX_PHOTOS}장까지 추가할 수 있어요.`);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    showSourceSheet(remaining);
  }, [imageUris.length, showSourceSheet]);

  return { startNewRequest, addPhotos };
}
