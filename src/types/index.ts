export type WarrantyType = '안심 보증서' | '작업 확인서' | '없음';

export interface WarrantyOption {
  type: WarrantyType;
  includedCare: string[];
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
  setImageUris: (uris: string[]) => void;
  setImageBase64s: (base64s: string[]) => void;
  addImageUri: (uri: string) => void;
  removeImageUri: (uri: string) => void;
  setLocation: (location: string) => void;
  setSymptom: (symptom: string) => void;
  setAiDraft: (draft: string) => void;
  setSelectedExpertId: (expertId: string) => void;
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
  disclaimer: string;
}
