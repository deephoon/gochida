/**
 * ==========================================
 * 1. 흐름 (Data & State Flow Diagram)
 * ==========================================
 * [View Layer] (upload.tsx) 
 *   -- (imageUris, location, symptom) -->
 * [Context Layer] (RequestContext.tsx) 
 *   -- (Call fetchAnalysis) -->
 * [Service Layer] (aiService.ts) 
 *   -- (Check EXPO_PUBLIC_USE_MOCK_AI)
 *       ├─(True)──> Return Mock JSON with delay (Fallback)
 *       └─(False)─> Call Gemini API (Promise.race for Timeout)
 *            ├─(Success)────────> Return AIRepairAnalysis (status: SUCCESS)
 *            ├─(Rate Limit 429)─> Throw Error "API 한도 초과"
 *            ├─(Irrelevant)─────> Return AIRepairAnalysis (status: REJECTED)
 *            └─(Timeout)────────> Throw Error "응답 시간 초과"
 *   <-- (Return Result or Throw Error) --
 * [Context Layer] 
 *   -- (Update global state: analysisResult, loading, error) -->
 * [View Layer] (analysis.tsx) 
 *   -- (Render UI based on state)
 */

/**
 * ==========================================
 * 2. 역할 분해 (Separation of Concerns)
 * ==========================================
 * - aiService.ts (Service Layer): 순수 비즈니스 및 통신 로직. AI 프롬프트 구성, 타임아웃, 예외 처리 등 네트워크 페이로드를 가공하고 반환하는 책임만 가집니다. (상태 없음)
 * - RequestContext.tsx (State Layer): View에서 호출된 Service 결과를 전역 상태(state)에 저장하고 상태 전환(로딩, 에러, 완료)을 관리하여 View 컴포넌트에 주입합니다.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIRepairAnalysis } from '../types';
import { buildMockAnalysis, getSuggestedPriceGuide } from '../data/mockData';

// ==========================================
// 3. 주석 코드: 실제 로직 작성 및 프롬프트 정의
// ==========================================

const buildPrompt = (location: string, symptom: string, imageCount: number) => `
너는 대한민국 주거 환경의 생활시공 요청을 전문가에게 전달하기 쉽게 정리하는 AI 요청서 작성 보조자다.
너는 최종 진단자가 아니며, 확정 견적을 제공하지 않는다.

사용자 입력:
- 위치: ${location}
- 증상: ${symptom}
- 첨부 이미지 수: ${imageCount}

서비스 목적:
사용자가 문제를 정확히 설명하지 못해도, 사진과 선택 입력을 바탕으로 전문가가 이해할 수 있는 생활시공 요청서 초안을 정리한다.

중요 원칙:
1. 너는 최종 진단자가 아니다. "진단"이 아니라 "요청서 정리"를 수행한다.
2. 너는 확정 견적을 제공하지 않는다. 비용은 참고 수준의 감각으로만 표현한다.
3. 사진에서 보이는 내용만 근거로 삼는다. 보이는 근거는 visibleEvidence에 적는다.
4. 사진만으로 보이지 않거나 단정할 수 없는 부분은 uncertainty에 적고, 절대 단정하지 않는다.
5. 위험한 작업은 사용자가 직접 시도하지 않도록 안내한다. 자가 수리 방법을 상세히 알려주지 않는다.
6. 최종 작업 범위와 비용은 전문가 상담 후 결정된다는 취지를 disclaimer에 포함한다.
7. 생활시공과 무관한 사진은 REJECTED로 처리한다.
8. 반드시 순수 JSON만 반환한다.

처리 범위 (Scope):
- 생활시공, 집수리, 보수 요청과 관련된 사진만 처리한다.
- 사람 얼굴, 음식, 풍경, 문서, 반려동물 등 생활시공과 무관한 사진은 status를 "REJECTED"로 설정하고 rejection_reason에 사유를 적는다.
- 사진이 지나치게 흐리거나 문제 부위가 보이지 않으면 REJECTED로 처리하거나, 부분적으로 판단 가능하면 additionalPhotosNeeded를 true로 설정하고 additionalQuestions에 필요한 추가 사진을 0~3개 적는다.

공종 분류 (tradeCategory) 예시:
- 방충망/창호
- 욕실 실리콘
- 수전/위생기구
- 문/문틀
- 도배/벽지
- 전기/조명
- 누수/배관
- 가구/수납 보수
- 기타 생활시공

위험 공종 기준 (Safety-first):
- 전기 합선, 노출 전선, 차단기 문제
- 심한 누수, 배관 파손
- 구조 균열, 천장 처짐
- 가스, 화재, 고소 작업 가능성
위 항목에 해당하면 riskLevel을 "높음"으로 판단하고, selfCheckGuide.available을 false로 설정하거나 doNotAttemptIf에 해당 상황을 명확히 적는다. 자가 수리를 권장하지 말고 전문가 확인을 안내한다.

비용 표현 규칙 (Cost Safety):
- costSense는 확정 금액이 아니라 "소규모 작업 가능성", "중간 규모 작업 가능성"처럼 비용 감각으로 표현한다.
- 금액 범위가 필요하면 "약 n만 ~ n만 원" 형태의 참고 수준으로만 적는다.
- "확정 견적", "최저가 보장" 같은 표현은 절대 사용하지 않는다.

요청서 작성 규칙 (Expert Request Quality):
- requestDraft.title은 전문가가 한눈에 이해할 수 있게 "위치 + 문제 + 요청 유형" 형태로 작성한다. (예: "베란다 방충망 파손 점검/보수 요청")
- requestDraft.message는 사용자가 그대로 전문가에게 보낼 수 있는 자연스러운 한국어 존댓말 문장으로 작성한다.
- requestDraft.structured는 location, symptom, suspected_issue, requested_work, additional_note를 반드시 모두 포함한다.
- requested_work는 "교체 요청", "점검 요청", "보수 요청", "현장 확인 요청"처럼 전문가의 작업 방향으로 정리한다.

출력 규칙 (Output Strictness):
- 반드시 순수 JSON 문자열만 반환한다.
- 마크다운 코드 펜스(\`\`\`)를 포함하지 않는다.
- 설명 문장, 주석, prefix, suffix를 붙이지 않는다.
- 아래 스키마의 모든 필드를 누락 없이 반환한다.

반환 JSON 스키마:
{
  "status": "SUCCESS | REJECTED",
  "rejection_reason": "",
  "problemCandidate": "",
  "tradeCategory": "",
  "confidence": "낮음 | 보통 | 높음",
  "visibleEvidence": [],
  "uncertainty": [],
  "riskLevel": "낮음 | 보통 | 높음",
  "visitRequired": true,
  "costSense": "",
  "actionRecommendation": "",
  "selfCheckGuide": {
    "available": true,
    "steps": [],
    "doNotAttemptIf": []
  },
  "additionalQuestions": [],
  "additionalPhotosNeeded": false,
  "requestDraft": {
    "title": "",
    "message": "",
    "structured": {
      "location": "",
      "symptom": "",
      "suspected_issue": "",
      "requested_work": "",
      "additional_note": ""
    }
  },
  "disclaimer": "사진과 입력 정보를 바탕으로 정리한 요청서 초안이며, 실제 작업 범위와 비용은 전문가 확인 후 달라질 수 있습니다."
}
`;

// 마크다운 펜스 제거 후, 응답에 부가 텍스트가 섞여 있어도 첫 '{'부터 마지막 '}'까지를
// JSON 본문으로 간주해 파싱 성공률을 높인다.
const stripJsonFences = (raw: string) => {
  const cleaned = raw.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) return cleaned;
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  return start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
};

const FALLBACK_DISCLAIMER =
  '사진과 입력 정보를 바탕으로 정리한 요청서 초안이며, 최종 작업 범위와 비용은 전문가 확인 후 결정됩니다.';

const LEVELS = ['낮음', '보통', '높음'] as const;

const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

const asLevel = (v: unknown, fallback: '낮음' | '보통' | '높음') =>
  LEVELS.includes(v as any) ? (v as '낮음' | '보통' | '높음') : fallback;

/**
 * Gemini 응답이 일부 필드를 누락하거나 타입이 어긋나도 UI가 crash하지 않도록
 * 모든 필드를 스키마에 맞게 보정한다. (배열 → [], 누락 문자열 → 안전한 기본값)
 */
const normalizeAnalysis = (raw: any, location: string, symptom: string): AIRepairAnalysis => {
  const loc = location || '실내';
  const sym = symptom || '문제';
  const structured = raw?.requestDraft?.structured ?? {};

  return {
    status: raw?.status === 'REJECTED' ? 'REJECTED' : 'SUCCESS',
    rejection_reason: typeof raw?.rejection_reason === 'string' && raw.rejection_reason
      ? raw.rejection_reason
      : undefined,
    problemCandidate: raw?.problemCandidate || `${loc} ${sym} 전문가 확인 필요`,
    tradeCategory: raw?.tradeCategory || '기타 생활시공',
    confidence: asLevel(raw?.confidence, '낮음'),
    visibleEvidence: asStringArray(raw?.visibleEvidence),
    uncertainty: asStringArray(raw?.uncertainty),
    riskLevel: asLevel(raw?.riskLevel, '보통'),
    visitRequired: typeof raw?.visitRequired === 'boolean' ? raw.visitRequired : true,
    costSense: raw?.costSense || '전문가 확인 후 안내',
    actionRecommendation: raw?.actionRecommendation || '전문가 현장 확인 요청',
    selfCheckGuide: {
      available: raw?.selfCheckGuide?.available === true,
      steps: asStringArray(raw?.selfCheckGuide?.steps),
      doNotAttemptIf: asStringArray(raw?.selfCheckGuide?.doNotAttemptIf),
    },
    additionalQuestions: asStringArray(raw?.additionalQuestions),
    additionalPhotosNeeded: raw?.additionalPhotosNeeded === true,
    requestDraft: {
      title: raw?.requestDraft?.title || `${loc} ${sym} 점검/보수 요청`,
      message:
        raw?.requestDraft?.message ||
        `${loc}에서 ${sym} 증상이 있어 점검을 요청드립니다. 정확한 작업 범위는 확인 후 안내 부탁드립니다.`,
      structured: {
        location: structured.location || `${loc} · ${sym}`,
        symptom: structured.symptom || sym,
        suspected_issue: structured.suspected_issue || raw?.problemCandidate || '전문가 확인 필요',
        requested_work: structured.requested_work || '현장 확인 요청',
        additional_note: structured.additional_note || '',
      },
    },
    disclaimer: raw?.disclaimer || FALLBACK_DISCLAIMER,
    priceGuide: raw?.priceGuide,
  };
};

// ==========================================
// 4. 엣지케이스 처리 (Rate Limit, Timeout 등)
// ==========================================
const callGeminiWithEdgeCases = async (
  apiKey: string,
  location: string,
  symptom: string,
  imageBase64s: string[]
): Promise<AIRepairAnalysis> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const imageParts = imageBase64s
    .filter((b) => !!b)
    .map((base64) => ({
      inlineData: { data: base64, mimeType: 'image/jpeg' },
    }));

  const prompt = buildPrompt(location, symptom, imageParts.length);

  // Timeout 구현 (45초)
  const TIMEOUT_MS = 45000;
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT_ERROR')), TIMEOUT_MS)
  );

  try {
    console.log('[Gochida AI] calling Gemini API...');
    const result = await Promise.race([
      model.generateContent([prompt, ...imageParts]),
      timeoutPromise
    ]);

    console.log('[Gochida AI] Gemini response received');
    const cleaned = stripJsonFences(result.response.text());

    try {
      // 누락 필드/타입 오류를 보정해 UI crash를 방지한다.
      const parsed = normalizeAnalysis(JSON.parse(cleaned), location, symptom);
      // Gemini 응답 스키마에는 priceGuide가 없으므로, 결과 화면의 참고 비용 카드가
      // 비지 않도록 위치·증상 기반 참고 시세를 보강한다. (Mock 경로와 동일하게 맞춤)
      if (parsed.status === 'SUCCESS' && !parsed.priceGuide) {
        parsed.priceGuide = getSuggestedPriceGuide(location, symptom).guide;
      }
      return parsed;
    } catch (parseError) {
      // raw response는 콘솔에만 남기고 사용자에게 노출하지 않는다.
      console.warn('[Gochida AI] JSON parse error:', parseError);
      throw new Error('요청서 정리 결과를 처리하지 못했어요. 다시 시도해 주세요.');
    }
  } catch (error: any) {
    console.warn('[Gochida AI] Gemini call failed:', error);
    // 1) Timeout 에러 처리
    if (error.message === 'TIMEOUT_ERROR') {
      throw new Error('AI 분석 응답 시간이 초과되었습니다. 다시 시도해주세요.');
    }
    // 2) 429 Rate Limit 에러 처리 (Gemini API 에러 응답 파싱)
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      throw new Error('현재 이용량이 많아 분석이 지연되고 있습니다. 잠시 후 시도해주세요. (Rate Limit)');
    }
    // 3) 내부에서 이미 사용자용 메시지로 가공한 에러는 그대로 전달 (이중 래핑 방지)
    if (error.message && error.message.includes('요청서 정리 결과')) {
      throw error;
    }
    // 기타 에러
    throw new Error(`AI 연동 중 알 수 없는 오류가 발생했습니다: ${error.message}`);
  }
};

export const analyzeImage = async (
  location: string,
  symptom: string,
  imageBase64s: string[]
): Promise<AIRepairAnalysis> => {
  const validBase64s = (imageBase64s || []).filter(b => typeof b === 'string' && b.trim() !== '');
  
  console.log(`[Gochida AI] Valid image count: ${validBase64s.length}`);
  
  if (validBase64s.length === 0) {
    throw new Error('이미지 데이터가 없습니다.');
  }

  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  const useMock = process.env.EXPO_PUBLIC_USE_MOCK_AI === 'true';

  console.log(`[Gochida AI] useMockAI: ${useMock}`);
  console.log(`[Gochida AI] hasApiKey: ${!!apiKey}`);

  if (useMock) {
    console.log('[Gochida AI] Falling back to mock because EXPO_PUBLIC_USE_MOCK_AI is true.');
    await new Promise((r) => setTimeout(r, 2000));
    const mockData = buildMockAnalysis(location, symptom);
    return { ...mockData, status: 'SUCCESS' } as AIRepairAnalysis;
  }

  if (!apiKey) {
    console.warn('[Gochida AI] Missing Gemini API key. Falling back to mock analysis.');
    await new Promise((r) => setTimeout(r, 2000));
    const mockData = buildMockAnalysis(location, symptom);
    return { ...mockData, status: 'SUCCESS' } as AIRepairAnalysis;
  }

  return await callGeminiWithEdgeCases(apiKey, location, symptom, validBase64s);
};

// ==========================================
// 5. 최소 테스트 (단위 테스트 스크립트 예제)
// ==========================================
/*
// __tests__/aiService.test.ts
import { analyzeImage } from '../services/aiService';

describe('aiService Edge Cases', () => {
  it('Mock 환경에서 딜레이 후 SUCCESS 상태의 JSON을 반환해야 한다', async () => {
    process.env.EXPO_PUBLIC_USE_MOCK_AI = 'true';
    const result = await analyzeImage('욕실', '누수', ['fake_base64']);
    expect(result.status).toBe('SUCCESS');
    expect(result.one_line_summary).toBeDefined();
  });

  it('비정상적이거나 흐린 이미지인 경우 REJECTED 상태를 반환해야 한다 (Gemini Response 흉내)', async () => {
    // Jest mock setup for GoogleGenerativeAI to return { status: 'REJECTED', rejection_reason: '...' }
    // ...
    // expect(result.status).toBe('REJECTED');
  });
});
*/
