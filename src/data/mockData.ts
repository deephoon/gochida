import { AIRepairAnalysis, ExpertResponse } from '../types';

export const mockExpertResponses: ExpertResponse[] = [
  {
    id: 'e1',
    expertName: '김반장 홈케어',
    available: '가능',
    visitRequired: false,
    workType: '부분 교체',
    costLevel: '소규모 작업',
    schedule: '내일 오전 가능',
    comment: '사진상 망만 찢어진 것으로 보여 현장에서 바로 부분 교체 가능합니다.',
    rating: 4.8,
    trustElements: ['작업 확인서 가능', '응답 빠름'],
    warranty: {
      available: true,
      type: '안심 보증서',
      period: '1년',
      description: '시공 후 1년 이내 하자 발생 시 무상 A/S',
      includedCare: ['재시공']
    }
  },
  {
    id: 'e2',
    expertName: '꼼꼼시공 이기사',
    available: '현장 확인 필요',
    visitRequired: true,
    workType: '추가 점검',
    costLevel: '현장 확인 후 확정',
    schedule: '모레 오후 방문 가능',
    comment: '프레임 휘어짐이 의심됩니다. 방문하여 정확한 진단 후 안내해 드리겠습니다.',
    rating: 4.9,
    trustElements: ['경력 10년 이상', '현장 견적 무료'],
    warranty: {
      available: true,
      type: '작업 확인서',
      period: '6개월',
      description: '작업 후 6개월 이내 동일 문제 발생 시 점검',
      includedCare: ['무상 점검']
    }
  },
  {
    id: 'e3',
    expertName: '뚝딱뚝딱 만물상',
    available: '가능',
    visitRequired: false,
    workType: '전체 교체',
    costLevel: '중간 수준 작업',
    schedule: '이번 주 주말 가능',
    comment: '오래된 알루미늄 방충망으로 보입니다. 미세 방충망으로 전체 교체를 추천합니다.',
    rating: 4.5,
    trustElements: ['친절한 상담', '깔끔한 마무리'],
    warranty: {
      available: false,
      type: '없음',
      period: '',
      description: '',
      includedCare: []
    }
  },
];

export const buildMockAnalysis = (
  location: string,
  symptom: string
): AIRepairAnalysis => ({
  status: 'SUCCESS',
  problemCandidate: '방충망 망 손상 또는 프레임 변형 의심',
  tradeCategory: '방충망/창호',
  confidence: '보통',
  visibleEvidence: [
    '망 일부에 찢어짐 또는 늘어짐으로 보이는 흔적',
    '프레임 모서리 정렬이 다소 어긋난 정황',
  ],
  uncertainty: [
    '프레임 내부 휘어짐 여부는 사진만으로 단정 어려움',
    '레일 마모 정도는 측면 사진이 있어야 확인 가능',
  ],
  riskLevel: '낮음',
  visitRequired: true,
  costSense: '소규모 작업 가능성',
  actionRecommendation: '망 부분 교체 또는 프레임 포함 부분 교체',
  selfCheckGuide: {
    available: true,
    steps: [
      '프레임이 휘어졌는지 측면에서 확인',
      '망만 찢어진 경우 부분 보수 가능 여부 확인',
      '모헤어(털실)의 마모 상태 확인',
    ],
    doNotAttemptIf: [
      '높은 곳에서의 작업은 직접 시도하지 말고 전문가에게 의뢰하세요.',
    ],
  },
  additionalQuestions: [
    '문제가 언제부터 시작되었나요?',
    '같은 증상이 다른 위치에도 있나요?',
  ],
  additionalPhotosNeeded: false,
  requestDraft: {
    title: `${location} ${symptom} 점검/보수 요청`,
    message: `${location}에서 ${symptom} 증상이 발생했습니다. 사진을 함께 첨부드리니 망 부분 교체 또는 프레임 포함 부분 교체 가능 여부와 일정, 대략적인 비용 감각을 알려주세요.`,
    structured: {
      location,
      symptom,
      suspected_issue: '방충망 망 손상 또는 프레임 변형 의심',
      requested_work: '망 부분 교체 또는 프레임 포함 부분 교체',
      additional_note: '방문 일정 가능 시간 안내 부탁드립니다.',
    },
  },
  disclaimer:
    '사진 기반 1차 분석 결과이며, 최종 진단과 정확한 비용은 전문가 확인 후 달라질 수 있습니다.',
});
