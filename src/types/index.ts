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
  /** 해당 전문가가 이 유형의 확인서/보증서를 발급한 누적 건수 (신뢰 지표). */
  issuedCount?: number;
  /** "발급 이력이 많은 전문가" 같은 신뢰 지표 설명 라벨. 법적 보장 표현은 사용하지 않는다. */
  trustImpactLabel?: string;
}

/**
 * 전문가 신뢰 지표. 별점 외에 작업 확인서·보증서 발급 이력과 사후관리 응답률을
 * 리뷰처럼 누적 데이터로 보여주기 위한 구조. (법적 보장이 아닌 참고 지표)
 */
export interface TrustStats {
  /** 확인 완료된 누적 작업 수. */
  completedJobs: number;
  /** 작업 확인서 발급 누적 건수. */
  certificateIssuedCount: number;
  /** 안심 보증서 발급 누적 건수. */
  warrantyIssuedCount: number;
  /** 사후관리 응답률 (0~100). */
  afterCareResponseRate: number;
  /** 최근 확인서 발급 시점 (예: "3일 전"). */
  recentCertificateIssuedAt?: string;
  /** 최근 30일 확인서 발급 건수. */
  recentCertificateCount?: number;
  /** 확인서 기반으로 검증된 작업 비율 (0~100). */
  verifiedJobRatio?: number;
}

/** 채팅 메시지 (Mock 상담방의 대화 한 줄). */
export interface ChatMessage {
  from: 'me' | 'expert';
  text: string;
}

/** 상담 시작 시 채팅 탭에 노출되는 상담방 (실제 채팅 서버 없이 Mock). */
export interface ConsultationRoom {
  id: string;
  expertId: string;
  expertName: string;
  requestTitle: string;
  warrantyType: WarrantyType;
  /** 사용자가 전문가에게 보내는 첫 메시지(미리보기). */
  previewMessage: string;
  lastMessage: string;
  timeText: string;
  unread: number;
  /** 상담방 대화 스레드. 탭 이동 후 복귀해도 유지되도록 전역 보관. */
  thread: ChatMessage[];
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
  /** 별점 외 신뢰 지표 (작업 확인서/보증서 발급 이력 등). */
  trustStats?: TrustStats;
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
  /** 요청서 검토 화면에서 사용자가 덧붙인 메모. 탭 이동 후 복귀해도 유지되도록 전역 보관. */
  additionalMemo: string;
  selectedExpertId: string;
  selectedExpertName: string;
  analysisResult: AIRepairAnalysis | null;
  isLoading: boolean;
  error: string | null;
  /** 시작된 상담방 목록 (채팅 탭에서 Mock 상담방으로 노출). */
  consultations: ConsultationRoom[];
}

export interface RequestContextValue extends RequestState {
  // 함수형 업데이트(prev => next)를 허용하기 위해 useState 디스패처 타입을 그대로 노출한다.
  setImageUris: Dispatch<SetStateAction<string[]>>;
  setImageBase64s: Dispatch<SetStateAction<string[]>>;
  setLocation: (location: string) => void;
  setSymptom: (symptom: string) => void;
  setAiDraft: (draft: string) => void;
  setAdditionalMemo: (memo: string) => void;
  setSelectedExpertId: (expertId: string) => void;
  setSelectedExpertName: (name: string) => void;
  setAnalysisResult: (result: AIRepairAnalysis | null) => void;
  clearRequest: () => void;
  submitAnalysis: () => Promise<void>;
  /** 상담 시작: 상담방을 생성(또는 갱신)하고 해당 방 id를 반환한다. 대화 스레드는 내부에서 초기화한다. */
  startConsultation: (
    room: Omit<ConsultationRoom, 'lastMessage' | 'timeText' | 'unread' | 'thread'>
  ) => string;
  /** 상담방에 메시지를 추가하고 lastMessage를 갱신한다. (탭 이동 후에도 유지) */
  appendConsultationMessage: (roomId: string, message: ChatMessage) => void;
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
