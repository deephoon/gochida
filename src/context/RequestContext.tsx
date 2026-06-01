import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import type { RequestContextValue, AIRepairAnalysis } from '../types';
import { analyzeImage } from '../services/aiService';

const RequestContext = createContext<RequestContextValue | undefined>(undefined);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [imageBase64s, setImageBase64s] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [symptom, setSymptom] = useState<string>('');
  const [aiDraft, setAiDraft] = useState<string>('');
  const [selectedExpertId, setSelectedExpertId] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AIRepairAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addImageUri = useCallback((uri: string) => {
    setImageUris((prev) => [...prev, uri]);
  }, []);

  const removeImageUri = useCallback((uri: string) => {
    setImageUris((prev) => prev.filter((item) => item !== uri));
  }, []);

  const clearRequest = useCallback(() => {
    setImageUris([]);
    setImageBase64s([]);
    setLocation('');
    setSymptom('');
    setAiDraft('');
    setSelectedExpertId('');
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const submitAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeImage(location, symptom, imageBase64s);
      setAnalysisResult(result);
      if (result.status === 'SUCCESS' && result.requestDraft?.message) {
        setAiDraft(result.requestDraft.message);
      } else {
        setAiDraft('전문가 상담 후 결정');
      }
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [location, symptom, imageBase64s]);

  const value = useMemo<RequestContextValue>(
    () => ({
      imageUris,
      imageBase64s,
      location,
      symptom,
      aiDraft,
      selectedExpertId,
      analysisResult,
      isLoading,
      error,
      setImageUris,
      setImageBase64s,
      addImageUri,
      removeImageUri,
      setLocation,
      setSymptom,
      setAiDraft,
      setSelectedExpertId,
      clearRequest,
      submitAnalysis,
    }),
    [
      imageUris,
      imageBase64s,
      location,
      symptom,
      aiDraft,
      selectedExpertId,
      analysisResult,
      isLoading,
      error,
      addImageUri,
      removeImageUri,
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
