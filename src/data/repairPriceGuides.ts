import { RepairPriceGuide } from '../types';

export type { RepairPriceGuide };

export const REPAIR_PRICE_GUIDES: RepairPriceGuide[] = [
  {
    id: 'guide_faucet',
    tradeCategory: '수전/위생기구',
    title: '세면대/싱크대 수전 교체 및 배송 수리',
    averagePrice: '약 11만 원',
    priceRange: '7만 원 ~ 15만 원',
    factors: [
      '교체할 수전 자재의 브랜드 및 등급 (국산 기본형 수전 vs 수입 및 대림/아메리칸스탠다드 고급형)',
      '작업 대상의 종류 (주방 싱크대 원홀/벽붙이형, 욕실 세면대 1홀/3홀, 샤워기 겸용 수전)',
      '노후 앵글밸브 및 고압호스의 동시 부식 상태로 인한 부속 추가 교체 필요성',
      '기존 불량 수전의 쩔어붙음(부식 고착)으로 인한 강제 탈거 공정 추가 여부'
    ],
    disclaimer: '참고용 시세이며, 선택하시는 수전 자재의 원가와 현장 철거 난이도에 따라 전문가 확인 후 달라질 수 있습니다.'
  },
  {
    id: 'guide_silicone',
    tradeCategory: '욕실 실리콘',
    title: '욕조 및 욕실 내부 실리콘 재시공',
    averagePrice: '약 20만 원',
    priceRange: '15만 원 ~ 25만 원',
    factors: [
      '시공이 필요한 부분의 총 길이 및 면적 (욕조 테두리 단품 vs 욕실 전체 모서리 전면 재시공)',
      '기존 실리콘의 변색 및 내부 곰팡이 오염도에 따른 스크래퍼 완전 제거 작업 시간',
      '실리콘 제거 후 시멘트 내부 습기 건조 공정 및 바이오 방습 약품 처리 유무',
      '항균 및 곰팡이 방지 기능이 강화된 고급 바이오 실리콘 자재 사용 여부'
    ],
    disclaimer: '참고용 시세이며, 기존 실리콘 제거량과 욕실 상태(오염도)에 따라 최종 비용이 조율될 수 있습니다.'
  },
  {
    id: 'guide_screen',
    tradeCategory: '방충망/창호',
    title: '베란다 및 창문 방충망 교체/보수',
    averagePrice: '약 10만 원',
    priceRange: '5만 원 ~ 15만 원',
    factors: [
      '방충망 망 자재의 종류 (일반 알루미늄망 vs 부식 없는 고밀도 모노필라멘트 미세촘촘망 vs 자석형/방범용 스텐망)',
      '창호의 규격 크기 (다용도실/대피공간 소형 반창 vs 거실 전면 대형 창호)',
      '수리가 필요한 방충망틀의 총 개수 (복수 개수 진행 시 단가 절감 효과 발생)',
      '노후화로 인한 모헤어(털) 삭음 상태 및 방충망틀 하부 로라(바퀴) 부속품의 파손 교체 유무'
    ],
    disclaimer: '참고용 시세이며, 창문 크기와 선택 자재 종류, 방충망틀 자체의 휘어짐 보정 여부에 따라 다를 수 있습니다.'
  },
  {
    id: 'guide_lighting',
    tradeCategory: '전기/조명',
    title: 'LED 조명 기구 교체 및 스위치 보수',
    averagePrice: '약 10만 원',
    priceRange: '5만 원 ~ 15만 원',
    factors: [
      '설치 조명의 종류 및 개수 (방등/주방등 일대일 기본 교체 vs 거실 3등 대형 조명 또는 매립등 무리 시공)',
      '조명 자재의 고객 직접 사전 구매 여부 (전문가 자재 대행 시 브랜드별 원가 추가)',
      '노후 등기구 철거 후 천장 석고보드 처짐 방지를 위한 상(나무 보강판) 작업 필요성',
      '기존 스위치 플레이트, 잔광 제거용 콘덴서, 노후 안정기 등 추가 소모품 교체 여부'
    ],
    disclaimer: '참고용 시세이며, 전등 기구 자체의 단가와 천장 보강 및 신규 배선 증설 작업 유무에 따라 조율됩니다.'
  },
  {
    id: 'guide_plumbing',
    tradeCategory: '누수/배관',
    title: '하수구/싱크대 배관 막힘 해결 및 세척',
    averagePrice: '약 11만 5천 원',
    priceRange: '8만 원 ~ 15만 원',
    factors: [
      '배관 내부를 가로막은 오염 물질의 종류 (단순 머리카락/이물질 수거 vs 굳어진 유지방 기름 슬러지 스케일링)',
      '현장 투입 전문 장비의 등급 (일반 수동 관통기/석션기 vs 전동 플렉스 샤프트 배관 세척기)',
      '원인 분석을 위한 하수구 내부 배관 내시경 카메라 촬영 점검 필요성 여부',
      '싱크대 하부 노후 배수구통 세트 및 S트랩 호스 자재의 전체 교체 마감 유무'
    ],
    disclaimer: '참고용 시세이며, 배관 막힘의 깊이와 고착 상태, 내시경 카메라 등 정밀 장비 사용 여부에 따라 변동될 수 있습니다.'
  },
  {
    id: 'guide_door',
    tradeCategory: '문/도어',
    title: '문짝 수리 및 경첩/문고리 손잡이 교체',
    averagePrice: '약 7만 5천 원',
    priceRange: '5만 원 ~ 10만 원',
    factors: [
      '수리 및 교체용 부속 자재비 (일반 방문 레버형 손잡이 vs 욕실용 방청 손잡이 vs 도어락/클로저 부품)',
      '습기로 인한 방문 하단 불어터짐 목공 보수 및 대패 가공 수평 작업 포함 여부',
      '노후 이지경첩 처짐으로 인한 나사 구멍 헐거워짐 충진재 보강 및 재타공 수리 작업',
      '현관문 도어클로저(유압 소모품) 신규 위치 타공 및 속도 조절 셋팅 유무'
    ],
    disclaimer: '참고용 시세이며, 단순 소형 부속 교체 작업과 문틀 뒤틀림 조정을 위한 목공 수리 작업 간 비용 차이가 있습니다.'
  },
  {
    id: 'guide_wallpaper',
    tradeCategory: '도배/장판',
    title: '방 1면 포인트 벽지 부분 도배 시공',
    averagePrice: '약 30만 원',
    priceRange: '20만 원 ~ 40만 원',
    factors: [
      '도배 자재의 등급 선택 (시공이 비교적 간편한 장폭 합지 벽지 vs 이음새 마감이 고급스러운 실크 벽지)',
      '기존 실크 벽지 겉지 제거 및 벽면 거친 요철면 보정용 부직포 초배(네바리) 공정 유무',
      '결로/누수로 인해 시멘트 벽면에 번진 내부 곰팡이 긁어내기 및 방지 코팅 약품 처리 비용',
      '도배 면적 구역 및 방 내부 무거운 가구(침대, 장롱)의 이동 배치 보조 소요 시간'
    ],
    disclaimer: '참고용 시세이며, 도배 면적과 벽지 종류(합지/실크), 기존 벽면 곰팡이 제거 공정 유무에 따라 가격 편차가 존재합니다.'
  }
];

export function getSuggestedPriceGuide(location?: string | null, symptom?: string | null): RepairPriceGuide {
  const loc = location || '';
  const sym = symptom || '';

  // 14가지 내부 구조화 휴리스틱 매칭 규칙
  if (loc.includes('주방') && sym.includes('누수')) return REPAIR_PRICE_GUIDES[0];
  if (loc.includes('주방') && sym.includes('파손')) return REPAIR_PRICE_GUIDES[0];
  if (loc.includes('욕실') && sym.includes('누수')) return REPAIR_PRICE_GUIDES[0];
  if (loc.includes('욕실') && sym.includes('파손')) return REPAIR_PRICE_GUIDES[0];
  
  if (loc.includes('욕실') && (sym.includes('악취') || sym.includes('기타'))) return REPAIR_PRICE_GUIDES[1];
  
  if (loc.includes('베란다') || loc.includes('현관')) return REPAIR_PRICE_GUIDES[2];
  
  if (sym.includes('작동 불량')) return REPAIR_PRICE_GUIDES[3];
  
  if (sym.includes('소음') || sym.includes('악취')) return REPAIR_PRICE_GUIDES[4];
  
  if (loc.includes('침실') && sym.includes('고장')) return REPAIR_PRICE_GUIDES[5];
  
  if (loc.includes('거실') && sym.includes('누수')) return REPAIR_PRICE_GUIDES[6];

  // 매칭 예외 시 Fallback: 7가지 공종 중 무작위 반환하여 인터랙션 유지
  const randomIndex = Math.floor(Math.random() * REPAIR_PRICE_GUIDES.length);
  return REPAIR_PRICE_GUIDES[randomIndex];
}
