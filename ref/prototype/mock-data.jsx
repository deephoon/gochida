/* ─────────────────────────────────────────────────────────────
   고치다 — Mock Data (price guides, AI analysis, experts)
   Mirrors the spec's repairPriceGuides.ts / mockData.ts behaviour.
   ───────────────────────────────────────────────────────────── */

const LOCATIONS = ['거실', '주방', '욕실', '침실', '베란다', '현관', '기타'];
const SYMPTOMS  = ['파손/고장', '소음', '누수', '작동 불량', '악취', '기타'];

/* 3D asset illustrations (transparent PNG) */
const ASSET = {
  heroFlow: 'images/Hero_RepairFlow.png',
  aiDraft: 'images/Asset_AIRequestDraft.png',
  priceGuide: 'images/Asset_PriceGuide.png',
  uploadCamera: 'images/Asset_UploadCamera.png',
  warranty: 'images/Asset_WarrantyDocument.png',
  expertCards: 'images/Asset_ExpertCards.png',
  windowScreen: 'images/Asset_WindowScreen.png',
  bathSilicone: 'images/Asset_BathSilicone.png',
  doorRepair: 'images/Asset_DoorRepair.png',
};

/* 7 reference price guides (repairPriceGuides.ts) */
const PRICE_GUIDES = {
  faucet: {
    id: 'faucet', tradeCategory: '수전/위생기구', title: '수전 교체 (세면대/싱크대)',
    averagePrice: '약 7만 ~ 15만 원', priceRange: '7만 ~ 15만 원',
    factors: ['부품 포함 여부', '수전 종류', '철거 난이도'],
  },
  silicone: {
    id: 'silicone', tradeCategory: '욕실 실리콘', title: '욕실 실리콘 재시공',
    averagePrice: '약 15만 ~ 25만 원', priceRange: '15만 ~ 25만 원',
    factors: ['곰팡이 실리콘 제거', '시공 면적'],
  },
  screen: {
    id: 'screen', tradeCategory: '방충망/창호', title: '방충망 교체',
    averagePrice: '약 5만 ~ 15만 원', priceRange: '5만 ~ 15만 원',
    factors: ['알루미늄 vs 미세방충망', '창호 크기/개수', '틀 수리'],
  },
  electric: {
    id: 'electric', tradeCategory: '전기/조명', title: 'LED 조명 교체',
    averagePrice: '약 5만 ~ 15만 원', priceRange: '5만 ~ 15만 원',
    factors: ['조명 기구 가격', '스위치 배선', '천장 타공'],
  },
  plumbing: {
    id: 'plumbing', tradeCategory: '누수/배관', title: '하수구/싱크대 막힘 뚫음',
    averagePrice: '약 8만 ~ 15만 원', priceRange: '8만 ~ 15만 원',
    factors: ['관통기 vs 석션 장비', '배관 내시경'],
  },
  door: {
    id: 'door', tradeCategory: '문/도어', title: '경첩 및 문 손잡이 수리',
    averagePrice: '약 5만 ~ 10만 원', priceRange: '5만 ~ 10만 원',
    factors: ['도어락/손잡이 부품가', '문틀 뒤틀림 조정'],
  },
  wallpaper: {
    id: 'wallpaper', tradeCategory: '도배/장판', title: '부분 도배',
    averagePrice: '약 20만 ~ 40만 원', priceRange: '20만 ~ 40만 원',
    factors: ['실크 vs 합지', '벽지 철거', '곰팡이 제거'],
  },
};

/* location + symptom → guide key (heuristic, spec §참고시세) */
function getGuideKey(location, symptom) {
  const k = `${location}|${symptom}`;
  const rules = {
    '주방|누수': 'faucet', '주방|파손/고장': 'faucet', '욕실|누수': 'faucet',
    '욕실|파손/고장': 'faucet', '베란다|파손/고장': 'screen', '거실|작동 불량': 'electric',
    '침실|작동 불량': 'electric', '현관|작동 불량': 'door', '욕실|악취': 'plumbing',
    '주방|악취': 'plumbing', '침실|파손/고장': 'door', '현관|파손/고장': 'door',
    '거실|누수': 'wallpaper', '베란다|누수': 'wallpaper',
  };
  if (rules[k]) return rules[k];
  // symptom fallbacks
  if (symptom === '누수') return 'plumbing';
  if (symptom === '악취') return 'plumbing';
  if (symptom === '작동 불량') return 'electric';
  if (symptom === '소음') return 'door';
  if (location === '욕실') return 'silicone';
  if (location === '베란다') return 'screen';
  return 'faucet';
}

function getSuggestedPriceGuide(location, symptom) {
  return PRICE_GUIDES[getGuideKey(location, symptom)];
}

/* Per-trade AI analysis templates */
const ANALYSIS_TEMPLATES = {
  screen: {
    problemCandidate: '방충망 망 손상 또는 프레임 변형 의심',
    confidence: '보통', riskLevel: '낮음', visitRequired: true,
    costSense: '소규모 작업 가능성',
    actionRecommendation: '망 부분 교체 또는 프레임 포함 부분 교체',
    visibleEvidence: ['망 일부에 찢어짐 또는 늘어짐으로 보이는 흔적', '프레임 모서리에 미세한 들뜸이 관찰됨'],
    uncertainty: ['프레임 내부 휘어짐 여부는 사진만으로 단정 어려움', '레일 마모 상태는 추가 확인 필요'],
    selfCheck: ['창틀 레일에 먼지나 이물질이 끼었는지 확인', '망이 프레임에서 빠진 것인지 찢어진 것인지 구분'],
    doNotAttempt: ['고층 외부 창에서 직접 탈착 시도', '프레임을 무리하게 휘어 끼우는 행위'],
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
  },
};

/* Build a full analysis object from selection (mirrors buildMockAnalysis) */
function buildAnalysis(location, symptom) {
  const key = getGuideKey(location, symptom);
  const t = ANALYSIS_TEMPLATES[key];
  const guide = PRICE_GUIDES[key];
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
    requestDraft: {
      title: `${loc} ${sym} 점검/보수 요청`,
      message: `${loc}에서 ${sym} 증상이 확인되어 점검을 요청드립니다. 사진 기반 1차 분석 결과 ${t.problemCandidate} 상태로 보이며, ${t.actionRecommendation}이(가) 필요할 것으로 예상됩니다.`,
      structured: {
        location: `${loc} · ${sym}`,
        symptom: sym,
        suspected_issue: t.problemCandidate,
        requested_work: t.actionRecommendation,
        additional_note: '',
      },
    },
    priceGuide: guide,
    disclaimer: '사진 기반 1차 분석 결과이며, 최종 작업 범위와 비용은 전문가 현장 확인 후 결정됩니다.',
  };
}

/* 3 mock experts (mockData.ts) — comment adapts to trade */
function buildExperts(analysis) {
  const trade = analysis ? analysis.tradeCategory : '생활시공';
  return [
    {
      id: 'kim',
      expertName: '김반장 홈케어',
      rating: 4.8, reviews: 312,
      available: true, availableLabel: '작업 가능',
      workType: '부분 교체', costLevel: '소규모 작업', visitLabel: '사진 기반 확인 가능',
      schedule: '내일 오전 방문 가능',
      comment: `사진상 ${trade} 쪽 손상으로 보여 현장에서 바로 부분 교체 가능합니다. 추가 부품이 필요하면 방문 시 안내드릴게요.`,
      trustElements: ['경력 12년', '재방문율 94%', '당일 견적'],
      warranty: { available: true, type: '안심 보증서', period: '1년',
        description: '시공 후 1년 이내 동일 하자 무상 재시공',
        includedCare: ['1년 무상 재시공', '시공 후 30일 무상 점검', '작업 전·후 사진 기록'] },
    },
    {
      id: 'lee',
      expertName: '꼼꼼시공 이기사',
      rating: 4.9, reviews: 528,
      available: false, availableLabel: '추가 확인 필요',
      workType: '정밀 점검 후 교체', costLevel: '중간 규모', visitLabel: '현장 실측 필요',
      schedule: '모레 오후 일정 가능',
      comment: `정확한 범위 산정을 위해 현장 실측을 권장드립니다. ${trade} 작업은 인접부 상태까지 함께 보는 게 재시공을 줄이는 길이라 꼼꼼히 확인합니다.`,
      trustElements: ['경력 18년', '실측 후 확정 견적', '자재 직거래'],
      warranty: { available: true, type: '작업 확인서', period: '6개월',
        description: '작업 내역 및 사용 자재가 명시된 확인서 발급',
        includedCare: ['작업 내역 확인서 발급', '6개월 하자 대응', '자재 영수증 제공'] },
    },
    {
      id: 'man',
      expertName: '뚝딱뚝딱 만물상',
      rating: 4.5, reviews: 187,
      available: true, availableLabel: '작업 가능',
      workType: '간단 보수', costLevel: '최소 비용', visitLabel: '방문 확인 필요',
      schedule: '오늘 저녁 방문 가능',
      comment: `간단한 보수로 해결되는 경우가 많습니다. 우선 가장 저렴하게 처리해 드리고, 더 큰 작업이 필요하면 솔직하게 말씀드릴게요.`,
      trustElements: ['빠른 방문', '합리적 비용', '소액 작업 환영'],
      warranty: { available: false, type: '없음', period: '',
        description: '별도 보증서는 제공되지 않습니다',
        includedCare: [] },
    },
  ];
}

/* 3 home-screen step guide copy */
const HOME_STEPS = [
  { n: '1', title: '문제 사진 찍기', desc: '거실, 욕실, 어디든 한 장이면 OK' },
  { n: '2', title: 'AI 요청서 정리', desc: '공종 분류와 참고 시세까지 자동' },
  { n: '3', title: '전문가 응답 비교', desc: '같은 기준으로 시공자 응답을 한눈에' },
];

/* Home price-guide preview (horizontal) */
const PRICE_PREVIEW = [
  { label: '방충망/창호', price: '약 5만~15만 원', img: 'images/Asset_WindowScreen.png' },
  { label: '욕실 실리콘', price: '약 15만~25만 원', img: 'images/Asset_BathSilicone.png' },
  { label: '문/문틀', price: '약 5만~10만 원', img: 'images/Asset_DoorRepair.png' },
];

/* Mock requests (mockRequests.ts) */
const MOCK_REQUESTS = [
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

const STATUS_LABEL = {
  draft: '요청서 작성 중', ai_done: '요청서 정리 완료', waiting: '응답 대기',
  responded: '응답 도착', chatting: '상담 중', completed: '작업 완료',
};

/* Mock chats (mockChats.ts) */
const MOCK_CHATS = [
  {
    id: 'chat-1', expertName: '김반장 홈케어', requestTitle: '베란다 방충망 보수 요청',
    lastMessage: '내일 오전 방문 가능해요.', timeText: '2분 전', warrantyType: '안심 보증서', unread: 1,
  },
  {
    id: 'chat-2', expertName: '꼼꼼시공 이기사', requestTitle: '베란다 방충망 보수 요청',
    lastMessage: '프레임 상태 확인이 필요합니다.', timeText: '15분 전', warrantyType: '작업 확인서', unread: 0,
  },
];

/* Mock chat thread for chat detail */
const MOCK_CHAT_THREAD = [
  { from: 'me', text: '요청서 확인 부탁드립니다.' },
  { from: 'expert', text: '사진상 망 부분 교체 가능해 보입니다.' },
  { from: 'expert', text: '내일 오전 방문 가능합니다.' },
  { from: 'me', text: '작업 확인서 발급도 가능한가요?' },
  { from: 'expert', text: '네, 작업 전후 사진과 작업 범위를 정리해 드릴 수 있습니다.' },
];

Object.assign(window, {
  LOCATIONS, SYMPTOMS, PRICE_GUIDES, getSuggestedPriceGuide,
  buildAnalysis, buildExperts, HOME_STEPS, PRICE_PREVIEW,
  MOCK_REQUESTS, MOCK_CHATS, MOCK_CHAT_THREAD, STATUS_LABEL,
  ASSET,
});
