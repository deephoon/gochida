export interface ExpertResponse {
  id: string;
  expertName: string;
  rating: number;
  available: boolean;
  workType: string;
  costLevel: string;
  visitRequired: boolean;
  schedule: string;
  comment: string;
  trustElements: string[];
  warranty: WarrantyOption;
}

export interface WarrantyOption {
  available: boolean;
  type: "작업 확인서" | "안심 보증서" | "없음";
  period: string;
  description: string;
  includedCare: string[];
}

export interface RepairPriceGuide {
  id: string;
  tradeCategory: string;
  title: string;
  averagePrice: string;
  priceRange: string;
  factors: string[];
  disclaimer: string;
}

export interface AIRepairAnalysis {
  status?: "SUCCESS" | "REJECTED";
  rejection_reason?: string;
  problemCandidate: string;
  tradeCategory: string;
  confidence: "낮음" | "보통" | "높음";
  visibleEvidence: string[];
  uncertainty: string[];
  riskLevel: "낮음" | "보통" | "높음";
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

export interface RequestData {
  id: string;
  imageUri: string;
  location: string;
  symptom: string;
  analysis: AIRepairAnalysis;
  draftText: string;
}
