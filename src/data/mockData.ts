import { getSuggestedPriceGuide } from './repairPriceGuides';
import type { ChatMessage } from '../types';
export { getSuggestedPriceGuide };

export const LOCATIONS = ['거실', '주방', '욕실', '침실', '베란다', '현관', '기타'];
export const SYMPTOMS = ['파손/고장', '소음', '누수', '작동 불량', '악취', '기타'];

export const ASSET = {
  heroFlow: require('../../assets/images/Hero_RepairFlow.png'),
  aiDraft: require('../../assets/images/Asset_AIRequestDraft.png'),
  priceGuide: require('../../assets/images/Asset_PriceGuide.png'),
  uploadCamera: require('../../assets/images/Asset_UploadCamera.png'),
  warranty: require('../../assets/images/Asset_WarrantyDocument.png'),
  expertCards: require('../../assets/images/Asset_ExpertCards.png'),
  windowScreen: require('../../assets/images/Asset_WindowScreen.png'),
  bathSilicone: require('../../assets/images/Asset_BathSilicone.png'),
  doorRepair: require('../../assets/images/Asset_DoorRepair.png'),
};

export const HOME_STEPS = [
  { n: '1', title: '문제 사진 찍기', desc: '거실, 욕실, 어디든 한 장이면 OK' },
  { n: '2', title: 'AI 요청서 정리', desc: '공종 분류와 참고 시세까지 자동' },
  { n: '3', title: '전문가 응답 비교', desc: '같은 기준으로 시공자 응답을 한눈에' },
];

export const PRICE_PREVIEW = [
  { label: '방충망/창호', price: '약 5만~15만 원', img: ASSET.windowScreen },
  { label: '욕실 실리콘', price: '약 15만~25만 원', img: ASSET.bathSilicone },
  { label: '문/문틀', price: '약 5만~10만 원', img: ASSET.doorRepair },
];

export const MOCK_REQUESTS = [
  {
    id: 'demo-request-1', title: '베란다 방충망 보수 요청',
    status: 'responded', statusLabel: '전문가 응답 3건 도착',
    location: '베란다', symptom: '파손/고장', tradeCategory: '방충망/창호',
    requestedWork: '망 교체 또는 프레임 확인', responses: 3, dateText: '오늘',
  },
  {
    id: 'demo-request-2', title: '욕실 실리콘 재시공 문의',
    status: 'completed', statusLabel: '작업 확인서 발급 가능',
    location: '욕실', symptom: '곰팡이/마감 불량', tradeCategory: '욕실 실리콘',
    requestedWork: '실리콘 제거 및 재시공 확인', responses: 2, dateText: '3일 전',
  },
];

export const STATUS_LABEL = {
  draft: '요청서 작성 중', ai_done: '요청서 정리 완료', waiting: '응답 대기',
  responded: '응답 도착', chatting: '상담 중', completed: '작업 완료',
};

/** 홈 상단 공종 바로가기 그리드. preset으로 업로드 화면 초기값을 채운다. */
export const HOME_CATEGORIES: {
  key: string;
  label: string;
  icon: 'droplet' | 'sparkle' | 'window' | 'plug' | 'door' | 'brush' | 'wrench' | 'grid';
  tint: string;
  bg: string;
  preset?: { location?: string; symptom?: string };
}[] = [
  { key: 'faucet', label: '수전·누수', icon: 'droplet', tint: '#2E8BEE', bg: '#E9F3FE', preset: { location: '주방', symptom: '누수' } },
  { key: 'silicone', label: '욕실·실리콘', icon: 'sparkle', tint: '#16B8A6', bg: '#E4F7F4', preset: { location: '욕실', symptom: '작동 불량' } },
  { key: 'screen', label: '방충망·창호', icon: 'window', tint: '#5B6CFF', bg: '#EEF0FF', preset: { location: '베란다', symptom: '파손/고장' } },
  { key: 'electric', label: '전기·조명', icon: 'plug', tint: '#F5A623', bg: '#FFF4E2', preset: { location: '거실', symptom: '작동 불량' } },
  { key: 'door', label: '문·경첩', icon: 'door', tint: '#8B5CF6', bg: '#F1ECFE', preset: { location: '현관', symptom: '작동 불량' } },
  { key: 'wallpaper', label: '도배·벽지', icon: 'brush', tint: '#EC6A8C', bg: '#FDEBF1', preset: { location: '침실', symptom: '파손/고장' } },
  { key: 'plumbing', label: '배수·악취', icon: 'wrench', tint: '#4B9E6B', bg: '#E8F6EE', preset: { location: '욕실', symptom: '악취' } },
  { key: 'all', label: '전체보기', icon: 'grid', tint: '#6E6E73', bg: '#F0F0F3' },
];

/** 홈 신뢰 지표 스트립. */
export const HOME_STATS = [
  { value: '12,840+', label: '누적 시공 요청', icon: 'wrench' as const },
  { value: '평균 23분', label: '첫 응답 시간', icon: 'clock' as const },
  { value: '94%', label: '재방문·추천율', icon: 'thumbsUp' as const },
];

/** 홈 프로모션/이벤트 가로 배너. */
export const HOME_PROMOS: {
  id: string;
  title: string;
  desc: string;
  badge: string;
  icon: 'gift' | 'shield' | 'sparkle';
  colors: [string, string];
}[] = [
  { id: 'promo-1', title: '첫 요청 안심 보증 UP', desc: '첫 시공 요청 시 안심 보증서를 무료로 제공해요', badge: 'EVENT', icon: 'gift', colors: ['#FF8A5B', '#FF5E7E'] },
  { id: 'promo-2', title: '겨울철 결로·곰팡이 점검', desc: '시즌 다발 문제, 사진으로 미리 진단받으세요', badge: '시즌', icon: 'shield', colors: ['#3FA9F5', '#2E6CEE'] },
  { id: 'promo-3', title: 'AI 요청서로 견적 비교', desc: '같은 기준으로 전문가 응답을 한눈에 비교', badge: 'TIP', icon: 'sparkle', colors: ['#7C6BFF', '#4654D9'] },
];

/** 홈 추천 전문가 가로 카드. */
export const RECOMMENDED_EXPERTS = [
  { id: 'kim', name: '김반장 홈케어', trade: '방충망·창호', rating: 4.8, reviews: 312, tag: '사진 확인 가능', tagType: 'primary' as const, area: '서울 강서·양천', career: 12, badge: '안심 보증' },
  { id: 'lee', name: '꼼꼼시공 이기사', trade: '욕실·방수', rating: 4.9, reviews: 528, tag: '실측 견적', tagType: 'neutral' as const, area: '서울 마포·서대문', career: 18, badge: '작업 확인서' },
  { id: 'park', name: '바로고침 박기사', trade: '전기·조명', rating: 4.7, reviews: 241, tag: '당일 방문', tagType: 'success' as const, area: '서울 송파·강동', career: 9, badge: '안심 보증' },
];

/** 홈 실시간 후기. */
export const HOME_REVIEWS = [
  { id: 'r1', name: '이○현', trade: '욕실 실리콘', rating: 5, text: '사진만 올렸는데 어떤 작업이 필요한지 정리가 깔끔하게 돼서 비교가 쉬웠어요. 보증서까지 받아 든든합니다.', time: '2시간 전' },
  { id: 'r2', name: '정○우', trade: '방충망 교체', rating: 5, text: '같은 기준으로 견적을 비교하니 과한 비용인지 바로 알겠더라고요. 당일 방문 가능한 분으로 빠르게 해결!', time: '어제' },
  { id: 'r3', name: '최○aja', trade: '문 경첩 조정', rating: 4, text: '작은 작업이라 부르기 애매했는데 합리적으로 처리해 주셨어요. 작업 전후 사진도 남겨주셔서 좋았습니다.', time: '3일 전' },
];

/** 홈 생활 시공 팁 콘텐츠. */
export const HOME_TIPS: {
  id: string;
  category: string;
  title: string;
  readTime: string;
  icon: 'droplet' | 'sparkle' | 'shield' | 'warning';
  tint: string;
  bg: string;
}[] = [
  { id: 't1', category: '누수', title: '수전 아래 물자국, 직접 확인하는 3가지 방법', readTime: '2분', icon: 'droplet', tint: '#2E8BEE', bg: '#E9F3FE' },
  { id: 't2', category: '곰팡이', title: '욕실 실리콘 곰팡이, 재시공 타이밍 잡기', readTime: '3분', icon: 'sparkle', tint: '#16B8A6', bg: '#E4F7F4' },
  { id: 't3', category: '안전', title: '직접 손대면 위험한 작업 체크리스트', readTime: '2분', icon: 'warning', tint: '#F5A623', bg: '#FFF4E2' },
];

/** 홈 진행 중 요청 추적 카드 (단계별 진행 상태). */
export const ACTIVE_REQUEST = {
  id: 'demo-request-1',
  title: '베란다 방충망 보수 요청',
  tradeCategory: '방충망/창호',
  responses: 3,
  etaText: '오늘 18:00까지 응답 도착 예정',
  currentStep: 2, // 0-based index of in-progress step
  steps: ['요청 접수', 'AI 요청서', '전문가 응답', '상담·시공'],
};

export const MOCK_CHATS = [
  {
    id: 'chat-1', expertName: '김반장 홈케어', requestTitle: '베란다 방충망 보수 요청',
    lastMessage: '내일 오전 방문 가능해요.', timeText: '2분 전', warrantyType: '안심 보증서', unread: 1,
  },
  {
    id: 'chat-2', expertName: '꼼꼼시공 이기사', requestTitle: '베란다 방충망 보수 요청',
    lastMessage: '프레임 상태 확인이 필요합니다.', timeText: '15분 전', warrantyType: '작업 확인서', unread: 0,
  },
];

export const MOCK_CHAT_THREAD = [
  { from: 'me', text: '요청서 확인 부탁드립니다.' },
  { from: 'expert', text: '사진상 망 부분 교체 가능해 보입니다.' },
  { from: 'expert', text: '내일 오전 방문 가능합니다.' },
  { from: 'me', text: '작업 확인서 발급도 가능한가요?' },
  { from: 'expert', text: '네, 작업 전후 사진과 작업 범위를 정리해 드릴 수 있습니다.' },
];

const ANALYSIS_TEMPLATES: any = {
  screen: {
    problemCandidate: '방충망 망 손상 또는 프레임 변형 의심',
    confidence: '보통', riskLevel: '낮음', visitRequired: true,
    costSense: '소규모 작업 가능성',
    actionRecommendation: '망 부분 교체 또는 프레임 포함 부분 교체',
    visibleEvidence: ['망 일부에 찢어짐 또는 늘어짐으로 보이는 흔적', '프레임 모서리에 미세한 들뜸이 관찰됨'],
    uncertainty: ['프레임 내부 휘어짐 여부는 사진만으로 단정 어려움', '레일 마모 상태는 추가 확인 필요'],
    selfCheck: ['창틀 레일에 먼지나 이물질이 끼었는지 확인', '망이 프레임에서 빠진 것인지 찢어진 것인지 구분'],
    doNotAttempt: ['고층 외부 창에서 직접 탈착 시도', '프레임을 무리하게 휘어 끼우는 행위'],
    additionalQuestions: ['방충망 전체와 프레임이 함께 보이는 사진', '문제 부위를 가까이에서 찍은 사진'],
    additionalPhotosNeeded: true,
  },
  faucet: {
    problemCandidate: '수전 연결부 누수 또는 패킹 노후 의심',
    confidence: '보통', riskLevel: '보통', visitRequired: true,
    costSense: '소규모 ~ 중간 규모 작업 가능성',
    actionRecommendation: '패킹/카트리지 교체 또는 수전 본체 교체',
    visibleEvidence: ['연결부 주변 물자국 및 백화 흔적', '수전 하부 마감재 변색'],
    uncertainty: ['벽 내부 배관 상태는 사진만으로 판단 불가', '온수/냉수 양쪽 누수 여부 확인 필요'],
    selfCheck: ['하부 밸브를 잠그고 누수가 멈추는지 확인', '연결 호스 체결 상태 점검'],
    doNotAttempt: ['벽 매립 배관 직접 절단', '온수 배관 강제 분해'],
    additionalQuestions: ['수전 아래 배관 연결부가 보이는 사진', '누수 흔적(물자국)이 보이는 사진'],
    additionalPhotosNeeded: true,
  },
  silicone: {
    problemCandidate: '욕실 실리콘 마감 노후 및 곰팡이 발생 의심',
    confidence: '높음', riskLevel: '낮음', visitRequired: false,
    costSense: '중간 규모 작업 가능성',
    actionRecommendation: '기존 실리콘 제거 후 방수 실리콘 재시공',
    visibleEvidence: ['코너 실리콘 라인 변색 및 들뜸', '곰팡이로 보이는 흑색 반점 다수'],
    uncertainty: ['타일 뒷면 수분 침투 정도는 확인 필요', '하부 방수층 손상 여부 불확실'],
    selfCheck: ['실리콘 들뜸 부위를 손으로 가볍게 눌러 확인', '환기 후 곰팡이 재발 속도 관찰'],
    doNotAttempt: ['타일을 강제로 들어내는 작업', '독한 약품을 밀폐 공간에서 사용'],
    additionalQuestions: ['시공 범위 확인을 위한 욕실 전체 구도 사진'],
    additionalPhotosNeeded: false,
  },
  electric: {
    problemCandidate: '조명 기구 접속 불량 또는 안정기/LED 모듈 수명 의심',
    confidence: '보통', riskLevel: '높음', visitRequired: true,
    costSense: '소규모 작업 가능성 (부품비 별도)',
    actionRecommendation: '조명 모듈 또는 기구 교체, 배선 점검',
    visibleEvidence: ['조명 점멸 또는 일부 미점등으로 추정되는 상태', '소켓 주변 변색 가능성'],
    uncertainty: ['천장 내부 배선 상태는 사진만으로 판단 불가', '스위치 측 문제 여부 확인 필요'],
    selfCheck: ['다른 정상 전구로 교체해 기구 문제인지 확인', '두꺼비집(차단기) 상태 점검'],
    doNotAttempt: ['전원 차단 없이 배선 직접 접촉', '천장 매립 배선 임의 연결'],
    additionalQuestions: ['조명 기구 전체와 스위치가 보이는 사진', '분전함(두꺼비집) 사진'],
    additionalPhotosNeeded: true,
  },
  plumbing: {
    problemCandidate: '배수 트랩 막힘 또는 봉수 손상으로 인한 악취 의심',
    confidence: '보통', riskLevel: '보통', visitRequired: true,
    costSense: '소규모 ~ 중간 규모 작업 가능성',
    actionRecommendation: '트랩 청소 및 봉수 보강, 필요 시 관통 작업',
    visibleEvidence: ['배수구 주변 이물질 및 물때 축적', '트랩 연결부 헐거움 추정'],
    uncertainty: ['배관 깊은 곳의 막힘 위치는 내시경 확인 필요', '역류 원인이 공용관인지 불확실'],
    selfCheck: ['배수구 거름망 청소 후 냄새 변화 확인', '사용하지 않을 때 봉수가 마르는지 관찰'],
    doNotAttempt: ['강산성 약품 과다 투입', '배관을 분해한 채 방치'],
    additionalQuestions: ['배수구 내부가 보이는 사진', '냄새가 나는 위치 주변 사진'],
    additionalPhotosNeeded: true,
  },
  door: {
    problemCandidate: '경첩 유격 또는 문 손잡이 체결 불량 의심',
    confidence: '높음', riskLevel: '낮음', visitRequired: false,
    costSense: '소규모 작업 가능성',
    actionRecommendation: '경첩 조정/교체 또는 손잡이·도어락 부품 교체',
    visibleEvidence: ['문이 처지거나 틀과 간섭되는 흔적', '손잡이 헐거움으로 보이는 유격'],
    uncertainty: ['문틀 자체 뒤틀림 정도는 현장 확인 필요', '도어락 내부 모터 상태 불확실'],
    selfCheck: ['경첩 나사가 풀렸는지 드라이버로 확인', '손잡이 고정 나사 조임 상태 점검'],
    doNotAttempt: ['디지털 도어락 강제 분해', '문을 통째로 들어내는 작업'],
    additionalQuestions: ['경첩과 문틀이 함께 보이는 사진'],
    additionalPhotosNeeded: false,
  },
  wallpaper: {
    problemCandidate: '벽지 들뜸·곰팡이 또는 누수 흔적 의심',
    confidence: '보통', riskLevel: '보통', visitRequired: true,
    costSense: '중간 규모 작업 가능성',
    actionRecommendation: '원인부 확인 후 부분 도배 또는 곰팡이 처리 후 재시공',
    visibleEvidence: ['벽면 변색 및 얼룩, 벽지 들뜸', '모서리 곰팡이로 보이는 반점'],
    uncertainty: ['내부 결로/누수 여부는 장비 확인 필요', '단열 상태와 재발 가능성 불확실'],
    selfCheck: ['얼룩 부위가 마른 상태인지 젖은 상태인지 확인', '환기·제습 후 변화 관찰'],
    doNotAttempt: ['누수 원인 미확인 상태로 도배만 진행', '곰팡이를 마른 상태로 긁어 비산'],
    additionalQuestions: ['벽면 전체 구도 사진', '얼룩 부위를 가까이에서 찍은 사진'],
    additionalPhotosNeeded: true,
  },
};

export function buildMockAnalysis(location: string, symptom: string): any {
  const guideInfo = getSuggestedPriceGuide(location, symptom);
  const guide = guideInfo.guide;
  const key = guideInfo.key;
  const t = ANALYSIS_TEMPLATES[key];
  const loc = location || '실내';
  const sym = symptom || '문제';
  return {
    status: 'SUCCESS',
    problemCandidate: t.problemCandidate,
    tradeCategory: guide.tradeCategory,
    confidence: t.confidence,
    visibleEvidence: t.visibleEvidence,
    uncertainty: t.uncertainty,
    riskLevel: t.riskLevel,
    visitRequired: t.visitRequired,
    costSense: t.costSense,
    actionRecommendation: t.actionRecommendation,
    selfCheckGuide: { available: true, steps: t.selfCheck, doNotAttemptIf: t.doNotAttempt },
    additionalQuestions: t.additionalQuestions ?? [],
    additionalPhotosNeeded: t.additionalPhotosNeeded ?? false,
    requestDraft: {
      title: `${loc} ${guide.tradeCategory} ${sym} 점검·${t.actionRecommendation.split(/[ ,]/)[0]} 요청`,
      // 전문가용 요청서: 의심 부품 + 사진 단서 + 작업 옵션 + 결정 포인트를 녹인다.
      message:
        `${loc} ${sym} 관련해 ${t.problemCandidate} 상태로 보입니다. ` +
        (t.visibleEvidence?.[0] ? `사진상 ${t.visibleEvidence[0]} 점이 확인되고, ` : '') +
        `${t.actionRecommendation} 방식이 적합해 보입니다. ` +
        `다만 ${t.uncertainty?.[0] || '정확한 작업 범위'}는 현장 확인이 필요하니, 방문 시 함께 점검해 주시면 좋겠습니다. ` +
        `방문 가능 시간과 부품 포함 여부가 반영된 견적을 함께 안내 부탁드립니다.`,
      structured: {
        location: `${loc} · ${sym}`,
        symptom: sym,
        suspected_issue: t.problemCandidate,
        requested_work: t.actionRecommendation,
        additional_note: t.uncertainty?.[0] ? `${t.uncertainty[0]} 여부를 현장에서 확인 부탁드립니다.` : '',
      },
    },
    priceGuide: guide,
    disclaimer: '사진 기반 1차 분석 결과이며, 최종 작업 범위와 비용은 전문가 현장 확인 후 결정됩니다.',
  };
}

export function buildExperts(analysis: any) {
  const trade = analysis ? analysis.tradeCategory : '생활시공';
  return [
    {
      id: 'kim',
      expertName: '김반장 홈케어',
      rating: 4.8, reviews: 312,
      available: true, availableLabel: '작업 가능',
      workType: '부분 교체', costLevel: '소규모 작업', visitLabel: '사진 기반 확인 가능', visitRequired: false,
      schedule: '내일 오전 방문 가능', scheduleRank: 1, costRank: 1,
      recommendedReason: '사진 기반 확인이 가능하고 사후관리 조건(안심 보증서)이 가장 명확해요.',
      comment: `사진상 ${trade} 쪽 손상으로 보여 현장에서 바로 부분 교체 가능합니다. 추가 부품이 필요하면 방문 시 안내드릴게요.`,
      trustElements: ['경력 12년', '재방문율 94%', '당일 견적'],
      trustStats: {
        completedJobs: 312,
        certificateIssuedCount: 128,
        warrantyIssuedCount: 42,
        afterCareResponseRate: 96,
        recentCertificateIssuedAt: '2일 전',
        recentCertificateCount: 18,
        verifiedJobRatio: 88,
      },
      warranty: {
        type: '안심 보증서' as any,
        available: true, period: '1년', description: '시공 후 1년 이내 동일 하자 무상 재시공',
        includedCare: ['시공 부위 1년 무상 A/S', '동일 하자 발생 시 무상 재시공', '정품 자재 사용 확인'],
        issuedCount: 42,
        trustImpactLabel: '발급 이력이 많은 전문가',
      },
    },
    {
      id: 'lee',
      expertName: '꼼꼼시공 이기사',
      rating: 4.9, reviews: 528,
      available: false, availableLabel: '추가 확인 필요',
      workType: '정밀 점검 후 교체', costLevel: '중간 규모', visitLabel: '현장 실측 필요', visitRequired: true,
      schedule: '모레 오후 일정 가능', scheduleRank: 2, costRank: 2,
      recommendedReason: '실측 후 작업 범위를 확정해 재시공 가능성을 줄이는 방식이에요.',
      comment: `정확한 범위 산정을 위해 현장 실측을 권장드립니다. ${trade} 작업은 인접부 상태까지 함께 보는 게 재시공을 줄이는 길이라 꼼꼼히 확인합니다.`,
      trustElements: ['경력 18년', '실측 기반 견적 안내', '자재 직거래'],
      trustStats: {
        completedJobs: 524,
        certificateIssuedCount: 301,
        warrantyIssuedCount: 19,
        afterCareResponseRate: 92,
        recentCertificateIssuedAt: '오늘',
        recentCertificateCount: 27,
        verifiedJobRatio: 95,
      },
      warranty: {
        type: '작업 확인서' as any,
        available: true, period: '6개월', description: '작업 내역 및 사용 자재가 명시된 확인서 발급',
        includedCare: ['시공 내역 상세 제공', '문제 발생 시 우선 방문'],
        issuedCount: 301,
        trustImpactLabel: '작업 확인서 발급이 활발한 전문가',
      },
    },
    {
      id: 'man',
      expertName: '뚝딱뚝딱 만물상',
      rating: 4.5, reviews: 187,
      available: true, availableLabel: '작업 가능',
      workType: '간단 보수', costLevel: '최소 비용', visitLabel: '방문 확인 필요', visitRequired: true,
      schedule: '오늘 저녁 방문 가능', scheduleRank: 0, costRank: 0,
      recommendedReason: '오늘 저녁 방문이 가능해 가장 빠르게 상태를 확인할 수 있어요.',
      comment: `간단한 보수로 해결되는 경우가 많습니다. 우선 가장 저렴하게 처리해 드리고, 더 큰 작업이 필요하면 솔직하게 말씀드릴게요.`,
      trustElements: ['빠른 방문', '합리적 비용', '소액 작업 환영'],
      trustStats: {
        completedJobs: 187,
        certificateIssuedCount: 12,
        warrantyIssuedCount: 0,
        afterCareResponseRate: 81,
        recentCertificateIssuedAt: '3주 전',
        recentCertificateCount: 1,
        verifiedJobRatio: 34,
      },
      warranty: {
        type: '없음' as any,
        available: false, period: '', description: '별도 보증서는 제공되지 않습니다',
        includedCare: [],
        issuedCount: 0,
      },
    },
  ];
}

export const mockExpertResponses = buildExperts(null);

/** 상담 시작 전 사용자가 전문가에게 보낼 첫 메시지(미리보기)를 요청서 기반으로 생성한다. */
export function buildConsultationPreviewMessage(
  analysis: any,
  location: string,
  symptom: string
): string {
  const subject = analysis?.problemCandidate || `${location || '집'} ${symptom || '문제'}`;
  const work = analysis?.requestDraft?.structured?.requested_work || '점검 및 보수';
  return `안녕하세요. 고치다에서 정리한 요청서를 보고 연락드립니다. ${subject} 관련해 ${work}이(가) 필요할 것 같습니다. 방문 가능 시간과 예상 작업 범위를 상담하고 싶습니다.`;
}

/** 상담방 진입 시 보여줄 Mock 대화 스레드를 첫 메시지 기준으로 구성한다. */
export function buildConsultationThread(previewMessage: string): ChatMessage[] {
  return [
    { from: 'me', text: previewMessage },
    { from: 'expert', text: '안녕하세요! 요청서 잘 받았습니다. 사진과 정리된 내용 확인했어요.' },
    { from: 'expert', text: '방문 가능 시간과 작업 확인서 발급 여부 포함해 안내드릴게요. 편하신 시간대가 있으실까요?' },
  ];
}

/** 상담 전 확인 체크리스트 (사용자가 전문가에게 확인할 항목). */
export const CONSULTATION_CHECKLIST = [
  '방문 가능 시간',
  '부품비 포함 여부',
  '추가 비용 발생 조건',
  '작업 전후 사진 기록 가능 여부',
  '작업 확인서 발급 가능 여부',
  '사후관리 조건',
];
