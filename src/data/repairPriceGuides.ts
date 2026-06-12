import { RepairPriceGuide } from '../types';

export const REPAIR_PRICE_GUIDES: Record<string, RepairPriceGuide> = {
  faucet: {
    id: 'faucet', tradeCategory: '수전/위생기구', title: '수전 교체 (세면대/싱크대)',
    averagePrice: '약 7만 ~ 15만 원', priceRange: '7만 ~ 15만 원',
    factors: ['부품 포함 여부', '수전 종류', '철거 난이도'],
    relatedLocations: ['주방', '욕실'],
    relatedSymptoms: ['누수', '파손/고장'],
    keywords: ['수전', '싱크대', '세면대', '물'],
  },
  silicone: {
    id: 'silicone', tradeCategory: '욕실 실리콘', title: '욕실 실리콘 재시공',
    averagePrice: '약 15만 ~ 25만 원', priceRange: '15만 ~ 25만 원',
    factors: ['곰팡이 실리콘 제거', '시공 면적'],
    relatedLocations: ['욕실'],
    relatedSymptoms: ['파손/고장', '악취'],
    keywords: ['실리콘', '곰팡이', '욕실', '마감'],
  },
  screen: {
    id: 'screen', tradeCategory: '방충망/창호', title: '방충망 교체',
    averagePrice: '약 5만 ~ 15만 원', priceRange: '5만 ~ 15만 원',
    factors: ['알루미늄 vs 미세방충망', '창호 크기/개수', '틀 수리'],
    relatedLocations: ['베란다', '거실', '침실'],
    relatedSymptoms: ['파손/고장'],
    keywords: ['방충망', '창문', '창호', '베란다'],
  },
  electric: {
    id: 'electric', tradeCategory: '전기/조명', title: 'LED 조명 교체',
    averagePrice: '약 5만 ~ 15만 원', priceRange: '5만 ~ 15만 원',
    factors: ['조명 기구 가격', '스위치 배선', '천장 타공'],
    relatedLocations: ['거실', '침실', '주방', '현관'],
    relatedSymptoms: ['작동 불량'],
    keywords: ['조명', '전등', '스위치', '전기'],
  },
  plumbing: {
    id: 'plumbing', tradeCategory: '누수/배관', title: '하수구/싱크대 막힘 뚫음',
    averagePrice: '약 8만 ~ 15만 원', priceRange: '8만 ~ 15만 원',
    factors: ['관통기 vs 석션 장비', '배관 내시경'],
    relatedLocations: ['욕실', '주방', '베란다'],
    relatedSymptoms: ['누수', '악취', '소음'],
    keywords: ['배관', '하수구', '배수', '막힘'],
  },
  door: {
    id: 'door', tradeCategory: '문/도어', title: '경첩 및 문 손잡이 수리',
    averagePrice: '약 5만 ~ 10만 원', priceRange: '5만 ~ 10만 원',
    factors: ['도어락/손잡이 부품가', '문틀 뒤틀림 조정'],
    relatedLocations: ['현관', '침실', '거실'],
    relatedSymptoms: ['파손/고장', '소음', '작동 불량'],
    keywords: ['문', '경첩', '손잡이', '도어락'],
  },
  wallpaper: {
    id: 'wallpaper', tradeCategory: '도배/장판', title: '부분 도배',
    averagePrice: '약 20만 ~ 40만 원', priceRange: '20만 ~ 40만 원',
    factors: ['실크 vs 합지', '벽지 철거', '곰팡이 제거'],
    relatedLocations: ['거실', '침실', '베란다'],
    relatedSymptoms: ['누수', '파손/고장'],
    keywords: ['벽지', '도배', '장판', '곰팡이'],
  },
};

export function getGuideKey(location?: string | null, symptom?: string | null): string {
  const loc = location || '';
  const sym = symptom || '';
  const k = `${loc}|${sym}`;
  const rules: Record<string, string> = {
    '주방|누수': 'faucet', '주방|파손/고장': 'faucet', '욕실|누수': 'faucet',
    '욕실|파손/고장': 'faucet', '베란다|파손/고장': 'screen', '거실|작동 불량': 'electric',
    '침실|작동 불량': 'electric', '현관|작동 불량': 'door', '욕실|악취': 'plumbing',
    '주방|악취': 'plumbing', '침실|파손/고장': 'door', '현관|파손/고장': 'door',
    '거실|누수': 'wallpaper', '베란다|누수': 'wallpaper',
  };
  if (rules[k]) return rules[k];
  // symptom fallbacks
  if (sym === '누수') return 'plumbing';
  if (sym === '악취') return 'plumbing';
  if (sym === '작동 불량') return 'electric';
  if (sym === '소음') return 'door';
  if (loc === '욕실') return 'silicone';
  if (loc === '베란다') return 'screen';
  return 'faucet';
}

export function getSuggestedPriceGuide(location?: string | null, symptom?: string | null): { guide: RepairPriceGuide, key: string } {
  const key = getGuideKey(location, symptom);
  return { guide: REPAIR_PRICE_GUIDES[key], key };
}

/**
 * 로딩 화면용 추천 시세 목록.
 * 위치/증상 관련도 점수로 정렬한 뒤, 부족하면 나머지 공종을 무작위로 섞어 채운다.
 * 항상 limit개를 반환하므로 로딩 중 다양한 공종 단가를 순환 노출할 수 있다.
 */
export function getRecommendedPriceGuides(
  location: string,
  symptom: string,
  limit = 4
): RepairPriceGuide[] {
  const all = Object.values(REPAIR_PRICE_GUIDES);

  const scored = all.map((guide) => {
    let score = 0;
    if (location && guide.relatedLocations?.includes(location)) score += 3;
    if (symptom && guide.relatedSymptoms?.includes(symptom)) score += 3;
    if (
      guide.keywords?.some(
        (keyword) =>
          (location && location.includes(keyword)) ||
          (symptom && symptom.includes(keyword))
      )
    ) {
      score += 1;
    }
    return { guide, score };
  });

  const related = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.guide);

  const fallback = all
    .filter((guide) => !related.some((item) => item.id === guide.id))
    .sort(() => Math.random() - 0.5);

  return [...related, ...fallback].slice(0, limit);
}
