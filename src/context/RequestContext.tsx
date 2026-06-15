import React, { createContext, useCallback, useContext, useMemo, useRef, useState, ReactNode } from 'react';
import type { RequestContextValue, AIRepairAnalysis, ConsultationRoom } from '../types';
import { analyzeImage } from '../services/aiService';
import { buildConsultationThread } from '../data/mockData';

const RequestContext = createContext<RequestContextValue | undefined>(undefined);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [imageBase64s, setImageBase64s] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [symptom, setSymptom] = useState<string>('');
  const [aiDraft, setAiDraft] = useState<string>('');
  const [additionalMemo, setAdditionalMemo] = useState<string>('');
  const [selectedExpertId, setSelectedExpertId] = useState<string>('');
  const [selectedExpertName, setSelectedExpertName] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AIRepairAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<ConsultationRoom[]>([]);

  // 동일 분석이 동시에 두 번 호출되지 않도록 막는 가드.
  // (upload에서 submit 후 analysis 화면 useEffect가 재차 호출하는 경쟁 상황 방지)
  const inFlightRef = useRef(false);

  const clearRequest = useCallback(() => {
    setImageUris([]);
    setImageBase64s([]);
    setLocation('');
    setSymptom('');
    setAiDraft('');
    setAdditionalMemo('');
    setSelectedExpertId('');
    setSelectedExpertName('');
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
    // 상담방(consultations)은 의도적으로 유지한다 — 새 요청을 시작해도 기존 상담 내역은 채팅에 남아야 한다.
  }, []);

  const submitAnalysis = useCallback(async () => {
    if (inFlightRef.current) return; // 중복 호출 방지
    inFlightRef.current = true;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
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
      inFlightRef.current = false;
    }
  }, [location, symptom, imageBase64s]);

  const startConsultation = useCallback<RequestContextValue['startConsultation']>((room) => {
    const id = room.id;
    setConsultations((prev) => {
      const existing = prev.find((c) => c.id === id);
      // 이미 상담방이 있으면 기존 대화 스레드를 보존한다(재진입 시 대화 유실 방지).
      const thread = existing?.thread ?? buildConsultationThread(room.previewMessage);
      const last = thread[thread.length - 1];
      const next: ConsultationRoom = {
        id,
        expertId: room.expertId,
        expertName: room.expertName,
        requestTitle: room.requestTitle,
        warrantyType: room.warrantyType,
        previewMessage: room.previewMessage,
        lastMessage: last?.text ?? room.previewMessage,
        timeText: '방금',
        unread: 0,
        thread,
      };
      const rest = prev.filter((c) => c.id !== id);
      // 최신 상담을 맨 앞으로
      return [next, ...rest];
    });
    return id;
  }, []);

  const appendConsultationMessage = useCallback<RequestContextValue['appendConsultationMessage']>(
    (roomId, message) => {
      setConsultations((prev) =>
        prev.map((c) =>
          c.id === roomId
            ? { ...c, thread: [...c.thread, message], lastMessage: message.text, timeText: '방금' }
            : c
        )
      );
    },
    []
  );

  const value = useMemo<RequestContextValue>(
    () => ({
      imageUris,
      imageBase64s,
      location,
      symptom,
      aiDraft,
      additionalMemo,
      selectedExpertId,
      selectedExpertName,
      analysisResult,
      isLoading,
      error,
      consultations,
      setImageUris,
      setImageBase64s,
      setLocation,
      setSymptom,
      setAiDraft,
      setAdditionalMemo,
      setSelectedExpertId,
      setSelectedExpertName,
      setAnalysisResult,
      clearRequest,
      submitAnalysis,
      startConsultation,
      appendConsultationMessage,
    }),
    [
      imageUris,
      imageBase64s,
      location,
      symptom,
      aiDraft,
      additionalMemo,
      selectedExpertId,
      selectedExpertName,
      analysisResult,
      isLoading,
      error,
      consultations,
      setAnalysisResult,
      clearRequest,
      submitAnalysis,
      startConsultation,
      appendConsultationMessage,
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
