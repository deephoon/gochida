import type { Dispatch, SetStateAction } from 'react';

export type WarrantyType = '안심 보증서' | '작업 확인서' | '없음';

export interface WarrantyOption {
  type: WarrantyType;
  /** 반드시 필수 배열로 유지 (사후관리 조건). */
  includedCare: string[];
  // 아래는 백엔드 연동 시 채워질 수 있는 선택 필드 (현 mock 데이터와 호환).
  available?: boolean;
  period?: string;
  description?: string;
}

export interface ExpertResponse {
  id: string;
  expertName: string;
  available: boolean;
  workType: string;
  costLevel: string;
  visitRequired: boolean;
  comment: string;
  warranty: WarrantyOption;
  // 백엔드 연동 시 확장 가능한 선택 필드.
  rating?: number;
  schedule?: string;
  trustElements?: string[];
  /** 응답 근거 (예: 사진 기반 확인 / 현장 실측 필요). */
  responseBasis?: string;
  /** 추천순 정렬 시 사용자에게 보여줄 추천 이유. */
  recommendedReason?: string;
}

/** 요청서 검토 화면의 완성도 표시용 구조. */
export interface RequestCompleteness {
  score: number;
  completedItems: string[];
  missingItems: string[];
  recommendation: string;
}

export interface AIRepairAnalysis {
  status: 'SUCCESS' | 'REJECTED';
  rejection_reason?: string;
  problemCandidate: string;
  tradeCategory: string;
  confidence: '낮음' | '보통' | '높음';
  visibleEvidence: string[];
  uncertainty: string[];
  riskLevel: '낮음' | '보통' | '높음';
  visitRequired: boolean;
  costSense: string;
  actionRecommendation: string;
  selfCheckGuide: {
    available: boolean;
    steps: string[];
    doNotAttemptIf: string[];
  };
  additionalQuestions: string[];
  additionalPhotosNeeded: boolean;
  requestDraft: {
    title: string;
    message: string;
    structured: {
      location: string;
      symptom: string;
      suspected_issue: string;
      requested_work: string;
      additional_note: string;
    };
  };
  disclaimer: string;
  priceGuide?: RepairPriceGuide;
}


export interface RequestState {
  imageUris: string[];
  imageBase64s: string[];
  location: string;
  symptom: string;
  aiDraft: string;
  selectedExpertId: string;
  analysisResult: AIRepairAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

export interface RequestContextValue extends RequestState {
  // 함수형 업데이트(prev => next)를 허용하기 위해 useState 디스패처 타입을 그대로 노출한다.
  setImageUris: Dispatch<SetStateAction<string[]>>;
  setImageBase64s: Dispatch<SetStateAction<string[]>>;
  setLocation: (location: string) => void;
  setSymptom: (symptom: string) => void;
  setAiDraft: (draft: string) => void;
  setSelectedExpertId: (expertId: string) => void;
  setAnalysisResult: (result: AIRepairAnalysis | null) => void;
  clearRequest: () => void;
  submitAnalysis: () => Promise<void>;
}

// 기존에 존재하던 추가 타입들 (필요시 유지)
export interface RepairPriceGuide {
  id: string;
  tradeCategory: string;
  title: string;
  averagePrice: string;
  priceRange: string;
  factors: string[];
  disclaimer?: string;
  /** 추천 점수 계산용 매칭 메타데이터. 로딩 화면의 관련 공종 우선 노출에 사용. */
  relatedLocations?: string[];
  relatedSymptoms?: string[];
  keywords?: string[];
}

/** expert/[id] 라우트 파라미터. id가 string | string[] | undefined일 수 있음. */
export interface ExpertDetailRouteParams {
  id?: string | string[];
}

/** 전문가 응답/요청 제출 시 서버로 전달되는 데이터 형태. */
export type RequestData = RequestState;
