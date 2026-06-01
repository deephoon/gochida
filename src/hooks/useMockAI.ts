import { useCallback } from 'react';

interface DraftInput {
  location: string;
  symptom: string;
}

/**
 * 데모용 요청서 초안 문장을 생성한다.
 * 실제 AI(aiService.analyzeImage)가 비활성일 때의 fallback 문구로 사용한다.
 * 금지 표현(진단/확정 견적/최저가/무조건 보장)을 포함하지 않는다.
 */
export function buildMockDraft({ location, symptom }: DraftInput): string {
  const loc = location?.trim() || '문제 부위';
  const sym = symptom?.trim() || '이상 증상';

  return [
    `${loc}의 ${sym} 증상으로 점검 및 수리를 요청드립니다.`,
    '첨부한 사진을 참고해 작업 가능 여부와 방문 일정, 사후관리 조건을 알려주세요.',
    '아래 참고 시공 단가는 비용 감각을 위한 정보이며, 실제 작업 범위와 비용은 전문가 확인 후 달라질 수 있습니다.',
  ].join('\n');
}

/**
 * Mock AI 훅. 2초 지연 후 요청서 초안 문자열을 반환한다.
 * UI 컴포넌트가 초안 생성 로직을 직접 들고 있지 않도록 분리한다.
 */
export function useMockAI(): {
  createDraft: (input: DraftInput) => Promise<string>;
} {
  const createDraft = useCallback(async (input: DraftInput): Promise<string> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
    return buildMockDraft(input);
  }, []);

  return { createDraft };
}
