import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { AIRepairAnalysis } from '../types';
import { analyzeImage } from '../services/aiService';

interface RequestContextData {
  imageUris: string[];
  imageBase64s: string[];
  location: string;
  symptom: string;
  analysisResult: AIRepairAnalysis | null;
  draftText: string;
  isLoading: boolean;
  error: string | null;

  setImageUris: (uris: string[]) => void;
  setImageBase64s: (base64s: string[]) => void;
  setLocation: (loc: string) => void;
  setSymptom: (sym: string) => void;
  setAnalysisResult: (result: AIRepairAnalysis | null) => void;
  setDraftText: (text: string) => void;
  clearRequest: () => void;
  
  // State Flow: View에서 Service를 직접 호출하지 않고 Context를 통해 상태와 통신을 제어
  submitAnalysis: () => Promise<void>;
}

const RequestContext = createContext<RequestContextData | undefined>(undefined);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [imageBase64s, setImageBase64s] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [symptom, setSymptom] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AIRepairAnalysis | null>(null);
  const [draftText, setDraftText] = useState<string>('');
  
  // 비동기 통신 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearRequest = useCallback(() => {
    setImageUris([]);
    setImageBase64s([]);
    setLocation('');
    setSymptom('');
    setAnalysisResult(null);
    setDraftText('');
    setIsLoading(false);
    setError(null);
  }, []);

  const submitAnalysis = useCallback(async () => {
    if (imageBase64s.length === 0 || !location || !symptom) {
      setError('입력 데이터가 부족합니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeImage(location, symptom, imageBase64s);
      
      // AI가 사진 판독 불가/생활시공 무관으로 거부한 경우
      if (result.status === 'REJECTED') {
        setError(result.rejection_reason || 'AI가 분석할 수 없는 사진입니다.');
        setAnalysisResult(null);
      } else {
        setAnalysisResult(result);
      }
    } catch (e: any) {
      setError(e.message || '분석 중 오류가 발생했습니다.');
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64s, location, symptom]);

  const value = useMemo<RequestContextData>(
    () => ({
      imageUris,
      imageBase64s,
      location,
      symptom,
      analysisResult,
      draftText,
      isLoading,
      error,
      setImageUris,
      setImageBase64s,
      setLocation,
      setSymptom,
      setAnalysisResult,
      setDraftText,
      clearRequest,
      submitAnalysis,
    }),
    [
      imageUris,
      imageBase64s,
      location,
      symptom,
      analysisResult,
      draftText,
      isLoading,
      error,
      clearRequest,
      submitAnalysis,
    ]
  );

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
};
