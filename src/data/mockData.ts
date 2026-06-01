import type { AIRepairAnalysis, ExpertResponse } from '../types';
import { getSuggestedPriceGuide } from './repairPriceGuides';

export const mockExpertResponses: ExpertResponse[] = [
  {
    id: 'expert_1',
    expertName: '김반장 설비',
    available: true,
    workType: '수전 교체',
    costLevel: '소규모 부분 수리 수준',
    visitRequired: true,
    comment: '사진상으로 수전 부식이 확인됩니다. 현장 상태를 보고 호스 교체까지 필요할 수 있습니다. 꼼꼼히 작업해 드리겠습니다.',
    warranty: {
      type: '안심 보증서',
      includedCare: [
        '작업 후 7일 내 누수 발생 시 무상 재확인',
        '동일 부위 간단 보수 상담'
      ]
    }
  },
  {
    id: 'expert_2',
    expertName: '스마트 홈케어',
    available: true,
    workType: '수전 및 배관 수리',
    costLevel: '중간 수준 작업',
    visitRequired: true,
    comment: '비슷한 시공 경험이 많습니다. 교체 후 정상 작동 여부를 현장에서 확실히 점검해 드립니다.',
    warranty: {
      type: '작업 확인서',
      includedCare: [
        '시공 완료 후 상태 점검표 제공',
        '정상 작동 시연'
      ]
    }
  },
  {
    id: 'expert_3',
    expertName: '동네 뚝딱이',
    available: true,
    workType: '단순 수전 교체',
    costLevel: '부담이 적은 소규모 부분 수리 수준',
    visitRequired: true,
    comment: '간단하게 교체만 빠르게 해드립니다. 부품은 직접 준비해 주시면 수월합니다.',
    warranty: {
      type: '없음',
      includedCare: []
    }
  }
];

/**
 * AI 요청서 정리 Mock fallback.
 * EXPO_PUBLIC_USE_MOCK_AI=true 이거나 API 키가 없을 때 aiService에서 사용한다.
 * status는 호출부(aiService)에서 SUCCESS로 채워진다.
 * 문구는 금지 표현(진단/확정 견적/최저가/무조건 보장)을 사용하지 않는다.
 */
export function buildMockAnalysis(
  location: string,
  symptom: string,
): Omit<AIRepairAnalysis, 'status'> {
  const guide = getSuggestedPriceGuide(location, symptom);
  const loc = location || '문제 부위';
  const sym = symptom || '이상 증상';

  return {
    problemCandidate: `${loc} ${guide.tradeCategory} 관련 작업`,
    tradeCategory: guide.tradeCategory,
    confidence: '보통',
    visibleEvidence: [
      `${loc}에서 ${sym} 정황이 사진으로 확인됩니다.`,
      `${guide.title} 범위의 작업이 필요해 보입니다.`,
    ],
    uncertainty: [
      '사진만으로는 내부 상태나 정확한 작업 범위를 확정하기 어렵습니다.',
      '실제 작업 범위는 전문가 확인 후 달라질 수 있습니다.',
    ],
    riskLevel: '보통',
    visitRequired: true,
    costSense: `${guide.priceRange} 정도의 참고 시공 단가가 형성되어 있어요. 실제 비용은 현장 상황에 따라 달라질 수 있습니다.`,
    actionRecommendation:
      '아래 요청서 초안을 확인한 뒤, 전문가에게 전달해 작업 조건을 비교해 보세요.',
    selfCheckGuide: {
      available: false,
      steps: [],
      doNotAttemptIf: [
        '누수·전기·배관처럼 위험이 따르는 작업은 직접 손대지 말고 전문가에게 맡기세요.',
      ],
    },
    additionalQuestions: [
      '증상이 처음 나타난 시점은 언제인가요?',
      '이전에 같은 부위를 수리한 적이 있나요?',
    ],
    additionalPhotosNeeded: false,
    requestDraft: {
      title: `${loc} ${sym} 관련 작업 요청`,
      message: `${loc}의 ${sym} 증상으로 점검 및 수리를 요청드립니다. 사진을 참고해 작업 가능 여부와 방문 일정, 사후관리 조건을 알려주세요.`,
      structured: {
        location: loc,
        symptom: sym,
        suspected_issue: `${guide.tradeCategory} 관련 이상`,
        requested_work: guide.title,
        additional_note: '참고 시공 단가는 비용 감각 용도이며, 전문가 확인 후 달라질 수 있습니다.',
      },
    },
    disclaimer:
      '사진과 입력 정보를 바탕으로 정리한 요청서 초안이며, 실제 작업 범위와 비용은 전문가 확인 후 달라질 수 있습니다.',
  };
}
