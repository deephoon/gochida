import type { ExpertResponse } from '../types';

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
    costLevel: '가장 저렴한 소규모 부분 수리 수준',
    visitRequired: true,
    comment: '간단하게 교체만 빠르게 해드립니다. 부품은 직접 준비해 주시면 수월합니다.',
    warranty: {
      type: '없음',
      includedCare: []
    }
  }
];
