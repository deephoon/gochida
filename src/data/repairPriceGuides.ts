import { RepairPriceGuide } from '../types';

export const mockPriceGuides: RepairPriceGuide[] = [
  {
    id: 'pg-1',
    tradeCategory: '수전/위생기구',
    title: '수전 교체 (세면대/싱크대)',
    averagePrice: '약 7만 ~ 15만 원',
    priceRange: '부품 가격 및 교체 난이도에 따라 변동',
    factors: ['부품 포함 여부', '수전 종류', '기존 수전 철거 난이도'],
    disclaimer: '인터넷 평균 시세 기준이며, 실제 비용은 현장 상황과 전문가에 따라 다를 수 있습니다.',
  },
  {
    id: 'pg-2',
    tradeCategory: '욕실 실리콘',
    title: '욕실 실리콘 재시공',
    averagePrice: '약 15만 ~ 25만 원',
    priceRange: '시공 범위에 따라 변동',
    factors: ['기존 곰팡이 실리콘 제거', '시공 면적(욕조, 세면대, 바닥 등)'],
    disclaimer: '인터넷 평균 시세 기준이며, 실제 비용은 현장 상황과 전문가에 따라 다를 수 있습니다.',
  },
  {
    id: 'pg-3',
    tradeCategory: '방충망/창호',
    title: '방충망 교체',
    averagePrice: '약 5만 ~ 15만 원',
    priceRange: '망 종류 및 창문 크기에 따라 변동',
    factors: ['알루미늄 vs 미세방충망', '창호 크기 및 개수', '틀 수리 여부'],
    disclaimer: '인터넷 평균 시세 기준이며, 실제 비용은 현장 상황과 전문가에 따라 다를 수 있습니다.',
  },
  {
    id: 'pg-4',
    tradeCategory: '전기/조명',
    title: 'LED 조명 교체',
    averagePrice: '약 5만 ~ 15만 원',
    priceRange: '조명 개수 및 배선 작업 여부에 따라 변동',
    factors: ['조명 기구 가격', '스위치 배선 추가 여부', '천장 타공 필요성'],
    disclaimer: '인터넷 평균 시세 기준이며, 실제 비용은 현장 상황과 전문가에 따라 다를 수 있습니다.',
  },
  {
    id: 'pg-5',
    tradeCategory: '누수/배관',
    title: '하수구/싱크대 막힘 뚫음',
    averagePrice: '약 8만 ~ 15만 원',
    priceRange: '막힘 정도와 장비 사용에 따라 변동',
    factors: ['단순 관통기 vs 석션 장비', '배관 내시경 사용 여부'],
    disclaimer: '인터넷 평균 시세 기준이며, 실제 비용은 현장 상황과 전문가에 따라 다를 수 있습니다.',
  },
  {
    id: 'pg-6',
    tradeCategory: '문/도어',
    title: '경첩 및 문 손잡이 수리',
    averagePrice: '약 5만 ~ 10만 원',
    priceRange: '부품 교체 및 문틀 상태에 따라 변동',
    factors: ['도어락/손잡이 부품가', '문틀 뒤틀림 조정 여부'],
    disclaimer: '인터넷 평균 시세 기준이며, 실제 비용은 현장 상황과 전문가에 따라 다를 수 있습니다.',
  },
  {
    id: 'pg-7',
    tradeCategory: '도배/장판',
    title: '부분 도배',
    averagePrice: '약 20만 ~ 40만 원',
    priceRange: '면적 및 벽지 종류에 따라 변동',
    factors: ['실크 vs 합지', '기존 벽지 철거', '곰팡이 제거 여부'],
    disclaimer: '인터넷 평균 시세 기준이며, 실제 비용은 현장 상황과 전문가에 따라 다를 수 있습니다.',
  },
];

export const getSuggestedPriceGuide = (location?: string, symptom?: string): RepairPriceGuide => {
  // 위치와 증상을 기반으로 가장 적절한 가이드를 휴리스틱하게 반환합니다.
  const keyword = `${location} ${symptom}`;

  if (keyword.includes('주방') && keyword.includes('누수')) return mockPriceGuides[0]; // 수전 교체
  if (keyword.includes('주방') && keyword.includes('파손')) return mockPriceGuides[0]; 
  if (keyword.includes('욕실') && keyword.includes('누수')) return mockPriceGuides[0]; // 수전 교체
  if (keyword.includes('욕실') && keyword.includes('곰팡이')) return mockPriceGuides[1]; // 실리콘
  if (keyword.includes('욕실') && keyword.includes('파손')) return mockPriceGuides[0]; // 수전/변기 파손
  if (keyword.includes('베란다') && keyword.includes('파손')) return mockPriceGuides[2]; // 방충망
  if (keyword.includes('거실') && keyword.includes('작동 불량')) return mockPriceGuides[3]; // 조명
  if (keyword.includes('욕실') && keyword.includes('악취')) return mockPriceGuides[4]; // 하수구 막힘
  if (keyword.includes('주방') && keyword.includes('악취')) return mockPriceGuides[4]; // 하수구 막힘
  if (keyword.includes('방') && keyword.includes('파손')) return mockPriceGuides[5]; // 문 수리
  if (keyword.includes('거실') && keyword.includes('누수')) return mockPriceGuides[6]; // 부분 도배
  
  // 매칭되는 것이 없으면 무작위 반환하여 로딩 중 지루함을 덜어줌
  return mockPriceGuides[Math.floor(Math.random() * mockPriceGuides.length)];
};
