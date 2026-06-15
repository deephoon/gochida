/**
 * AI(또는 Mock) 응답 텍스트를 화면에 안전하게 렌더하기 위한 정규화 유틸.
 * raw 응답을 그대로 출력하면 과도한 줄바꿈/공백/끊김이 생기므로 여기서 한 번 다듬는다.
 */

/**
 * 연속 공백·불필요한 줄바꿈을 정리하고 앞뒤 공백을 제거한다.
 * "\n\n"이 그대로 화면에 노출되지 않도록 단일 공백/문단 단위로 정돈한다.
 */
export function normalizeAiText(text?: string | null): string {
  if (!text) return '';
  return String(text)
    // 윈도우 개행 통일
    .replace(/\r\n/g, '\n')
    // 3개 이상 연속 개행 → 문단 구분 1개로
    .replace(/\n{3,}/g, '\n\n')
    // 줄 끝 공백 제거
    .replace(/[ \t]+\n/g, '\n')
    // 줄 안의 연속 공백 → 1칸
    .replace(/[ \t]{2,}/g, ' ')
    // 마침표/물음표/느낌표 뒤 공백 없이 붙은 한글/영문 → 한 칸 띄움
    .replace(/([.?!])([^\s\d.)\]」』”])/g, '$1 $2')
    .trim();
}

/**
 * 긴 메시지를 문장 단위로 분리한다. (마침표/물음표/느낌표 기준)
 * maxItems가 주어지면 그 수만큼만 반환하고, 빈 경우 원문을 단일 항목으로 돌려준다.
 */
export function splitSentences(text?: string | null, maxItems?: number): string[] {
  const normalized = normalizeAiText(text);
  if (!normalized) return [];
  // 종결부호 뒤에서 분리. 종결부호는 유지한다.
  const parts = normalized
    .split(/(?<=[.?!다요])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const result = parts.length > 0 ? parts : [normalized];
  return typeof maxItems === 'number' ? result.slice(0, maxItems) : result;
}

/**
 * 배열 필드를 안전하게 렌더용으로 변환한다.
 * 문자열만 남기고 trim하며, 비어 있으면 fallback 한 줄을 제공한다.
 */
export function formatBulletItems(
  items?: unknown,
  options?: { max?: number; fallback?: string }
): string[] {
  const max = options?.max;
  const fallback = options?.fallback;
  const list = Array.isArray(items)
    ? items
        .filter((x): x is string => typeof x === 'string')
        .map((x) => normalizeAiText(x))
        .filter(Boolean)
    : [];
  const sliced = typeof max === 'number' ? list.slice(0, max) : list;
  if (sliced.length === 0 && fallback) return [fallback];
  return sliced;
}
